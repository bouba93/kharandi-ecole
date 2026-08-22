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
  ShieldCheck,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
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

  // Real metrics derived from backend data
  const totalStudents = students.length;
  const totalClasses = classes.length;
  const totalGrades = grades.length;
  const todayDateStr = new Date().toISOString().slice(0, 10);
  const todayAbsences = attendance.filter((a) => a.date === todayDateStr && a.status.includes('Absent'));
  const unexcusedAbsences = attendance.filter((a) => a.status === 'Absent Non Justifié');

  // Recent 4 students enrolled
  const recentStudents = students.slice(0, 4);

  // Recent attendance records
  const recentAttendance = attendance.slice(0, 4);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* School Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">{schoolInfo.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
              Année {schoolInfo.schoolYear} • T{schoolInfo.currentTrimester}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {schoolInfo.address} • {schoolInfo.dpe} ({schoolInfo.ministere})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('students')}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" />
            <span>Inscrire un élève</span>
          </button>
          <button
            onClick={() => onNavigate('attendance')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Contrôle des présences</span>
          </button>
        </div>
      </div>

      {/* 6 Key Academic Metrics (Truthful to Backend) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Élèves */}
        <button
          onClick={() => onNavigate('students')}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 hover:border-sky-300 transition-all text-left shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Élèves</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900">{totalStudents}</span>
            <p className="text-[10px] text-slate-400">Inscrits au registre</p>
          </div>
        </button>

        {/* Classes */}
        <button
          onClick={() => onNavigate('classes')}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 hover:border-sky-300 transition-all text-left shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Classes</span>
            <GraduationCap className="w-4 h-4 text-slate-700" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900">{totalClasses}</span>
            <p className="text-[10px] text-slate-400">Divisions actives</p>
          </div>
        </button>

        {/* Enseignants */}
        <button
          onClick={() => onNavigate('teachers')}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 hover:border-sky-300 transition-all text-left shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Professeurs</span>
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900">{teachersCount}</span>
            <p className="text-[10px] text-slate-400">Corps enseignant</p>
          </div>
        </button>

        {/* Notes */}
        <button
          onClick={() => onNavigate('grades')}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 hover:border-sky-300 transition-all text-left shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Évaluations</span>
            <ClipboardList className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900">{totalGrades}</span>
            <p className="text-[10px] text-slate-400">Notes enregistrées</p>
          </div>
        </button>

        {/* Absences */}
        <button
          onClick={() => onNavigate('attendance')}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 hover:border-sky-300 transition-all text-left shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Absences</span>
            <UserCheck className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-rose-600">{unexcusedAbsences.length}</span>
            <p className="text-[10px] text-slate-400">Non justifiées</p>
          </div>
        </button>

        {/* Badges */}
        <button
          onClick={() => onNavigate('badges')}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 hover:border-sky-300 transition-all text-left shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Badges</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900">{badgesCount}</span>
            <p className="text-[10px] text-slate-400">Cartes & Distinctions</p>
          </div>
        </button>
      </div>

      {/* Main Grid: Quick Nav Shortcuts + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quick Navigation Hub (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Accès Rapides d'Administration
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => onNavigate('students')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/30 transition-all flex items-start gap-3 text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Registre des Élèves</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Inscriptions, dossiers et recherche par classe.</p>
                </div>
              </button>

              <button
                onClick={() => onNavigate('classes')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/30 transition-all flex items-start gap-3 text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Gestion des Classes</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Effectifs, professeurs principaux et salles.</p>
                </div>
              </button>

              <button
                onClick={() => onNavigate('teachers')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/30 transition-all flex items-start gap-3 text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Corps Enseignant</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Gestion des professeurs et affectations de matières.</p>
                </div>
              </button>

              <button
                onClick={() => onNavigate('grades')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/30 transition-all flex items-start gap-3 text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Notes & Évaluations</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Revue trimestrielle des notes et moyennes.</p>
                </div>
              </button>

              <button
                onClick={() => onNavigate('attendance')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/30 transition-all flex items-start gap-3 text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Assiduité & Absences</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Historique des appels et alertes tuteurs.</p>
                </div>
              </button>

              <button
                onClick={() => onNavigate('badges')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/30 transition-all flex items-start gap-3 text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Badges & Cartes Scolaires</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Émission certifiée, QR code et impression PDF.</p>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Enrolled Students */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-700" />
                <h3 className="font-bold text-slate-900 text-xs">Dernières Inscriptions Scolaires</h3>
              </div>
              <button
                onClick={() => onNavigate('students')}
                className="text-xs font-bold text-sky-600 hover:underline inline-flex items-center gap-1"
              >
                <span>Voir tout le registre</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {recentStudents.map((std) => (
                <div key={std.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase">
                      {std.firstName.slice(0, 1)}{std.lastName.slice(0, 1)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{std.firstName} {std.lastName}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">{std.matricule} • {std.className}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {std.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Attendance & Academic Feed (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Attendance Overview Box */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                Derniers Relevés d'Assiduité
              </h3>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Appel
              </span>
            </div>

            <div className="space-y-2.5">
              {recentAttendance.map((att) => (
                <div key={att.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{att.studentName}</p>
                    <p className="text-[10px] text-slate-500">{att.className} • {att.date}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      att.status === 'Présent'
                        ? 'bg-emerald-100 text-emerald-800'
                        : att.status === 'Retard'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {att.status}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('attendance')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all text-center block"
            >
              Consulter le registre complet
            </button>
          </div>

          {/* School Integrity & Certification Card */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                CONFORMITÉ MEPU-A
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>

            <h4 className="text-sm font-bold text-white">
              Système de Gestion Scolaire Kharandi
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed">
              Toutes les données élèves, notes d'évaluations et relevés d'assiduité sont cryptés et synchronisés pour garantir l'intégrité des dossiers scolaires.
            </p>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Code Établissement : <strong className="text-slate-200 font-mono">SCH-GN-001</strong></span>
              <span className="text-emerald-400 font-bold">Actif ✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
