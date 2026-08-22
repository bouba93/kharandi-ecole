import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { BookOpen, Plus, Calendar, CheckCircle2, Clock } from 'lucide-react';

export const TeacherLogbook: React.FC = () => {
  const { classes, logbook, addLogbookEntry } = useSchool();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [topicCovered, setTopicCovered] = useState('');
  const [homeworkAssigned, setHomeworkAssigned] = useState('');
  const [homeworkDueDate, setHomeworkDueDate] = useState('');
  const [nextEvaluationDate, setNextEvaluationDate] = useState('');

  const targetClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicCovered.trim()) return;

    addLogbookEntry({
      classId: targetClass.id,
      className: targetClass.name,
      subjectId: 'sub-math-sm',
      subjectName: 'Mathématiques & Sciences',
      teacherName: 'Prof. Souleymane Camara',
      date: new Date().toISOString().split('T')[0],
      topicCovered,
      homeworkAssigned,
      homeworkDueDate,
      nextEvaluationDate,
    });

    setTopicCovered('');
    setHomeworkAssigned('');
  };

  const classEntries = logbook.filter((l) => l.classId === selectedClassId);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-xs font-bold text-[#18bfd6] uppercase tracking-wider block">ESPACE ENSEIGNANT</span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Cahier de Texte Digital & Devoirs
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Saisie du contenu des cours dispensés, devoirs à faire et programmation des évaluations.
          </p>
        </div>

        {/* Class Selector */}
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-[#18bfd6]"
        >
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.level})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entry Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-extrabold text-slate-900 text-sm mb-4 flex items-center space-x-2">
            <Plus className="w-4 h-4 text-[#18bfd6]" />
            <span>Nouvelle Séance de Cours</span>
          </h3>

          <form onSubmit={handleCreateEntry} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Contenu & Chapitre du Cours
              </label>
              <textarea
                rows={3}
                value={topicCovered}
                onChange={(e) => setTopicCovered(e.target.value)}
                placeholder="Ex: Chapitre 4 - Intégrales et Calcul de Surfaces..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#18bfd6]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Devoirs à faire pour la maison
              </label>
              <textarea
                rows={2}
                value={homeworkAssigned}
                onChange={(e) => setHomeworkAssigned(e.target.value)}
                placeholder="Ex: Exercices 12, 14 et 18 page 95..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#18bfd6]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">A rendre pour le</label>
                <input
                  type="date"
                  value={homeworkDueDate}
                  onChange={(e) => setHomeworkDueDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#18bfd6]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Prochain Devoir</label>
                <input
                  type="date"
                  value={nextEvaluationDate}
                  onChange={(e) => setNextEvaluationDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#18bfd6]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#18bfd6] hover:bg-[#15aabf] text-white font-bold rounded-xl shadow-sm transition-all"
            >
              Enregistrer au Cahier de Texte
            </button>
          </form>
        </div>

        {/* History List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm">
            Historique du Cahier de Texte — {targetClass?.name}
          </h3>

          {classEntries.length === 0 ? (
            <div className="bg-white p-8 text-center text-slate-400 rounded-2xl border border-slate-100">
              Aucun cours consigné pour cette classe.
            </div>
          ) : (
            classEntries.map((log) => (
              <div
                key={log.id}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-[#18bfd6]" />
                    <span className="font-extrabold text-slate-900 text-xs">{log.subjectName}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {log.date} • {log.teacherName}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Contenu du Cours</span>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">{log.topicCovered}</p>
                </div>

                {log.homeworkAssigned && (
                  <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100 text-xs">
                    <span className="font-bold text-amber-900 block mb-0.5">Devoir à faire :</span>
                    <p className="text-slate-800">{log.homeworkAssigned}</p>
                    {log.homeworkDueDate && (
                      <span className="text-[10px] font-bold text-amber-800 block mt-1 font-mono">
                        A rendre le : {log.homeworkDueDate}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
