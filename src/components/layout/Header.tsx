import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  School,
  Building2,
  BookOpen,
  Users,
  ChevronDown,
  Bell,
  RotateCcw,
  ArrowRightLeft,
  Terminal,
  Activity,
} from 'lucide-react';
import { AlertsDrawer } from '../common/AlertsDrawer';
import { SessionSwitcherModal } from '../common/SessionSwitcherModal';
import { ApiEndpointsConsole } from '../common/ApiEndpointsConsole';

export const Header: React.FC = () => {
  const {
    role,
    schoolInfo,
    students,
    selectedStudentIdForParent,
    setSelectedStudentIdForParent,
    alerts,
    isBackendConnected,
    resetAllData,
  } = useSchool();

  const [showAlerts, setShowAlerts] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showApiConsole, setShowApiConsole] = useState(false);

  // Dynamic user profile info based on active session
  const activeUserProfile = {
    admin: {
      name: 'Dr. Diallo Mamadou',
      roleTitle: 'Directeur Général',
      initials: 'DM',
      spaceName: 'Espace Direction Générale',
      icon: Building2,
      badgeColor: 'bg-slate-900 text-sky-400',
    },
    teacher: {
      name: 'M. Camara Fodé',
      roleTitle: 'Prof. Titulaire (Maths)',
      initials: 'FC',
      spaceName: 'Espace Corps Enseignant',
      icon: BookOpen,
      badgeColor: 'bg-slate-900 text-amber-400',
    },
    parent: {
      name: 'Mme Sow Aïssatou',
      roleTitle: 'Tuteur Légal',
      initials: 'AS',
      spaceName: 'Portail Parent & Tuteur',
      icon: Users,
      badgeColor: 'bg-amber-400 text-slate-950',
    },
  }[role];

  const IconComponent = activeUserProfile.icon;

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        {/* Brand & School Header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-xs">
            <School className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-slate-900">Kharandi</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                ERP GUINÉE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate max-w-[160px] sm:max-w-xs">
              {schoolInfo.name}
            </p>
          </div>
        </div>

        {/* Center: Active Session Workspace Switcher Button */}
        <div className="flex items-center">
          <button
            onClick={() => setShowSessionModal(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 transition-all text-xs font-bold shadow-2xs"
            title="Changer d'Espace ou de Session ERP"
          >
            <span className={`p-1 rounded-md ${activeUserProfile.badgeColor}`}>
              <IconComponent className="w-3.5 h-3.5" />
            </span>
            <span className="hidden sm:inline font-extrabold">{activeUserProfile.spaceName}</span>
            <span className="sm:hidden font-extrabold">Session</span>
            <span className="text-[10px] font-medium bg-white text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 flex items-center gap-1">
              <ArrowRightLeft className="w-2.5 h-2.5" />
              Changer
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Right Actions & Active Session User Profile */}
        <div className="flex items-center gap-3">
          {/* Parent Child Selector when in parent portal */}
          {role === 'parent' && (
            <div className="relative flex items-center bg-amber-50/80 border border-amber-200/80 rounded-lg px-2.5 py-1 text-xs">
              <span className="text-amber-800 text-[10px] font-bold mr-1.5 hidden md:inline">Élève :</span>
              <select
                value={selectedStudentIdForParent}
                onChange={(e) => setSelectedStudentIdForParent(e.target.value)}
                className="bg-transparent text-slate-900 font-bold text-xs focus:outline-none cursor-pointer pr-1"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} ({s.className})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* API Endpoints Console Trigger */}
          <button
            onClick={() => setShowApiConsole(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs border border-slate-700"
            title="Consulter et tester les endpoints backend REST API v1"
          >
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline font-mono text-[11px]">API v1</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          {/* SMS Notifications Button */}
          <button
            onClick={() => setShowAlerts(true)}
            className="relative p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors border border-slate-200/80"
            title="Alertes SMS"
          >
            <Bell className="w-4 h-4 text-slate-700" />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {alerts.length}
              </span>
            )}
          </button>

          {/* Active Profile Badge */}
          <div className="hidden sm:flex items-center gap-2.5 border-l pl-3.5 border-slate-200">
            <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-xs">
              {activeUserProfile.initials}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-bold text-slate-900 leading-none">{activeUserProfile.name}</p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                {activeUserProfile.roleTitle}
              </p>
            </div>
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm('Réinitialiser toutes les données de démonstration de Kharandi École ?')) {
                resetAllData();
              }
            }}
            className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-amber-600 transition-colors border border-slate-200/80 hidden xl:flex items-center"
            title="Réinitialiser les données démo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Notifications Drawer */}
      {showAlerts && <AlertsDrawer onClose={() => setShowAlerts(false)} />}

      {/* Session Switcher Modal */}
      <SessionSwitcherModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
      />

      {/* API Endpoints Console Modal */}
      <ApiEndpointsConsole
        isOpen={showApiConsole}
        onClose={() => setShowApiConsole(false)}
      />
    </>
  );
};
