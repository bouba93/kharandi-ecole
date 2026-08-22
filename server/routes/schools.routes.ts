import { Router, Request, Response } from 'express';
import { store, SchoolEntity, StudentEntity } from '../data/store';

const router = Router();

/**
 * GET /api/v1/ecole/schools/
 * Liste des établissements
 */
router.get('/', (_req: Request, res: Response): void => {
  try {
    const schoolsWithMetrics = store.schools.map((sch) => {
      const schoolStudents = store.students.filter((s) => s.schoolId === sch.id);
      const schoolTeachers = store.teachers.filter((t) => t.schoolId === sch.id);
      const schoolClasses = store.classes.filter((c) => c.schoolId === sch.id);

      return {
        ...sch,
        totalStudents: schoolStudents.length,
        totalTeachers: schoolTeachers.length,
        totalClasses: schoolClasses.length,
      };
    });

    res.status(200).json({
      success: true,
      count: schoolsWithMetrics.length,
      schools: schoolsWithMetrics,
      currentSchool: schoolsWithMetrics[0] || null,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/v1/ecole/schools/
 * Créer un établissement
 */
router.post('/', (req: Request, res: Response): void => {
  try {
    const { name, address, phone, email, dpe, ministere, schoolYear, currentTrimester } = req.body;

    if (!name) {
      res.status(400).json({ success: false, error: 'Le nom de l\'établissement est obligatoire.' });
      return;
    }

    const newSchool: SchoolEntity = {
      id: `sch-gn-${Date.now().toString().slice(-4)}`,
      name,
      subtext: req.body.subtext || 'Établissement Enseignement Général',
      address: address || 'Conakry, République de Guinée',
      phone: phone || '+224 620 00 00 00',
      email: email || 'contact@ecole.gn',
      ministere: ministere || 'MEPU-A Guinée',
      dpe: dpe || 'DCE Conakry',
      logoUrl: req.body.logoUrl || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=200&q=80',
      currentTrimester: currentTrimester || 1,
      schoolYear: schoolYear || '2025-2026',
      activationCode: `KH-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    store.schools.push(newSchool);

    res.status(201).json({
      success: true,
      message: 'Établissement créé avec succès.',
      school: newSchool,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/v1/ecole/schools/:school_id/
 * Obtenir les détails d'un établissement
 */
router.get('/:school_id', (req: Request, res: Response): void => {
  try {
    const { school_id } = req.params;
    const school = store.schools.find((s) => s.id === school_id) || store.schools[0];

    if (!school) {
      res.status(404).json({ success: false, error: 'Établissement non trouvé.' });
      return;
    }

    const schoolStudents = store.students.filter((s) => s.schoolId === school.id);
    const schoolTeachers = store.teachers.filter((t) => t.schoolId === school.id);
    const schoolClasses = store.classes.filter((c) => c.schoolId === school.id);
    const schoolPayments = store.payments.filter((p) => schoolStudents.some((s) => s.id === p.studentId));

    const totalTuitionExpected = schoolStudents.reduce((acc, curr) => acc + curr.tuitionTotal, 0);
    const totalTuitionCollected = schoolStudents.reduce((acc, curr) => acc + curr.tuitionPaid, 0);

    res.status(200).json({
      success: true,
      school: {
        ...school,
        totalStudents: schoolStudents.length,
        totalTeachers: schoolTeachers.length,
        totalClasses: schoolClasses.length,
        financialMetrics: {
          totalTuitionExpected,
          totalTuitionCollected,
          totalOutstanding: Math.max(0, totalTuitionExpected - totalTuitionCollected),
          collectionRate: totalTuitionExpected > 0 ? ((totalTuitionCollected / totalTuitionExpected) * 100).toFixed(1) : '0',
          kharandiLicensingFees: schoolStudents.length * 60000,
        },
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PATCH /api/v1/ecole/schools/:school_id/
 * Mettre à jour un établissement
 */
router.patch('/:school_id', (req: Request, res: Response): void => {
  try {
    const { school_id } = req.params;
    let school = store.schools.find((s) => s.id === school_id);

    if (!school) {
      school = store.schools[0];
    }

    Object.assign(school, req.body);

    res.status(200).json({
      success: true,
      message: 'Informations de l\'établissement mises à jour avec succès.',
      school,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/v1/ecole/schools/:school_id/
 * Supprimer un établissement
 */
router.delete('/:school_id', (req: Request, res: Response): void => {
  try {
    const { school_id } = req.params;
    const initialLen = store.schools.length;
    store.schools = store.schools.filter((s) => s.id !== school_id);

    if (store.schools.length === 0) {
      // Keep at least one default
      store.schools = [
        {
          id: 'sch-gn-001',
          name: 'Groupe Scolaire Kharandi Excellence',
          subtext: 'Établissement Enseignement Général',
          address: 'Conakry, République de Guinée',
          phone: '+224 628 00 11 22',
          email: 'contact@kharandi-excellence.gn',
          ministere: 'MEPU-A',
          dpe: 'DCE Ratoma',
          logoUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=200&q=80',
          currentTrimester: 1,
          schoolYear: '2025-2026',
          activationCode: 'KH-EXC-2025',
          status: 'active',
          createdAt: new Date().toISOString(),
        }
      ];
    }

    res.status(200).json({
      success: true,
      message: 'Établissement supprimé ou réinitialisé.',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/v1/ecole/schools/:school_id/students/
 * Liste des élèves de l'établissement avec filtres
 */
router.get('/:school_id/students', (req: Request, res: Response): void => {
  try {
    const { school_id } = req.params;
    const { class_id, level, status, search } = req.query;

    let list = store.students.filter(
      (s) => s.schoolId === school_id || school_id === 'default' || school_id === 'current' || s.schoolId === 'sch-gn-001'
    );

    if (class_id) {
      list = list.filter((s) => s.classId === class_id);
    }
    if (level) {
      list = list.filter((s) => s.level.toLowerCase() === (level as string).toLowerCase());
    }
    if (status) {
      list = list.filter((s) => s.status.toLowerCase() === (status as string).toLowerCase());
    }
    if (search) {
      const q = (search as string).toLowerCase();
      list = list.filter(
        (s) =>
          s.firstName.toLowerCase().includes(q) ||
          s.lastName.toLowerCase().includes(q) ||
          s.matricule.toLowerCase().includes(q) ||
          s.parentPhone.toLowerCase().includes(q)
      );
    }

    res.status(200).json({
      success: true,
      count: list.length,
      students: list,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/v1/ecole/schools/:school_id/students/
 * Inscrire un nouvel élève dans l'établissement
 */
router.post('/:school_id/students', (req: Request, res: Response): void => {
  try {
    const { school_id } = req.params;
    const {
      firstName,
      lastName,
      gender,
      birthDate,
      birthPlace,
      classId,
      className,
      level,
      parentName,
      parentPhone,
      parentEmail,
      address,
      tuitionTotal,
      tuitionPaid,
      photoUrl,
    } = req.body;

    if (!firstName || !lastName || !classId) {
      res.status(400).json({
        success: false,
        error: 'Champs requis manquants : prénom, nom et classe sont obligatoires.',
      });
      return;
    }

    const schoolTarget = store.schools.find((s) => s.id === school_id) || store.schools[0];
    const targetClass = store.classes.find((c) => c.id === classId);

    const seq = (store.students.length + 101).toString().padStart(4, '0');
    const matricule = `KH-2025-${seq}`;
    const studentId = `std-${Date.now()}`;

    const newStudent: StudentEntity = {
      id: studentId,
      schoolId: schoolTarget.id,
      matricule,
      firstName,
      lastName,
      gender: gender || 'M',
      birthDate: birthDate || '2008-01-01',
      birthPlace: birthPlace || 'Conakry',
      classId,
      className: className || targetClass?.name || 'Classe non assignée',
      level: (level || targetClass?.level || 'Collège') as 'Primaire' | 'Collège' | 'Lycée',
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      parentName: parentName || 'Tuteur Légal',
      parentPhone: parentPhone || '+224 620 00 00 00',
      parentEmail: parentEmail || '',
      address: address || 'Conakry, Guinée',
      enrollmentDate: new Date().toISOString().slice(0, 10),
      tuitionTotal: Number(tuitionTotal) || 1800000,
      tuitionPaid: Number(tuitionPaid) || 0,
      status: Number(tuitionPaid) >= (Number(tuitionTotal) || 1800000) ? 'En règle' : 'En retard',
    };

    store.students.unshift(newStudent);

    // Update class count
    if (targetClass) {
      targetClass.studentCount = (targetClass.studentCount || 0) + 1;
    }

    // Auto issue school badge for student
    const newBadge = {
      id: `bdg-${Date.now()}`,
      schoolId: schoolTarget.id,
      studentId: newStudent.id,
      studentName: `${newStudent.firstName} ${newStudent.lastName}`,
      matricule: newStudent.matricule,
      className: newStudent.className,
      issueDate: new Date().toISOString().slice(0, 10),
      expiryDate: '2026-07-31',
      qrCodeData: `KHARANDI:AUTH:${newStudent.matricule}:${schoolTarget.id}:VERIFIED`,
      status: 'active' as const,
      badgeType: 'carte_scolaire' as const,
      downloadedCount: 0,
    };
    store.badges.unshift(newBadge);

    res.status(201).json({
      success: true,
      message: `Élève ${newStudent.firstName} ${newStudent.lastName} inscrit(e) avec succès. Matricule attribué : ${newStudent.matricule}.`,
      student: newStudent,
      badge: newBadge,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
