import { Router, Request, Response } from 'express';
import { store } from '../data/store';

const router = Router();

/**
 * POST /api/v1/ecole/activate/
 * Activer un compte établissement scolaire
 */
router.post('/activate', (req: Request, res: Response): void => {
  try {
    const {
      school_name,
      activation_code,
      email,
      phone,
      password,
      address,
      dpe,
      ministere,
      admin_name
    } = req.body;

    if (!school_name || !email) {
      res.status(400).json({
        success: false,
        error: 'Champs requis manquants : school_name et email sont obligatoires.'
      });
      return;
    }

    // Verify if school exists with activation code or create a new school
    let existingSchool = store.schools.find(
      (s) => s.activationCode === activation_code || s.email.toLowerCase() === email.toLowerCase()
    );

    if (existingSchool) {
      existingSchool.status = 'active';
      if (school_name) existingSchool.name = school_name;
      if (phone) existingSchool.phone = phone;
      if (address) existingSchool.address = address;
      if (dpe) existingSchool.dpe = dpe;

      res.status(200).json({
        success: true,
        message: `L'établissement ${existingSchool.name} a été activé avec succès !`,
        school: existingSchool,
        token: `jwt_kharandi_${Date.now()}_${existingSchool.id}`,
        role: 'admin',
        admin: {
          name: admin_name || 'Direction Générale',
          email: existingSchool.email,
        }
      });
      return;
    }

    // Create new school entity
    const newSchoolId = `sch-gn-${Date.now().toString().slice(-4)}`;
    const newSchool = {
      id: newSchoolId,
      name: school_name,
      subtext: 'Établissement Enseignement Général (Primaire - Collège - Lycée)',
      address: address || 'Conakry, République de Guinée',
      phone: phone || '+224 620 00 00 00',
      email: email,
      ministere: ministere || 'MEPU-A Guinée',
      dpe: dpe || 'DCE Ratoma / Conakry',
      logoUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=200&q=80',
      currentTrimester: 1 as const,
      schoolYear: '2025-2026',
      activationCode: activation_code || `KH-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
    };

    store.schools.push(newSchool);

    res.status(201).json({
      success: true,
      message: `Compte école activé avec succès pour ${newSchool.name}. Bienvenue sur Kharandi !`,
      school: newSchool,
      token: `jwt_kharandi_${Date.now()}_${newSchool.id}`,
      role: 'admin',
      admin: {
        name: admin_name || 'Direction de l\'Établissement',
        email: newSchool.email,
      }
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'activation de l\'école',
      details: err.message
    });
  }
});

/**
 * POST /api/v1/ecole/login/
 * Connexion Administration / Direction Générale
 */
router.post('/login', (req: Request, res: Response): void => {
  try {
    const { email, password, code } = req.body;

    const school = store.schools[0]; // Active school in context

    if (!email && !code) {
      res.status(400).json({
        success: false,
        error: 'Veuillez renseigner un identifiant (email ou code école).'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Connexion Direction Générale réussie.',
      token: `jwt_kharandi_admin_${Date.now()}`,
      user: {
        id: 'admin-001',
        name: 'M. Diallo Mamadou',
        role: 'admin',
        email: email || school.email,
        title: 'Proviseur & Administrateur Principal',
      },
      school: school,
      stats: {
        totalStudents: store.students.length,
        totalTeachers: store.teachers.length,
        totalClasses: store.classes.length,
      }
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la connexion',
      details: err.message
    });
  }
});

/**
 * POST /api/v1/ecole/teacher/login/
 * Connexion Enseignant / Professeur
 */
router.post('/teacher/login', (req: Request, res: Response): void => {
  try {
    const { email, phone, matricule } = req.body;

    let teacher = store.teachers.find(
      (t) =>
        (email && t.email.toLowerCase() === email.toLowerCase()) ||
        (phone && t.phone.replace(/\s+/g, '') === phone.replace(/\s+/g, '')) ||
        (matricule && t.matriculeTeacher === matricule)
    );

    // Fallback to first teacher if testing
    if (!teacher && (!email && !phone && !matricule)) {
      teacher = store.teachers[0];
    } else if (!teacher) {
      // Default to first teacher for demo ease
      teacher = store.teachers[0];
    }

    const school = store.schools.find((s) => s.id === teacher!.schoolId) || store.schools[0];
    const assignedClasses = store.classes.filter((c) =>
      teacher!.classIds?.includes(c.id) || c.mainTeacherId === teacher!.id
    );

    res.status(200).json({
      success: true,
      message: `Connexion réussie. Bienvenue ${teacher!.name}.`,
      token: `jwt_teacher_${teacher!.id}_${Date.now()}`,
      teacher: {
        ...teacher,
        assignedClasses,
      },
      school: {
        id: school.id,
        name: school.name,
        schoolYear: school.schoolYear,
        currentTrimester: school.currentTrimester,
      }
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la connexion enseignant',
      details: err.message
    });
  }
});

export default router;
