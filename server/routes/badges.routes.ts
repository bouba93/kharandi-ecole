import { Router, Request, Response } from 'express';
import { store, BadgeEntity } from '../data/store';

const router = Router();

/**
 * POST /api/v1/ecole/schools/badges/issue/
 * Émettre / générer un badge pour un élève (ou pour une classe entière)
 */
router.post('/issue', (req: Request, res: Response): void => {
  try {
    const { studentId, schoolId, classId, badgeType, expiryDate } = req.body;

    const targetSchoolId = schoolId || store.schools[0]?.id || 'sch-gn-001';
    const targetExpiry = expiryDate || '2026-07-31';
    const type = badgeType || 'carte_scolaire';

    const createdBadges: BadgeEntity[] = [];

    if (studentId) {
      const student = store.students.find((s) => s.id === studentId || s.matricule === studentId);
      if (!student) {
        res.status(404).json({ success: false, error: 'Élève non trouvé pour l\'émission du badge.' });
        return;
      }

      // Check if active badge already exists
      const existingIndex = store.badges.findIndex((b) => b.studentId === student.id && b.badgeType === type);
      if (existingIndex !== -1) {
        store.badges[existingIndex].status = 'active';
        store.badges[existingIndex].expiryDate = targetExpiry;
        createdBadges.push(store.badges[existingIndex]);
      } else {
        const newBadge: BadgeEntity = {
          id: `bdg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          schoolId: targetSchoolId,
          studentId: student.id,
          studentName: `${student.firstName} ${student.lastName}`,
          matricule: student.matricule,
          className: student.className,
          issueDate: new Date().toISOString().slice(0, 10),
          expiryDate: targetExpiry,
          qrCodeData: `KHARANDI:AUTH:${student.matricule}:${targetSchoolId}:VERIFIED`,
          status: 'active',
          badgeType: type,
          downloadedCount: 0,
        };
        store.badges.unshift(newBadge);
        createdBadges.push(newBadge);
      }
    } else if (classId) {
      const classStudents = store.students.filter((s) => s.classId === classId);
      for (const student of classStudents) {
        const newBadge: BadgeEntity = {
          id: `bdg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          schoolId: targetSchoolId,
          studentId: student.id,
          studentName: `${student.firstName} ${student.lastName}`,
          matricule: student.matricule,
          className: student.className,
          issueDate: new Date().toISOString().slice(0, 10),
          expiryDate: targetExpiry,
          qrCodeData: `KHARANDI:AUTH:${student.matricule}:${targetSchoolId}:VERIFIED`,
          status: 'active',
          badgeType: type,
          downloadedCount: 0,
        };
        store.badges.unshift(newBadge);
        createdBadges.push(newBadge);
      }
    } else {
      res.status(400).json({
        success: false,
        error: 'Veuillez spécifier un "studentId" ou un "classId" pour émettre les badges.',
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: `${createdBadges.length} badge(s) émis avec succès.`,
      count: createdBadges.length,
      badges: createdBadges,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/v1/ecole/schools/badges/history/:school_id/
 * Historique des badges émis dans l'établissement
 */
router.get('/history/:school_id', (req: Request, res: Response): void => {
  try {
    const { school_id } = req.params;
    const { type, status } = req.query;

    let list = store.badges.filter(
      (b) => b.schoolId === school_id || school_id === 'sch-gn-001' || school_id === 'all'
    );

    if (type) {
      list = list.filter((b) => b.badgeType === type);
    }
    if (status) {
      list = list.filter((b) => b.status === status);
    }

    res.status(200).json({
      success: true,
      count: list.length,
      schoolId: school_id,
      badges: list,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/v1/ecole/schools/badges/:badge_id/
 * Révocation / suppression d'un badge
 */
router.delete('/:badge_id', (req: Request, res: Response): void => {
  try {
    const { badge_id } = req.params;
    const index = store.badges.findIndex((b) => b.id === badge_id);

    if (index === -1) {
      res.status(404).json({ success: false, error: 'Badge non trouvé.' });
      return;
    }

    const revoked = store.badges.splice(index, 1)[0];

    res.status(200).json({
      success: true,
      message: `Badge ${revoked.id} (Élève: ${revoked.studentName}) révoqué et supprimé avec succès.`,
      badgeId: revoked.id,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
