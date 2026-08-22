import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { UserCheck, CheckCircle2 } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Feuille de présence</h1>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600">
              Appel du jour
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Pointage en direct des élèves avec notification SMS automatique en cas d'absence.
          </p>
        </div>

        {/* Class Selector */}
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-900 focus:outline-none focus:border-emerald-500"
        >
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.studentCount} élèves)
            </option>
          ))}
        </select>
      </div>

      {/* Control Actions Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={notifyParents}
            onChange={(e) => setNotifyParents(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span>Notifier le tuteur par SMS en cas d'absence ou de retard</span>
        </label>

        <button
          onClick={handleSaveAttendance}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
          <span>{isSaved ? 'Appel validé' : 'Valider la feuille de présence'}</span>
        </button>
      </div>

      {/* Roll Call Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Élève</th>
                <th className="py-3 px-4">Matricule</th>
                <th className="py-3 px-4">Tuteur</th>
                <th className="py-3 px-4 text-center">Statut d'assiduité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {classStudents.map((std) => {
                const currentStatus = currentStatuses[std.id] || 'Présent';

                return (
                  <tr key={std.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {std.firstName} {std.lastName}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {std.matricule}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      <div>{std.parentName}</div>
                      <div className="text-[11px] font-mono text-slate-400">{std.parentPhone}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(std.id, 'Présent')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                            currentStatus === 'Présent'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Présent
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(std.id, 'Retard')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                            currentStatus === 'Retard'
                              ? 'bg-sky-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Retard
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(std.id, 'Absent Non Justifié')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                            currentStatus === 'Absent Non Justifié'
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Absent
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
