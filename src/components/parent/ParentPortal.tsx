import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { parentApi, gradesApi, absencesApi } from '../../services/api';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  FileText,
  UserCheck,
  ClipboardList,
  GraduationCap,
  Download,
  Printer,
  QrCode,
} from 'lucide-react';

interface ParentPortalProps {
  activeSubTab?: string;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({ activeSubTab = 'student_profile' }) => {
  const { students, selectedStudentIdForParent, getStudentReportCard, attendance } = useSchool();
  const [activeTab, setActiveTab] = useState<string>(activeSubTab);

  useEffect(() => {
    setActiveTab(activeSubTab);
  }, [activeSubTab]);

  const currentStudent =
    students.find((s) => s.id === selectedStudentIdForParent) || students[0];

  const reportCard = getStudentReportCard(currentStudent?.id || '', 1);
  const studentAttendance = attendance.filter((a) => a.studentId === currentStudent?.id);

  if (!currentStudent) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <p className="text-xs text-slate-500">Aucun élève rattaché à ce compte tuteur.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Student Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-sky-400/80 flex items-center justify-center text-xl font-bold text-white uppercase shrink-0">
            {currentStudent.firstName.slice(0, 1)}
            {currentStudent.lastName.slice(0, 1)}
          </div>
          <div>
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
              PORTAIL PARENT KHARANDI • MEPU-A
            </span>
            <h2 className="text-xl font-extrabold tracking-tight">
              {currentStudent.firstName} {currentStudent.lastName}
            </h2>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              Matricule : <strong className="text-white">{currentStudent.matricule}</strong> • {currentStudent.className}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('student_profile')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'student_profile'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Notes & Bulletin
          </button>
          <button
            onClick={() => setActiveTab('absences')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'absences'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Assiduité
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'badges'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Carte & Badge
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: Academic Report Card */}
      {activeTab === 'student_profile' && reportCard && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs text-center">
              <span className="text-xs text-slate-500 font-bold uppercase block">Moyenne du 1er Trimestre</span>
              <p className="text-3xl font-black font-mono text-sky-700 mt-1">
                {reportCard.overallAverage} <span className="text-xs font-normal text-slate-400">/ 20</span>
              </p>
              <span className="text-[11px] text-emerald-600 font-bold block mt-1">
                {reportCard.decision}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs text-center">
              <span className="text-xs text-slate-500 font-bold uppercase block">Rang dans la Classe</span>
              <p className="text-3xl font-black font-mono text-amber-600 mt-1">
                {reportCard.classRank}e <span className="text-xs font-normal text-slate-400">/ {reportCard.totalStudentsInClass}</span>
              </p>
              <span className="text-[11px] text-slate-500 block mt-1">Classement officiel</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs text-center">
              <span className="text-xs text-slate-500 font-bold uppercase block">Total Absences</span>
              <p className="text-3xl font-black font-mono text-slate-900 mt-1">
                {reportCard.totalAbsences}
              </p>
              <span className="text-[11px] text-slate-500 block mt-1">séance(s) signalée(s)</span>
            </div>
          </div>

          {/* Subject Grades Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Relevé des Évaluations par Matière</h3>
              <span className="text-xs font-semibold text-slate-500">1er Trimestre</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200/80 text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4">Matière</th>
                    <th className="py-3 px-4 text-center">Coefficient</th>
                    <th className="py-3 px-4 text-center">Moyenne / 20</th>
                    <th className="py-3 px-4">Appréciation du Professeur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {reportCard.subjectAverages.map((sub) => (
                    <tr key={sub.subjectId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{sub.subjectName}</td>
                      <td className="py-3 px-4 text-center font-mono text-slate-600">
                        {sub.coefficient}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-xs text-slate-900">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-lg ${
                            sub.average >= 14
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : sub.average < 10
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {sub.average} / 20
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 italic">{sub.teacherAppreciation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Attendance & Discipline */}
      {activeTab === 'absences' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">
              Historique d'Assiduité de l'Élève
            </h3>
            <span className="text-xs text-slate-500">{studentAttendance.length} événement(s) noté(s)</span>
          </div>

          {studentAttendance.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs text-slate-600 font-semibold">Aucune absence enregistrée.</p>
              <p className="text-[11px] text-slate-400">L'élève est assidu et ponctuel à tous les cours.</p>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              {studentAttendance.map((att) => (
                <div
                  key={att.id}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{att.date}</span>
                    <span className="text-slate-600 text-[11px]">
                      {att.reason || 'Appel en classe effectué par l’enseignant'}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      att.status.includes('Non Justifié')
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : att.status.includes('Justifié')
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-sky-50 text-sky-700 border border-sky-200'
                    }`}
                  >
                    {att.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 3: Badges & Student ID */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Carte Scolaire Numérique & Certifications</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Badge d'identité officiel vérifiable par QR code auprès du MEPU-A.
              </p>
            </div>

            {/* Virtual Card */}
            <div className="max-w-md bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-2xl p-5 border border-slate-700 shadow-md relative overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-[9px] font-extrabold text-sky-400 tracking-wider uppercase">
                    RÉPUBLIQUE DE GUINÉE • MEPU-A
                  </span>
                  <h4 className="text-xs font-black text-white">GROUPE SCOLAIRE KHARANDI</h4>
                </div>
                <Award className="w-5 h-5 text-amber-400" />
              </div>

              <div className="flex items-center gap-4 my-3">
                <div className="w-14 h-14 rounded-xl bg-slate-700 border border-white/20 flex items-center justify-center font-bold text-base">
                  {currentStudent.firstName.slice(0, 1)}
                  {currentStudent.lastName.slice(0, 1)}
                </div>
                <div>
                  <h5 className="font-bold text-white text-sm">
                    {currentStudent.firstName} {currentStudent.lastName}
                  </h5>
                  <p className="text-xs text-sky-300 font-mono">{currentStudent.matricule}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{currentStudent.className}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Validité: 2025-2026</span>
                <span className="text-emerald-400 font-bold">Certifié MEPU-A ✓</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer la carte</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
