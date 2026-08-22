export interface SchoolEntity {
  id: string;
  name: string;
  subtext: string;
  address: string;
  phone: string;
  email: string;
  ministere: string;
  dpe: string;
  logoUrl: string;
  currentTrimester: 1 | 2 | 3;
  schoolYear: string;
  activationCode: string;
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
  totalStudents?: number;
  totalTeachers?: number;
  totalClasses?: number;
}

export interface TeacherEntity {
  id: string;
  schoolId: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  classIds: string[];
  role: 'teacher' | 'head_teacher' | 'coordinator';
  avatarUrl?: string;
  active: boolean;
  matriculeTeacher?: string;
  hireDate?: string;
}

export interface BadgeEntity {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  matricule: string;
  className: string;
  issueDate: string;
  expiryDate: string;
  qrCodeData: string;
  status: 'active' | 'expired' | 'revoked';
  badgeType: 'carte_scolaire' | 'excellence' | 'discipline' | 'assiduite';
  downloadedCount: number;
}

export interface StudentEntity {
  id: string;
  schoolId: string;
  matricule: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  birthDate: string;
  birthPlace: string;
  classId: string;
  className: string;
  level: 'Primaire' | 'Collège' | 'Lycée';
  photoUrl?: string;
  
  // Médical & Contact
  bloodType?: string;
  medicalNotes?: string;
  emergencyContact?: string;
  
  // Tuteurs & Parents
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  address: string;
  fatherName?: string;
  fatherPhone?: string;
  fatherJob?: string;
  motherName?: string;
  motherPhone?: string;
  motherJob?: string;
  tutorRelationship?: string;

  enrollmentDate: string;
  tuitionTotal: number;
  tuitionPaid: number;
  status: 'Inscrit' | 'En règle' | 'En retard' | 'Exclu';
}

export interface ClassEntity {
  id: string;
  schoolId: string;
  name: string;
  level: 'Primaire' | 'Collège' | 'Lycée';
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

export interface GradeEntity {
  id: string;
  studentId: string;
  studentName?: string;
  subjectId: string;
  subjectName: string;
  trimester: 1 | 2 | 3;
  type: 'Interrogation' | 'Devoir 1' | 'Devoir 2' | 'Composition';
  score: number;
  maxScore: number;
  date: string;
  coefficient: number;
  comment?: string;
}

export interface EvaluationPeriodEntity {
  id: string;
  schoolId: string;
  trimester: 1 | 2 | 3;
  title: string;
  startDate: string;
  endDate: string;
  gradingDeadline: string;
  deliberationDate?: string;
  status: 'upcoming' | 'active' | 'closed';
}

export interface ScheduledEvaluationEntity {
  id: string;
  schoolId: string;
  periodId: string;
  trimester: 1 | 2 | 3;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  type: 'Interrogation' | 'Devoir 1' | 'Devoir 2' | 'Composition' | 'Examen Blanc';
  title: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  roomNumber: string;
  coefficient: number;
  supervisorName: string;
  status: 'planifié' | 'en_cours' | 'terminé' | 'noté';
  maxScore: number;
}

export interface AttendanceEntity {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  date: string;
  status: 'Présent' | 'Absent Non Justifié' | 'Absent Justifié' | 'Retard';
  minutesLate?: number;
  reason?: string;
  notifiedParent: boolean;
}

export interface AlertEntity {
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

export interface LogbookEntity {
  id: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherName: string;
  date: string;
  topicCovered: string;
  homeworkAssigned: string;
  homeworkDueDate?: string;
  nextEvaluationDate?: string;
}

export interface PaymentEntity {
  id: string;
  receiptNumber: string;
  studentId: string;
  studentName: string;
  matricule: string;
  className: string;
  amount: number;
  kharandiFee: number;
  paymentMethod: 'Orange Money' | 'MTN MoMo' | 'Espèces' | 'Virement';
  transactionRef: string;
  phoneNumber?: string;
  trimesterLabel: string;
  date: string;
  status: 'Payé' | 'En cours' | 'Échoué';
  issuedBy: string;
}

// In-memory data store with default seed
class DataStore {
  public schools: SchoolEntity[] = [
    {
      id: 'sch-gn-001',
      name: 'Groupe Scolaire Kharandi Excellence',
      subtext: 'Établissement Privé d\'Enseignement Général (Primaire - Collège - Lycée)',
      address: 'Quartier Kaporo-Cité, Commune de Ratoma, Conakry, République de Guinée',
      phone: '+224 628 00 11 22 / +224 664 33 44 55',
      email: 'contact@kharandi-excellence.gn',
      ministere: 'Ministère de l\'Enseignement Pré-Universitaire et de l\'Alphabétisation (MEPU-A)',
      dpe: 'DCE de Ratoma - Conakry',
      logoUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=200&q=80',
      currentTrimester: 1,
      schoolYear: '2025-2026',
      activationCode: 'KH-EXC-2025',
      status: 'active',
      createdAt: '2025-08-15T08:00:00.000Z',
    }
  ];

  public evaluationPeriods: EvaluationPeriodEntity[] = [
    {
      id: 'per-trim-1',
      schoolId: 'sch-gn-001',
      trimester: 1,
      title: '1er Trimestre — Évaluations & Compositions',
      startDate: '2025-10-15',
      endDate: '2025-12-15',
      gradingDeadline: '2025-12-20',
      deliberationDate: '2025-12-22',
      status: 'active',
    },
    {
      id: 'per-trim-2',
      schoolId: 'sch-gn-001',
      trimester: 2,
      title: '2ème Trimestre — Évaluations & Compositions',
      startDate: '2026-01-10',
      endDate: '2026-03-25',
      gradingDeadline: '2026-03-30',
      deliberationDate: '2026-04-02',
      status: 'upcoming',
    },
    {
      id: 'per-trim-3',
      schoolId: 'sch-gn-001',
      trimester: 3,
      title: '3ème Trimestre — Examens Blancs & Passage',
      startDate: '2026-04-15',
      endDate: '2026-06-20',
      gradingDeadline: '2026-06-25',
      deliberationDate: '2026-06-28',
      status: 'upcoming',
    },
  ];

  public scheduledEvaluations: ScheduledEvaluationEntity[] = [
    {
      id: 'eval-001',
      schoolId: 'sch-gn-001',
      periodId: 'per-trim-1',
      trimester: 1,
      classId: 'cls-t-sm1',
      className: 'Terminale SM 1',
      subjectId: 'sub-math-sm',
      subjectName: 'Mathématiques',
      type: 'Devoir 1',
      title: 'Devoir Surveillé N°1 - Fonctions Logarithmes & Suites',
      date: '2025-10-15',
      startTime: '08:00',
      durationMinutes: 180,
      roomNumber: 'Salle 204 (Bac)',
      coefficient: 5,
      supervisorName: 'Prof. Souleymane Camara',
      status: 'noté',
      maxScore: 20,
    },
    {
      id: 'eval-002',
      schoolId: 'sch-gn-001',
      periodId: 'per-trim-1',
      trimester: 1,
      classId: 'cls-t-sm1',
      className: 'Terminale SM 1',
      subjectId: 'sub-phys-sm',
      subjectName: 'Physique-Chimie',
      type: 'Composition',
      title: 'Composition Trimestrielle de Physique-Chimie',
      date: '2025-11-01',
      startTime: '08:30',
      durationMinutes: 180,
      roomNumber: 'Salle 204 (Bac)',
      coefficient: 4,
      supervisorName: 'Prof. Mamadou Alpha Bah',
      status: 'noté',
      maxScore: 20,
    },
    {
      id: 'eval-003',
      schoolId: 'sch-gn-001',
      periodId: 'per-trim-1',
      trimester: 1,
      classId: 'cls-10-a',
      className: '10ème Année A (BEPC)',
      subjectId: 'sub-fr-col',
      subjectName: 'Français',
      type: 'Devoir 1',
      title: 'Devoir Surveillé N°1 - Dictée & Questions de Texte',
      date: '2025-10-18',
      startTime: '10:00',
      durationMinutes: 120,
      roomNumber: 'Salle 102',
      coefficient: 4,
      supervisorName: 'Prof. Fatoumata Diallo',
      status: 'noté',
      maxScore: 20,
    },
    {
      id: 'eval-004',
      schoolId: 'sch-gn-001',
      periodId: 'per-trim-1',
      trimester: 1,
      classId: 'cls-10-a',
      className: '10ème Année A (BEPC)',
      subjectId: 'sub-math-col',
      subjectName: 'Mathématiques',
      type: 'Devoir 2',
      title: 'Devoir Surveillé N°2 - Calcul Littéral & Théorème de Thalès',
      date: '2025-11-18',
      startTime: '08:00',
      durationMinutes: 120,
      roomNumber: 'Salle 102',
      coefficient: 4,
      supervisorName: 'Prof. Souleymane Camara',
      status: 'planifié',
      maxScore: 20,
    },
    {
      id: 'eval-005',
      schoolId: 'sch-gn-001',
      periodId: 'per-trim-1',
      trimester: 1,
      classId: 'cls-6-ann',
      className: '6ème Année B (CEE)',
      subjectId: 'sub-calc-prim',
      subjectName: 'Calcul',
      type: 'Composition',
      title: 'Évaluation Harmonisée Trimestrielle - Opérations & Problèmes',
      date: '2025-11-20',
      startTime: '09:00',
      durationMinutes: 90,
      roomNumber: 'Salle 04',
      coefficient: 5,
      supervisorName: 'Prof. Aïssatou Sow',
      status: 'planifié',
      maxScore: 20,
    },
  ];

  public teachers: TeacherEntity[] = [
    {
      id: 'tch-camara',
      schoolId: 'sch-gn-001',
      name: 'Prof. Souleymane Camara',
      email: 'souleymane.camara@kharandi-excellence.gn',
      phone: '+224 622 11 22 33',
      subjects: ['Mathématiques'],
      classIds: ['cls-t-sm1', 'cls-10-a'],
      role: 'head_teacher',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      active: true,
      matriculeTeacher: 'ENS-2025-001',
      hireDate: '2022-09-01'
    },
    {
      id: 'tch-diallo',
      schoolId: 'sch-gn-001',
      name: 'Prof. Fatoumata Diallo',
      email: 'fatoumata.diallo@kharandi-excellence.gn',
      phone: '+224 624 33 44 55',
      subjects: ['Français', 'Philosophie'],
      classIds: ['cls-t-sm1', 'cls-10-a'],
      role: 'teacher',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      active: true,
      matriculeTeacher: 'ENS-2025-002',
      hireDate: '2023-09-01'
    },
    {
      id: 'tch-bah',
      schoolId: 'sch-gn-001',
      name: 'Prof. Mamadou Alpha Bah',
      email: 'mamadou.bah@kharandi-excellence.gn',
      phone: '+224 628 55 66 77',
      subjects: ['Physique-Chimie', 'Physique'],
      classIds: ['cls-t-sm1', 'cls-10-a'],
      role: 'teacher',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      active: true,
      matriculeTeacher: 'ENS-2025-003',
      hireDate: '2021-09-01'
    },
    {
      id: 'tch-sow',
      schoolId: 'sch-gn-001',
      name: 'Prof. Aïssatou Sow',
      email: 'aissatou.sow@kharandi-excellence.gn',
      phone: '+224 664 77 88 99',
      subjects: ['Français', 'Calcul', 'Sciences', 'Anglais', 'Histoire-Géographie'],
      classIds: ['cls-6-ann', 'cls-10-a', 'cls-t-sm1'],
      role: 'teacher',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      active: true,
      matriculeTeacher: 'ENS-2025-004',
      hireDate: '2024-09-01'
    }
  ];

  public classes: ClassEntity[] = [
    {
      id: 'cls-t-sm1',
      schoolId: 'sch-gn-001',
      name: 'Terminale SM 1',
      level: 'Lycée',
      mainTeacherId: 'tch-camara',
      mainTeacherName: 'Prof. Souleymane Camara',
      roomNumber: 'Salle 204 (Bâtiment Bac)',
      studentCount: 38,
      subjects: [
        { subjectId: 'sub-math-sm', subjectName: 'Mathématiques', coefficient: 5, teacherName: 'Prof. Souleymane Camara' },
        { subjectId: 'sub-phys-sm', subjectName: 'Physique-Chimie', coefficient: 4, teacherName: 'Prof. Mamadou Alpha Bah' },
        { subjectId: 'sub-fr-lyc', subjectName: 'Français', coefficient: 3, teacherName: 'Prof. Fatoumata Diallo' },
        { subjectId: 'sub-philo', subjectName: 'Philosophie', coefficient: 3, teacherName: 'Prof. Fatoumata Diallo' },
        { subjectId: 'sub-ang-lyc', subjectName: 'Anglais', coefficient: 2, teacherName: 'Prof. Aïssatou Sow' },
      ],
    },
    {
      id: 'cls-10-a',
      schoolId: 'sch-gn-001',
      name: '10ème Année A (BEPC)',
      level: 'Collège',
      mainTeacherId: 'tch-diallo',
      mainTeacherName: 'Prof. Fatoumata Diallo',
      roomNumber: 'Salle 102',
      studentCount: 42,
      subjects: [
        { subjectId: 'sub-math-col', subjectName: 'Mathématiques', coefficient: 4, teacherName: 'Prof. Souleymane Camara' },
        { subjectId: 'sub-fr-col', subjectName: 'Français', coefficient: 4, teacherName: 'Prof. Fatoumata Diallo' },
        { subjectId: 'sub-phys-col', subjectName: 'Physique', coefficient: 3, teacherName: 'Prof. Mamadou Alpha Bah' },
        { subjectId: 'sub-hg-col', subjectName: 'Histoire-Géographie', coefficient: 3, teacherName: 'Prof. Aïssatou Sow' },
        { subjectId: 'sub-ang-col', subjectName: 'Anglais', coefficient: 2, teacherName: 'Prof. Aïssatou Sow' },
      ],
    },
    {
      id: 'cls-6-ann',
      schoolId: 'sch-gn-001',
      name: '6ème Année B (CEE)',
      level: 'Primaire',
      mainTeacherId: 'tch-sow',
      mainTeacherName: 'Prof. Aïssatou Sow',
      roomNumber: 'Salle 04 (Primaire)',
      studentCount: 35,
      subjects: [
        { subjectId: 'sub-fr-prim', subjectName: 'Français', coefficient: 5, teacherName: 'Prof. Aïssatou Sow' },
        { subjectId: 'sub-calc-prim', subjectName: 'Calcul', coefficient: 5, teacherName: 'Prof. Aïssatou Sow' },
        { subjectId: 'sub-sc-prim', subjectName: 'Sciences', coefficient: 3, teacherName: 'Prof. Aïssatou Sow' },
      ],
    },
  ];

  public students: StudentEntity[] = [
    {
      id: 'std-001',
      schoolId: 'sch-gn-001',
      matricule: 'KH-2025-0101',
      firstName: 'Kadiatou',
      lastName: 'Barry',
      gender: 'F',
      birthDate: '2008-04-14',
      birthPlace: 'Mamou',
      classId: 'cls-10-a',
      className: '10ème Année A (BEPC)',
      level: 'Collège',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bloodType: 'O+',
      medicalNotes: 'R.A.S - Aucune allergie connue',
      emergencyContact: '+224 622 34 56 78',
      parentName: 'M. Ousmane Barry',
      parentPhone: '+224 622 34 56 78',
      parentEmail: 'ousmane.barry@gmail.com',
      fatherName: 'Ousmane Barry',
      fatherPhone: '+224 622 34 56 78',
      fatherJob: 'Commerçant',
      motherName: 'Hadja Rabiatou Diallo',
      motherPhone: '+224 628 11 22 33',
      motherJob: 'Enseignante',
      tutorRelationship: 'Père',
      address: 'Kipé, Ratoma, Conakry',
      enrollmentDate: '2025-09-02',
      tuitionTotal: 1800000,
      tuitionPaid: 1800000,
      status: 'En règle',
    },
    {
      id: 'std-002',
      schoolId: 'sch-gn-001',
      matricule: 'KH-2025-0102',
      firstName: 'Ibrahima Sory',
      lastName: 'Diallo',
      gender: 'M',
      birthDate: '2007-11-22',
      birthPlace: 'Labé',
      classId: 'cls-t-sm1',
      className: 'Terminale SM 1',
      level: 'Lycée',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bloodType: 'A+',
      medicalNotes: 'Légère myopie (porte des lunettes)',
      emergencyContact: '+224 628 88 99 00',
      parentName: 'Mme Mariama Ciré Diallo',
      parentPhone: '+224 628 88 99 00',
      parentEmail: 'mariama.diallo@orange.gn',
      fatherName: 'Amadou Diallo (Décédé)',
      fatherPhone: '',
      fatherJob: 'Ancien Fonctionnaire',
      motherName: 'Mariama Ciré Diallo',
      motherPhone: '+224 628 88 99 00',
      motherJob: 'Cadre Télécoms',
      tutorRelationship: 'Mère',
      address: 'Lambanyi, Conakry',
      enrollmentDate: '2025-09-01',
      tuitionTotal: 2200000,
      tuitionPaid: 1500000,
      status: 'En retard',
    },
    {
      id: 'std-003',
      schoolId: 'sch-gn-001',
      matricule: 'KH-2025-0103',
      firstName: 'Aïcha',
      lastName: 'Camara',
      gender: 'F',
      birthDate: '2007-08-05',
      birthPlace: 'Kindia',
      classId: 'cls-t-sm1',
      className: 'Terminale SM 1',
      level: 'Lycée',
      photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80',
      bloodType: 'B+',
      medicalNotes: 'Asthme modéré (Ventoline en cas de crise)',
      emergencyContact: '+224 664 12 45 78',
      parentName: 'Dr. Sekou Camara',
      parentPhone: '+224 664 12 45 78',
      parentEmail: 'sekou.camara@sante.gov.gn',
      fatherName: 'Dr. Sekou Camara',
      fatherPhone: '+224 664 12 45 78',
      fatherJob: 'Médecin Chirurgien',
      motherName: 'Fanta Kourouma',
      motherPhone: '+224 620 55 66 77',
      motherJob: 'Pharmacienne',
      tutorRelationship: 'Père',
      address: 'Nongo Taady, Conakry',
      enrollmentDate: '2025-09-01',
      tuitionTotal: 2200000,
      tuitionPaid: 2200000,
      status: 'En règle',
    },
    {
      id: 'std-004',
      schoolId: 'sch-gn-001',
      matricule: 'KH-2025-0104',
      firstName: 'Mohamed Lamine',
      lastName: 'Conde',
      gender: 'M',
      birthDate: '2008-01-19',
      birthPlace: 'Kankan',
      classId: 'cls-10-a',
      className: '10ème Année A (BEPC)',
      level: 'Collège',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      bloodType: 'AB+',
      medicalNotes: 'R.A.S',
      emergencyContact: '+224 621 55 44 33',
      parentName: 'Elhadj Fodé Conde',
      parentPhone: '+224 621 55 44 33',
      parentEmail: 'fode.conde@yahoo.fr',
      fatherName: 'Fodé Conde',
      fatherPhone: '+224 621 55 44 33',
      fatherJob: 'Opérateur Économique',
      motherName: 'Aminata Diakité',
      motherPhone: '+224 625 33 22 11',
      motherJob: 'Ménagère',
      tutorRelationship: 'Père',
      address: 'Cosa, Conakry',
      enrollmentDate: '2025-09-03',
      tuitionTotal: 1800000,
      tuitionPaid: 600000,
      status: 'En retard',
    },
    {
      id: 'std-005',
      schoolId: 'sch-gn-001',
      matricule: 'KH-2025-0105',
      firstName: 'Fatoumata Binta',
      lastName: 'Bah',
      gender: 'F',
      birthDate: '2013-06-12',
      birthPlace: 'Pita',
      classId: 'cls-6-ann',
      className: '6ème Année B (CEE)',
      level: 'Primaire',
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      bloodType: 'O+',
      medicalNotes: 'R.A.S',
      emergencyContact: '+224 620 99 88 77',
      parentName: 'M. Alpha Oumar Bah',
      parentPhone: '+224 620 99 88 77',
      parentEmail: 'alpha.bah@gn.telecom.com',
      fatherName: 'Alpha Oumar Bah',
      fatherPhone: '+224 620 99 88 77',
      fatherJob: 'Ingénieur Télécom',
      motherName: 'Djenabou Diallo',
      motherPhone: '+224 627 88 77 66',
      motherJob: 'Comptable',
      tutorRelationship: 'Père',
      address: 'Sangoyah, Matoto',
      enrollmentDate: '2025-09-05',
      tuitionTotal: 1400000,
      tuitionPaid: 1400000,
      status: 'En règle',
    },
    {
      id: 'std-006',
      schoolId: 'sch-gn-001',
      matricule: 'KH-2025-0106',
      firstName: 'Ousmane Bamba',
      lastName: 'Sylla',
      gender: 'M',
      birthDate: '2007-03-30',
      birthPlace: 'Boké',
      classId: 'cls-t-sm1',
      className: 'Terminale SM 1',
      level: 'Lycée',
      photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
      bloodType: 'A-',
      medicalNotes: 'R.A.S',
      emergencyContact: '+224 625 77 66 55',
      parentName: 'Mme Nagnouma Sylla',
      parentPhone: '+224 625 77 66 55',
      parentEmail: 'nagnouma.sylla@gmail.com',
      fatherName: 'Lamine Sylla',
      fatherPhone: '+224 629 00 11 22',
      fatherJob: 'Juriste',
      motherName: 'Nagnouma Sylla',
      motherPhone: '+224 625 77 66 55',
      motherJob: 'Consultante',
      tutorRelationship: 'Mère',
      address: 'Hamdallaye, Conakry',
      enrollmentDate: '2025-09-02',
      tuitionTotal: 2200000,
      tuitionPaid: 2200000,
      status: 'En règle',
    },
  ];

  public grades: GradeEntity[] = [
    { id: 'grd-01', studentId: 'std-001', subjectId: 'sub-math-col', subjectName: 'Mathématiques', trimester: 1, type: 'Interrogation', score: 17, maxScore: 20, date: '2025-10-10', coefficient: 4, comment: 'Excellente maîtrise des équations' },
    { id: 'grd-02', studentId: 'std-001', subjectId: 'sub-math-col', subjectName: 'Mathématiques', trimester: 1, type: 'Devoir 1', score: 18, maxScore: 20, date: '2025-10-25', coefficient: 4, comment: 'Raisonnement rigoureux' },
    { id: 'grd-03', studentId: 'std-001', subjectId: 'sub-fr-col', subjectName: 'Français', trimester: 1, type: 'Devoir 1', score: 16, maxScore: 20, date: '2025-10-18', coefficient: 4, comment: 'Bon style de rédaction' },
    { id: 'grd-04', studentId: 'std-001', subjectId: 'sub-phys-col', subjectName: 'Physique', trimester: 1, type: 'Composition', score: 15.5, maxScore: 20, date: '2025-11-02', coefficient: 3, comment: 'Bien travaillé' },
    { id: 'grd-05', studentId: 'std-001', subjectId: 'sub-hg-col', subjectName: 'Histoire-Géographie', trimester: 1, type: 'Composition', score: 17.5, maxScore: 20, date: '2025-11-04', coefficient: 3, comment: 'Très bonne culture générale' },
    { id: 'grd-06', studentId: 'std-002', subjectId: 'sub-math-sm', subjectName: 'Mathématiques', trimester: 1, type: 'Devoir 1', score: 14, maxScore: 20, date: '2025-10-15', coefficient: 5, comment: 'Progrès constants' },
    { id: 'grd-07', studentId: 'std-002', subjectId: 'sub-phys-sm', subjectName: 'Physique-Chimie', trimester: 1, type: 'Composition', score: 13.5, maxScore: 20, date: '2025-11-01', coefficient: 4, comment: 'Attention aux étourderies' },
    { id: 'grd-08', studentId: 'std-002', subjectId: 'sub-fr-lyc', subjectName: 'Français & Littérature', trimester: 1, type: 'Devoir 1', score: 12, maxScore: 20, date: '2025-10-20', coefficient: 3, comment: 'Approfondir les dissertations' },
    { id: 'grd-09', studentId: 'std-003', subjectId: 'sub-math-sm', subjectName: 'Mathématiques', trimester: 1, type: 'Devoir 1', score: 19, maxScore: 20, date: '2025-10-15', coefficient: 5, comment: 'Note maximale de la classe' },
    { id: 'grd-10', studentId: 'std-003', subjectId: 'sub-phys-sm', subjectName: 'Physique-Chimie', trimester: 1, type: 'Composition', score: 18.5, maxScore: 20, date: '2025-11-01', coefficient: 4, comment: 'Travail exemplaire' },
    { id: 'grd-11', studentId: 'std-003', subjectId: 'sub-philo', subjectName: 'Philosophie', trimester: 1, type: 'Devoir 1', score: 16, maxScore: 20, date: '2025-10-22', coefficient: 3, comment: 'Très bonne argumentation' },
  ];

  public absences: AttendanceEntity[] = [
    {
      id: 'att-101',
      studentId: 'std-001',
      studentName: 'Kadiatou Barry',
      classId: 'cls-10-a',
      className: '10ème Année A (BEPC)',
      date: '2025-11-03',
      status: 'Présent',
      notifiedParent: false,
    },
    {
      id: 'att-102',
      studentId: 'std-002',
      studentName: 'Ibrahima Sory Diallo',
      classId: 'cls-t-sm1',
      className: 'Terminale SM 1',
      date: '2025-11-03',
      status: 'Absent Non Justifié',
      reason: 'Absence au cours de Physique de 8h',
      notifiedParent: true,
    },
    {
      id: 'att-103',
      studentId: 'std-004',
      studentName: 'Mohamed Lamine Conde',
      classId: 'cls-10-a',
      className: '10ème Année A (BEPC)',
      date: '2025-11-03',
      status: 'Retard',
      minutesLate: 15,
      reason: 'Embouteillage à Bambéto',
      notifiedParent: true,
    },
  ];

  public badges: BadgeEntity[] = [
    {
      id: 'bdg-001',
      schoolId: 'sch-gn-001',
      studentId: 'std-001',
      studentName: 'Kadiatou Barry',
      matricule: 'KH-2025-0101',
      className: '10ème Année A (BEPC)',
      issueDate: '2025-09-10',
      expiryDate: '2026-07-31',
      qrCodeData: 'ECOLE:AUTH:KH-2025-0101:SCH-GN-001:VERIFIED',
      status: 'active',
      badgeType: 'carte_scolaire',
      downloadedCount: 3,
    },
    {
      id: 'bdg-002',
      schoolId: 'sch-gn-001',
      studentId: 'std-002',
      studentName: 'Ibrahima Sory Diallo',
      matricule: 'KH-2025-0102',
      className: 'Terminale SM 1',
      issueDate: '2025-09-10',
      expiryDate: '2026-07-31',
      qrCodeData: 'ECOLE:AUTH:KH-2025-0102:SCH-GN-001:VERIFIED',
      status: 'active',
      badgeType: 'carte_scolaire',
      downloadedCount: 1,
    },
    {
      id: 'bdg-003',
      schoolId: 'sch-gn-001',
      studentId: 'std-003',
      studentName: 'Aïcha Camara',
      matricule: 'KH-2025-0103',
      className: 'Terminale SM 1',
      issueDate: '2025-09-10',
      expiryDate: '2026-07-31',
      qrCodeData: 'ECOLE:AUTH:KH-2025-0103:SCH-GN-001:VERIFIED',
      status: 'active',
      badgeType: 'excellence',
      downloadedCount: 5,
    }
  ];

  public alerts: AlertEntity[] = [
    {
      id: 'alt-01',
      studentId: 'std-002',
      studentName: 'Ibrahima Sory Diallo',
      parentPhone: '+224 628 88 99 00',
      title: 'Alerte Absence',
      message: 'Avis École : Votre enfant Ibrahima Sory Diallo a été noté absent non justifié le 03/11/2025 à 08:00 en cours de Physique-Chimie.',
      type: 'absence',
      channel: 'SMS',
      sentAt: '2025-11-03 08:15',
      status: 'Délivré',
    },
  ];

  public logbook: LogbookEntity[] = [
    {
      id: 'log-01',
      classId: 'cls-t-sm1',
      className: 'Terminale SM 1',
      subjectId: 'sub-math-sm',
      subjectName: 'Mathématiques',
      teacherName: 'Prof. Souleymane Camara',
      date: '2025-11-04',
      topicCovered: 'Chapitre 3 : Fonctions Logarithmes Népériens - Propriétés algébriques et études de limites.',
      homeworkAssigned: 'Résoudre les exercices N° 14, 18 et 22 page 86 du livre de SM.',
      homeworkDueDate: '2025-11-07',
      nextEvaluationDate: '2025-11-14 (Devoir Surveillé N°2)',
    },
    {
      id: 'log-02',
      classId: 'cls-10-a',
      className: '10ème Année A (BEPC)',
      subjectId: 'sub-fr-col',
      subjectName: 'Français',
      teacherName: 'Prof. Fatoumata Diallo',
      date: '2025-11-03',
      topicCovered: 'Grammaire : La proposition subordonnée conjonctive complément d\'objet direct.',
      homeworkAssigned: 'Analyse grammaticale du texte page 42 + 5 phrases à compléter.',
      homeworkDueDate: '2025-11-06',
    }
  ];

  public payments: PaymentEntity[] = [
    {
      id: 'pay-001',
      receiptNumber: 'REC-2025-001',
      studentId: 'std-001',
      studentName: 'Kadiatou Barry',
      matricule: 'KH-2025-0101',
      className: '10ème Année A (BEPC)',
      amount: 1800000,
      kharandiFee: 60000,
      paymentMethod: 'Orange Money',
      transactionRef: 'OM224-884920',
      phoneNumber: '+224 622 34 56 78',
      trimesterLabel: 'Solde Annuel',
      date: '2025-09-02 10:14',
      status: 'Payé',
      issuedBy: 'Comptabilité École',
    },
    {
      id: 'pay-002',
      receiptNumber: 'REC-2025-002',
      studentId: 'std-003',
      studentName: 'Aïcha Camara',
      matricule: 'KH-2025-0103',
      className: 'Terminale SM 1',
      amount: 2200000,
      kharandiFee: 60000,
      paymentMethod: 'MTN MoMo',
      transactionRef: 'MOMO224-332910',
      phoneNumber: '+224 664 12 45 78',
      trimesterLabel: 'Solde Total Baccalauréat',
      date: '2025-09-01 14:30',
      status: 'Payé',
      issuedBy: 'Comptabilité École',
    },
    {
      id: 'pay-003',
      receiptNumber: 'REC-2025-003',
      studentId: 'std-002',
      studentName: 'Ibrahima Sory Diallo',
      matricule: 'KH-2025-0102',
      className: 'Terminale SM 1',
      amount: 1500000,
      kharandiFee: 60000,
      paymentMethod: 'Espèces',
      transactionRef: 'CASH-0029',
      trimesterLabel: '1ère Tranche',
      date: '2025-09-01 11:00',
      status: 'Payé',
      issuedBy: 'M. Sylla (Caisse)',
    }
  ];
}

export const store = new DataStore();

