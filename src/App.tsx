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
import { GradeEntry } from './components/teacher/GradeEntry';
import { AttendanceRollCall } from './components/teacher/AttendanceRollCall';
import { ParentPortal } from './components/parent/ParentPortal';
import { ShieldCheck, BookOpen, Users } from 'lucide-react';

function AppContent() {
  const { role } = useSchool();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Switch default tab when role changes
  useEffect(() => {
    if (role === 'admin') setActiveTab('dashboard');
    else if (role === 'teacher') setActiveTab('grades');
    else if (role === 'parent') setActiveTab('student_profile');
  }, [role]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col selection:bg-sky-600 selection:text-white">
      {/* Top Bar Header */}
      <Header />

      {/* Session Context Banner */}
      <div className="bg-slate-900 border-b border-slate-800 text-white px-4 sm:px-6 lg:px-8 py-2.5 text-xs flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2.5">
          {role === 'admin' && (
            <>
              <span className="p-1 rounded bg-sky-500/20 text-sky-400">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
              <span className="font-bold text-white">Espace Direction & Administration</span>
              <span className="text-slate-400 hidden sm:inline">• Direction Générale de l'Établissement</span>
            </>
          )}

          {role === 'teacher' && (
            <>
              <span className="p-1 rounded bg-amber-500/20 text-amber-400">
                <BookOpen className="w-3.5 h-3.5" />
              </span>
              <span className="font-bold text-white">Espace Corps Enseignant</span>
              <span className="text-slate-400 hidden sm:inline">• Saisie des notes et appel</span>
            </>
          )}

          {role === 'parent' && (
            <>
              <span className="p-1 rounded bg-amber-400 text-slate-950 font-bold">
                <Users className="w-3.5 h-3.5" />
              </span>
              <span className="font-bold text-white">Portail Parent & Tuteur</span>
              <span className="text-slate-400 hidden sm:inline">• Suivi académique et assiduité</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Année Scolaire 2025-2026 • MEPU-A Guinée</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
        {/* Navigation Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-[calc(100vh-6rem)]">
          {/* Admin Views */}
          {role === 'admin' && (
            <>
              {activeTab === 'dashboard' && (
                <ExecutiveDashboard onNavigate={(tab) => setActiveTab(tab)} />
              )}
              {activeTab === 'students' && <StudentsDirectory />}
              {activeTab === 'classes' && <ClassesManagement />}
              {activeTab === 'teachers' && <TeachersManagement />}
              {activeTab === 'grades' && <GradesOverview />}
              {activeTab === 'attendance' && <AttendanceManagement />}
              {activeTab === 'badges' && <BadgesManagement />}
              {activeTab === 'settings' && <SchoolSettings />}
            </>
          )}

          {/* Teacher Views */}
          {role === 'teacher' && (
            <>
              {activeTab === 'grades' && <GradeEntry />}
              {activeTab === 'attendance' && <AttendanceRollCall />}
              {activeTab === 'classes' && <ClassesManagement />}
              {activeTab === 'badges' && <BadgesManagement />}
            </>
          )}

          {/* Parent Views */}
          {role === 'parent' && (
            <>
              <ParentPortal activeSubTab={activeTab} />
            </>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-4 text-center text-xs text-slate-500">
        <p>
          © 2025-2026 <strong>Kharandi École</strong> — Module de gestion scolaire numérique, MEPU-A République de Guinée.
        </p>
      </footer>
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
