import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { LevelCategory, SchoolClass } from '../../types';
import { GraduationCap, Plus, BookOpen, UserCheck, Layers, Award, Edit2, CheckCircle } from 'lucide-react';

export const ClassesManagement: React.FC = () => {
  const { classes, subjects, addClass } = useSchool();
  const [selectedLevel, setSelectedLevel] = useState<LevelCategory | 'Tous'>('Tous');

  const [showAddModal, setShowAddModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newLevel, setNewLevel] = useState<LevelCategory>('Lycée');
  const [mainTeacherName, setMainTeacherName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');

  const filteredClasses = selectedLevel === 'Tous'
    ? classes
    : classes.filter((c) => c.level === selectedLevel);

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    // Get default subjects for level
    const levelSubjects = subjects
      .filter((s) => s.category === newLevel)
      .map((s) => ({
        subjectId: s.id,
        subjectName: s.name,
        coefficient: s.coefficient,
        teacherName: mainTeacherName || 'Enseignant Titulaire',
      }));

    addClass({
      name: newClassName,
      level: newLevel,
      mainTeacherId: `tch-${Date.now()}`,
      mainTeacherName: mainTeacherName || 'Prof. Souleymane Camara',
      roomNumber: roomNumber || 'Salle 101',
      subjects: levelSubjects,
    });

    setNewClassName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block">ORGANISATION PÉDAGOGIQUE</span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Gestion des Classes, Niveaux & Coefficients
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Structure des établissements Guinéens : Primaire (CEE), Collège (BEPC), Lycée (BAC SM/SS/SE).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all inline-flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Créer une Classe</span>
        </button>
      </div>

      {/* Level Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        {(['Tous', 'Primaire', 'Collège', 'Lycée'] as const).map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedLevel === lvl
                ? 'bg-slate-900 text-white shadow'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {lvl} {lvl !== 'Tous' && `(${classes.filter((c) => c.level === lvl).length})`}
          </button>
        ))}
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => (
          <div
            key={cls.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  cls.level === 'Primaire'
                    ? 'bg-amber-100 text-amber-800'
                    : cls.level === 'Collège'
                    ? 'bg-cyan-100 text-cyan-800'
                    : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {cls.level}
                </span>

                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {cls.roomNumber}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 mb-1">{cls.name}</h3>

              <div className="flex items-center text-xs text-slate-600 mb-4 space-x-2">
                <UserCheck className="w-3.5 h-3.5 text-[#18bfd6]" />
                <span className="font-semibold">{cls.mainTeacherName}</span>
              </div>

              {/* Subjects & Coefficients Table */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">
                  Matières & Coefficients Assignés
                </span>
                <div className="space-y-1.5 text-xs">
                  {cls.subjects.map((sub) => (
                    <div key={sub.subjectId} className="flex items-center justify-between">
                      <span className="text-slate-700 font-medium truncate max-w-[170px]">{sub.subjectName}</span>
                      <span className="font-mono font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">
                        Coeff. {sub.coefficient}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Effectif inscrit :</span>
              <span className="font-bold font-mono text-slate-900 bg-cyan-50 text-[#18bfd6] px-2 py-0.5 rounded-lg">
                {cls.studentCount} Élèves
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="font-bold text-slate-900 text-base mb-4">Créer une Nouvelle Classe</h3>

            <form onSubmit={handleCreateClass} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nom de la Classe</label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="Ex : 10ème Année B, Terminale SS 2..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#18bfd6]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Niveau Scolaire</label>
                <select
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value as LevelCategory)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#18bfd6]"
                >
                  <option value="Primaire">Primaire (CEE)</option>
                  <option value="Collège">Collège (BEPC)</option>
                  <option value="Lycée">Lycée (BAC)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Professeur Principal</label>
                <input
                  type="text"
                  value={mainTeacherName}
                  onChange={(e) => setMainTeacherName(e.target.value)}
                  placeholder="Ex : Prof. Souleymane Camara"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#18bfd6]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Numéro de Salle</label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="Ex : Salle 204"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#18bfd6]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#18bfd6] hover:bg-[#15aabf] text-white font-bold rounded-xl shadow-sm"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
