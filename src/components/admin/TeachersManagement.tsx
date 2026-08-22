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
  GraduationCap,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  Shield,
  Layers,
  ChevronRight,
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
  const [formSubjectInput, setFormSubjectInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Bulk selection
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<string[]>([]);

  // Load teachers from backend
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
        // Update teacher (POST /api/v1/ecole/teachers/{id})
        await teachersApi.update(editingTeacher.id, formData);
        setActionSuccess(`L'enseignant ${formData.name} a été mis à jour avec succès.`);
      } else {
        // Create teacher (POST /api/v1/ecole/teachers)
        await teachersApi.create({
          ...formData,
          schoolId: 'sch-gn-001',
        });
        setActionSuccess(`L'enseignant ${formData.name} a été enregistré avec succès.`);
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
      setActionSuccess(`L'enseignant ${deletingTeacher.name} a été retiré de l'établissement.`);
      setDeletingTeacher(null);
      await loadTeachers();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression de l'enseignant.");
    } finally {
      setSubmitting(false);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTeacherIds.length === 0) return;
    if (!window.confirm(`Confirmer la suppression de ${selectedTeacherIds.length} enseignant(s) ?`)) return;

    setSubmitting(true);
    try {
      await teachersApi.deleteMany(selectedTeacherIds);
      setActionSuccess(`${selectedTeacherIds.length} enseignant(s) ont été supprimés avec succès.`);
      setSelectedTeacherIds([]);
      await loadTeachers();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression groupée.');
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
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Corps Enseignant</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
              {teachers.length} Enseignant{teachers.length > 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestion du personnel pédagogique, des disciplines enseignées et des affectations de classes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedTeacherIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={submitting}
              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Supprimer ({selectedTeacherIds.length})</span>
            </button>
          )}
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-sky-400" />
            <span>Ajouter un enseignant</span>
          </button>
        </div>
      </div>

      {/* Success / Error Alerts */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium flex items-center justify-between gap-2">
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
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-800"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full md:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">Toutes les disciplines</option>
              {AVAILABLE_SUBJECTS.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={loadTeachers}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            Actualiser
          </button>
        </div>
      </div>

      {/* Teachers List / Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
          <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-500">Chargement de la liste des enseignants...</p>
        </div>
      ) : teachers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Aucun enseignant trouvé</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            {searchQuery || subjectFilter !== 'all'
              ? 'Aucun résultat ne correspond à vos critères de recherche.'
              : 'Commencez par ajouter les premiers professeurs de votre établissement.'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" />
            <span>Ajouter un enseignant</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedTeacherIds.length === teachers.length && teachers.length > 0
                      }
                      onChange={selectAll}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                  </th>
                  <th className="py-3 px-4">Enseignant</th>
                  <th className="py-3 px-4">Coordonnées</th>
                  <th className="py-3 px-4">Matières Enseignées</th>
                  <th className="py-3 px-4">Classes Assignées</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {teachers.map((t) => {
                  const isSelected = selectedTeacherIds.includes(t.id);
                  return (
                    <tr
                      key={t.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isSelected ? 'bg-sky-50/40' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectTeacher(t.id)}
                          className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {t.name
                              ? t.name
                                  .replace('Prof.', '')
                                  .replace('M.', '')
                                  .replace('Mme', '')
                                  .trim()
                                  .slice(0, 2)
                              : 'PR'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{t.name}</span>
                              {t.role === 'head_teacher' && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                  Prof. Principal
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">ID: {t.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 space-y-1">
                        {t.phone && (
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{t.phone}</span>
                          </div>
                        )}
                        {t.email && (
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate max-w-[180px]">{t.email}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {t.subjects && t.subjects.length > 0 ? (
                            t.subjects.map((subj: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                              >
                                {subj}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">Non spécifié</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {t.classIds && t.classIds.length > 0 ? (
                            t.classIds.map((cid: string) => {
                              const foundClass = classes.find((c) => c.id === cid);
                              return (
                                <span
                                  key={cid}
                                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sky-50 text-sky-800 border border-sky-200"
                                >
                                  {foundClass ? foundClass.name : cid}
                                </span>
                              );
                            })
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">Aucune classe assignée</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(t)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Modifier l'enseignant"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingTeacher(t)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Retirer l'enseignant"
                          >
                            <Trash2 className="w-4 h-4" />
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
      )}

      {/* Add / Edit Teacher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {editingTeacher ? "Modifier l'enseignant" : 'Ajouter un nouvel enseignant'}
                </h3>
                <p className="text-xs text-slate-400">
                  {editingTeacher
                    ? 'Actualiser les coordonnées et matières assignées.'
                    : 'Enregistrer un nouveau professeur dans le registre officiel.'}
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nom complet / Titre officiel <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Prof. Oumar Telly Diallo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>

              {/* Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Numéro de téléphone
                  </label>
                  <input
                    type="tel"
                    placeholder="+224 62X XX XX XX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Adresse Email professionnelle
                  </label>
                  <input
                    type="email"
                    placeholder="enseignant@kharandi.gn"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Rôle pédagogique
                </label>
                <select
                  value={formData.role}
                  onChange={(e: any) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="teacher">Enseignant titulaire / vacataire</option>
                  <option value="head_teacher">Professeur Principal de promotion</option>
                </select>
              </div>

              {/* Subjects Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Disciplines enseignées
                </label>
                <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 border border-slate-200 rounded-xl max-h-32 overflow-y-auto">
                  {AVAILABLE_SUBJECTS.map((subj) => {
                    const isChecked = formData.subjects.includes(subj);
                    return (
                      <button
                        type="button"
                        key={subj}
                        onClick={() => handleToggleSubject(subj)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          isChecked
                            ? 'bg-sky-600 text-white shadow-2xs font-semibold'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {subj}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Classes Assignment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Classes assignées
                </label>
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl max-h-36 overflow-y-auto">
                  {classes.map((cls) => {
                    const isChecked = formData.classIds.includes(cls.id);
                    return (
                      <button
                        type="button"
                        key={cls.id}
                        onClick={() => handleToggleClass(cls.id)}
                        className={`p-2 rounded-lg text-left text-xs transition-all border ${
                          isChecked
                            ? 'bg-slate-900 text-white border-slate-900 font-bold'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="truncate">{cls.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{cls.level}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                >
                  {submitting ? 'Enregistrement...' : editingTeacher ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">Confirmer la suppression</h3>
              <p className="text-xs text-slate-500 mt-1">
                Êtes-vous sûr de vouloir retirer <strong className="text-slate-800">{deletingTeacher.name}</strong> du registre des enseignants ? Cette action est irréversible.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingTeacher(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                {submitting ? 'Suppression...' : 'Supprimer définitivement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
