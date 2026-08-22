import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { UserCheck, Send, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';

export const AttendanceRollCall: React.FC = () => {
  const { classes, students, recordAttendance } = useSchool();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [currentStatuses, setCurrentStatuses] = useState<Record<string, 'Présent' | 'Absent Non Justifié' | 'Absent Justifié' | 'Retard'>>({
    'std-001': 'Présent',
    'std-002': 'Absent Non Justifié',
    'std-003': 'Présent',
    'std-004': 'Retard',
    'std-006': 'Présent',
  });

  const [notifyParents, setNotifyParents] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const classStudents = students.filter((s) => s.classId === selectedClassId);
  const targetClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  const handleStatusChange = (stdId: string, status: any) => {
    setCurrentStatuses((prev) => ({ ...prev, [stdId]: status }));
    setIsSaved(false);
  };

  const handleSaveAttendance = () => {
    const records = classStudents.map((s) => ({
      studentId: s.id,
      studentName: `${s.firstName} ${s.lastName}`,
      classId: targetClass.id,
      className: targetClass.name,
      date: new Date().toISOString().split('T')[0],
      status: currentStatuses[s.id] || 'Présent',
      notifiedParent: notifyParents,
    }));

    recordAttendance(records);
    setIsSaved(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-xs font-bold text-[#18bfd6] uppercase tracking-wider block">DISCIPLINE & ASSIDUITÉ</span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Prise d'Appel Quotidien & Alertes Parentales
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pointage instantané des présences avec envoi automatique de SMS aux parents en cas d'absence.
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
              {c.name} ({c.studentCount} Élèves)
            </option>
          ))}
        </select>
      </div>

      {/* Control Actions Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <label className="flex items-center space-x-2 text-slate-800 font-bold cursor-pointer">
          <input
            type="checkbox"
            checked={notifyParents}
            onChange={(e) => setNotifyParents(e.target.checked)}
            className="w-4 h-4 rounded text-[#18bfd6] focus:ring-[#18bfd6]"
          />
          <span>Envoyer automatiquement une alerte SMS au parent si l'élève est absent / en retard</span>
        </label>

        <button
          onClick={handleSaveAttendance}
          className="px-5 py-2.5 bg-[#18bfd6] hover:bg-[#15aabf] text-white font-bold rounded-xl shadow-sm transition-all inline-flex items-center space-x-2 whitespace-nowrap"
        >
          <Send className="w-4 h-4" />
          <span>{isSaved ? 'Appel Enregistré & Alertes Envoyées !' : 'Valider & Alerter les Parents'}</span>
        </button>
      </div>

      {/* Roll Call Grid */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Élève</th>
                <th className="py-3.5 px-4">Matricule</th>
                <th className="py-3.5 px-4">Contact Tuteur</th>
                <th className="py-3.5 px-4 text-center">Statut d'Appel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {classStudents.map((std) => {
                const current = currentStatuses[std.id] || 'Présent';

                return (
                  <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-extrabold text-slate-900">{std.firstName} {std.lastName}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#18bfd6]">{std.matricule}</td>
                    <td className="py-3 px-4 font-mono text-[#fcb303] font-bold">{std.parentPhone}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex bg-slate-100 p-1 rounded-xl space-x-1">
                        <button
                          onClick={() => handleStatusChange(std.id, 'Présent')}
                          className={`px-3 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                            current === 'Présent'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Présent
                        </button>

                        <button
                          onClick={() => handleStatusChange(std.id, 'Absent Non Justifié')}
                          className={`px-3 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                            current === 'Absent Non Justifié'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Absent
                        </button>

                        <button
                          onClick={() => handleStatusChange(std.id, 'Retard')}
                          className={`px-3 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                            current === 'Retard'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Retard
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
