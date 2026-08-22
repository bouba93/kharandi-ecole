import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { gradesApi } from '../../services/api';
import {
  ClipboardList,
  Search,
  GraduationCap,
  BookOpen,
} from 'lucide-react';

export const GradesOverview: React.FC = () => {
  const { classes, students, subjects, grades: localGrades } = useSchool();
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls-10-a');
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3>(1);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [gradesList, setGradesList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

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
        const filtered = localGrades.filter(
          (g) =>
            (selectedTrimester ? g.trimester === selectedTrimester : true) &&
            (selectedSubjectId !== 'all' ? g.subjectId === selectedSubjectId : true)
        );
        setGradesList(filtered);
      }
    } catch {
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

  const filteredGrades = gradesList.filter((g) => {
    const student = students.find((s) => s.id === g.studentId);
    const fullName = student ? `${student.firstName} ${student.lastName}` : g.studentName || '';
    return fullName.toLowerCase().includes(searchQuery.toLowerCase()) || g.subjectName?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalScores = gradesList.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0);
  const classAverage = gradesList.length > 0 ? (totalScores / gradesList.length).toFixed(2) : '—';
  const highestScore = gradesList.length > 0 ? Math.max(...gradesList.map((g) => Number(g.score) || 0)) : '—';
  const lowestScore = gradesList.length > 0 ? Math.min(...gradesList.map((g) => Number(g.score) || 0)) : '—';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Notes & Évaluations</h1>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600">
              Trimestre {selectedTrimester}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Consultation des devoirs, compositions et moyennes par classe.
          </p>
        </div>

        {/* Trimester Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {([1, 2, 3] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTrimester(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                selectedTrimester === t
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Trimestre {t}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Moyenne de classe</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-slate-900">{classAverage}</span>
            <span className="text-xs text-slate-400">/20</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Notes saisies</p>
          <div className="mt-1">
            <span className="text-2xl font-bold text-slate-900">{gradesList.length}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Note maximale</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-emerald-600">{highestScore}</span>
            <span className="text-xs text-slate-400">/20</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Effectif classe</p>
          <div className="mt-1">
            <span className="text-2xl font-bold text-slate-900">{classStudents.length}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
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
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.level})
                </option>
              ))}
            </select>
          </div>

          {/* Subject Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Matière :</span>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Toutes les matières</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (Coeff. {s.coefficient})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrer par nom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500 text-slate-800"
          />
        </div>
      </div>

      {/* Grades Table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
          Chargement des notes...
        </div>
      ) : filteredGrades.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
          Aucune note enregistrée pour {currentClass?.name}.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                  <th className="py-3 px-4">Élève</th>
                  <th className="py-3 px-4">Matricule</th>
                  <th className="py-3 px-4">Matière</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Coefficient</th>
                  <th className="py-3 px-4 text-center">Note</th>
                  <th className="py-3 px-4">Appréciation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredGrades.map((g, idx) => {
                  const student = students.find((s) => s.id === g.studentId);
                  const score = Number(g.score) || 0;
                  const isHigh = score >= 14;
                  const isLow = score < 10;

                  return (
                    <tr key={g.id || idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {student ? `${student.firstName} ${student.lastName}` : g.studentName || 'Élève'}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                        {student ? student.matricule : '—'}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800">{g.subjectName}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700">
                          {g.type}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-600 font-mono">
                        {g.coefficient || 2}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded font-bold text-xs ${
                            isHigh
                              ? 'bg-emerald-50 text-emerald-700'
                              : isLow
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {score.toFixed(1)} / 20
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {g.comment || (score >= 14 ? 'Très bon travail' : score >= 10 ? 'Travail convenable' : 'À approfondir')}
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
