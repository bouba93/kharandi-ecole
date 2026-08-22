import { Router, Request, Response } from 'express';
import { store, ClassEntity } from '../data/store';

const router = Router();

/**
 * GET /api/v1/ecole/classes/
 * Liste des classes
 */
router.get('/', (req: Request, res: Response): void => {
  try {
    const { school_id, level } = req.query;

    let list = store.classes;
    if (school_id) {
      list = list.filter((c) => c.schoolId === school_id);
    }
    if (level) {
      list = list.filter((c) => c.level.toLowerCase() === (level as string).toLowerCase());
    }

    // Enrich with live student count
    const enriched = list.map((cls) => {
      const count = store.students.filter((s) => s.classId === cls.id).length;
      return {
        ...cls,
        studentCount: count || cls.studentCount || 0,
      };
    });

    res.status(200).json({
      success: true,
      count: enriched.length,
      classes: enriched,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/v1/ecole/classes/
 * Créer une nouvelle classe
 */
router.post('/', (req: Request, res: Response): void => {
  try {
    const {
      schoolId,
      name,
      level,
      mainTeacherId,
      mainTeacherName,
      roomNumber,
      subjects,
    } = req.body;

    if (!name || !level) {
      res.status(400).json({
        success: false,
        error: 'Le nom de la classe et le niveau d\'enseignement sont obligatoires.',
      });
      return;
    }

    const classId = `cls-${Date.now().toString().slice(-6)}`;
    const newClass: ClassEntity = {
      id: classId,
      schoolId: schoolId || store.schools[0]?.id || 'sch-gn-001',
      name,
      level,
      mainTeacherId: mainTeacherId || 'tch-camara',
      mainTeacherName: mainTeacherName || 'Non assigné',
      roomNumber: roomNumber || 'Salle Standard',
      studentCount: 0,
      subjects: subjects || [
        { subjectId: 'sub-math-col', subjectName: 'Mathématiques', coefficient: 4, teacherName: mainTeacherName || 'Professeur' },
        { subjectId: 'sub-fr-col', subjectName: 'Français', coefficient: 4, teacherName: mainTeacherName || 'Professeur' },
        { subjectId: 'sub-phys-col', subjectName: 'Physique-Chimie', coefficient: 3, teacherName: mainTeacherName || 'Professeur' },
      ],
    };

    store.classes.push(newClass);

    res.status(201).json({
      success: true,
      message: `Classe ${newClass.name} créée avec succès.`,
      class: newClass,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
