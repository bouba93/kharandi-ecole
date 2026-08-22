import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { badgesApi, parentApi } from '../../services/api';
import {
  Award,
  Plus,
  Trash2,
  QrCode,
  CheckCircle2,
  AlertCircle,
  X,
  Printer,
} from 'lucide-react';

export const BadgesManagement: React.FC = () => {
  const { students, classes } = useSchool();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Issue modal
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueMode, setIssueMode] = useState<'student' | 'class'>('student');
  const [targetStudentId, setTargetStudentId] = useState<string>(students[0]?.id || '');
  const [targetClassId, setTargetClassId] = useState<string>(classes[0]?.id || '');
  const [badgeType, setBadgeType] = useState<string>('carte_scolaire');
  const [expiryDate, setExpiryDate] = useState<string>('2026-07-31');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preview modal
  const [previewBadge, setPreviewBadge] = useState<any | null>(null);
  const [deletingBadge, setDeletingBadge] = useState<any | null>(null);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await badgesApi.getHistory('sch-gn-001');
      if (res.success && res.badges) {
        setHistory(res.badges);
      } else {
        setHistory([]);
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des badges.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload: any = {
        schoolId: 'sch-gn-001',
        badgeType,
        expiryDate,
      };

      if (issueMode === 'student') {
        payload.studentId = targetStudentId;
      } else {
        payload.classId = targetClassId;
      }

      const res = await badgesApi.issue(payload);
      setActionSuccess(res.message || 'Carte / badge généré avec succès.');
      setShowIssueModal(false);
      await loadHistory();
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'émission.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  const handleDeleteBadge = async () => {
    if (!deletingBadge) return;
    setIsSubmitting(true);
    try {
      await badgesApi.delete(deletingBadge.id);
      setActionSuccess('Le badge a été révoqué.');
      setDeletingBadge(null);
      await loadHistory();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la révocation.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  const getBadgeTypeLabel = (type: string) => {
    switch (type) {
      case 'carte_scolaire':
        return { label: "Carte d'identité scolaire", color: 'bg-slate-100 text-slate-800' };
      case 'excellence':
        return { label: "Tableau d'honneur & Excellence", color: 'bg-amber-50 text-amber-800' };
      case 'discipline':
        return { label: 'Conduite exemplaire', color: 'bg-emerald-50 text-emerald-800' };
      default:
        return { label: 'Carte scolaire', color: 'bg-slate-100 text-slate-700' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Cartes scolaires & Distinctions</h1>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600">
              {history.length} cartes émises
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Génération des cartes scolaires avec QR Code et badges de mérite.
          </p>
        </div>

        <button
          onClick={() => setShowIssueModal(true)}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Générer une carte</span>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs font-medium text-slate-500">Cartes scolaires actives</p>
          <div className="mt-1">
            <span className="text-2xl font-bold text-slate-900">
              {history.filter((b) => b.badgeType === 'carte_scolaire' && b.status === 'Actif').length}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs font-medium text-slate-500">Badges de mérite</p>
          <div className="mt-1">
            <span className="text-2xl font-bold text-slate-900">
              {history.filter((b) => b.badgeType !== 'carte_scolaire' && b.status === 'Actif').length}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs font-medium text-slate-500">Total dans le registre</p>
          <div className="mt-1">
            <span className="text-2xl font-bold text-slate-900">{history.length}</span>
          </div>
        </div>
      </div>

      {/* Badges Table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
          Chargement des cartes...
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
          Aucune carte scolaire émise pour le moment.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                  <th className="py-3 px-4">Élève</th>
                  <th className="py-3 px-4">Matricule</th>
                  <th className="py-3 px-4">Type de document</th>
                  <th className="py-3 px-4">Date d'émission</th>
                  <th className="py-3 px-4">Validité</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {history.map((b) => {
                  const student = students.find((s) => s.id === b.studentId);
                  const badgeInfo = getBadgeTypeLabel(b.badgeType);

                  return (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {student ? `${student.firstName} ${student.lastName}` : b.studentName || 'Élève'}
                        <span className="text-[11px] text-slate-400 block font-normal">
                          {student ? student.className : ''}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                        {student ? student.matricule : b.studentId}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${badgeInfo.color}`}>
                          {badgeInfo.label}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                        {b.issuedDate}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                        {b.expiryDate}
                      </td>

                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => setPreviewBadge({ ...b, student })}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="Aperçu & Imprimer"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingBadge(b)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Révoquer"
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

      {/* Issue Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Générer une carte ou un badge</h3>
              <button onClick={() => setShowIssueModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleIssue} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Type de document</label>
                <select
                  value={badgeType}
                  onChange={(e) => setBadgeType(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="carte_scolaire">Carte d'Identité Scolaire (avec QR Code)</option>
                  <option value="excellence">Tableau d'Honneur & Excellence</option>
                  <option value="discipline">Badge de Conduite Exemplaire</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Destinataire</label>
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setIssueMode('student')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium ${
                      issueMode === 'student' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Un élève
                  </button>
                  <button
                    type="button"
                    onClick={() => setIssueMode('class')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium ${
                      issueMode === 'class' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Toute une classe
                  </button>
                </div>

                {issueMode === 'student' ? (
                  <select
                    value={targetStudentId}
                    onChange={(e) => setTargetStudentId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.firstName} {s.lastName} ({s.className})
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={targetClassId}
                    onChange={(e) => setTargetClassId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.studentCount} élèves)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Date d'expiration</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
                >
                  {isSubmitting ? 'Génération...' : 'Générer la carte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview / Print Modal */}
      {previewBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Aperçu de la carte scolaire</h3>
              <button onClick={() => setPreviewBadge(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* School Card Mockup */}
            <div className="border border-slate-300 rounded-xl p-4 bg-slate-50 text-slate-900 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div>
                  <p className="font-bold text-xs">Groupe Scolaire Kharandi</p>
                  <p className="text-[10px] text-slate-500">Conakry, République de Guinée</p>
                </div>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-slate-200 rounded">
                  2025-2026
                </span>
              </div>

              <div className="flex gap-3 items-center">
                <div className="w-16 h-16 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-lg shrink-0">
                  {previewBadge.student?.firstName?.slice(0, 1) || 'E'}
                  {previewBadge.student?.lastName?.slice(0, 1) || 'L'}
                </div>
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-sm">
                    {previewBadge.student?.firstName} {previewBadge.student?.lastName}
                  </p>
                  <p className="text-slate-500">
                    Matricule : <strong className="font-mono text-slate-800">{previewBadge.student?.matricule}</strong>
                  </p>
                  <p className="text-slate-500">
                    Classe : <strong>{previewBadge.student?.className}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                <span>Valable jusqu'au : {previewBadge.expiryDate}</span>
                <span className="font-bold text-emerald-700">QR Code Vérifié</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg inline-flex items-center gap-1.5 text-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer la carte</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletingBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-sm w-full p-6">
            <h3 className="font-bold text-slate-900 text-sm mb-2">Révoquer le document</h3>
            <p className="text-xs text-slate-600 mb-4">
              Voulez-vous révoquer ce document ({deletingBadge.id}) ?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeletingBadge(null)}
                className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteBadge}
                disabled={isSubmitting}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
              >
                {isSubmitting ? 'Révocation...' : 'Révoquer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
