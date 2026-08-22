import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  CheckCircle2,
  Printer,
} from 'lucide-react';

interface ParentPortalProps {
  activeSubTab?: string;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({ activeSubTab = 'student_profile' }) => {
  const { students, selectedStudentIdForParent, getStudentReportCard, attendance, schoolInfo } = useSchool();
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
      <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
        <p className="text-xs text-slate-500">Aucun élève rattaché à ce compte.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Student Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
            {currentStudent.firstName.slice(0, 1)}
            {currentStudent.lastName.slice(0, 1)}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {currentStudent.firstName} {currentStudent.lastName}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Matricule : <strong className="font-mono text-slate-700">{currentStudent.matricule}</strong> • {currentStudent.className}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('student_profile')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'student_profile'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bulletin & Notes
          </button>
          <button
            onClick={() => setActiveTab('absences')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'absences'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Assiduité
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'badges'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Carte scolaire
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: Academic Report Card */}
      {activeTab === 'student_profile' && reportCard && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium block">Moyenne du 1er Trimestre</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-slate-900">{reportCard.overallAverage}</span>
                <span className="text-xs text-slate-400">/20</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-medium block mt-1">
                {reportCard.decision}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium block">Rang dans la classe</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-slate-900">{reportCard.classRank}e</span>
                <span className="text-xs text-slate-400">sur {reportCard.totalStudentsInClass}</span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">Classement officiel</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium block">Total des absences</span>
              <div className="mt-1">
                <span className="text-2xl font-bold text-slate-900">{reportCard.totalAbsences}</span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">séance(s) signalée(s)</span>
            </div>
          </div>

          {/* Subject Grades Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs">Relevé des notes par matière</h3>
              <span className="text-xs text-slate-500">1er Trimestre 2025-2026</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">Matière</th>
                    <th className="py-3 px-4 text-center">Coefficient</th>
                    <th className="py-3 px-4 text-center">Moyenne</th>
                    <th className="py-3 px-4">Appréciation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {reportCard.subjectAverages.map((sub) => (
                    <tr key={sub.subjectId} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">{sub.subjectName}</td>
                      <td className="py-3 px-4 text-center font-mono text-slate-600">
                        {sub.coefficient}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-xs">
                        <span
                          className={`inline-block px-2 py-0.5 rounded ${
                            sub.average >= 14
                              ? 'bg-emerald-50 text-emerald-700'
                              : sub.average < 10
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {sub.average} / 20
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{sub.teacherAppreciation}</td>
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
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-xs">
              Historique d'assiduité de l'élève
            </h3>
            <span className="text-xs text-slate-500">{studentAttendance.length} événement(s)</span>
          </div>

          {studentAttendance.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
              <p className="text-xs text-slate-600 font-medium">Aucune absence enregistrée.</p>
              <p className="text-[11px] text-slate-400">L'élève est ponctuel à tous les cours.</p>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              {studentAttendance.map((att) => (
                <div
                  key={att.id}
                  className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-slate-900 block">{att.date}</span>
                    <span className="text-slate-500 text-[11px]">
                      {att.reason || 'Appel de classe'}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      att.status.includes('Non Justifié')
                        ? 'bg-rose-50 text-rose-700'
                        : att.status.includes('Justifié')
                        ? 'bg-amber-50 text-amber-800'
                        : 'bg-sky-50 text-sky-700'
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
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Carte d'identité scolaire</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Carte numérique officielle de l'élève pour l'année scolaire 2025-2026.
              </p>
            </div>

            {/* Virtual Card */}
            <div className="max-w-md bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-2xl p-5 border border-sky-400 shadow-md space-y-3">
              <div className="flex items-start justify-between border-b border-sky-400/50 pb-2">
                <div>
                  <p className="text-[10px] text-orange-200 font-bold uppercase tracking-wider">
                    Carte Scolaire Numérique
                  </p>
                  <h4 className="text-xs font-black text-white">{schoolInfo.name}</h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-sky-700 text-white rounded-full">
                  2025-2026
                </span>
              </div>

              <div className="flex items-center gap-3 py-1">
                <div className="w-14 h-14 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-base">
                  {currentStudent.firstName.slice(0, 1)}
                  {currentStudent.lastName.slice(0, 1)}
                </div>
                <div className="text-xs space-y-0.5">
                  <h5 className="font-bold text-white text-sm">
                    {currentStudent.firstName} {currentStudent.lastName}
                  </h5>
                  <p className="text-slate-300 font-mono">
                    Matricule : <strong className="text-white">{currentStudent.matricule}</strong>
                  </p>
                  <p className="text-slate-400">Classe : {currentStudent.className}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Année : 2025-2026</span>
                <span className="text-emerald-400 font-semibold">Carte Valide ✓</span>
              </div>
            </div>

            <div>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
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
