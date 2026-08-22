export type Role = 'admin' | 'teacher' | 'parent';

export type LevelCategory = 'Primaire' | 'Collège' | 'Lycée';

export interface Subject {
  id: string;
  name: string;
  code: string;
  coefficient: number;
  category: LevelCategory;
}

export interface SchoolClass {
  id: string;
  name: string; // e.g., "Terminale SM 1", "10ème Année A", "6ème Année"
  level: LevelCategory;
  mainTeacherId: string;
  mainTeacherName: string;
  roomNumber: string;
  studentCount: number;
  subjects: {
    subjectId: string;
    subjectName: string;
    coefficient: number;
    teacherName: string;
  }[];
}

export interface Student {
  id: string;
  matricule: string; // e.g. KH-2025-0482
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  birthDate: string;
  birthPlace: string;
  classId: string;
  className: string;
  level: LevelCategory;
  photoUrl?: string;
  parentName: string;
  parentPhone: string; // +224 62X XX XX XX
  parentEmail: string;
  address: string;
  enrollmentDate: string;
  tuitionTotal: number; // in GNF
  tuitionPaid: number; // in GNF
  status: 'Inscrit' | 'En règle' | 'En retard' | 'Exclu';
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  subjectName: string;
  trimester: 1 | 2 | 3;
  type: 'Interrogation' | 'Devoir 1' | 'Devoir 2' | 'Composition';
  score: number; // out of 20
  maxScore: number; // usually 20
  date: string;
  coefficient: number;
  comment?: string;
}

export interface SubjectAverages {
  subjectId: string;
  subjectName: string;
  coefficient: number;
  average: number;
  teacherName: string;
  teacherAppreciation: string;
}

export interface StudentReportCard {
  student: Student;
  trimester: 1 | 2 | 3;
  schoolYear: string;
  subjectAverages: SubjectAverages[];
  overallAverage: number;
  classRank: number;
  totalStudentsInClass: number;
  totalAbsences: number;
  unexcusedAbsences: number;
  conductAppreciation: string;
  headTeacherAppreciation: string;
  decision: string; // e.g. "Admis avec Tableau d'Honneur", "Encouragements", etc.
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  date: string; // YYYY-MM-DD
  status: 'Présent' | 'Absent Non Justifié' | 'Absent Justifié' | 'Retard';
  minutesLate?: number;
  reason?: string;
  notifiedParent: boolean;
}

export interface LogbookEntry {
  id: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherName: string;
  date: string;
  topicCovered: string; // Contenu du cours
  homeworkAssigned: string; // Devoirs à faire
  homeworkDueDate?: string;
  nextEvaluationDate?: string;
}

export interface PaymentTransaction {
  id: string;
  receiptNumber: string; // e.g. REC-2025-0891
  studentId: string;
  studentName: string;
  matricule: string;
  className: string;
  amount: number; // in GNF
  kharandiFee: number; // portion corresponding to 60,000 GNF/yr
  paymentMethod: 'Orange Money' | 'MTN MoMo' | 'Espèces' | 'Virement';
  transactionRef: string; // e.g. OM-948271
  phoneNumber?: string;
  trimesterLabel: string; // e.g. "1ère Tranche + Forfait Kharandi"
  date: string;
  status: 'Payé' | 'En cours' | 'Échoué';
  issuedBy: string;
}

export interface ParentAlert {
  id: string;
  studentId: string;
  studentName: string;
  parentPhone: string;
  title: string;
  message: string;
  type: 'absence' | 'payment_reminder' | 'grade_published' | 'discipline';
  channel: 'SMS' | 'WhatsApp' | 'Push';
  sentAt: string;
  status: 'Délivré' | 'Envoyé';
}
