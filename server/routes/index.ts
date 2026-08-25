import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes';
import schoolsRoutes from './schools.routes';
import studentsRoutes from './students.routes';
import classesRoutes from './classes.routes';
import teachersRoutes from './teachers.routes';
import gradesRoutes from './grades.routes';
import absencesRoutes from './absences.routes';
import parentRoutes from './parent.routes';
import badgesRoutes from './badges.routes';
import evaluationsRoutes from './evaluations.routes';
import karamoRoutes from './karamo.routes';
import { store } from '../data/store';

const mainRouter = Router();

// Health check
mainRouter.get('/health', (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'online',
    system: 'SYSTÈME SCOLAIRE GUINÉE API v1',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: ['POST /activate/', 'POST /login/', 'POST /teacher/login/'],
      schools: ['GET /schools/', 'POST /schools/', 'GET /schools/:id/', 'PATCH /schools/:id/', 'DELETE /schools/:id/'],
      students: ['GET /schools/:id/students/', 'POST /schools/:id/students/', 'PATCH /students/:id/', 'DELETE /students/:id/'],
      classes: ['GET /classes/', 'POST /classes/'],
      teachers: ['GET /teachers/', 'POST /teachers/', 'GET /teachers/:id/', 'POST /teachers/:id/', 'DELETE /teachers/:id/', 'DELETE /teachers/'],
      grades: ['GET /grades/', 'POST /grades/'],
      evaluations: ['GET /evaluations/periods', 'POST /evaluations/periods', 'GET /evaluations/schedule', 'POST /evaluations/schedule'],
      absences: ['GET /absences/', 'POST /absences/'],
      parent: ['GET /parent/:matricule/', 'GET /parents/students/:id/badges/', 'GET /parents/students/:id/badges/:badge_id/pdf/'],
      badges: ['POST /schools/badges/issue/', 'GET /schools/badges/history/:school_id/', 'DELETE /schools/badges/:badge_id/'],
    }
  });
});

// Global Overview Metrics
mainRouter.get('/overview', (_req: Request, res: Response): void => {
  const school = store.schools[0];
  const totalStudents = store.students.length;
  const totalTeachers = store.teachers.length;
  const totalClasses = store.classes.length;
  const totalTuition = store.students.reduce((acc, curr) => acc + curr.tuitionTotal, 0);
  const collectedTuition = store.students.reduce((acc, curr) => acc + curr.tuitionPaid, 0);

  res.status(200).json({
    success: true,
    school,
    kpis: {
      totalStudents,
      totalTeachers,
      totalClasses,
      totalTuitionExpected: totalTuition,
      totalTuitionCollected: collectedTuition,
      collectionRate: totalTuition > 0 ? ((collectedTuition / totalTuition) * 100).toFixed(1) : 0,
      activeBadgesCount: store.badges.length,
      recentAbsencesCount: store.absences.length,
      recentGradesCount: store.grades.length,
    }
  });
});

// Mount Specific Sub-Routers
// 1. Auth (/activate, /login, /teacher/login)
mainRouter.use('/', authRoutes);

// 2. Badges under /schools/badges (must be mounted before /schools to avoid route conflicts)
mainRouter.use('/schools/badges', badgesRoutes);

// 3. Schools (/schools, /schools/:school_id, /schools/:school_id/students)
mainRouter.use('/schools', schoolsRoutes);

// 4. Students direct endpoints (/students/:student_id)
mainRouter.use('/students', studentsRoutes);

// 5. Classes (/classes)
mainRouter.use('/classes', classesRoutes);

// 6. Teachers (/teachers, /teachers/:teacher_id)
mainRouter.use('/teachers', teachersRoutes);

// 7. Grades (/grades)
mainRouter.use('/grades', gradesRoutes);

// 8. Evaluations Planning (/evaluations)
mainRouter.use('/evaluations', evaluationsRoutes);

// 9. Absences (/absences)
mainRouter.use('/absences', absencesRoutes);

// 10. Parent portal (/parent/:matricule, /parents/students/...)
mainRouter.use('/parent', parentRoutes);
mainRouter.use('/parents', parentRoutes);

// 11. Assistant IA Scolaire Karamô (/karamo/chat)
mainRouter.use('/karamo', karamoRoutes);

export default mainRouter;
