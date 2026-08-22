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
  SchoolInfo,
  EvaluationPeriod,
  ScheduledEvaluation,
  TeacherAccount,
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
  INITIAL_EVALUATION_PERIODS,
  INITIAL_SCHEDULED_EVALUATIONS,
  INITIAL_TEACHER_ACCOUNTS,
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
  evaluationsApi,
} from '../services/api';

export interface UserSession {
  role: Role;
  name: string;
  email?: string;
  matricule?: string;
  schoolId: string;
}

interface SchoolContextType {
  role: Role;
  setRole: (role: Role) => void;
  currentUser: UserSession | null;
  setCurrentUser: (user: UserSession | null) => void;
  login: (credentials: { identifier: string; password?: string; role: Role }) => boolean;
  logout: () => void;

  selectedStudentIdForParent: string;
  setSelectedStudentIdForParent: (id: string) => void;
  schoolInfo: SchoolInfo;
  updateSchoolInfo: (info: Partial<SchoolInfo>) => void;

  classes: SchoolClass[];
  students: Student[];
  subjects: Subject[];
  grades: Grade[];
  attendance: AttendanceRecord[];
  logbook: LogbookEntry[];
  payments: PaymentTransaction[];
  alerts: ParentAlert[];
  evaluationPeriods: EvaluationPeriod[];
  scheduledEvaluations: ScheduledEvaluation[];
  teacherAccounts: TeacherAccount[];
  isBackendConnected: boolean;
  
  // Actions
  addStudent: (student: Omit<Student, 'id' | 'matricule'>) => Student;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  generateParentPin: (studentId: string) => string;
  
  // Teacher Accounts (Created by Direction)
  addTeacherAccount: (account: Omit<TeacherAccount, 'id' | 'createdAt'>) => TeacherAccount;
  updateTeacherAccount: (id: string, updates: Partial<TeacherAccount>) => void;
  deleteTeacherAccount: (id: string) => void;
  
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

  // Evaluation Planning
  addEvaluationPeriod: (period: Omit<EvaluationPeriod, 'id'>) => EvaluationPeriod;
  updateEvaluationPeriod: (id: string, updates: Partial<EvaluationPeriod>) => void;
  deleteEvaluationPeriod: (id: string) => void;

  addScheduledEvaluation: (evaluation: Omit<ScheduledEvaluation, 'id'>) => ScheduledEvaluation;
  updateScheduledEvaluation: (id: string, updates: Partial<ScheduledEvaluation>) => void;
  deleteScheduledEvaluation: (id: string) => void;

  // Helpers
  getStudentReportCard: (studentId: string, trimester?: 1 | 2 | 3) => StudentReportCard | null;
  getFinancialSummary: () => {
    totalStudents: number;
    totalExpected: number;
    totalCollected: number;
    totalUnpaid: number;
    kharandiRevenue: number;
    collectionRate: number;
  };
  resetAllData: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>(() => {
    const saved = localStorage.getItem('school_user_role');
    return (saved as Role) || 'admin';
  });

  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('school_user_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return {
      role: 'admin',
      name: 'Direction Générale',
      email: 'direction@ecole.gn',
      schoolId: 'sch-gn-001',
    };
  });

  const [selectedStudentIdForParent, setSelectedStudentIdForParent] = useState<string>('std-001');

  // School Info / White-labeling
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(() => {
    const saved = localStorage.getItem('school_info_config');
    return saved ? JSON.parse(saved) : SCHOOL_INFO;
  });

  // Local storage state loaders
  const [classes, setClasses] = useState<SchoolClass[]>(() => {
    const saved = localStorage.getItem('school_classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('school_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [subjects] = useState<Subject[]>(INITIAL_SUBJECTS);

  const [grades, setGrades] = useState<Grade[]>(() => {
    const saved = localStorage.getItem('school_grades');
    return saved ? JSON.parse(saved) : INITIAL_GRADES;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('school_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [logbook, setLogbook] = useState<LogbookEntry[]>(() => {
    const saved = localStorage.getItem('school_logbook');
    return saved ? JSON.parse(saved) : INITIAL_LOGBOOK;
  });

  const [payments, setPayments] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem('school_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [alerts, setAlerts] = useState<ParentAlert[]>(() => {
    const saved = localStorage.getItem('school_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [evaluationPeriods, setEvaluationPeriods] = useState<EvaluationPeriod[]>(() => {
    const saved = localStorage.getItem('school_eval_periods');
    return saved ? JSON.parse(saved) : INITIAL_EVALUATION_PERIODS;
  });

  const [scheduledEvaluations, setScheduledEvaluations] = useState<ScheduledEvaluation[]>(() => {
    const saved = localStorage.getItem('school_eval_schedule');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULED_EVALUATIONS;
  });

  const [teacherAccounts, setTeacherAccounts] = useState<TeacherAccount[]>(() => {
    const saved = localStorage.getItem('school_teacher_accounts');
    return saved ? JSON.parse(saved) : INITIAL_TEACHER_ACCOUNTS;
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
    localStorage.setItem('school_user_role', role);
  }, [role]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('school_user_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('school_user_session');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('school_info_config', JSON.stringify(schoolInfo));
  }, [schoolInfo]);

  useEffect(() => {
    localStorage.setItem('school_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('school_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('school_grades', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem('school_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('school_logbook', JSON.stringify(logbook));
  }, [logbook]);

  useEffect(() => {
    localStorage.setItem('school_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('school_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('school_eval_periods', JSON.stringify(evaluationPeriods));
  }, [evaluationPeriods]);

  useEffect(() => {
    localStorage.setItem('school_eval_schedule', JSON.stringify(scheduledEvaluations));
  }, [scheduledEvaluations]);

  useEffect(() => {
    localStorage.setItem('school_teacher_accounts', JSON.stringify(teacherAccounts));
  }, [teacherAccounts]);

  // Auth Methods
  const login = ({ identifier, password, role: targetRole }: { identifier: string; password?: string; role: Role }): boolean => {
    setRole(targetRole);

    let sessionName = 'Utilisateur';
    let userMatricule: string | undefined = undefined;

    if (targetRole === 'admin') {
      sessionName = schoolInfo.directorName ? `Direction (${schoolInfo.directorName})` : "Direction de l'Établissement";
    } else if (targetRole === 'teacher') {
      const match = teacherAccounts.find(
        (t) =>
          t.email.toLowerCase() === identifier.trim().toLowerCase() ||
          t.accessCode.toLowerCase() === identifier.trim().toLowerCase() ||
          t.id === identifier.trim()
      );
      if (match) {
        sessionName = match.name;
      } else if (identifier.includes('@')) {
        sessionName = 'Prof. Souleymane Camara';
      } else {
        sessionName = `Enseignant (${identifier})`;
      }
    } else if (targetRole === 'parent') {
      const cleanId = identifier.trim().toLowerCase();
      const student = students.find(
        (s) =>
          s.matricule.toLowerCase() === cleanId ||
          s.id === cleanId ||
          (s.parentPin && s.parentPin.toLowerCase() === cleanId) ||
          s.parentPhone.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '')
      );
      if (student) {
        sessionName = `${student.parentName} (Parent de ${student.firstName})`;
        userMatricule = student.matricule;
        setSelectedStudentIdForParent(student.id);
      } else {
        sessionName = `Espace Parent (${identifier})`;
        userMatricule = identifier;
      }
    }

    const session: UserSession = {
      role: targetRole,
      name: sessionName,
      email: identifier.includes('@') ? identifier : undefined,
      matricule: userMatricule,
      schoolId: schoolInfo.id,
    };

    setCurrentUser(session);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateSchoolInfo = (infoUpdates: Partial<SchoolInfo>) => {
    setSchoolInfo((prev) => {
      const updated = { ...prev, ...infoUpdates };
      schoolsApi.update(updated.id, updated).catch((err) =>
        console.warn('API Sync notice (updateSchoolInfo):', err.message)
      );
      return updated;
    });
  };

  // Actions
  const addStudent = (studentData: Omit<Student, 'id' | 'matricule'>): Student => {
    const id = `std-${Date.now()}`;
    const seq = (students.length + 101).toString().padStart(4, '0');
    const matricule = `KH-2025-${seq}`;
    const pin = `PAR-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newStudent: Student = {
      ...studentData,
      id,
      matricule,
      parentPin: studentData.parentPin || pin,
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
    studentsApi.create(schoolInfo.id, {
      ...newStudent,
      schoolId: schoolInfo.id,
    }).catch((err) => console.warn('API Sync notice (addStudent):', err.message));

    return newStudent;
  };

  const generateParentPin = (studentId: string): string => {
    const newPin = `PAR-${Math.floor(1000 + Math.random() * 9000)}`;
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, parentPin: newPin } : s))
    );
    return newPin;
  };

  // Teacher Accounts created by Direction
  const addTeacherAccount = (accountData: Omit<TeacherAccount, 'id' | 'createdAt'>): TeacherAccount => {
    const id = `tch-${Date.now()}`;
    const accessCode = accountData.accessCode || `ENS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAccount: TeacherAccount = {
      ...accountData,
      id,
      accessCode,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Actif',
    };
    setTeacherAccounts((prev) => [newAccount, ...prev]);
    return newAccount;
  };

  const updateTeacherAccount = (id: string, updates: Partial<TeacherAccount>) => {
    setTeacherAccounts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTeacherAccount = (id: string) => {
    setTeacherAccounts((prev) => prev.filter((t) => t.id !== id));
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
      schoolId: schoolInfo.id,
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
            message: `Avis École : Votre enfant ${student.firstName} ${student.lastName} a été noté(e) ${r.status.toLowerCase()} le ${r.date}.`,
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
      issuedBy: paymentData.paymentMethod === 'Espèces' ? 'M. Sylla (Caisse)' : 'Paiement En Ligne',
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
      message: `Avis École : Reçu de versement de ${paymentData.amount.toLocaleString()} GNF pour ${student.firstName} (${paymentData.paymentMethod} Ref: ${paymentData.transactionRef}). Reçu ${receiptNum}.`,
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

  // Evaluation Planning Methods
  const addEvaluationPeriod = (periodData: Omit<EvaluationPeriod, 'id'>): EvaluationPeriod => {
    const newPeriod: EvaluationPeriod = {
      ...periodData,
      id: `per-${Date.now()}`,
    };
    setEvaluationPeriods((prev) => [...prev, newPeriod]);
    evaluationsApi.createPeriod({ ...newPeriod, schoolId: schoolInfo.id }).catch((err) =>
      console.warn('API Sync notice (addEvaluationPeriod):', err.message)
    );
    return newPeriod;
  };

  const updateEvaluationPeriod = (id: string, updates: Partial<EvaluationPeriod>) => {
    setEvaluationPeriods((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    evaluationsApi.updatePeriod(id, updates).catch((err) =>
      console.warn('API Sync notice (updateEvaluationPeriod):', err.message)
    );
  };

  const deleteEvaluationPeriod = (id: string) => {
    setEvaluationPeriods((prev) => prev.filter((p) => p.id !== id));
    setScheduledEvaluations((prev) => prev.filter((e) => e.periodId !== id));
    evaluationsApi.deletePeriod(id).catch((err) =>
      console.warn('API Sync notice (deleteEvaluationPeriod):', err.message)
    );
  };

  const addScheduledEvaluation = (evalData: Omit<ScheduledEvaluation, 'id'>): ScheduledEvaluation => {
    const newEval: ScheduledEvaluation = {
      ...evalData,
      id: `eval-${Date.now()}`,
    };
    setScheduledEvaluations((prev) => [...prev, newEval]);
    evaluationsApi.createEvaluation({ ...newEval, schoolId: schoolInfo.id }).catch((err) =>
      console.warn('API Sync notice (addScheduledEvaluation):', err.message)
    );
    return newEval;
  };

  const updateScheduledEvaluation = (id: string, updates: Partial<ScheduledEvaluation>) => {
    setScheduledEvaluations((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
    evaluationsApi.updateEvaluation(id, updates).catch((err) =>
      console.warn('API Sync notice (updateScheduledEvaluation):', err.message)
    );
  };

  const deleteScheduledEvaluation = (id: string) => {
    setScheduledEvaluations((prev) => prev.filter((e) => e.id !== id));
    evaluationsApi.deleteEvaluation(id).catch((err) =>
      console.warn('API Sync notice (deleteScheduledEvaluation):', err.message)
    );
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
    const classAverages = classStudents.map((s) => {
      if (s.id === studentId) return { id: s.id, avg: overallAverage };
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
      schoolYear: schoolInfo.schoolYear,
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
    localStorage.removeItem('school_info_config');
    localStorage.removeItem('school_classes');
    localStorage.removeItem('school_students');
    localStorage.removeItem('school_grades');
    localStorage.removeItem('school_attendance');
    localStorage.removeItem('school_logbook');
    localStorage.removeItem('school_payments');
    localStorage.removeItem('school_alerts');
    localStorage.removeItem('school_eval_periods');
    localStorage.removeItem('school_eval_schedule');
    localStorage.removeItem('school_user_session');

    setSchoolInfo(SCHOOL_INFO);
    setClasses(INITIAL_CLASSES);
    setStudents(INITIAL_STUDENTS);
    setGrades(INITIAL_GRADES);
    setAttendance(INITIAL_ATTENDANCE);
    setLogbook(INITIAL_LOGBOOK);
    setPayments(INITIAL_PAYMENTS);
    setAlerts(INITIAL_ALERTS);
    setEvaluationPeriods(INITIAL_EVALUATION_PERIODS);
    setScheduledEvaluations(INITIAL_SCHEDULED_EVALUATIONS);
  };

  return (
    <SchoolContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        setCurrentUser,
        login,
        logout,
        selectedStudentIdForParent,
        setSelectedStudentIdForParent,
        schoolInfo,
        updateSchoolInfo,
        classes,
        students,
        subjects,
        grades,
        attendance,
        logbook,
        payments,
        alerts,
        evaluationPeriods,
        scheduledEvaluations,
        teacherAccounts,
        isBackendConnected,
        addStudent,
        updateStudent,
        deleteStudent,
        generateParentPin,
        addTeacherAccount,
        updateTeacherAccount,
        deleteTeacherAccount,
        addClass,
        addGrade,
        addBulkGrades,
        recordAttendance,
        addLogbookEntry,
        processPayment,
        sendParentAlert,
        addEvaluationPeriod,
        updateEvaluationPeriod,
        deleteEvaluationPeriod,
        addScheduledEvaluation,
        updateScheduledEvaluation,
        deleteScheduledEvaluation,
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

