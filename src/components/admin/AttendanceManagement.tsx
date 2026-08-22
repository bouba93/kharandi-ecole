import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { absencesApi } from '../../services/api';
import {
  UserCheck,
  Search,
  Calendar,
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
} from 'lucide-react';

export const AttendanceManagement: React.FC = () => {
  const { classes, students, attendance: localAttendance } = useSchool();
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [absencesList, setAbsencesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadAbsences = async () => {
    setLoading(true);
    try {
      const res = await absencesApi.getAll({
        class_id: selectedClassId !== 'all' ? selectedClassId : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        date: selectedDate || undefined,
      });
      if (res.success && res.absences) {
        setAbsencesList(res.absences);
      } else {
        setAbsencesList(localAttendance);
      }
    } catch {
      setAbsencesList(localAttendance);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAbsences();
  }, [selectedClassId, selectedStatus, selectedDate]);

  const filteredList = absencesList.filter((a) => {
    const student = students.find((s) => s.id === a.studentId);
    const fullName = student ? `${student.firstName} ${student.lastName}` : a.studentName || '';
    const matchesSearch = fullName.toLowerCase().includes(searchQuery.toLowerCase()) || (a.className || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClassId === 'all' || a.classId === selectedClassId;
    const matchesStatus = selectedStatus === 'all' || a.status === selectedStatus;
    const matchesDate = !selectedDate || a.date === selectedDate;
    return matchesSearch && matchesClass && matchesStatus && matchesDate;
  });

  const totalRecords = filteredList.length;
  const unexcusedCount = filteredList.filter((a) => a.status === 'Absent Non Justifié').length;
  const excusedCount = filteredList.filter((a) => a.status === 'Absent Justifié').length;
  const tardyCount = filteredList.filter((a) => a.status === 'Retard').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Présent':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700">
            Présent
          </span>
        );
      case 'Absent Non Justifié':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700">
            Non Justifié
          </span>
        );
      case 'Absent Justifié':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700">
            Justifié
          </span>
        );
      case 'Retard':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-700">
            Retard
          </span>
        );
      default:
        return <span className="text-slate-500">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Suivi d'assiduité</h1>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600">
              {totalRecords} relevés
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Historique des absences et retards signalés lors des appels quotidiens.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedClassId('all');
            setSelectedStatus('all');
            setSelectedDate('');
            setSearchQuery('');
          }}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors self-start sm:self-auto"
        >
          Réinitialiser filtres
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Total relevés</p>
          <div className="mt-1">
            <span className="text-2xl font-bold text-slate-900">{totalRecords}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Absences non justifiées</p>
          <div className="mt-1">
            <span className="text-2xl font-bold text-rose-600">{unexcusedCount}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Absences justifiées</p>
          <div className="mt-1">
            <span className="text-2xl font-bold text-amber-700">{excusedCount}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Retards</p>
          <div className="mt-1">
            <span className="text-2xl font-bold text-slate-900">{tardyCount}</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Class Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Classe :</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Toutes les classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Statut :</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="Absent Non Justifié">Non Justifié</option>
              <option value="Absent Justifié">Justifié</option>
              <option value="Retard">Retard</option>
              <option value="Présent">Présent</option>
            </select>
          </div>

          {/* Date Input */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Date :</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par élève..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500 text-slate-800"
          />
        </div>
      </div>

      {/* Attendance Table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
          Chargement des présences...
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
          Aucun événement d'absence enregistré.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                  <th className="py-3 px-4">Élève</th>
                  <th className="py-3 px-4">Classe</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4">Motif / Justification</th>
                  <th className="py-3 px-4">Signalé par</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredList.map((a, idx) => {
                  const student = students.find((s) => s.id === a.studentId);
                  return (
                    <tr key={a.id || idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {student ? `${student.firstName} ${student.lastName}` : a.studentName || 'Élève'}
                      </td>

                      <td className="py-3 px-4 text-slate-700">
                        {a.className || (student ? student.className : '—')}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                        {a.date}
                      </td>

                      <td className="py-3 px-4">
                        {getStatusBadge(a.status)}
                      </td>

                      <td className="py-3 px-4 text-slate-600 text-[11px]">
                        {a.reason || (a.status === 'Absent Non Justifié' ? 'Aucun justificatif fourni' : '—')}
                      </td>

                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {a.recordedBy || 'Prof. Principal'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
