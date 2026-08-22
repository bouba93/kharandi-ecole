import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { schoolsApi } from '../../services/api';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Building,
  School,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const SchoolSettings: React.FC = () => {
  const { schoolInfo, updateSchoolInfo } = useSchool();
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: schoolInfo.name || 'Groupe Scolaire Kharandi',
    subtext: schoolInfo.subtext || 'Excellence & Discipline',
    address: schoolInfo.address || 'Commune de Ratoma, Conakry',
    phone: schoolInfo.phone || '+224 622 12 34 56',
    email: schoolInfo.email || 'direction@kharandi-gn.org',
    dpe: schoolInfo.dpe || 'DCE Ratoma • Inspection Régionale',
    ministere: schoolInfo.ministere || "Ministère de l'Éducation Nationale",
    schoolYear: schoolInfo.schoolYear || '2025-2026',
    currentTrimester: schoolInfo.currentTrimester || 1,
    logoUrl: schoolInfo.logoUrl || '',
    directorName: schoolInfo.directorName || 'Dr. Mamadou Cellou Diallo',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      updateSchoolInfo(formData);
      await schoolsApi.update('sch-gn-001', formData);
      setSuccessMsg("L'identité de l'établissement et la plateforme ont été enregistrées avec succès.");
    } catch (err: any) {
      setErrorMsg(err.message || 'Impossible de mettre à jour les paramètres.');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm relative overflow-hidden">
        <div className="h-1.5 w-full absolute top-0 left-0 flex">
          <div className="w-1/3 bg-gn-red"></div>
          <div className="w-1/3 bg-gn-yellow"></div>
          <div className="w-1/3 bg-gn-green"></div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
                <School className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">Identité & Configuration de l'École</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Personnalisez les coordonnées officielles, l'année scolaire et les informations administratives.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 self-start sm:self-auto">
            Direction Générale
          </span>
        </div>
      </div>

      {/* Success / Error Alerts */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm space-y-6">
        {/* Section 1: School Identity */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="w-4 h-4 text-sky-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Coordonnées Officielles & Marque de l'Établissement
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Nom officiel de l'école (Affiché en haut de la plateforme et sur les bulletins) *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 font-bold text-sm"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Devise / Slogan de l'école
              </label>
              <input
                type="text"
                value={formData.subtext}
                onChange={(e) => setFormData({ ...formData, subtext: e.target.value })}
                placeholder="Ex: Discipline — Travail — Succès"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nom du Chef d'Établissement / Directeur
              </label>
              <input
                type="text"
                value={formData.directorName}
                onChange={(e) => setFormData({ ...formData, directorName: e.target.value })}
                placeholder="Ex: M. Ousmane Diallo"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Téléphone officiel
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-sky-500 font-mono font-medium"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Email officiel
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Adresse géographique & Commune
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Ministry & Academic Year */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            <h2 className="text-sm font-bold text-slate-900">
              Tutelle Administrative & Paramètres Académiques
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Direction Préfectorale / Communale (DPE / DCE)
              </label>
              <input
                type="text"
                value={formData.dpe}
                onChange={(e) => setFormData({ ...formData, dpe: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Ministère de tutelle
              </label>
              <input
                type="text"
                value={formData.ministere}
                onChange={(e) => setFormData({ ...formData, ministere: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Année scolaire en cours
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.schoolYear}
                  onChange={(e) => setFormData({ ...formData, schoolYear: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-sky-500 font-mono font-bold"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Trimestre actif de saisie
              </label>
              <select
                value={formData.currentTrimester}
                onChange={(e) => setFormData({ ...formData, currentTrimester: Number(e.target.value) as 1 | 2 | 3 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-sky-500 font-bold"
              >
                <option value={1}>1er Trimestre (En cours)</option>
                <option value={2}>2ème Trimestre</option>
                <option value={3}>3ème Trimestre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="bg-gradient-to-r from-sky-50 to-orange-50/40 p-4 rounded-xl border border-sky-100 space-y-2">
          <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block">
            Aperçu de l'en-tête de votre établissement :
          </span>
          <div className="bg-white p-3.5 rounded-xl border border-sky-100 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black text-sm shadow-xs">
                {formData.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{formData.name}</p>
                <p className="text-[11px] text-slate-500">{formData.subtext} • {formData.dpe}</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-orange-50 text-orange-600 border border-orange-200 px-2.5 py-1 rounded-lg">
              {formData.schoolYear}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm shadow-sky-500/20"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Enregistrement en cours...' : 'Enregistrer les modifications'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

