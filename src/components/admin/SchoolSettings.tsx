import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { schoolsApi } from '../../services/api';
import {
  Building2,
  Save,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Layers,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const SchoolSettings: React.FC = () => {
  const { schoolInfo } = useSchool();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: schoolInfo.name || '',
    subtext: schoolInfo.subtext || '',
    address: schoolInfo.address || '',
    phone: schoolInfo.phone || '',
    email: schoolInfo.email || '',
    dpe: schoolInfo.dpe || '',
    ministere: schoolInfo.ministere || '',
    schoolYear: schoolInfo.schoolYear || '2025-2026',
    currentTrimester: schoolInfo.currentTrimester || 1,
  });

  const loadSchoolData = async () => {
    setLoading(true);
    try {
      const res = await schoolsApi.getById('sch-gn-001');
      if (res.success && res.school) {
        setFormData({
          name: res.school.name || '',
          subtext: res.school.subtext || '',
          address: res.school.address || '',
          phone: res.school.phone || '',
          email: res.school.email || '',
          dpe: res.school.dpe || '',
          ministere: res.school.ministere || '',
          schoolYear: res.school.schoolYear || '2025-2026',
          currentTrimester: res.school.currentTrimester || 1,
        });
      }
    } catch {
      // Fallback already initialized with schoolInfo
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchoolData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await schoolsApi.update('sch-gn-001', formData);
      setSuccessMsg('Les paramètres de votre établissement ont été enregistrés avec succès.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Impossible de mettre à jour les paramètres.');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-slate-900">Paramètres de l'Établissement</h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            Configuration Générale
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Informations administratives de l'école, affiliation ministérielle (MEPU-A) et période académique active.
        </p>
      </div>

      {/* Success / Error Alerts */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Settings Form */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Identity Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Identité de l'École
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nom officiel de l'établissement <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sous-titre / Cycles d'enseignement
                </label>
                <input
                  type="text"
                  value={formData.subtext}
                  onChange={(e) => setFormData({ ...formData, subtext: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  placeholder="Ex: Maternelle - Primaire - Collège - Lycée"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Adresse physique & Localisation
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                placeholder="Ex: Kipé Centre Émetteur, Commune de Ratoma, Conakry"
              />
            </div>
          </div>

          {/* Affiliation Section */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Affiliation Administrative (Guinée)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Direction Préfectorale / Communale de l'Éducation (DPE/DCE)
                </label>
                <input
                  type="text"
                  value={formData.dpe}
                  onChange={(e) => setFormData({ ...formData, dpe: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ministère de tutelle
                </label>
                <input
                  type="text"
                  value={formData.ministere}
                  onChange={(e) => setFormData({ ...formData, ministere: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Coordonnées de Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Téléphone(s) du secrétariat
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Adresse Email officielle
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Academic Calendar */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Année Scolaire & Période Active
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Année Scolaire en cours
                </label>
                <input
                  type="text"
                  value={formData.schoolYear}
                  onChange={(e) => setFormData({ ...formData, schoolYear: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Trimestre actif pour les évaluations
                </label>
                <select
                  value={formData.currentTrimester}
                  onChange={(e) =>
                    setFormData({ ...formData, currentTrimester: Number(e.target.value) as any })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value={1}>1er Trimestre (En cours)</option>
                  <option value={2}>2ème Trimestre</option>
                  <option value={3}>3ème Trimestre (Fin d'année)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={loadSchoolData}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Réinitialiser</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <Save className="w-4 h-4 text-sky-400" />
              <span>{saving ? 'Enregistrement...' : 'Sauvegarder les modifications'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
