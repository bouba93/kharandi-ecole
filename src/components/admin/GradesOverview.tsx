import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { gradesApi } from '../../services/api';
import {
  ClipboardList,
  Search,
  Filter,
  GraduationCap,
  Calendar,
  BookOpen,
  Award,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

export const GradesOverview: React.FC = () => {
  const { classes, students, subjects, grades: localGrades } = useSchool();
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls-10-a');
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3>(1);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [gradesList, setGradesList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load grades from API or local fallback
  const loadGrades = async () => {
    setLoading(true);
    try {
      const res = await gradesApi.getAll({
        class_id: selectedClassId,
        trimester: selectedTrimester,
        subject_id: selectedSubjectId !== 'all' ? selectedSubjectId : undefined,
      });
      if (res.success && res.grades) {
        setGradesList(res.grades);
      } else {
        // Fallback filter from context
        const filtered = localGrades.filter(
          (g) =>
            (selectedTrimester ? g.trimester === selectedTrimester : true) &&
            (selectedSubjectId !== 'all' ? g.subjectId === selectedSubjectId : true)
        );
        setGradesList(filtered);
      }
    } catch {
      // Local fallback
      const filtered = localGrades.filter(
        (g) =>
          (selectedTrimester ? g.trimester === selectedTrimester : true) &&
          (selectedSubjectId !== 'all' ? g.subjectId === selectedSubjectId : true)
      );
      setGradesList(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrades();
  }, [selectedClassId, selectedTrimester, selectedSubjectId]);

  const currentClass = classes.find((c) => c.id === selectedClassId);
  const classStudents = students.filter((s) => s.classId === selectedClassId);

  // Filter by search
  const filteredGrades = gradesList.filter((g) => {
    const student = students.find((s) => s.id === g.studentId);
    const fullName = student ? `${student.firstName} ${student.lastName}` : g.studentName || '';
    return fullName.toLowerCase().includes(searchQuery.toLowerCase()) || g.subjectName?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Calculate statistics
  const totalScores = gradesList.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0);
  const classAverage = gradesList.length > 0 ? (totalScores / gradesList.length).toFixed(2) : '—';
  const highestScore = gradesList.length > 0 ? Math.max(...gradesList.map((g) => Number(g.score) || 0)) : '—';
  const lowestScore = gradesList.length > 0 ? Math.min(...gradesList.map((g) => Number(g.score) || 0)) : '—';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Registre des Notes & Évaluations</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Trimestre {selectedTrimester}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Revue académique centralisée des interrogations, devoirs et compositions par classe.
          </p>
        </div>

        {/* Trimester Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          {([1, 2, 3] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTrimester(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedTrimester === t
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1er Trimestre
              {t === 1 ? ' (En cours)' : t === 2 ? '2e Trimestre' : '3e Trimestre'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Moyenne Générale</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">{classAverage}</span>
            <span className="text-xs font-bold text-slate-400">/ 20</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Total Évaluations Saisies</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-sky-700">{gradesList.length}</span>
            <span className="text-xs text-slate-400">notes enregistrées</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Note la plus élevée</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-600">{highestScore}</span>
            <span className="text-xs font-bold text-slate-400">/ 20</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Effectif de la classe</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">{classStudents.length}</span>
            <span className="text-xs text-slate-400">élèves</span>
          </div>
        </div>
      </div>

      {/* Class & Subject Filter Bar */}
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
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.level})
                </option>
              ))}
            </select>
          </div>

          {/* Subject Select */}
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">Toutes les matières</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (Coef {s.coefficient})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search inside table */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrer par élève ou matière..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
          />
        </div>
      </div>

      {/* Grades Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
          <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-500">Chargement du relevé des notes...</p>
        </div>
      ) : filteredGrades.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <ClipboardList className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Aucune note enregistrée</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Aucune note n'a été saisie pour la classe <strong>{currentClass?.name}</strong> pour ce trimestre et cette matière.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Élève</th>
                  <th className="py-3 px-4">Matricule</th>
                  <th className="py-3 px-4">Matière</th>
                  <th className="py-3 px-4">Type d'évaluation</th>
                  <th className="py-3 px-4">Coefficient</th>
                  <th className="py-3 px-4 text-center">Note / 20</th>
                  <th className="py-3 px-4">Appréciation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredGrades.map((g, idx) => {
                  const student = students.find((s) => s.id === g.studentId);
                  const score = Number(g.score) || 0;
                  const isHigh = score >= 14;
                  const isLow = score < 10;

                  return (
                    <tr key={g.id || idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {student ? `${student.firstName} ${student.lastName}` : g.studentName || 'Élève'}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                        {student ? student.matricule : '—'}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">{g.subjectName}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {g.type}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-600 font-mono">
                        Coef {g.coefficient || 2}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg font-black text-xs ${
                            isHigh
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isLow
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-800 border border-slate-200'
                          }`}
                        >
                          {score.toFixed(1)} / 20
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {g.comment || (score >= 14 ? 'Très bon travail' : score >= 10 ? 'Travail convenable' : 'Doit progresser')}
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
