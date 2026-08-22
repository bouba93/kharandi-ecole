import { Router, Request, Response } from 'express';
import { store, EvaluationPeriodEntity, ScheduledEvaluationEntity } from '../data/store';

const router = Router();

// GET all evaluation periods
router.get('/periods', (req: Request, res: Response): void => {
  const schoolId = (req.query.school_id as string) || store.schools[0]?.id;
  const periods = store.evaluationPeriods.filter((p) => !schoolId || p.schoolId === schoolId);

  res.status(200).json({
    success: true,
    count: periods.length,
    periods,
  });
});

// POST create evaluation period
router.post('/periods', (req: Request, res: Response): void => {
  const { trimester, title, startDate, endDate, gradingDeadline, deliberationDate, schoolId } = req.body;

  if (!title || !startDate || !endDate) {
    res.status(400).json({ success: false, error: 'Titre, date de début et de fin requis.' });
    return;
  }

  const newPeriod: EvaluationPeriodEntity = {
    id: `per-${Date.now()}`,
    schoolId: schoolId || store.schools[0]?.id || 'sch-gn-001',
    trimester: Number(trimester) as 1 | 2 | 3 || 1,
    title,
    startDate,
    endDate,
    gradingDeadline: gradingDeadline || endDate,
    deliberationDate,
    status: 'upcoming',
  };

  store.evaluationPeriods.push(newPeriod);

  res.status(201).json({
    success: true,
    period: newPeriod,
    message: 'Période d\'évaluation créée avec succès.',
  });
});

// PATCH update evaluation period
router.patch('/periods/:id', (req: Request, res: Response): void => {
  const periodId = req.params.id;
  const idx = store.evaluationPeriods.findIndex((p) => p.id === periodId);

  if (idx === -1) {
    res.status(404).json({ success: false, error: 'Période non trouvée.' });
    return;
  }

  store.evaluationPeriods[idx] = {
    ...store.evaluationPeriods[idx],
    ...req.body,
  };

  res.status(200).json({
    success: true,
    period: store.evaluationPeriods[idx],
    message: 'Période mise à jour.',
  });
});

// DELETE evaluation period
router.delete('/periods/:id', (req: Request, res: Response): void => {
  const periodId = req.params.id;
  store.evaluationPeriods = store.evaluationPeriods.filter((p) => p.id !== periodId);
  store.scheduledEvaluations = store.scheduledEvaluations.filter((e) => e.periodId !== periodId);

  res.status(200).json({
    success: true,
    message: 'Période supprimée.',
  });
});

// GET scheduled evaluations
router.get('/schedule', (req: Request, res: Response): void => {
  const { class_id, period_id, trimester, subject_id } = req.query;

  let evaluations = store.scheduledEvaluations;

  if (class_id) {
    evaluations = evaluations.filter((e) => e.classId === class_id);
  }
  if (period_id) {
    evaluations = evaluations.filter((e) => e.periodId === period_id);
  }
  if (trimester) {
    evaluations = evaluations.filter((e) => e.trimester === Number(trimester));
  }
  if (subject_id) {
    evaluations = evaluations.filter((e) => e.subjectId === subject_id);
  }

  res.status(200).json({
    success: true,
    count: evaluations.length,
    evaluations,
  });
});

// POST schedule new evaluation
router.post('/schedule', (req: Request, res: Response): void => {
  const {
    periodId,
    trimester,
    classId,
    className,
    subjectId,
    subjectName,
    type,
    title,
    date,
    startTime,
    durationMinutes,
    roomNumber,
    coefficient,
    supervisorName,
    maxScore,
  } = req.body;

  if (!title || !date || !classId || !subjectId) {
    res.status(400).json({ success: false, error: 'Matière, classe, date et intitulé sont requis.' });
    return;
  }

  const newEval: ScheduledEvaluationEntity = {
    id: `eval-${Date.now()}`,
    schoolId: store.schools[0]?.id || 'sch-gn-001',
    periodId: periodId || 'per-trim-1',
    trimester: Number(trimester) as 1 | 2 | 3 || 1,
    classId,
    className: className || store.classes.find((c) => c.id === classId)?.name || 'Classe',
    subjectId,
    subjectName: subjectName || 'Matière',
    type: type || 'Devoir 1',
    title,
    date,
    startTime: startTime || '08:00',
    durationMinutes: Number(durationMinutes) || 120,
    roomNumber: roomNumber || 'Salle de classe',
    coefficient: Number(coefficient) || 2,
    supervisorName: supervisorName || 'Enseignant responsable',
    status: 'planifié',
    maxScore: Number(maxScore) || 20,
  };

  store.scheduledEvaluations.push(newEval);

  res.status(201).json({
    success: true,
    evaluation: newEval,
    message: 'Évaluation planifiée avec succès.',
  });
});

// PATCH update scheduled evaluation
router.patch('/schedule/:id', (req: Request, res: Response): void => {
  const evalId = req.params.id;
  const idx = store.scheduledEvaluations.findIndex((e) => e.id === evalId);

  if (idx === -1) {
    res.status(404).json({ success: false, error: 'Évaluation non trouvée.' });
    return;
  }

  store.scheduledEvaluations[idx] = {
    ...store.scheduledEvaluations[idx],
    ...req.body,
  };

  res.status(200).json({
    success: true,
    evaluation: store.scheduledEvaluations[idx],
    message: 'Évaluation mise à jour.',
  });
});

// DELETE scheduled evaluation
router.delete('/schedule/:id', (req: Request, res: Response): void => {
  const evalId = req.params.id;
  store.scheduledEvaluations = store.scheduledEvaluations.filter((e) => e.id !== evalId);

  res.status(200).json({
    success: true,
    message: 'Évaluation annulée / supprimée.',
  });
});

export default router;
