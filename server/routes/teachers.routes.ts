import { Router, Request, Response } from 'express';
import { store, TeacherEntity } from '../data/store';

const router = Router();

/**
 * GET /api/v1/ecole/teachers/
 * Liste des enseignants
 */
router.get('/', (req: Request, res: Response): void => {
  try {
    const { school_id, subject, search } = req.query;

    let list = store.teachers;

    if (school_id) {
      list = list.filter((t) => t.schoolId === school_id);
    }
    if (subject) {
      list = list.filter((t) => t.subjects.some((s) => s.toLowerCase().includes((subject as string).toLowerCase())));
    }
    if (search) {
      const q = (search as string).toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q) ||
          t.phone.includes(q)
      );
    }

    res.status(200).json({
      success: true,
      count: list.length,
      teachers: list,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/v1/ecole/teachers/
 * Ajouter un enseignant
 */
router.post('/', (req: Request, res: Response): void => {
  try {
    const { name, email, phone, subjects, classIds, role, avatarUrl, schoolId } = req.body;

    if (!name || !phone) {
      res.status(400).json({
        success: false,
        error: 'Le nom et le numéro de téléphone de l\'enseignant sont obligatoires.',
      });
      return;
    }

    const teacherId = `tch-${Date.now().toString().slice(-6)}`;
    const newTeacher: TeacherEntity = {
      id: teacherId,
      schoolId: schoolId || store.schools[0]?.id || 'sch-gn-001',
      name,
      email: email || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@kharandi-ecole.gn`,
      phone,
      subjects: Array.isArray(subjects) ? subjects : [subjects || 'Enseignement Général'],
      classIds: Array.isArray(classIds) ? classIds : (classIds ? [classIds] : []),
      role: role || 'teacher',
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      active: true,
      matriculeTeacher: `ENS-2025-${(store.teachers.length + 1).toString().padStart(3, '0')}`,
      hireDate: new Date().toISOString().slice(0, 10),
    };

    store.teachers.push(newTeacher);

    res.status(201).json({
      success: true,
      message: `Professeur ${newTeacher.name} ajouté avec succès.`,
      teacher: newTeacher,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/v1/ecole/teachers/:teacher_id/
 * Détails d'un enseignant
 */
router.get('/:teacher_id', (req: Request, res: Response): void => {
  try {
    const { teacher_id } = req.params;
    const teacher = store.teachers.find((t) => t.id === teacher_id || t.matriculeTeacher === teacher_id);

    if (!teacher) {
      res.status(404).json({ success: false, error: 'Enseignant non trouvé.' });
      return;
    }

    const assignedClasses = store.classes.filter(
      (c) => teacher.classIds?.includes(c.id) || c.mainTeacherId === teacher.id
    );

    res.status(200).json({
      success: true,
      teacher: {
        ...teacher,
        assignedClasses,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/v1/ecole/teachers/:teacher_id/
 * Mettre à jour les informations d'un enseignant
 */
router.post('/:teacher_id', (req: Request, res: Response): void => {
  try {
    const { teacher_id } = req.params;
    const teacher = store.teachers.find((t) => t.id === teacher_id || t.matriculeTeacher === teacher_id);

    if (!teacher) {
      res.status(404).json({ success: false, error: 'Enseignant non trouvé.' });
      return;
    }

    Object.assign(teacher, req.body);

    res.status(200).json({
      success: true,
      message: `Profil de ${teacher.name} mis à jour avec succès.`,
      teacher,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/v1/ecole/teachers/:teacher_id/
 * Supprimer un enseignant spécifique
 */
router.delete('/:teacher_id', (req: Request, res: Response): void => {
  try {
    const { teacher_id } = req.params;
    const index = store.teachers.findIndex((t) => t.id === teacher_id || t.matriculeTeacher === teacher_id);

    if (index === -1) {
      res.status(404).json({ success: false, error: 'Enseignant non trouvé.' });
      return;
    }

    const removed = store.teachers.splice(index, 1)[0];

    res.status(200).json({
      success: true,
      message: `L'enseignant ${removed.name} a été retiré de l'établissement.`,
      teacherId: removed.id,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/v1/ecole/teachers/
 * Suppression en masse d'enseignants
 */
router.delete('/', (req: Request, res: Response): void => {
  try {
    const { teacher_ids } = req.body;

    if (!Array.isArray(teacher_ids) || teacher_ids.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Veuillez fournir un tableau "teacher_ids" contenant les identifiants à supprimer.',
      });
      return;
    }

    const initialCount = store.teachers.length;
    store.teachers = store.teachers.filter((t) => !teacher_ids.includes(t.id));
    const deletedCount = initialCount - store.teachers.length;

    res.status(200).json({
      success: true,
      message: `${deletedCount} enseignant(s) supprimé(s) avec succès.`,
      deletedCount,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
