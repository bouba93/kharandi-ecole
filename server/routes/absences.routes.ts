import { Router, Request, Response } from 'express';
import { store, AttendanceEntity, AlertEntity } from '../data/store';

const router = Router();

/**
 * GET /api/v1/ecole/absences/
 * Liste des relevés d'absences et de présences
 */
router.get('/', (req: Request, res: Response): void => {
  try {
    const { student_id, class_id, date, status } = req.query;

    let list = store.absences;

    if (student_id) {
      list = list.filter((a) => a.studentId === student_id);
    }
    if (class_id) {
      list = list.filter((a) => a.classId === class_id);
    }
    if (date) {
      list = list.filter((a) => a.date === date);
    }
    if (status) {
      list = list.filter((a) => a.status.toLowerCase().includes((status as string).toLowerCase()));
    }

    res.status(200).json({
      success: true,
      count: list.length,
      absences: list,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/v1/ecole/absences/
 * Enregistrement d'appel ou d'absence avec déclenchement automatique d'alertes parentales
 */
router.post('/', (req: Request, res: Response): void => {
  try {
    const body = req.body;
    const recordsInput: Array<Partial<AttendanceEntity>> = Array.isArray(body)
      ? body
      : Array.isArray(body.records)
      ? body.records
      : [body];

    if (recordsInput.length === 0) {
      res.status(400).json({ success: false, error: 'Aucun enregistrement d\'appel fourni.' });
      return;
    }

    const createdRecords: AttendanceEntity[] = [];
    const generatedAlerts: AlertEntity[] = [];

    for (const item of recordsInput) {
      if (!item.studentId) continue;

      const student = store.students.find((s) => s.id === item.studentId);
      const studentClass = store.classes.find((c) => c.id === item.classId || (student && c.id === student.classId));

      const newRecord: AttendanceEntity = {
        id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        studentId: item.studentId,
        studentName: item.studentName || (student ? `${student.firstName} ${student.lastName}` : 'Élève'),
        classId: item.classId || student?.classId || 'cls-gen',
        className: item.className || studentClass?.name || student?.className || 'Classe',
        date: item.date || new Date().toISOString().slice(0, 10),
        status: item.status || 'Présent',
        minutesLate: item.minutesLate ? Number(item.minutesLate) : undefined,
        reason: item.reason || '',
        notifiedParent: item.notifiedParent !== undefined ? Boolean(item.notifiedParent) : true,
      };

      store.absences.unshift(newRecord);
      createdRecords.push(newRecord);

      // Trigger automatic parent SMS/WhatsApp alert if absent or late and notifiedParent is true
      if (
        student &&
        newRecord.notifiedParent &&
        (newRecord.status === 'Absent Non Justifié' || newRecord.status === 'Retard')
      ) {
        const isLate = newRecord.status === 'Retard';
        const alertTitle = isLate ? 'Alerte Retard Élève' : 'Alerte Absence Non Justifiée';
        const alertMsg = isLate
          ? `Kharandi École : Votre enfant ${student.firstName} ${student.lastName} est arrivé en retard (${newRecord.minutesLate || 15} min) en classe le ${newRecord.date}. Motif : ${newRecord.reason || 'Non précisé'}.`
          : `Kharandi École : Notification importante. Votre enfant ${student.firstName} ${student.lastName} a été noté(e) absent(e) le ${newRecord.date}. Merci de contacter la vie scolaire au +224 628 00 11 22.`;

        const newAlert: AlertEntity = {
          id: `alt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          studentId: student.id,
          studentName: `${student.firstName} ${student.lastName}`,
          parentPhone: student.parentPhone,
          title: alertTitle,
          message: alertMsg,
          type: 'absence',
          channel: 'SMS',
          sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          status: 'Délivré',
        };

        store.alerts.unshift(newAlert);
        generatedAlerts.push(newAlert);
      }
    }

    res.status(201).json({
      success: true,
      message: `${createdRecords.length} statut(s) d'appel enregistré(s). ${generatedAlerts.length} alerte(s) parentale(s) envoyée(s).`,
      count: createdRecords.length,
      absences: createdRecords,
      alertsDispatched: generatedAlerts,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
