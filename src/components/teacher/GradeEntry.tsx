import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Grade } from '../../types';
import { Save, CheckCircle2 } from 'lucide-react';

export const GradeEntry: React.FC = () => {
  const { classes, students, addBulkGrades } = useSchool();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('sub-math-sm');
  const [trimester, setTrimester] = useState<1 | 2 | 3>(1);
  const [evaluationType, setEvaluationType] = useState<'Interrogation' | 'Devoir 1' | 'Devoir 2' | 'Composition'>('Devoir 1');

  const classStudents = students.filter((s) => s.classId === selectedClassId);

  // Scores state: studentId -> score string
  const [scores, setScores] = useState<Record<string, string>>({
    'std-001': '17.5',
    'std-002': '14',
    'std-003': '19',
    'std-004': '11.5',
    'std-006': '16',
  });

  const [comments, setComments] = useState<Record<string, string>>({});
  const [isSaved, setIsSaved] = useState(false);

  // Calculate statistics
  const numericScores = (Object.values(scores) as string[])
    .map((v) => parseFloat(v))
    .filter((n) => !isNaN(n));

  const average = numericScores.length > 0 ? (numericScores.reduce((a, b) => a + b, 0) / numericScores.length).toFixed(2) : '0.00';
  const maxScore = numericScores.length > 0 ? Math.max(...numericScores).toFixed(1) : '0.0';
  const minScore = numericScores.length > 0 ? Math.min(...numericScores).toFixed(1) : '0.0';

  const handleScoreChange = (stdId: string, val: string) => {
    setScores((prev) => ({ ...prev, [stdId]: val }));
    setIsSaved(false);
  };

  const handleCommentChange = (stdId: string, val: string) => {
    setComments((prev) => ({ ...prev, [stdId]: val }));
    setIsSaved(false);
  };

  const handleSaveGrades = () => {
    const gradeList: Omit<Grade, 'id'>[] = classStudents.map((std) => ({
      studentId: std.id,
      subjectId: selectedSubjectId,
      subjectName: 'Mathématiques & Sciences',
      trimester,
      type: evaluationType,
      score: parseFloat(scores[std.id] || '10'),
      maxScore: 20,
      date: new Date().toISOString().split('T')[0],
      coefficient: 4,
      comment: comments[std.id] || 'Évaluation enregistrée',
    }));

    addBulkGrades(gradeList);
    setIsSaved(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Saisie des notes</h1>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600">
              Trimestre {trimester}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Saisie directe des devoirs et compositions avec calcul automatique de la moyenne.
          </p>
        </div>

        <button
          onClick={handleSaveGrades}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Notes enregistrées' : 'Enregistrer les notes'}</span>
        </button>
      </div>

      {/* Control Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block text-slate-500 font-medium mb-1">Classe</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500 font-semibold"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.studentCount} élèves)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-500 font-medium mb-1">Trimestre</label>
          <select
            value={trimester}
            onChange={(e) => setTrimester(Number(e.target.value) as 1 | 2 | 3)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
          >
            <option value={1}>1er Trimestre</option>
            <option value={2}>2ème Trimestre</option>
            <option value={3}>3ème Trimestre</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-500 font-medium mb-1">Matière</label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
          >
            <option value="sub-math-sm">Mathématiques (Coeff. 4)</option>
            <option value="sub-phys-sm">Physique - Chimie (Coeff. 3)</option>
            <option value="sub-fra-sm">Français (Coeff. 3)</option>
            <option value="sub-ang-sm">Anglais (Coeff. 2)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-500 font-medium mb-1">Type d'évaluation</label>
          <select
            value={evaluationType}
            onChange={(e) => setEvaluationType(e.target.value as any)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
          >
            <option value="Devoir 1">Devoir sur table 1</option>
            <option value="Devoir 2">Devoir sur table 2</option>
            <option value="Interrogation">Interrogation écrite</option>
            <option value="Composition">Composition Trimestrielle</option>
          </select>
        </div>
      </div>

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 font-medium block">Moyenne du groupe</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-slate-900">{average}</span>
            <span className="text-xs text-slate-400">/20</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 font-medium block">Note maximale</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-emerald-600">{maxScore}</span>
            <span className="text-xs text-slate-400">/20</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 font-medium block">Note minimale</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-rose-600">{minScore}</span>
            <span className="text-xs text-slate-400">/20</span>
          </div>
        </div>
      </div>

      {/* Grade Entry Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Élève</th>
                <th className="py-3 px-4">Matricule</th>
                <th className="py-3 px-4 w-36">Note (/ 20)</th>
                <th className="py-3 px-4">Appréciation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {classStudents.map((std) => (
                <tr key={std.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {std.firstName} {std.lastName}
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                    {std.matricule}
                  </td>

                  <td className="py-3 px-4">
                    <input
                      type="number"
                      min={0}
                      max={20}
                      step={0.5}
                      value={scores[std.id] || ''}
                      onChange={(e) => handleScoreChange(std.id, e.target.value)}
                      placeholder="0.0"
                      className="w-24 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-none focus:border-emerald-500 text-center font-mono"
                    />
                  </td>

                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={comments[std.id] || ''}
                      onChange={(e) => handleCommentChange(std.id, e.target.value)}
                      placeholder="Observation..."
                      className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
