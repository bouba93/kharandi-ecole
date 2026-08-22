import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { teachersApi } from '../../services/api';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  BookOpen,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  Filter,
} from 'lucide-react';

interface TeacherFormData {
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  classIds: string[];
  role: 'teacher' | 'head_teacher';
}

const INITIAL_FORM: TeacherFormData = {
  name: '',
  email: '',
  phone: '',
  subjects: [],
  classIds: [],
  role: 'teacher',
};

const AVAILABLE_SUBJECTS = [
  'Mathématiques',
  'Physique - Chimie',
  'Biologie & SVT',
  'Français & Littérature',
  'Histoire - Géographie',
  'Anglais',
  'Philosophie',
  'Informatique & TIC',
  'Éducation Civique',
  'Arabe',
  'Éducation Physique (EPS)',
];

export const TeachersManagement: React.FC = () => {
  const { classes } = useSchool();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any | null>(null);
  const [deletingTeacher, setDeletingTeacher] = useState<any | null>(null);
  const [formData, setFormData] = useState<TeacherFormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Bulk selection
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<string[]>([]);

  const loadTeachers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await teachersApi.getAll({
        subject: subjectFilter !== 'all' ? subjectFilter : undefined,
        search: searchQuery.trim() || undefined,
      });
      if (res.success && res.teachers) {
        setTeachers(res.teachers);
      } else {
        setTeachers([]);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des enseignants.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, [subjectFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadTeachers();
  };

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setFormData(INITIAL_FORM);
    setShowAddModal(true);
  };

  const handleOpenEdit = (teacher: any) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name || '',
      email: teacher.email || '',
      phone: teacher.phone || '',
      subjects: teacher.subjects || [],
      classIds: teacher.classIds || [],
      role: teacher.role || 'teacher',
    });
    setShowAddModal(true);
  };

  const handleToggleSubject = (subj: string) => {
    if (formData.subjects.includes(subj)) {
      setFormData({
        ...formData,
        subjects: formData.subjects.filter((s) => s !== subj),
      });
    } else {
      setFormData({
        ...formData,
        subjects: [...formData.subjects, subj],
      });
    }
  };

  const handleToggleClass = (classId: string) => {
    if (formData.classIds.includes(classId)) {
      setFormData({
        ...formData,
        classIds: formData.classIds.filter((id) => id !== classId),
      });
    } else {
      setFormData({
        ...formData,
        classIds: [...formData.classIds, classId],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      if (editingTeacher) {
        await teachersApi.update(editingTeacher.id, formData);
        setActionSuccess(`L'enseignant ${formData.name} a été mis à jour.`);
      } else {
        await teachersApi.create({
          ...formData,
          schoolId: 'sch-gn-001',
        });
        setActionSuccess(`L'enseignant ${formData.name} a été enregistré.`);
      }
      setShowAddModal(false);
      setFormData(INITIAL_FORM);
      setEditingTeacher(null);
      await loadTeachers();
    } catch (err: any) {
      setError(err.message || "Impossible d'enregistrer l'enseignant.");
    } finally {
      setSubmitting(false);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTeacher) return;
    setSubmitting(true);
    try {
      await teachersApi.delete(deletingTeacher.id);
      setActionSuccess(`L'enseignant ${deletingTeacher.name} a été supprimé.`);
      setDeletingTeacher(null);
      await loadTeachers();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression de l'enseignant.");
    } finally {
      setSubmitting(false);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  const toggleSelectTeacher = (id: string) => {
    if (selectedTeacherIds.includes(id)) {
      setSelectedTeacherIds(selectedTeacherIds.filter((tId) => tId !== id));
    } else {
      setSelectedTeacherIds([...selectedTeacherIds, id]);
    }
  };

  const selectAll = () => {
    if (selectedTeacherIds.length === teachers.length) {
      setSelectedTeacherIds([]);
    } else {
      setSelectedTeacherIds(teachers.map((t) => t.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Corps enseignant</h1>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600">
              {teachers.length} enseignant{teachers.length > 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Matières enseignées, coordonnées et classes assignées.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un enseignant</span>
        </button>
      </div>

      {/* Alerts */}
      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-medium flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500 text-slate-800"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Toutes les disciplines</option>
            {AVAILABLE_SUBJECTS.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Teachers Table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
          Chargement des enseignants...
        </div>
      ) : teachers.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
          Aucun enseignant trouvé.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                  <th className="py-3 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedTeacherIds.length === teachers.length && teachers.length > 0}
                      onChange={selectAll}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </th>
                  <th className="py-3 px-4">Enseignant</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Matières</th>
                  <th className="py-3 px-4">Classes assignées</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {teachers.map((t) => {
                  const isSelected = selectedTeacherIds.includes(t.id);
                  return (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectTeacher(t.id)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {t.name ? t.name.replace('Prof.', '').replace('M.', '').trim().slice(0, 2) : 'PR'}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900">{t.name}</span>
                            {t.role === 'head_teacher' && (
                              <span className="ml-1.5 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                Principal
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        <div>{t.phone || '—'}</div>
                        <div className="text-[11px] text-slate-400">{t.email}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {t.subjects && t.subjects.length > 0 ? (
                            t.subjects.map((subj: string, idx: number) => (
                              <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700">
                                {subj}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 italic">Non spécifié</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {t.classIds && t.classIds.length > 0 ? (
                            t.classIds.map((cId: string, idx: number) => {
                              const cls = classes.find((c) => c.id === cId);
                              return (
                                <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                                  {cls ? cls.name : cId}
                                </span>
                              );
                            })
                          ) : (
                            <span className="text-slate-400 italic">Aucune</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingTeacher(t)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingTeacher ? "Modifier l'enseignant" : "Ajouter un enseignant"}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nom complet</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex : M. Fodé Camara"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+224 620 00 00 00"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="prof@kharandi.gn"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Disciplines */}
              <div>
                <label className="block font-medium text-slate-700 mb-1.5">Matières enseignées</label>
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  {AVAILABLE_SUBJECTS.map((subj) => (
                    <label key={subj} className="flex items-center gap-1.5 cursor-pointer text-slate-700 text-[11px]">
                      <input
                        type="checkbox"
                        checked={formData.subjects.includes(subj)}
                        onChange={() => handleToggleSubject(subj)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{subj}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Classes */}
              <div>
                <label className="block font-medium text-slate-700 mb-1.5">Classes assignées</label>
                <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  {classes.map((cls) => (
                    <label key={cls.id} className="flex items-center gap-1.5 cursor-pointer text-slate-700 text-[11px]">
                      <input
                        type="checkbox"
                        checked={formData.classIds.includes(cls.id)}
                        onChange={() => handleToggleClass(cls.id)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{cls.name}</span>
                    </label>
                  ))}
                </div>
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
                  disabled={submitting}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
                >
                  {submitting ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-sm w-full p-6">
            <h3 className="font-bold text-slate-900 text-sm mb-2">Confirmer la suppression</h3>
            <p className="text-xs text-slate-600 mb-4">
              Voulez-vous vraiment retirer l'enseignant <strong>{deletingTeacher.name}</strong> ?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeletingTeacher(null)}
                className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
              >
                {submitting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
