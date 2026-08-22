import React, { useEffect, useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { teachersApi, badgesApi } from '../../services/api';
import {
  Users,
  GraduationCap,
  BookOpen,
  UserCheck,
  Award,
  ClipboardList,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

interface ExecutiveDashboardProps {
  onNavigate: (tab: string) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ onNavigate }) => {
  const { students, classes, grades, attendance, schoolInfo } = useSchool();
  const [teachersCount, setTeachersCount] = useState<number>(4);
  const [badgesCount, setBadgesCount] = useState<number>(0);

  useEffect(() => {
    teachersApi.getAll().then((res) => {
      if (res.success && res.teachers) setTeachersCount(res.teachers.length);
    }).catch(() => {});

    badgesApi.getHistory('sch-gn-001').then((res) => {
      if (res.success && res.badges) setBadgesCount(res.badges.length);
    }).catch(() => {});
  }, []);

  const totalStudents = students.length;
  const totalClasses = classes.length;
  const unexcusedAbsences = attendance.filter((a) => a.status === 'Absent Non Justifié');

  // Compute school average
  const totalScores = grades.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0);
  const overallAvg = grades.length > 0 ? (totalScores / grades.length).toFixed(1) : '13.8';

  const recentStudents = students.slice(0, 5);
  const recentAttendance = attendance.slice(0, 5);

  return (
    <div id="executive-dashboard-view" className="space-y-6">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {schoolInfo.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {schoolInfo.address} • DPE {schoolInfo.dpe} • Année scolaire {schoolInfo.schoolYear}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="dash-quick-add-student"
            onClick={() => onNavigate('students')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouvel élève</span>
          </button>
          <button
            id="dash-quick-attendance"
            onClick={() => onNavigate('attendance')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-slate-600" />
            <span>Faire l'appel</span>
          </button>
        </div>
      </div>

      {/* 5 Clean Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Effectif Élèves */}
        <button
          id="kpi-card-students"
          onClick={() => onNavigate('students')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all text-left group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Élèves</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900">{totalStudents}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Inscrits au registre</p>
          </div>
        </button>

        {/* Classes */}
        <button
          id="kpi-card-classes"
          onClick={() => onNavigate('classes')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all text-left group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Classes</span>
            <GraduationCap className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900">{totalClasses}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Divisions actives</p>
          </div>
        </button>

        {/* Enseignants */}
        <button
          id="kpi-card-teachers"
          onClick={() => onNavigate('teachers')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all text-left group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Enseignants</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900">{teachersCount}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Corps professoral</p>
          </div>
        </button>

        {/* Moyenne */}
        <button
          id="kpi-card-average"
          onClick={() => onNavigate('grades')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all text-left group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Moyenne</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900">{overallAvg}</span>
              <span className="text-xs text-slate-400 font-medium">/20</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Trimestre 1</p>
          </div>
        </button>

        {/* Absences */}
        <button
          id="kpi-card-absences"
          onClick={() => onNavigate('attendance')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all text-left group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Absences</span>
            <UserCheck className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-rose-600">{unexcusedAbsences.length}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Non justifiées</p>
          </div>
        </button>
      </div>

      {/* Main Grid: Modules & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: School Management Sections (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Access Modules */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Gestion de l'établissement
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                id="hub-btn-students"
                onClick={() => onNavigate('students')}
                className="p-3.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-3 text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Registre des élèves</h3>
                  <p className="text-[11px] text-slate-500">Inscriptions, fiches et contacts</p>
                </div>
              </button>

              <button
                id="hub-btn-classes"
                onClick={() => onNavigate('classes')}
                className="p-3.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-3 text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Classes & Divisions</h3>
                  <p className="text-[11px] text-slate-500">Salles et professeurs principaux</p>
                </div>
              </button>

              <button
                id="hub-btn-teachers"
                onClick={() => onNavigate('teachers')}
                className="p-3.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-3 text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Corps enseignant</h3>
                  <p className="text-[11px] text-slate-500">Matières dispensées et contacts</p>
                </div>
              </button>

              <button
                id="hub-btn-grades"
                onClick={() => onNavigate('grades')}
                className="p-3.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-3 text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Notes & Bulletins</h3>
                  <p className="text-[11px] text-slate-500">Moyennes et délibérations</p>
                </div>
              </button>

              <button
                id="hub-btn-attendance"
                onClick={() => onNavigate('attendance')}
                className="p-3.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-3 text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Assiduité & Présences</h3>
                  <p className="text-[11px] text-slate-500">Appel quotidien et motifs</p>
                </div>
              </button>

              <button
                id="hub-btn-badges"
                onClick={() => onNavigate('badges')}
                className="p-3.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-3 text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Cartes scolaires</h3>
                  <p className="text-[11px] text-slate-500">Génération et impression</p>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Registrations Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-xs text-slate-900">Derniers élèves inscrits</h3>
              <button
                id="view-all-students-link"
                onClick={() => onNavigate('students')}
                className="text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1"
              >
                <span>Voir tout le registre</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {recentStudents.map((std) => (
                <div key={std.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                      {std.firstName.slice(0, 1)}{std.lastName.slice(0, 1)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{std.firstName} {std.lastName}</h4>
                      <p className="text-[11px] text-slate-500">{std.matricule} • {std.className}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                    {std.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Attendance Feed & Academic Calendar (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Daily Attendance Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">
                Contrôle d'assiduité récent
              </h3>
              <button
                id="dash-full-attendance-btn"
                onClick={() => onNavigate('attendance')}
                className="text-xs font-semibold text-slate-700 hover:underline"
              >
                Gérer
              </button>
            </div>

            <div className="space-y-2">
              {recentAttendance.map((att) => (
                <div key={att.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-900">{att.studentName}</p>
                    <p className="text-[11px] text-slate-500">{att.className} • {att.date}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      att.status === 'Présent'
                        ? 'bg-emerald-50 text-emerald-700'
                        : att.status === 'Retard'
                        ? 'bg-sky-50 text-sky-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {att.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Info Card */}
          <div className="bg-white text-slate-900 p-5 rounded-2xl border border-sky-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-600 uppercase tracking-wider">
                Établissement homologué
              </span>
              <span className="text-xs text-slate-500 font-mono">SCH-GN-001</span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {schoolInfo.name}
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Conakry, République de Guinée
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Directeur : <strong className="text-slate-900">{schoolInfo.directorName}</strong></span>
              <span className="text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200 font-bold">Actif</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
