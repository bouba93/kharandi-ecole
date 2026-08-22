import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  ClipboardList,
  UserCheck,
  Settings,
  Calendar,
  CalendarCheck,
  Palette,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  countColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { role, students, classes, attendance, scheduledEvaluations, schoolInfo } = useSchool();

  const unexcusedCount = attendance.filter((a) => a.status === 'Absent Non Justifié').length;

  const adminNav: NavItem[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'students', label: 'Élèves & Inscriptions', icon: Users, count: students.length },
    { id: 'classes', label: 'Classes & Niveaux', icon: GraduationCap, count: classes.length },
    { id: 'evaluations', label: 'Planification Examens', icon: CalendarCheck, count: scheduledEvaluations.length },
    { id: 'grades', label: 'Notes & Bulletins', icon: ClipboardList },
    { id: 'bulletin_studio', label: 'Studio Bulletins & Badges', icon: Palette },
    { id: 'teachers', label: 'Enseignants', icon: BookOpen },
    { id: 'attendance', label: 'Assiduité & Retards', icon: UserCheck, count: unexcusedCount > 0 ? unexcusedCount : undefined, countColor: 'bg-rose-50 text-gn-red border border-rose-200' },
    { id: 'settings', label: 'Identité de l\'école', icon: Settings },
  ];

  const teacherNav: NavItem[] = [
    { id: 'grades', label: 'Saisie des notes', icon: ClipboardList },
    { id: 'evaluations', label: 'Calendrier des Épreuves', icon: CalendarCheck, count: scheduledEvaluations.length },
    { id: 'attendance', label: 'Feuille de présence', icon: UserCheck },
    { id: 'classes', label: 'Mes classes', icon: GraduationCap },
  ];

  const parentNav: NavItem[] = [
    { id: 'student_profile', label: 'Bulletin & Notes', icon: ClipboardList },
    { id: 'evaluations', label: 'Calendrier Examens', icon: Calendar },
    { id: 'absences', label: 'Assiduité & Absences', icon: UserCheck },
  ];

  const currentNav = role === 'admin' ? adminNav : role === 'teacher' ? teacherNav : parentNav;

  return (
    <aside id="main-sidebar" className="w-full lg:w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col justify-between p-4 shadow-2xs">
      <div className="space-y-4">
        {/* Guinean Tricolor small accent on sidebar */}
        <div className="flex items-center justify-between px-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Menu principal
          </p>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gn-red inline-block"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-gn-yellow inline-block"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-gn-green inline-block"></span>
          </div>
        </div>

        <nav className="space-y-1">
          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                id={`nav-item-${item.id}`}
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white font-bold shadow-sm shadow-sky-500/20'
                    : 'text-slate-600 hover:bg-sky-50 hover:text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-200' : 'text-sky-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-sky-600 text-orange-200' : (item.countColor || 'bg-sky-50 text-sky-700 border border-sky-200')
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* School Year Info at footer of sidebar */}
      <div className="pt-4 border-t border-slate-200">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">Année scolaire</span>
            <span className="text-gn-green font-bold text-[11px] font-mono">{schoolInfo.schoolYear || '2025-2026'}</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Trimestre {schoolInfo.currentTrimester || 1} en cours</p>
        </div>
      </div>
    </aside>
  );
};
