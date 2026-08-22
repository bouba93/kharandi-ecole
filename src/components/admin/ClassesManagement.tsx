import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { LevelCategory } from '../../types';
import { GraduationCap, Plus, BookOpen, UserCheck, X } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Gestion des classes</h1>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600">
              {classes.length} classes
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Divisions pédagogiques, professeurs principaux et salles attribuées.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Créer une classe</span>
        </button>
      </div>

      {/* Level Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['Tous', 'Primaire', 'Collège', 'Lycée'] as const).map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedLevel === lvl
                ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-sm shadow-sky-500/20'
                : 'bg-white text-slate-600 hover:bg-sky-50 border border-slate-200'
            }`}
          >
            {lvl} {lvl !== 'Tous' && `(${classes.filter((c) => c.level === lvl).length})`}
          </button>
        ))}
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClasses.map((cls) => (
          <div
            key={cls.id}
            className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {cls.level}
                </span>

                <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  {cls.roomNumber}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{cls.name}</h3>

              <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1 mb-4">
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Prof. principal : <strong>{cls.mainTeacherName}</strong></span>
              </div>

              {/* Subjects Table */}
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Matières assignées
                </span>
                <div className="space-y-1.5 text-xs">
                  {cls.subjects.slice(0, 4).map((sub) => (
                    <div key={sub.subjectId} className="flex items-center justify-between">
                      <span className="text-slate-700 truncate">{sub.subjectName}</span>
                      <span className="font-mono text-[10px] font-semibold text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        Coeff. {sub.coefficient}
                      </span>
                    </div>
                  ))}
                  {cls.subjects.length > 4 && (
                    <p className="text-[10px] text-slate-400 pt-1">
                      +{cls.subjects.length - 4} autres matières
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Effectif de la classe :</span>
              <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                {cls.studentCount} élèves
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Créer une nouvelle classe</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nom de la classe</label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="Ex : 10ème Année B, Terminale SS 2..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Niveau scolaire</label>
                <select
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value as LevelCategory)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="Primaire">Primaire (CEE)</option>
                  <option value="Collège">Collège (BEPC)</option>
                  <option value="Lycée">Lycée (BAC)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Professeur principal</label>
                <input
                  type="text"
                  value={mainTeacherName}
                  onChange={(e) => setMainTeacherName(e.target.value)}
                  placeholder="Ex : Prof. Souleymane Camara"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Numéro de salle</label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="Ex : Salle 204"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
                >
                  Enregistrer la classe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
