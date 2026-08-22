import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { absencesApi } from '../../services/api';
import {
  UserCheck,
  Search,
  Filter,
  Calendar,
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  Bell,
  X,
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

  // Filtered by search
  const filteredList = absencesList.filter((a) => {
    const student = students.find((s) => s.id === a.studentId);
    const fullName = student ? `${student.firstName} ${student.lastName}` : a.studentName || '';
    const matchesSearch = fullName.toLowerCase().includes(searchQuery.toLowerCase()) || (a.className || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClassId === 'all' || a.classId === selectedClassId;
    const matchesStatus = selectedStatus === 'all' || a.status === selectedStatus;
    const matchesDate = !selectedDate || a.date === selectedDate;
    return matchesSearch && matchesClass && matchesStatus && matchesDate;
  });

  // Calculate statistics
  const totalRecords = filteredList.length;
  const unexcusedCount = filteredList.filter((a) => a.status === 'Absent Non Justifié').length;
  const excusedCount = filteredList.filter((a) => a.status === 'Absent Justifié').length;
  const tardyCount = filteredList.filter((a) => a.status === 'Retard').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Présent':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Présent
          </span>
        );
      case 'Absent Non Justifié':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1 w-fit">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            Non Justifié
          </span>
        );
      case 'Absent Justifié':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 w-fit">
            <FileText className="w-3 h-3 text-amber-600" />
            Justifié
          </span>
        );
      case 'Retard':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3 text-sky-600" />
            Retard
          </span>
        );
      default:
        return <span className="text-slate-500">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Registre d'Assiduité & Absences</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
              Contrôle Quotidien
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Suivi des appels de classe, alertes automatiques SMS aux parents et régularisation des absences.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedClassId('all');
            setSelectedStatus('all');
            setSelectedDate('');
            setSearchQuery('');
          }}
          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors w-fit"
        >
          Réinitialiser filtres
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Total Enregistrements</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">{totalRecords}</span>
            <span className="text-xs text-slate-400">événements</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Absences Non Justifiées</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-rose-600">{unexcusedCount}</span>
            <span className="text-xs text-rose-500 font-bold">Alertes envoyées</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Absences Justifiées</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-amber-700">{excusedCount}</span>
            <span className="text-xs text-slate-400">avec motif</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Retards Notés</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-sky-700">{tardyCount}</span>
            <span className="text-xs text-slate-400">retards</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Class Select */}
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-slate-400" />
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
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
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="Absent Non Justifié">Absence Non Justifiée</option>
              <option value="Absent Justifié">Absence Justifiée</option>
              <option value="Retard">Retard</option>
              <option value="Présent">Présent</option>
            </select>
          </div>

          {/* Date Input */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher élève..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
          />
        </div>
      </div>

      {/* Attendance Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
          <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-500">Chargement des relevés d'assiduité...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <UserCheck className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Aucune absence enregistrée</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Aucun relevé d'absence ne correspond aux critères sélectionnés. Tous les élèves sont réputés présents.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Élève</th>
                  <th className="py-3 px-4">Classe</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4">Motif / Détails</th>
                  <th className="py-3 px-4 text-center">Alerte Parent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredList.map((a, idx) => {
                  const student = students.find((s) => s.id === a.studentId);

                  return (
                    <tr key={a.id || idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-600 text-[11px] whitespace-nowrap">
                        {a.date}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">
                          {student ? `${student.firstName} ${student.lastName}` : a.studentName || 'Élève'}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {student ? student.matricule : '—'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">
                          {a.className || student?.className || 'Classe'}
                        </span>
                      </td>

                      <td className="py-3 px-4">{getStatusBadge(a.status)}</td>

                      <td className="py-3 px-4 text-slate-600 text-[11px]">
                        {a.status === 'Retard' && a.minutesLate
                          ? `${a.minutesLate} minutes de retard`
                          : a.reason || 'Non précisé'}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {a.notifiedParent ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <Send className="w-3 h-3 text-emerald-600" />
                            SMS Envoyé
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
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
