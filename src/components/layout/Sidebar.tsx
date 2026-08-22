import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  ClipboardList,
  UserCheck,
  Award,
  Settings,
  Building2,
  FileCheck,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { role } = useSchool();

  const adminNav = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'students', label: 'Inscriptions & Élèves', icon: Users },
    { id: 'classes', label: 'Classes & Matières', icon: GraduationCap },
    { id: 'teachers', label: 'Corps Enseignant', icon: BookOpen },
    { id: 'grades', label: 'Notes & Évaluations', icon: ClipboardList },
    { id: 'attendance', label: 'Assiduité & Absences', icon: UserCheck },
    { id: 'badges', label: 'Badges & Cartes', icon: Award },
    { id: 'settings', label: 'Paramètres École', icon: Settings },
  ];

  const teacherNav = [
    { id: 'grades', label: 'Saisie des évaluations', icon: ClipboardList },
    { id: 'attendance', label: 'Prise d\'appel & Absences', icon: UserCheck },
    { id: 'classes', label: 'Mes Classes assignées', icon: GraduationCap },
    { id: 'badges', label: 'Badges & Mérite', icon: Award },
  ];

  const parentNav = [
    { id: 'student_profile', label: 'Bulletin & Notes', icon: ClipboardList },
    { id: 'absences', label: 'Suivi des Absences', icon: UserCheck },
    { id: 'badges', label: 'Cartes & Badges élève', icon: Award },
  ];

  const currentNav = role === 'admin' ? adminNav : role === 'teacher' ? teacherNav : parentNav;

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-slate-200/90 flex-shrink-0 flex flex-col justify-between p-4 sm:p-5">
      <div className="space-y-6">
        {/* Active Space Indicator */}
        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
              <Building2 className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">ESPACE ACTIF</p>
              <p className="text-xs font-bold text-slate-900">
                {role === 'admin' ? 'Direction Établissement' : role === 'teacher' ? 'Corps Enseignant' : 'Portail Parent'}
              </p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>

        {/* Navigation Group */}
        <div>
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 mb-2">
            NAVIGATION PRINCIPALE
          </p>

          <nav className="space-y-0.5">
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="pt-4 border-t border-slate-100">
        <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3 text-[11px] text-slate-600 space-y-1">
          <div className="flex items-center justify-between font-medium">
            <span className="text-slate-500">Kharandi Système</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              MEPU-A En ligne
            </span>
          </div>
          <p className="text-[10px] text-slate-400">Synchronisation des registres scolaires active.</p>
        </div>
      </div>
    </aside>
  );
};
