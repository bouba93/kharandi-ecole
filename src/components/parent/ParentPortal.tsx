import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  CheckCircle2,
  Printer,
  Bot,
  FileText,
  ListChecks,
  TrendingUp,
  UserCheck,
  ShieldCheck,
  CreditCard,
  Award,
  AlertTriangle,
  Clock,
  Calendar,
  Smartphone,
  Check,
  ChevronRight,
  TrendingDown,
  BookOpen,
} from 'lucide-react';
import { KaramoAssistant } from '../karamo/KaramoAssistant';
import { OrangeMtnPaymentModal } from '../common/OrangeMtnPaymentModal';

interface ParentPortalProps {
  activeSubTab?: string;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({ activeSubTab = 'karamo_ia' }) => {
  const {
    students,
    selectedStudentIdForParent,
    setSelectedStudentIdForParent,
    getStudentReportCard,
    attendance,
    grades,
    subjects,
    payments,
    schoolInfo,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<string>(activeSubTab);
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3>(1);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  useEffect(() => {
    if (activeSubTab) {
      // Map old aliases to new requested tabs if necessary
      if (activeSubTab === 'student_profile') setActiveTab('bulletin');
      else if (activeSubTab === 'absences') setActiveTab('attendance');
      else setActiveTab(activeSubTab);
    }
  }, [activeSubTab]);

  const currentStudent =
    students.find((s) => s.id === selectedStudentIdForParent) || students[0];

  const reportCard = getStudentReportCard(currentStudent?.id || '', selectedTrimester);
  const studentAttendance = attendance.filter((a) => a.studentId === currentStudent?.id);
  const studentGrades = grades.filter((g) => g.studentId === currentStudent?.id);
  const studentPayments = payments.filter((p) => p.studentId === currentStudent?.id);

  if (!currentStudent) {
    return (
      <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
        <p className="text-xs text-slate-500">Aucun élève rattaché à ce compte.</p>
      </div>
    );
  }

  // Filtered grades for 'Note' tab
  const filteredGrades =
    selectedSubjectFilter === 'all'
      ? studentGrades
      : studentGrades.filter((g) => g.subjectId === selectedSubjectFilter);

  // Performance calculations
  const subjectAverages = reportCard?.subjectAverages || [];
  const strongSubjects = subjectAverages.filter((s) => s.average >= 14);
  const weakSubjects = subjectAverages.filter((s) => s.average < 10);
  const averageGrade =
    studentGrades.length > 0
      ? (
          studentGrades.reduce((sum, g) => sum + (g.value / g.maxScore) * 20, 0) /
          studentGrades.length
        ).toFixed(2)
      : '14.50';

  // Tuition calculations
  const totalTuition = 1800000; // 1,800,000 GNF annual
  const totalPaid = studentPayments.reduce((sum, p) => sum + p.amount, 0);
  const remainingBalance = Math.max(0, totalTuition - totalPaid);

  const tabs = [
    { id: 'karamo_ia', label: 'Assistant Karamô', icon: Bot },
    { id: 'bulletin', label: 'Bulletin', icon: FileText },
    { id: 'note', label: 'Note', icon: ListChecks },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'attendance', label: 'Assiduité', icon: UserCheck },
    { id: 'conduite', label: 'Conduite', icon: ShieldCheck },
    { id: 'scolarite', label: 'Scolarité', icon: CreditCard },
  ];

  return (
    <div className="space-y-5">
      {/* Student Banner Header (Light Clean) */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-2xs">
            {currentStudent.firstName.slice(0, 1)}
            {currentStudent.lastName.slice(0, 1)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                {currentStudent.firstName} {currentStudent.lastName}
              </h2>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  currentStudent.status === 'En règle'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {currentStudent.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Matricule : <strong className="font-mono text-slate-700">{currentStudent.matricule}</strong> • Classe : <span className="font-medium text-slate-700">{currentStudent.className}</span> • Tuteur : {currentStudent.parentName}
            </p>
          </div>
        </div>

        {/* Multi-student switch if parent has multiple kids */}
        {students.length > 1 && (
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-500">Changer d'enfant :</span>
            <select
              value={currentStudent.id}
              onChange={(e) => setSelectedStudentIdForParent(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} ({s.className})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
        <nav className="flex items-center gap-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* TAB 1: ASSISTANT KARAMÔ */}
      {activeTab === 'karamo_ia' && (
        <div className="space-y-4">
          <KaramoAssistant defaultStudentId={currentStudent.id} />
        </div>
      )}

      {/* TAB 2: BULLETIN */}
      {activeTab === 'bulletin' && (
        <div className="space-y-5">
          {/* Trimester Switch & Actions */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Trimestre :</span>
              <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                {[1, 2, 3].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTrimester(t as 1 | 2 | 3)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      selectedTrimester === t
                        ? 'bg-white text-slate-900 font-bold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t}er Trimestre
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer le bulletin officiel</span>
            </button>
          </div>

          {/* Key Summary Metrics */}
          {reportCard && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium block">Moyenne Générale</span>
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
                <span className="text-[11px] text-slate-500 block mt-1">Élèves évalués</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium block">Absences constatées</span>
                <div className="mt-1">
                  <span className="text-2xl font-bold text-slate-900">{reportCard.totalAbsences}</span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">séance(s) manquée(s)</span>
              </div>
            </div>
          )}

          {/* Subject Grades Table */}
          {reportCard && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-xs">
                  Relevé des notes et appréciations des professeurs
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  Année scolaire {schoolInfo.schoolYear}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <th className="py-3 px-4">Matière</th>
                      <th className="py-3 px-4 text-center">Coefficient</th>
                      <th className="py-3 px-4 text-center">Moyenne</th>
                      <th className="py-3 px-4">Appréciation Pédagogique</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {reportCard.subjectAverages.map((sub) => (
                      <tr key={sub.subjectId} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900">{sub.subjectName}</td>
                        <td className="py-3 px-4 text-center font-mono text-slate-600">
                          {sub.coefficient}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-xs">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded font-semibold ${
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
                        <td className="py-3 px-4 text-slate-600">{sub.teacherAppreciation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: NOTE */}
      {activeTab === 'note' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Détail de toutes les notes</h3>
              <p className="text-xs text-slate-500">
                Consultez chaque devoir, interrogation et contrôle continu individuel
              </p>
            </div>

            {/* Subject Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Filtrer par matière :</span>
              <select
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg px-3 py-1.5 focus:outline-none"
              >
                <option value="all">Toutes les matières</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            {filteredGrades.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <ListChecks className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs text-slate-600 font-medium">Aucune note enregistrée pour ce filtre.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <th className="py-3 px-4">Matière</th>
                      <th className="py-3 px-4">Épreuve</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-center">Note / Barème</th>
                      <th className="py-3 px-4 text-center">Équiv. /20</th>
                      <th className="py-3 px-4">Commentaire</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {filteredGrades.map((grade) => {
                      const equiv20 = ((grade.value / grade.maxScore) * 20).toFixed(1);
                      return (
                        <tr key={grade.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 font-semibold text-slate-900">{grade.subjectName}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                              {grade.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                            {grade.date}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-semibold text-slate-900">
                            {grade.value} / {grade.maxScore}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-xs ${
                                Number(equiv20) >= 14
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : Number(equiv20) < 10
                                  ? 'bg-rose-50 text-rose-700'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {equiv20}/20
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-500 italic text-[11px]">
                            {grade.comment || 'Note certifiée'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: PERFORMANCE */}
      {activeTab === 'performance' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium block">Moyenne Globale</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-slate-900">{averageGrade}</span>
                <span className="text-xs text-slate-400">/20</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-medium block mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Niveau très satisfaisant
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium block">Points Forts</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-emerald-700">{strongSubjects.length}</span>
                <span className="text-xs text-slate-400">matière(s) ≥ 14/20</span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">Excellence académique</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium block">Points de Vigilance</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-amber-600">{weakSubjects.length}</span>
                <span className="text-xs text-slate-400">matière(s) &lt; 10/20</span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">Soutien recommandé</span>
            </div>
          </div>

          {/* Detailed Performance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strong Subjects */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                <Award className="w-4 h-4" />
                <span>Matières Maîtrisées (Points Forts)</span>
              </div>
              {strongSubjects.length === 0 ? (
                <p className="text-xs text-slate-500">Aucune matière supérieure à 14/20 pour le moment.</p>
              ) : (
                <div className="space-y-2">
                  {strongSubjects.map((sub) => (
                    <div
                      key={sub.subjectId}
                      className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-lg flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-slate-900">{sub.subjectName}</span>
                      <span className="font-bold text-emerald-700 font-mono">{sub.average}/20</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Areas for Improvement */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-xs">
                <BookOpen className="w-4 h-4" />
                <span>Matières à Accompagner</span>
              </div>
              {weakSubjects.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg text-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                  <p className="text-xs text-slate-700 font-medium">Toutes les matières sont validées !</p>
                  <p className="text-[11px] text-slate-400">Aucune moyenne inférieure à 10/20.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {weakSubjects.map((sub) => (
                    <div
                      key={sub.subjectId}
                      className="bg-rose-50/50 border border-rose-100 p-3 rounded-lg flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-slate-900 block">{sub.subjectName}</span>
                        <span className="text-[10px] text-rose-600">Exercices supplémentaires conseillés</span>
                      </div>
                      <span className="font-bold text-rose-700 font-mono">{sub.average}/20</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ASSIDUITÉ */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Feuille de présence et assiduité</h3>
              <p className="text-xs text-slate-500">
                Suivi complet des absences et des retards enregistrés par l'école
              </p>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {studentAttendance.length} événement(s)
            </span>
          </div>

          {studentAttendance.length === 0 ? (
            <div className="py-10 text-center text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs text-slate-700 font-bold">Assiduité Parfaite (100%)</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                L'élève est ponctuel et présent à tous les cours.
              </p>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              {studentAttendance.map((att) => (
                <div
                  key={att.id}
                  className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-900 block">{att.date}</span>
                    <span className="text-slate-500 text-[11px]">
                      Motif : {att.reason || 'Appel de présence en classe'}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
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

      {/* TAB 6: CONDUITE */}
      {activeTab === 'conduite' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium block">Note de Conduite</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-slate-900">18.5</span>
                <span className="text-xs text-slate-400">/20</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-medium block mt-1">
                Très bonne conduite
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium block">Distinction & Mérite</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-amber-600">Tableau</span>
                <span className="text-xs text-slate-400">d'Honneur</span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">Comportement exemplaire</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium block">Sanctions & Retenues</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-slate-900">0</span>
                <span className="text-xs text-slate-400">avertissement</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-medium block mt-1">
                Casier vierge
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-xs">
              Évaluation du Comportement & du Climat Scolaire
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-900 block">Respect du règlement intérieur</span>
                  <span className="text-slate-500 text-[11px]">Tenue scolaire réglementaire et ponctualité</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold rounded text-[11px]">
                  Conforme ✓
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-900 block">Participation et vie de classe</span>
                  <span className="text-slate-500 text-[11px]">Esprit d'équipe, écoute et politesse envers les enseignants</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold rounded text-[11px]">
                  Exemplaire ✓
                </span>
              </div>

              <div className="p-3.5 bg-amber-50/50 rounded-lg border border-amber-200/80 text-xs space-y-1">
                <span className="font-bold text-amber-900 block">Appréciation de la Vie Scolaire (CPE) :</span>
                <p className="text-slate-700 italic leading-relaxed">
                  « Élève respectueux(se), sérieux(se) et engagé(e) dans son travail scolaire. Fait preuve d'une excellente camaraderie au sein de l'établissement. »
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: SCOLARITÉ */}
      {activeTab === 'scolarite' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium block">Total Frais Annuels</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold text-slate-900">{totalTuition.toLocaleString('fr-FR')}</span>
                <span className="text-xs text-slate-400">GNF</span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">Année {schoolInfo.schoolYear}</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium block">Montant Réglé</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold text-emerald-700">{totalPaid.toLocaleString('fr-FR')}</span>
                <span className="text-xs text-slate-400">GNF</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-medium block mt-1">
                Paiements validés
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium block">Solde Restant Dû</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold text-slate-900">{remainingBalance.toLocaleString('fr-FR')}</span>
                <span className="text-xs text-slate-400">GNF</span>
              </div>
              <span
                className={`text-[11px] font-semibold block mt-1 ${
                  remainingBalance === 0 ? 'text-emerald-700' : 'text-amber-600'
                }`}
              >
                {remainingBalance === 0 ? 'Scolarité soldée' : 'Tranches à échoir'}
              </span>
            </div>
          </div>

          {/* Quick Pay CTA */}
          <div className="bg-slate-900 text-white p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white">Paiement Mobile Instantané</h4>
              </div>
              <p className="text-xs text-slate-300">
                Réglez les frais scolaires en toute sécurité via Orange Money Guinée ou MTN MoMo.
              </p>
            </div>

            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              <span>Payer les frais</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* History of Payments Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs">Historique des reçus de paiement</h3>
              <span className="text-xs text-slate-500 font-medium">
                {studentPayments.length} transaction(s)
              </span>
            </div>

            {studentPayments.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <CreditCard className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs text-slate-600 font-medium">Aucun reçu de paiement enregistré.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <th className="py-3 px-4">Référence</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Libellé</th>
                      <th className="py-3 px-4">Moyen</th>
                      <th className="py-3 px-4 text-right">Montant</th>
                      <th className="py-3 px-4 text-center">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {studentPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 font-mono font-semibold text-slate-900">{p.receiptNumber}</td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{p.date}</td>
                        <td className="py-3 px-4 text-slate-700">{p.description}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-800">
                            {p.method}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          {p.amount.toLocaleString('fr-FR')} GNF
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <OrangeMtnPaymentModal
          student={currentStudent}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
};
