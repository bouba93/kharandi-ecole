import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  School,
  Building2,
  BookOpen,
  Users,
  ChevronDown,
  Bell,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { AlertsDrawer } from '../common/AlertsDrawer';
import { SessionSwitcherModal } from '../common/SessionSwitcherModal';

interface HeaderProps {
  onShowLogin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShowLogin }) => {
  const {
    role,
    setRole,
    schoolInfo,
    students,
    selectedStudentIdForParent,
    setSelectedStudentIdForParent,
    alerts,
    userSession,
    logout,
  } = useSchool();

  const [showAlerts, setShowAlerts] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);

  const activeUserProfile = {
    admin: {
      name: userSession?.displayName || 'Direction Générale',
      roleTitle: 'Chef d\'Établissement',
      initials: 'DG',
      spaceName: 'Direction',
    },
    teacher: {
      name: userSession?.displayName || 'Fodé Camara',
      roleTitle: 'Professeur Titulaire',
      initials: 'FC',
      spaceName: 'Corps Enseignant',
    },
    parent: {
      name: userSession?.displayName || 'Aïssatou Sow',
      roleTitle: 'Parent d\'élève',
      initials: 'AS',
      spaceName: 'Portail Famille',
    },
  }[role];

  return (
    <>
      <header id="main-app-header" className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        {/* National Tricolor Top Line (Red, Yellow, Green) */}
        <div className="h-1 w-full flex">
          <div className="w-1/3 bg-gn-red"></div>
          <div className="w-1/3 bg-gn-yellow"></div>
          <div className="w-1/3 bg-gn-green"></div>
        </div>

        <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* School Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm border border-sky-400">
              <School className="w-5 h-5 text-orange-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-slate-900 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                  {schoolInfo.name}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 hidden sm:inline-block font-mono">
                  {schoolInfo.schoolYear || '2025-2026'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate max-w-[180px] sm:max-w-xs">
                {schoolInfo.dpe || 'Plateforme Éducative Officielle'}
              </p>
            </div>
          </div>

          {/* Center: Clean Segmented Role Switcher */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              id="role-btn-admin"
              type="button"
              onClick={() => setRole('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                role === 'admin'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className={`w-3.5 h-3.5 ${role === 'admin' ? 'text-gn-green' : 'text-slate-400'}`} />
              <span>Direction</span>
            </button>

            <button
              id="role-btn-teacher"
              type="button"
              onClick={() => setRole('teacher')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                role === 'teacher'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className={`w-3.5 h-3.5 ${role === 'teacher' ? 'text-gn-green' : 'text-slate-400'}`} />
              <span>Enseignants</span>
            </button>

            <button
              id="role-btn-parent"
              type="button"
              onClick={() => setRole('parent')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                role === 'parent'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className={`w-3.5 h-3.5 ${role === 'parent' ? 'text-gn-green' : 'text-slate-400'}`} />
              <span>Espace Parents</span>
            </button>
          </div>

          {/* Right Side: Student Picker (if Parent) + Notifications + User Avatar */}
          <div className="flex items-center gap-3">
            {/* Mobile Role Switcher Trigger */}
            <button
              id="mobile-role-switcher"
              onClick={() => setShowSessionModal(true)}
              className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold"
            >
              <span>{activeUserProfile.spaceName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Parent Child Selector */}
            {role === 'parent' && (
              <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
                <span className="text-slate-500 text-[11px] font-medium mr-1.5 hidden sm:inline">Élève :</span>
                <select
                  id="parent-child-select"
                  value={selectedStudentIdForParent}
                  onChange={(e) => setSelectedStudentIdForParent(e.target.value)}
                  className="bg-transparent text-slate-900 font-bold text-xs focus:outline-none cursor-pointer"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.className})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* SMS / Notifications */}
            <button
              id="btn-alerts-drawer"
              onClick={() => setShowAlerts(true)}
              className="relative p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors border border-slate-200"
              title="Notifications & Alertes SMS"
            >
              <Bell className="w-4 h-4 text-slate-700" />
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gn-red text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {alerts.length}
                </span>
              )}
            </button>

            {/* User Profile Info */}
            <div className="flex items-center gap-2.5 pl-1 border-l border-slate-200">
              <div className="w-8 h-8 bg-gradient-to-tr from-orange-500 to-orange-600 text-white rounded-lg flex items-center justify-center font-bold text-xs shadow-xs">
                {activeUserProfile.initials}
              </div>
              <div className="text-left hidden xl:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">{activeUserProfile.name}</p>
                <p className="text-[11px] text-slate-500 font-medium leading-tight">
                  {activeUserProfile.roleTitle}
                </p>
              </div>
            </div>

            {/* Switch Account / Logout */}
            <button
              id="btn-switch-account"
              onClick={() => {
                if (onShowLogin) {
                  onShowLogin();
                } else {
                  logout();
                }
              }}
              className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 flex items-center gap-1 text-xs font-semibold"
              title="Changer de compte / Déconnexion"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Portail</span>
            </button>
          </div>
        </div>
      </header>

      {/* Notifications Drawer */}
      {showAlerts && <AlertsDrawer onClose={() => setShowAlerts(false)} />}

      {/* Session Switcher Modal */}
      <SessionSwitcherModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
      />
    </>
  );
};
