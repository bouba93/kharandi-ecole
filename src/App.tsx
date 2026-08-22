import React, { useState, useEffect } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ExecutiveDashboard } from './components/admin/ExecutiveDashboard';
import { ClassesManagement } from './components/admin/ClassesManagement';
import { StudentsDirectory } from './components/admin/StudentsDirectory';
import { TeachersManagement } from './components/admin/TeachersManagement';
import { GradesOverview } from './components/admin/GradesOverview';
import { AttendanceManagement } from './components/admin/AttendanceManagement';
import { BadgesManagement } from './components/admin/BadgesManagement';
import { SchoolSettings } from './components/admin/SchoolSettings';
import { BulletinBadgeStudio } from './components/admin/BulletinBadgeStudio';
import { EvaluationPlanning } from './components/admin/EvaluationPlanning';
import { GradeEntry } from './components/teacher/GradeEntry';
import { AttendanceRollCall } from './components/teacher/AttendanceRollCall';
import { ParentPortal } from './components/parent/ParentPortal';
import { LoadingScreen } from './components/common/LoadingScreen';
import { UnifiedLogin } from './components/auth/UnifiedLogin';

function AppContent() {
  const { role, userSession, schoolInfo } = useSchool();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [showLoginPage, setShowLoginPage] = useState<boolean>(false);

  // Switch default tab when role changes
  useEffect(() => {
    if (role === 'admin') setActiveTab('dashboard');
    else if (role === 'teacher') setActiveTab('grades');
    else if (role === 'parent') setActiveTab('student_profile');
  }, [role]);

  // Loading Screen on startup
  if (isInitialLoading) {
    return (
      <LoadingScreen
        schoolName={schoolInfo.name}
        onComplete={() => setIsInitialLoading(false)}
      />
    );
  }

  // Unified Portal Login view when requested
  if (showLoginPage) {
    return <UnifiedLogin onLoginSuccess={() => setShowLoginPage(false)} />;
  }

  return (
    <div className="min-h-screen bg-geometric-grid text-slate-900 font-sans flex flex-col antialiased">
      {/* Top Header with Guinea Tricolor accent */}
      <Header onShowLogin={() => setShowLoginPage(true)} />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Navigation Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <main id="main-content-workspace" className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl">
          {/* Admin Views */}
          {role === 'admin' && (
            <>
              {activeTab === 'dashboard' && (
                <ExecutiveDashboard onNavigate={(tab) => setActiveTab(tab)} />
              )}
              {activeTab === 'students' && <StudentsDirectory />}
              {activeTab === 'classes' && <ClassesManagement />}
              {activeTab === 'evaluations' && <EvaluationPlanning />}
              {activeTab === 'teachers' && <TeachersManagement />}
              {activeTab === 'grades' && <GradesOverview />}
              {activeTab === 'bulletin_studio' && <BulletinBadgeStudio />}
              {activeTab === 'attendance' && <AttendanceManagement />}
              {activeTab === 'badges' && <BadgesManagement />}
              {activeTab === 'settings' && <SchoolSettings />}
            </>
          )}

          {/* Teacher Views */}
          {role === 'teacher' && (
            <>
              {activeTab === 'grades' && <GradeEntry />}
              {activeTab === 'evaluations' && <EvaluationPlanning />}
              {activeTab === 'attendance' && <AttendanceRollCall />}
              {activeTab === 'classes' && <ClassesManagement />}
              {activeTab === 'badges' && <BadgesManagement />}
            </>
          )}

          {/* Parent Views */}
          {role === 'parent' && (
            <>
              {activeTab === 'evaluations' ? (
                <EvaluationPlanning />
              ) : (
                <ParentPortal activeSubTab={activeTab} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SchoolProvider>
      <AppContent />
    </SchoolProvider>
  );
}
