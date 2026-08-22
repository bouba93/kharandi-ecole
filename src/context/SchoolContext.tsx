import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  Student,
  SchoolClass,
  Subject,
  Grade,
  AttendanceRecord,
  LogbookEntry,
  PaymentTransaction,
  ParentAlert,
  StudentReportCard,
  SubjectAverages,
} from '../types';
import {
  SCHOOL_INFO,
  INITIAL_CLASSES,
  INITIAL_STUDENTS,
  INITIAL_SUBJECTS,
  INITIAL_GRADES,
  INITIAL_ATTENDANCE,
  INITIAL_LOGBOOK,
  INITIAL_PAYMENTS,
  INITIAL_ALERTS,
} from '../data/initialData';

import {
  authApi,
  schoolsApi,
  studentsApi,
  classesApi,
  teachersApi,
  gradesApi,
  absencesApi,
  parentApi,
  badgesApi,
} from '../services/api';

interface SchoolContextType {
  role: Role;
  setRole: (role: Role) => void;
  selectedStudentIdForParent: string;
  setSelectedStudentIdForParent: (id: string) => void;
  schoolInfo: typeof SCHOOL_INFO;
  classes: SchoolClass[];
  students: Student[];
  subjects: Subject[];
  grades: Grade[];
  attendance: AttendanceRecord[];
  logbook: LogbookEntry[];
  payments: PaymentTransaction[];
  alerts: ParentAlert[];
  isBackendConnected: boolean;
  
  // Actions
  addStudent: (student: Omit<Student, 'id' | 'matricule'>) => Student;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  
  addClass: (cls: Omit<SchoolClass, 'id' | 'studentCount'>) => void;
  addGrade: (grade: Omit<Grade, 'id'>) => void;
  addBulkGrades: (gradesList: Omit<Grade, 'id'>[]) => void;
  
  recordAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;
  addLogbookEntry: (entry: Omit<LogbookEntry, 'id'>) => void;
  
  processPayment: (payment: {
    studentId: string;
    amount: number;
    paymentMethod: 'Orange Money' | 'MTN MoMo' | 'Espèces' | 'Virement';
    transactionRef: string;
    phoneNumber?: string;
    trimesterLabel: string;
  }) => PaymentTransaction;
  
  sendParentAlert: (alert: Omit<ParentAlert, 'id' | 'sentAt' | 'status'>) => ParentAlert;

  // Helpers
  getStudentReportCard: (studentId: string, trimester?: 1 | 2 | 3) => StudentReportCard | null;
  getFinancialSummary: () => {
    totalStudents: number;
    totalExpected: number;
    totalCollected: number;
    totalUnpaid: number;
    kharandiRevenue: number; // 60,000 GNF * totalStudents
    collectionRate: number;
  };
  resetAllData: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('admin');
  const [selectedStudentIdForParent, setSelectedStudentIdForParent] = useState<string>('std-001');

  // Local storage initial state loader
  const [classes, setClasses] = useState<SchoolClass[]>(() => {
    const saved = localStorage.getItem('kharandi_classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('kharandi_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [subjects] = useState<Subject[]>(INITIAL_SUBJECTS);

  const [grades, setGrades] = useState<Grade[]>(() => {
    const saved = localStorage.getItem('kharandi_grades');
    return saved ? JSON.parse(saved) : INITIAL_GRADES;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('kharandi_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [logbook, setLogbook] = useState<LogbookEntry[]>(() => {
    const saved = localStorage.getItem('kharandi_logbook');
    return saved ? JSON.parse(saved) : INITIAL_LOGBOOK;
  });

  const [payments, setPayments] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem('kharandi_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [alerts, setAlerts] = useState<ParentAlert[]>(() => {
    const saved = localStorage.getItem('kharandi_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);

  // Ping backend on initialization
  useEffect(() => {
    fetch('/api/v1/ecole/health')
      .then((res) => res.json())
      .then(() => setIsBackendConnected(true))
      .catch(() => setIsBackendConnected(false));
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('kharandi_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('kharandi_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('kharandi_grades', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem('kharandi_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('kharandi_logbook', JSON.stringify(logbook));
  }, [logbook]);

  useEffect(() => {
    localStorage.setItem('kharandi_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('kharandi_alerts', JSON.stringify(alerts));
  }, [alerts]);

  // Actions
  const addStudent = (studentData: Omit<Student, 'id' | 'matricule'>): Student => {
    const id = `std-${Date.now()}`;
    const seq = (students.length + 101).toString().padStart(4, '0');
    const matricule = `KH-2025-${seq}`;
    
    const newStudent: Student = {
      ...studentData,
      id,
      matricule,
      photoUrl: studentData.photoUrl || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80`,
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Update class student count
    setClasses((prev) =>
      prev.map((c) =>
        c.id === newStudent.classId ? { ...c, studentCount: c.studentCount + 1 } : c
      )
    );

    // Sync to Backend
    studentsApi.create('sch-gn-001', {
      ...newStudent,
      schoolId: 'sch-gn-001',
    }).catch((err) => console.warn('API Sync notice (addStudent):', err.message));

    return newStudent;
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );

    // Sync to Backend
    studentsApi.update(id, updates).catch((err) =>
      console.warn('API Sync notice (updateStudent):', err.message)
    );
  };

  const deleteStudent = (id: string) => {
    const target = students.find((s) => s.id === id);
    if (target) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
      setClasses((prev) =>
        prev.map((c) =>
          c.id === target.classId ? { ...c, studentCount: Math.max(0, c.studentCount - 1) } : c
        )
      );

      // Sync to Backend
      studentsApi.delete(id).catch((err) =>
        console.warn('API Sync notice (deleteStudent):', err.message)
      );
    }
  };

  const addClass = (clsData: Omit<SchoolClass, 'id' | 'studentCount'>) => {
    const newClass: SchoolClass = {
      ...clsData,
      id: `cls-${Date.now()}`,
      studentCount: 0,
    };
    setClasses((prev) => [...prev, newClass]);

    // Sync to Backend
    classesApi.create({
      ...newClass,
      schoolId: 'sch-gn-001',
    }).catch((err) => console.warn('API Sync notice (addClass):', err.message));
  };

  const addGrade = (gradeData: Omit<Grade, 'id'>) => {
    const newGrade: Grade = {
      ...gradeData,
      id: `grd-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setGrades((prev) => [newGrade, ...prev]);

    // Sync to Backend
    gradesApi.create(newGrade).catch((err) =>
      console.warn('API Sync notice (addGrade):', err.message)
    );
  };

  const addBulkGrades = (gradesList: Omit<Grade, 'id'>[]) => {
    const newGrades: Grade[] = gradesList.map((g, idx) => ({
      ...g,
      id: `grd-${Date.now()}-${idx}`,
    }));
    setGrades((prev) => [...newGrades, ...prev]);

    // Sync to Backend
    gradesApi.create(newGrades).catch((err) =>
      console.warn('API Sync notice (addBulkGrades):', err.message)
    );
  };

  const recordAttendance = (records: Omit<AttendanceRecord, 'id'>[]) => {
    const newRecords: AttendanceRecord[] = records.map((r, idx) => ({
      ...r,
      id: `att-${Date.now()}-${idx}`,
    }));

    setAttendance((prev) => [...newRecords, ...prev]);

    // Sync to Backend
    absencesApi.create(newRecords).catch((err) =>
      console.warn('API Sync notice (recordAttendance):', err.message)
    );

    // Send instant parent alert for non-justified absences or tardiness
    newRecords.forEach((r) => {
      if ((r.status === 'Absent Non Justifié' || r.status === 'Retard') && r.notifiedParent) {
        const student = students.find((s) => s.id === r.studentId);
        if (student) {
          sendParentAlert({
            studentId: student.id,
            studentName: `${student.firstName} ${student.lastName}`,
            parentPhone: student.parentPhone,
            title: r.status === 'Retard' ? 'Alerte Retard' : 'Alerte Absence',
            message: `Kharandi École : Votre enfant ${student.firstName} ${student.lastName} a été noté(e) ${r.status.toLowerCase()} le ${r.date}.`,
            type: 'absence',
            channel: 'SMS',
          });
        }
      }
    });
  };

  const addLogbookEntry = (entryData: Omit<LogbookEntry, 'id'>) => {
    const newEntry: LogbookEntry = {
      ...entryData,
      id: `log-${Date.now()}`,
    };
    setLogbook((prev) => [newEntry, ...prev]);
  };

  const processPayment = (paymentData: {
    studentId: string;
    amount: number;
    paymentMethod: 'Orange Money' | 'MTN MoMo' | 'Espèces' | 'Virement';
    transactionRef: string;
    phoneNumber?: string;
    trimesterLabel: string;
  }): PaymentTransaction => {
    const student = students.find((s) => s.id === paymentData.studentId);
    if (!student) throw new Error('Élève non trouvé');

    const receiptNum = `REC-2025-${(payments.length + 1).toString().padStart(3, '0')}`;
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newPayment: PaymentTransaction = {
      id: `pay-${Date.now()}`,
      receiptNumber: receiptNum,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      matricule: student.matricule,
      className: student.className,
      amount: paymentData.amount,
      kharandiFee: 60000,
      paymentMethod: paymentData.paymentMethod,
      transactionRef: paymentData.transactionRef,
      phoneNumber: paymentData.phoneNumber || student.parentPhone,
      trimesterLabel: paymentData.trimesterLabel,
      date: dateStr,
      status: 'Payé',
      issuedBy: paymentData.paymentMethod === 'Espèces' ? 'M. Sylla (Caisse)' : 'Paiement En Ligne Kharandi',
    };

    setPayments((prev) => [newPayment, ...prev]);

    // Update student paid tuition
    const newPaid = student.tuitionPaid + paymentData.amount;
    const newStatus = newPaid >= student.tuitionTotal ? 'En règle' : 'En retard';
    updateStudent(student.id, { tuitionPaid: newPaid, status: newStatus });

    // Send confirmation alert
    sendParentAlert({
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      parentPhone: student.parentPhone,
      title: 'Paiement Confirmé',
      message: `Kharandi École : Reçu de versement de ${paymentData.amount.toLocaleString()} GNF pour ${student.firstName} (${paymentData.paymentMethod} Ref: ${paymentData.transactionRef}). Reçu ${receiptNum}.`,
      type: 'payment_reminder',
      channel: 'SMS',
    });

    return newPayment;
  };

  const sendParentAlert = (alertData: Omit<ParentAlert, 'id' | 'sentAt' | 'status'>): ParentAlert => {
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newAlert: ParentAlert = {
      ...alertData,
      id: `alt-${Date.now()}`,
      sentAt: dateStr,
      status: 'Délivré',
    };

    setAlerts((prev) => [newAlert, ...prev]);
    return newAlert;
  };

  // Helper for Report Card
  const getStudentReportCard = (studentId: string, trimester: 1 | 2 | 3 = 1): StudentReportCard | null => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return null;

    const studentClass = classes.find((c) => c.id === student.classId);
    const classSubjects = studentClass ? studentClass.subjects : [];

    // Filter student grades for this trimester
    const studentGrades = grades.filter((g) => g.studentId === studentId && g.trimester === trimester);

    // Calculate subject averages
    const subjectAverages: SubjectAverages[] = classSubjects.map((sub) => {
      const subGrades = studentGrades.filter((g) => g.subjectId === sub.subjectId);
      let avg = 0;
      if (subGrades.length > 0) {
        const total = subGrades.reduce((acc, curr) => acc + curr.score, 0);
        avg = total / subGrades.length;
      } else {
        avg = 12.5; // default benchmark if not yet graded
      }

      let appreciation = 'Travail satisfaisant.';
      if (avg >= 16) appreciation = 'Excellents résultats, élève modèle.';
      else if (avg >= 14) appreciation = 'Très bon travail, poursuivez ainsi.';
      else if (avg >= 12) appreciation = 'Travail convenable.';
      else if (avg >= 10) appreciation = 'Passable, doit faire plus d\'efforts.';
      else appreciation = 'Résultats insuffisants. Nécessite un suivi strict.';

      return {
        subjectId: sub.subjectId,
        subjectName: sub.subjectName,
        coefficient: sub.coefficient,
        average: parseFloat(avg.toFixed(2)),
        teacherName: sub.teacherName,
        teacherAppreciation: appreciation,
      };
    });

    // Calculate overall weighted average
    const totalWeightedScores = subjectAverages.reduce((acc, curr) => acc + curr.average * curr.coefficient, 0);
    const totalCoefficients = subjectAverages.reduce((acc, curr) => acc + curr.coefficient, 0);
    const overallAverage = totalCoefficients > 0 ? parseFloat((totalWeightedScores / totalCoefficients).toFixed(2)) : 0;

    // Calculate class rank
    const classStudents = students.filter((s) => s.classId === student.classId);
    // Sort all class students by average (using dummy logic or real grades)
    const classAverages = classStudents.map((s) => {
      if (s.id === studentId) return { id: s.id, avg: overallAverage };
      // approximate average for other classmates
      const sGrades = grades.filter((g) => g.studentId === s.id && g.trimester === trimester);
      const avg = sGrades.length > 0 ? sGrades.reduce((a, b) => a + b.score, 0) / sGrades.length : 13.5;
      return { id: s.id, avg };
    });
    classAverages.sort((a, b) => b.avg - a.avg);
    const classRank = classAverages.findIndex((x) => x.id === studentId) + 1 || 1;

    // Absences
    const studentAbsences = attendance.filter((a) => a.studentId === studentId && a.status.includes('Absent'));

    // Decision
    let decision = 'Admis(e) en classe supérieure';
    if (overallAverage >= 16) decision = 'Tableau d\'Honneur avec Félicitations du Conseil';
    else if (overallAverage >= 14) decision = 'Tableau d\'Honneur & Encouragements';
    else if (overallAverage >= 12) decision = 'Satisfaisant - Passage accordé';
    else if (overallAverage >= 10) decision = 'Passable - Mises en garde pédagogiques';
    else decision = 'Ajourné - Travail très insuffisant';

    return {
      student,
      trimester,
      schoolYear: SCHOOL_INFO.schoolYear,
      subjectAverages,
      overallAverage,
      classRank,
      totalStudentsInClass: classStudents.length,
      totalAbsences: studentAbsences.length,
      unexcusedAbsences: studentAbsences.filter((a) => a.status === 'Absent Non Justifié').length,
      conductAppreciation: 'Excellente tenue, élève discipliné(e) et assidu(e).',
      headTeacherAppreciation: `Élève engagé(e). Moyenne générale de ${overallAverage}/20 avec rang de ${classRank}e sur ${classStudents.length}.`,
      decision,
    };
  };

  const getFinancialSummary = () => {
    const totalStudents = students.length;
    const totalExpected = students.reduce((acc, curr) => acc + curr.tuitionTotal, 0);
    const totalCollected = students.reduce((acc, curr) => acc + curr.tuitionPaid, 0);
    const totalUnpaid = Math.max(0, totalExpected - totalCollected);
    const kharandiRevenue = totalStudents * 60000;
    const collectionRate = totalExpected > 0 ? parseFloat(((totalCollected / totalExpected) * 100).toFixed(1)) : 0;

    return {
      totalStudents,
      totalExpected,
      totalCollected,
      totalUnpaid,
      kharandiRevenue,
      collectionRate,
    };
  };

  const resetAllData = () => {
    localStorage.removeItem('kharandi_classes');
    localStorage.removeItem('kharandi_students');
    localStorage.removeItem('kharandi_grades');
    localStorage.removeItem('kharandi_attendance');
    localStorage.removeItem('kharandi_logbook');
    localStorage.removeItem('kharandi_payments');
    localStorage.removeItem('kharandi_alerts');

    setClasses(INITIAL_CLASSES);
    setStudents(INITIAL_STUDENTS);
    setGrades(INITIAL_GRADES);
    setAttendance(INITIAL_ATTENDANCE);
    setLogbook(INITIAL_LOGBOOK);
    setPayments(INITIAL_PAYMENTS);
    setAlerts(INITIAL_ALERTS);
  };

  return (
    <SchoolContext.Provider
      value={{
        role,
        setRole,
        selectedStudentIdForParent,
        setSelectedStudentIdForParent,
        schoolInfo: SCHOOL_INFO,
        classes,
        students,
        subjects,
        grades,
        attendance,
        logbook,
        payments,
        alerts,
        isBackendConnected,
        addStudent,
        updateStudent,
        deleteStudent,
        addClass,
        addGrade,
        addBulkGrades,
        recordAttendance,
        addLogbookEntry,
        processPayment,
        sendParentAlert,
        getStudentReportCard,
        getFinancialSummary,
        resetAllData,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const ctx = useContext(SchoolContext);
  if (!ctx) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return ctx;
};
