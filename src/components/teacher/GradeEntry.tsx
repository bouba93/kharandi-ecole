import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Grade } from '../../types';
import { ClipboardList, CheckCircle2, Save, Calculator, Wand2 } from 'lucide-react';

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

  const generateAutoAppreciations = () => {
    const newComments: Record<string, string> = {};
    classStudents.forEach((std) => {
      const scoreNum = parseFloat(scores[std.id] || '12');
      if (scoreNum >= 16) {
        newComments[std.id] = 'Compétences parfaitement acquises. Élève très brillant.';
      } else if (scoreNum >= 14) {
        newComments[std.id] = 'Bon travail. Poursuivez vos efforts avec régularité.';
      } else if (scoreNum >= 10) {
        newComments[std.id] = 'Ensemble passable. Renforcer la rigueur dans les exercices.';
      } else {
        newComments[std.id] = 'Résultats en deçà des attentes. Révision approfondie nécessaire.';
      }
    });
    setComments(newComments);
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
      comment: comments[std.id] || 'Évaluation consignée',
    }));

    addBulkGrades(gradeList);
    setIsSaved(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block">GRILLES D'ÉVALUATION</span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Saisie des Notes par Classe
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Saisie directe des devoirs & compositions avec calcul instantané de la moyenne de classe et appréciations automatiques.
          </p>
        </div>

        <button
          onClick={generateAutoAppreciations}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-all inline-flex items-center space-x-2"
        >
          <Wand2 className="w-4 h-4 text-amber-400" />
          <span>Générer Appréciations</span>
        </button>
      </div>

      {/* Control Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Classe</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Trimestre</label>
          <select
            value={trimester}
            onChange={(e) => setTrimester(Number(e.target.value) as any)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
          >
            <option value={1}>1er Trimestre</option>
            <option value={2}>2ème Trimestre</option>
            <option value={3}>3ème Trimestre</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Type d'Évaluation</label>
          <select
            value={evaluationType}
            onChange={(e) => setEvaluationType(e.target.value as any)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
          >
            <option value="Interrogation">Interrogation Écrite</option>
            <option value="Devoir 1">Devoir Surveillé N°1</option>
            <option value="Devoir 2">Devoir Surveillé N°2</option>
            <option value="Composition">Composition Trimestrielle</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleSaveGrades}
            className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-2xs inline-flex items-center justify-center space-x-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{isSaved ? 'Notes Enregistrées !' : 'Enregistrer les Notes'}</span>
          </button>
        </div>
      </div>

      {/* Class Statistics Cards */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Moyenne de Classe</span>
          <span className="text-xl font-extrabold font-mono text-sky-600">{average} /20</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Note Maximale</span>
          <span className="text-xl font-extrabold font-mono text-emerald-600">{maxScore} /20</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Note Minimale</span>
          <span className="text-xl font-extrabold font-mono text-rose-600">{minScore} /20</span>
        </div>
      </div>

      {/* Student Spreadsheet Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Élève</th>
                <th className="py-3.5 px-4">Matricule</th>
                <th className="py-3.5 px-4 w-32">Note (/20)</th>
                <th className="py-3.5 px-4">Appréciation Pédagogique</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {classStudents.map((std) => (
                <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-extrabold text-slate-900">{std.firstName} {std.lastName}</td>
                  <td className="py-3 px-4 font-mono font-bold text-sky-600">{std.matricule}</td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      step={0.5}
                      min={0}
                      max={20}
                      value={scores[std.id] || ''}
                      onChange={(e) => handleScoreChange(std.id, e.target.value)}
                      placeholder="12.0"
                      className="w-24 text-center font-mono font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl py-1.5 focus:outline-none focus:border-sky-500"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={comments[std.id] || ''}
                      onChange={(e) =>
                        setComments((prev) => ({ ...prev, [std.id]: e.target.value }))
                      }
                      placeholder="Remarque pédagogique..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-slate-800 text-xs focus:outline-none focus:border-sky-500"
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
