import { Router, Request, Response } from 'express';
import { store, GradeEntity } from '../data/store';

const router = Router();

/**
 * GET /api/v1/ecole/grades/
 * Liste des notes avec filtres
 */
router.get('/', (req: Request, res: Response): void => {
  try {
    const { student_id, class_id, subject_id, trimester } = req.query;

    let list = store.grades;

    if (student_id) {
      list = list.filter((g) => g.studentId === student_id);
    }
    if (class_id) {
      const studentIdsInClass = store.students
        .filter((s) => s.classId === class_id)
        .map((s) => s.id);
      list = list.filter((g) => studentIdsInClass.includes(g.studentId));
    }
    if (subject_id) {
      list = list.filter((g) => g.subjectId === subject_id);
    }
    if (trimester) {
      list = list.filter((g) => g.trimester === Number(trimester));
    }

    // Attach student name for convenience
    const enrichedGrades = list.map((g) => {
      const student = store.students.find((s) => s.id === g.studentId);
      return {
        ...g,
        studentName: student ? `${student.firstName} ${student.lastName}` : 'Élève inconnu',
        matricule: student?.matricule || '',
      };
    });

    res.status(200).json({
      success: true,
      count: enrichedGrades.length,
      grades: enrichedGrades,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/v1/ecole/grades/
 * Enregistrement de note(s) (simple ou tableau bulk)
 */
router.post('/', (req: Request, res: Response): void => {
  try {
    const body = req.body;
    const gradesInput: Array<Partial<GradeEntity>> = Array.isArray(body)
      ? body
      : Array.isArray(body.grades)
      ? body.grades
      : [body];

    if (gradesInput.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Aucune note fournie.',
      });
      return;
    }

    const createdGrades: GradeEntity[] = [];

    for (const item of gradesInput) {
      if (!item.studentId || item.score === undefined) {
        continue;
      }

      const gradeId = `grd-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newGrade: GradeEntity = {
        id: gradeId,
        studentId: item.studentId,
        subjectId: item.subjectId || 'sub-gen',
        subjectName: item.subjectName || 'Évaluation',
        trimester: (item.trimester as 1 | 2 | 3) || 1,
        type: item.type || 'Devoir 1',
        score: Number(item.score),
        maxScore: Number(item.maxScore) || 20,
        date: item.date || new Date().toISOString().slice(0, 10),
        coefficient: Number(item.coefficient) || 1,
        comment: item.comment || '',
      };

      store.grades.unshift(newGrade);
      createdGrades.push(newGrade);
    }

    res.status(201).json({
      success: true,
      message: `${createdGrades.length} note(s) enregistrée(s) avec succès.`,
      count: createdGrades.length,
      grades: createdGrades,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
