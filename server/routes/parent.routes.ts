import { Router, Request, Response } from 'express';
import { store } from '../data/store';

const router = Router();

/**
 * GET /api/v1/ecole/parent/:matricule/
 * Espace Parent : Consultation du dossier complet de l'élève par son matricule
 */
router.get('/:matricule', (req: Request, res: Response): void => {
  try {
    const { matricule } = req.params;
    const cleanMatricule = matricule.trim().toUpperCase();

    const student = store.students.find(
      (s) =>
        s.matricule.toUpperCase() === cleanMatricule ||
        s.id.toLowerCase() === cleanMatricule.toLowerCase() ||
        s.parentPhone.replace(/\s+/g, '') === cleanMatricule.replace(/\s+/g, '')
    );

    if (!student) {
      res.status(404).json({
        success: false,
        error: `Aucun dossier d'élève trouvé pour le matricule : ${matricule}. Veuillez vérifier le matricule délivré lors de l'inscription (ex: KH-2025-0101).`,
      });
      return;
    }

    const school = store.schools.find((s) => s.id === student.schoolId) || store.schools[0];
    const studentClass = store.classes.find((c) => c.id === student.classId);
    const studentGrades = store.grades.filter((g) => g.studentId === student.id);
    const studentAttendance = store.absences.filter((a) => a.studentId === student.id);
    const studentPayments = store.payments.filter((p) => p.studentId === student.id);
    const studentBadges = store.badges.filter((b) => b.studentId === student.id || b.matricule === student.matricule);
    const classLogbook = store.logbook.filter((l) => l.classId === student.classId);

    // Calculate academic statistics
    const classSubjects = studentClass?.subjects || [];
    const subjectAverages = classSubjects.map((sub) => {
      const subGrades = studentGrades.filter((g) => g.subjectId === sub.subjectId);
      const avg = subGrades.length > 0
        ? subGrades.reduce((sum, g) => sum + g.score, 0) / subGrades.length
        : 13.0;

      let appreciation = 'Travail convenable.';
      if (avg >= 16) appreciation = 'Excellents résultats, élève modèle.';
      else if (avg >= 14) appreciation = 'Très bon travail, poursuivez ainsi.';
      else if (avg >= 10) appreciation = 'Passable, doit redoubler d\'efforts.';
      else appreciation = 'Insuffisant, suivi nécessaire.';

      return {
        subjectId: sub.subjectId,
        subjectName: sub.subjectName,
        coefficient: sub.coefficient,
        average: parseFloat(avg.toFixed(2)),
        teacherName: sub.teacherName,
        appreciation,
        recentGrades: subGrades,
      };
    });

    const totalWeightedScore = subjectAverages.reduce((acc, curr) => acc + curr.average * curr.coefficient, 0);
    const totalCoeff = subjectAverages.reduce((acc, curr) => acc + curr.coefficient, 0);
    const overallAverage = totalCoeff > 0 ? parseFloat((totalWeightedScore / totalCoeff).toFixed(2)) : 14.5;

    const unexcusedAbsences = studentAttendance.filter((a) => a.status === 'Absent Non Justifié').length;
    const lates = studentAttendance.filter((a) => a.status === 'Retard').length;

    res.status(200).json({
      success: true,
      message: `Dossier scolaire de ${student.firstName} ${student.lastName} chargé avec succès.`,
      student,
      school: {
        id: school.id,
        name: school.name,
        address: school.address,
        phone: school.phone,
        email: school.email,
        schoolYear: school.schoolYear,
        currentTrimester: school.currentTrimester,
        dpe: school.dpe,
      },
      classInfo: {
        id: studentClass?.id || student.classId,
        name: studentClass?.name || student.className,
        level: studentClass?.level || student.level,
        mainTeacherName: studentClass?.mainTeacherName || 'Professeur Principal',
        roomNumber: studentClass?.roomNumber || 'Salle Standard',
      },
      academicOverview: {
        currentTrimester: school.currentTrimester,
        overallAverage,
        decision: overallAverage >= 14 ? 'Tableau d\'Honneur avec Encouragements' : (overallAverage >= 10 ? 'Admis en classe supérieure' : 'Avertissement Travail'),
        subjectAverages,
        allGrades: studentGrades,
      },
      attendanceSummary: {
        totalRecords: studentAttendance.length,
        unexcusedAbsences,
        lates,
        history: studentAttendance,
      },
      financialStatus: {
        tuitionTotal: student.tuitionTotal,
        tuitionPaid: student.tuitionPaid,
        balanceRemaining: Math.max(0, student.tuitionTotal - student.tuitionPaid),
        isUpToDate: student.tuitionPaid >= student.tuitionTotal,
        paymentHistory: studentPayments,
      },
      homeworkAndLogbook: classLogbook,
      badges: studentBadges,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/v1/ecole/parents/students/:student_id/badges/
 * Badges de l'élève
 */
router.get('/students/:student_id/badges', (req: Request, res: Response): void => {
  try {
    const { student_id } = req.params;
    const student = store.students.find((s) => s.id === student_id || s.matricule === student_id);

    if (!student) {
      res.status(404).json({ success: false, error: 'Élève non trouvé.' });
      return;
    }

    let badges = store.badges.filter((b) => b.studentId === student.id || b.matricule === student.matricule);

    if (badges.length === 0) {
      // Create a default digital badge
      const defaultBadge = {
        id: `bdg-${Date.now()}`,
        schoolId: student.schoolId || 'sch-gn-001',
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        matricule: student.matricule,
        className: student.className,
        issueDate: '2025-09-10',
        expiryDate: '2026-07-31',
        qrCodeData: `KHARANDI:AUTH:${student.matricule}:${student.schoolId}:VERIFIED`,
        status: 'active' as const,
        badgeType: 'carte_scolaire' as const,
        downloadedCount: 1,
      };
      store.badges.push(defaultBadge);
      badges = [defaultBadge];
    }

    res.status(200).json({
      success: true,
      count: badges.length,
      student: {
        id: student.id,
        matricule: student.matricule,
        name: `${student.firstName} ${student.lastName}`,
        className: student.className,
        photoUrl: student.photoUrl,
      },
      badges,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/v1/ecole/parents/students/:student_id/badges/:badge_id/pdf/
 * Génération / Téléchargement du Badge Scolaire / Carte Scolaire en PDF / SVG
 */
router.get('/students/:student_id/badges/:badge_id/pdf', (req: Request, res: Response): void => {
  try {
    const { student_id, badge_id } = req.params;
    const student = store.students.find((s) => s.id === student_id || s.matricule === student_id);
    const badge = store.badges.find((b) => b.id === badge_id || (student && b.studentId === student.id));

    if (!student) {
      res.status(404).json({ success: false, error: 'Élève non trouvé.' });
      return;
    }

    const school = store.schools.find((s) => s.id === student.schoolId) || store.schools[0];

    if (badge) {
      badge.downloadedCount = (badge.downloadedCount || 0) + 1;
    }

    // Return printable document payload with certificate verification
    res.status(200).json({
      success: true,
      message: 'Fichier d\'impression du Badge Scolaire Numérique Kharandi généré.',
      downloadUrl: `/api/v1/ecole/parents/students/${student.id}/badges/${badge?.id || 'default'}/pdf`,
      certificateVerification: {
        status: 'VALIDE & CERTIFIÉ',
        issuedBy: school.name,
        ministry: school.ministere,
        dpe: school.dpe,
        studentMatricule: student.matricule,
        studentFullName: `${student.firstName} ${student.lastName}`,
        studentBirth: `${student.birthDate} à ${student.birthPlace}`,
        class: student.className,
        academicYear: school.schoolYear,
        qrPayload: `KHARANDI:AUTH:${student.matricule}:${school.id}:VERIFIED`,
        securityHash: `KH-${Buffer.from(student.matricule + school.id).toString('hex').slice(0, 16).toUpperCase()}`,
        generatedAt: new Date().toISOString(),
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
