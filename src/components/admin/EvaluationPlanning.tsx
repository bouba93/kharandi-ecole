import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { EvaluationPeriod, ScheduledEvaluation } from '../../types';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Printer,
  Search,
  Filter,
  FileText,
  Building,
  GraduationCap,
  CalendarCheck,
} from 'lucide-react';

export const EvaluationPlanning: React.FC = () => {
  const {
    classes,
    schoolInfo,
    evaluationPeriods,
    scheduledEvaluations,
    addEvaluationPeriod,
    updateEvaluationPeriod,
    deleteEvaluationPeriod,
    addScheduledEvaluation,
    updateScheduledEvaluation,
    deleteScheduledEvaluation,
  } = useSchool();

  const [activeSubTab, setActiveSubTab] = useState<'schedule' | 'periods'>('schedule');
  const [selectedTrimester, setSelectedTrimester] = useState<number>(1);
  const [selectedClassId, setSelectedClassId] = useState<string>('Tous');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal State for New Scheduled Exam
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [examClassId, setExamClassId] = useState(classes[0]?.id || '');
  const [examSubjectName, setExamSubjectName] = useState('Mathématiques');
  const [examType, setExamType] = useState('Devoir 1');
  const [examTitle, setExamTitle] = useState('Évaluation Harmonisée');
  const [examDate, setExamDate] = useState('2025-11-20');
  const [examStartTime, setExamStartTime] = useState('08:30');
  const [examDuration, setExamDuration] = useState(120);
  const [examRoom, setExamRoom] = useState('Salle 12 (Bâtiment A)');
  const [examCoeff, setExamCoeff] = useState(3);
  const [examSupervisor, setExamSupervisor] = useState('M. Fodé Camara');

  // Modal State for New Period
  const [showAddPeriodModal, setShowAddPeriodModal] = useState(false);
  const [periodTitle, setPeriodTitle] = useState('');
  const [periodTrimester, setPeriodTrimester] = useState<1 | 2 | 3>(1);
  const [periodStartDate, setPeriodStartDate] = useState('2025-11-15');
  const [periodEndDate, setPeriodEndDate] = useState('2025-11-30');
  const [periodDeadline, setPeriodDeadline] = useState('2025-12-05');
  const [periodDeliberation, setPeriodDeliberation] = useState('2025-12-10');

  // Filtered Evaluations
  const filteredEvaluations = scheduledEvaluations.filter((ev) => {
    const matchesTrimester = ev.trimester === selectedTrimester;
    const matchesClass = selectedClassId === 'Tous' || ev.classId === selectedClassId;
    const matchesSearch =
      `${ev.title} ${ev.subjectName} ${ev.className} ${ev.supervisorName || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesTrimester && matchesClass && matchesSearch;
  });

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    const targetClass = classes.find((c) => c.id === examClassId) || classes[0];

    addScheduledEvaluation({
      periodId: `per-trim-${selectedTrimester}`,
      trimester: selectedTrimester as 1 | 2 | 3,
      classId: targetClass.id,
      className: targetClass.name,
      subjectId: `sub-${Date.now()}`,
      subjectName: examSubjectName,
      type: examType,
      title: examTitle,
      date: examDate,
      startTime: examStartTime,
      durationMinutes: Number(examDuration),
      roomNumber: examRoom,
      coefficient: Number(examCoeff),
      supervisorName: examSupervisor,
      status: 'planifié',
      maxScore: 20,
    });

    setShowAddExamModal(false);
    setExamTitle('Évaluation Harmonisée');
  };

  const handleCreatePeriod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!periodTitle.trim()) return;

    addEvaluationPeriod({
      trimester: periodTrimester,
      title: periodTitle,
      startDate: periodStartDate,
      endDate: periodEndDate,
      gradingDeadline: periodDeadline,
      deliberationDate: periodDeliberation,
      status: 'upcoming',
    });

    setShowAddPeriodModal(false);
    setPeriodTitle('');
  };

  const handlePrintSchedule = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="h-1.5 w-full absolute top-0 left-0 flex">
          <div className="w-1/3 bg-gn-red"></div>
          <div className="w-1/3 bg-gn-yellow"></div>
          <div className="w-1/3 bg-gn-green"></div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">Planification des Évaluations & Examens</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-gn-green border border-emerald-200">
                {scheduledEvaluations.length} programmées
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {schoolInfo.name} • Calendrier officiel des devoirs, compositions trimestrielles et examens blancs.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handlePrintSchedule}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5 border border-slate-200"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer l'emploi du temps</span>
            </button>

            {activeSubTab === 'schedule' ? (
              <button
                onClick={() => setShowAddExamModal(true)}
                className="px-4 py-2 bg-gn-green hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Programmer une évaluation</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAddPeriodModal(true)}
                className="px-4 py-2 bg-gn-green hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Créer une période</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sub tabs switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('schedule')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
            activeSubTab === 'schedule'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Calendrier des Épreuves ({scheduledEvaluations.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('periods')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
            activeSubTab === 'periods'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Périodes & Trimestres ({evaluationPeriods.length})</span>
        </button>
      </div>

      {/* TAB 1: SCHEDULE */}
      {activeSubTab === 'schedule' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher matière, classe, titre..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-slate-800 focus:outline-none focus:border-gn-green font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Trimester Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 font-medium">Trimestre :</span>
                <select
                  value={selectedTrimester}
                  onChange={(e) => setSelectedTrimester(Number(e.target.value))}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-900 font-bold focus:outline-none focus:border-gn-green"
                >
                  <option value={1}>1er Trimestre</option>
                  <option value={2}>2ème Trimestre</option>
                  <option value={3}>3ème Trimestre</option>
                </select>
              </div>

              {/* Class Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 font-medium">Classe :</span>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-900 font-semibold focus:outline-none focus:border-gn-green"
                >
                  <option value="Tous">Toutes les classes</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Evaluations Grid / Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs" id="printable-eval-schedule">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                    <th className="py-3 px-4">Date & Heure</th>
                    <th className="py-3 px-4">Classe & Niveau</th>
                    <th className="py-3 px-4">Matière & Type</th>
                    <th className="py-3 px-4">Coeff.</th>
                    <th className="py-3 px-4">Salle & Surveillance</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4 text-right no-print">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredEvaluations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400 font-medium">
                        Aucune évaluation planifiée pour ces critères. Cliquez sur "Programmer une évaluation".
                      </td>
                    </tr>
                  ) : (
                    filteredEvaluations.map((ev) => (
                      <tr key={ev.id} className="hover:bg-slate-50 transition-colors">
                        {/* Date & Time */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-gn-green flex items-center justify-center font-bold text-xs border border-emerald-200">
                              <Calendar className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">{ev.date}</span>
                              <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {ev.startTime} ({ev.durationMinutes} min)
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Class */}
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {ev.className}
                        </td>

                        {/* Subject & Type */}
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block">{ev.subjectName}</span>
                          <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                            {ev.type} — {ev.title}
                          </span>
                        </td>

                        {/* Coefficient */}
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                          {ev.coefficient}
                        </td>

                        {/* Room & Supervisor */}
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-slate-800 block">{ev.roomNumber || 'Salle principale'}</span>
                          <span className="text-[11px] text-slate-500">Surveillant : {ev.supervisorName || 'Professeur titulaire'}</span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <select
                            value={ev.status}
                            onChange={(e) => updateScheduledEvaluation(ev.id, { status: e.target.value as any })}
                            className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                              ev.status === 'publié'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : ev.status === 'noté'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : ev.status === 'en cours'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <option value="planifié">Planifié</option>
                            <option value="en cours">En cours</option>
                            <option value="noté">Noté / Corrigé</option>
                            <option value="publié">Publié sur Bulletin</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right no-print">
                          <button
                            onClick={() => {
                              if (window.confirm(`Supprimer cette évaluation de ${ev.subjectName} (${ev.className}) ?`)) {
                                deleteScheduledEvaluation(ev.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-gn-red transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PERIODS */}
      {activeSubTab === 'periods' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {evaluationPeriods.map((period) => (
              <div
                key={period.id}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                    Trimestre {period.trimester}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      period.status === 'active'
                        ? 'bg-emerald-50 text-gn-green border border-emerald-200'
                        : period.status === 'closed'
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {period.status === 'active' ? 'Période Active' : period.status === 'closed' ? 'Clôturée' : 'À Venir'}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{period.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Du <strong className="text-slate-800">{period.startDate}</strong> au{' '}
                    <strong className="text-slate-800">{period.endDate}</strong>
                  </p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date limite saisie :</span>
                    <span className="font-semibold text-slate-800">{period.gradingDeadline}</span>
                  </div>
                  {period.deliberationDate && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Conseil & Délibération :</span>
                      <span className="font-semibold text-gn-green">{period.deliberationDate}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {scheduledEvaluations.filter((e) => e.periodId === period.id || e.trimester === period.trimester).length} épreuves associées
                  </span>

                  <button
                    onClick={() => {
                      if (window.confirm(`Supprimer la période "${period.title}" ?`)) {
                        deleteEvaluationPeriod(period.id);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-gn-red transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Schedule Evaluation */}
      {showAddExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Programmer une Évaluation / Examen</h3>
                <p className="text-xs text-slate-500">Trimestre {selectedTrimester} • {schoolInfo.name}</p>
              </div>
              <button onClick={() => setShowAddExamModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Classe ciblée *</label>
                  <select
                    value={examClassId}
                    onChange={(e) => setExamClassId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green font-bold"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.level})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Matière *</label>
                  <input
                    type="text"
                    value={examSubjectName}
                    onChange={(e) => setExamSubjectName(e.target.value)}
                    placeholder="Ex: Mathématiques, Français..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Type d'évaluation</label>
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green font-medium"
                  >
                    <option value="Devoir 1">Devoir 1 (Mi-trimestre)</option>
                    <option value="Devoir 2">Devoir 2</option>
                    <option value="Composition Trimestrielle">Composition Trimestrielle</option>
                    <option value="Examen Blanc">Examen Blanc (BEPC / Bac)</option>
                    <option value="Interrogation Écrite">Interrogation Écrite</option>
                    <option value="Travaux Pratiques">Travaux Pratiques (TP)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Intitulé / Titre</label>
                  <input
                    type="text"
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    placeholder="Ex: Évaluation Harmonisée"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Heure de début *</label>
                  <input
                    type="time"
                    value={examStartTime}
                    onChange={(e) => setExamStartTime(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Durée (minutes)</label>
                  <input
                    type="number"
                    value={examDuration}
                    onChange={(e) => setExamDuration(Number(e.target.value))}
                    min={15}
                    step={15}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Coefficient</label>
                  <input
                    type="number"
                    value={examCoeff}
                    onChange={(e) => setExamCoeff(Number(e.target.value))}
                    min={1}
                    max={10}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Salle d'examen</label>
                  <input
                    type="text"
                    value={examRoom}
                    onChange={(e) => setExamRoom(e.target.value)}
                    placeholder="Ex: Salle 12"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Surveillant assigné</label>
                  <input
                    type="text"
                    value={examSupervisor}
                    onChange={(e) => setExamSupervisor(e.target.value)}
                    placeholder="Ex: M. Camara"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddExamModal(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gn-green hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs"
                >
                  Valider et Planifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Period */}
      {showAddPeriodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Définir une Période d'Évaluation</h3>
              <button onClick={() => setShowAddPeriodModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePeriod} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nom / Libellé de la période *</label>
                <input
                  type="text"
                  value={periodTitle}
                  onChange={(e) => setPeriodTitle(e.target.value)}
                  placeholder="Ex: 1er Trimestre — Compositions Générales"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Trimestre associé</label>
                <select
                  value={periodTrimester}
                  onChange={(e) => setPeriodTrimester(Number(e.target.value) as 1 | 2 | 3)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green font-bold"
                >
                  <option value={1}>1er Trimestre</option>
                  <option value={2}>2ème Trimestre</option>
                  <option value={3}>3ème Trimestre</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Date de début *</label>
                  <input
                    type="date"
                    value={periodStartDate}
                    onChange={(e) => setPeriodStartDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Date de fin *</label>
                  <input
                    type="date"
                    value={periodEndDate}
                    onChange={(e) => setPeriodEndDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Date limite de saisie des notes</label>
                  <input
                    type="date"
                    value={periodDeadline}
                    onChange={(e) => setPeriodDeadline(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Date Conseil de classe</label>
                  <input
                    type="date"
                    value={periodDeliberation}
                    onChange={(e) => setPeriodDeliberation(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddPeriodModal(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gn-green hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs"
                >
                  Enregistrer la Période
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
