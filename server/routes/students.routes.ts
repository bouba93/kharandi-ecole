import { Router, Request, Response } from 'express';
import { store } from '../data/store';

const router = Router();

/**
 * PATCH /api/v1/ecole/students/:student_id/
 * Mettre à jour les informations d'un élève
 */
router.patch('/:student_id', (req: Request, res: Response): void => {
  try {
    const { student_id } = req.params;
    const student = store.students.find((s) => s.id === student_id || s.matricule === student_id);

    if (!student) {
      res.status(404).json({
        success: false,
        error: `Élève non trouvé avec l'identifiant ou matricule : ${student_id}`,
      });
      return;
    }

    const previousClassId = student.classId;

    // Apply updates
    Object.assign(student, req.body);

    // If tuition was updated, auto-calculate status
    if (req.body.tuitionPaid !== undefined || req.body.tuitionTotal !== undefined) {
      student.status = student.tuitionPaid >= student.tuitionTotal ? 'En règle' : 'En retard';
    }

    // If class was modified, adjust student counts
    if (req.body.classId && req.body.classId !== previousClassId) {
      const oldClass = store.classes.find((c) => c.id === previousClassId);
      if (oldClass) oldClass.studentCount = Math.max(0, oldClass.studentCount - 1);

      const newClass = store.classes.find((c) => c.id === req.body.classId);
      if (newClass) {
        newClass.studentCount = (newClass.studentCount || 0) + 1;
        student.className = newClass.name;
        student.level = newClass.level;
      }
    }

    res.status(200).json({
      success: true,
      message: `Dossier de l'élève ${student.firstName} ${student.lastName} mis à jour avec succès.`,
      student,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/v1/ecole/students/:student_id/
 * Supprimer / désinscrire un élève
 */
router.delete('/:student_id', (req: Request, res: Response): void => {
  try {
    const { student_id } = req.params;
    const studentIndex = store.students.findIndex(
      (s) => s.id === student_id || s.matricule === student_id
    );

    if (studentIndex === -1) {
      res.status(404).json({
        success: false,
        error: `Élève non trouvé avec l'identifiant ${student_id}`,
      });
      return;
    }

    const deletedStudent = store.students[studentIndex];
    store.students.splice(studentIndex, 1);

    // Decrement class count
    const targetClass = store.classes.find((c) => c.id === deletedStudent.classId);
    if (targetClass) {
      targetClass.studentCount = Math.max(0, targetClass.studentCount - 1);
    }

    // Cleanup badges
    store.badges = store.badges.filter((b) => b.studentId !== deletedStudent.id);

    res.status(200).json({
      success: true,
      message: `L'élève ${deletedStudent.firstName} ${deletedStudent.lastName} (Matricule: ${deletedStudent.matricule}) a été supprimé du registre.`,
      deletedStudentId: deletedStudent.id,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
