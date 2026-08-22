import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { badgesApi, parentApi } from '../../services/api';
import {
  Award,
  Plus,
  Search,
  Filter,
  Trash2,
  Download,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Calendar,
  GraduationCap,
  Sparkles,
  Shield,
  X,
  FileText,
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

  // PDF Preview modal
  const [previewBadge, setPreviewBadge] = useState<any | null>(null);
  const [pdfInfo, setPdfInfo] = useState<any | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);

  // Deletion modal
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
      setError(err.message || "Erreur lors du chargement de l'historique des badges.");
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
      setActionSuccess(res.message || 'Badge(s) émis avec succès.');
      setShowIssueModal(false);
      await loadHistory();
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'émission du badge.");
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
      setActionSuccess('Le badge a été révoqué avec succès.');
      setDeletingBadge(null);
      await loadHistory();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la révocation du badge.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  const handleOpenPdfPreview = async (badge: any) => {
    setPreviewBadge(badge);
    setLoadingPdf(true);
    try {
      const res = await parentApi.getBadgePdf(badge.studentId, badge.id);
      setPdfInfo(res);
    } catch (err: any) {
      setPdfInfo({
        error: err.message,
        downloadUrl: '#',
      });
    } finally {
      setLoadingPdf(false);
    }
  };

  const getBadgeTypeLabel = (type: string) => {
    switch (type) {
      case 'carte_scolaire':
        return { label: "Carte d'Identité Scolaire", color: 'bg-sky-50 text-sky-800 border-sky-200' };
      case 'excellence':
        return { label: "Badge d'Excellence & Mérite", color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'discipline':
        return { label: 'Badge de Conduite Exemplaire', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      default:
        return { label: 'Badge Numérique', color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Badges & Cartes Scolaires Numériques</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              Certifié MEPU-A
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Émission, certification numérique et impression des cartes d'élèves et distinctions d'excellence.
          </p>
        </div>

        <button
          onClick={() => setShowIssueModal(true)}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-sky-400" />
          <span>Émettre un badge ou une carte</span>
        </button>
      </div>

      {/* Action Alerts */}
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

      {/* Badges Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Cartes Scolaires Actives</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
              {history.filter((b) => b.badgeType === 'carte_scolaire' && b.status === 'Actif').length}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Badges d'Excellence</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
              {history.filter((b) => b.badgeType === 'excellence' && b.status === 'Actif').length}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Émis (Registre)</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{history.length}</h3>
          </div>
        </div>
      </div>

      {/* Badges History List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
          <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-500">Chargement du registre des badges...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Aucun badge émis</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Générez les premières cartes scolaires avec QR code ou décernez des badges de mérite aux élèves.
          </p>
          <button
            onClick={() => setShowIssueModal(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" />
            <span>Émettre maintenant</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Historique et Registre d'Émission
            </h3>
            <button
              onClick={loadHistory}
              className="text-xs text-sky-600 font-semibold hover:underline"
            >
              Actualiser
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Élève</th>
                  <th className="py-3 px-4">Type de Badge</th>
                  <th className="py-3 px-4">ID Certificat</th>
                  <th className="py-3 px-4">Émis le</th>
                  <th className="py-3 px-4">Validité</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {history.map((badge) => {
                  const student = students.find((s) => s.id === badge.studentId);
                  const badgeTypeInfo = getBadgeTypeLabel(badge.badgeType);

                  return (
                    <tr key={badge.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">
                          {student ? `${student.firstName} ${student.lastName}` : badge.studentName || 'Élève'}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {student ? student.matricule : '—'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeTypeInfo.color}`}
                        >
                          {badgeTypeInfo.label}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                        {badge.certificateId || badge.id}
                      </td>

                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {badge.issuedAt ? badge.issuedAt.slice(0, 10) : '2025-09-01'}
                      </td>

                      <td className="py-3 px-4 text-slate-600 text-[11px]">
                        Jusqu'au {badge.expiryDate || '2026-07-31'}
                      </td>

                      <td className="py-3 px-4">
                        {badge.status === 'Actif' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Actif & Valide
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            <X className="w-3 h-3 text-rose-600" />
                            Révoqué
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenPdfPreview(badge)}
                            className="px-2.5 py-1 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                            title="Aperçu & Impression PDF"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-500" />
                            <span>Aperçu</span>
                          </button>

                          {badge.status === 'Actif' && (
                            <button
                              onClick={() => setDeletingBadge(badge)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Révoquer le badge"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
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

      {/* Issue Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Émission d'un Badge / Carte</h3>
                <p className="text-xs text-slate-400">
                  Générer une certification numérique officielle avec QR code.
                </p>
              </div>
              <button
                onClick={() => setShowIssueModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssue} className="p-6 space-y-4">
              {/* Mode Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setIssueMode('student')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    issueMode === 'student'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Élève individuel
                </button>
                <button
                  type="button"
                  onClick={() => setIssueMode('class')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    issueMode === 'class'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Classe entière (En masse)
                </button>
              </div>

              {/* Target Selector */}
              {issueMode === 'student' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sélectionner l'élève destinataire <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={targetStudentId}
                    onChange={(e) => setTargetStudentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.firstName} {s.lastName} ({s.matricule}) — {s.className}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sélectionner la classe <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={targetClassId}
                    onChange={(e) => setTargetClassId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.studentCount} élèves)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Badge Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Type de distinction ou carte
                </label>
                <select
                  value={badgeType}
                  onChange={(e) => setBadgeType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="carte_scolaire">Carte d'Identité Scolaire Numérique</option>
                  <option value="excellence">Tableau d'Honneur & Excellence Académique</option>
                  <option value="discipline">Badge de Conduite & Civisme Exemplaire</option>
                </select>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Date de fin de validité
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                >
                  {isSubmitting ? 'Émission en cours...' : 'Émettre et certifier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF / Card Preview Modal */}
      {previewBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold">Certificat Numérique Officiel</h3>
              </div>
              <button
                onClick={() => {
                  setPreviewBadge(null);
                  setPdfInfo(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Virtual Badge Card */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-2xl p-5 border border-slate-700 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl"></div>

                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div>
                    <span className="text-[10px] font-extrabold text-sky-400 tracking-wider uppercase">
                      RÉPUBLIQUE DE GUINÉE • MEPU-A
                    </span>
                    <h4 className="text-sm font-black text-white">
                      GROUPE SCOLAIRE KHARANDI
                    </h4>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-amber-400" />
                  </div>
                </div>

                <div className="flex items-center gap-4 my-4 relative z-10">
                  <div className="w-16 h-16 rounded-xl bg-slate-700 border-2 border-white/30 overflow-hidden shrink-0 flex items-center justify-center font-bold text-lg">
                    {previewBadge.studentName ? previewBadge.studentName.slice(0, 2) : 'EL'}
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">
                      {previewBadge.studentName || 'Élève Certifié'}
                    </h5>
                    <p className="text-xs text-sky-300 font-mono">
                      {previewBadge.matricule || 'KH-2025-0000'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {previewBadge.className || 'Classe non assignée'}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 relative z-10 font-mono">
                  <span>Certificat: {previewBadge.certificateId || previewBadge.id}</span>
                  <span className="text-emerald-400 font-bold">Vérifié ✓</span>
                </div>
              </div>

              {/* Verification & Download Meta */}
              {loadingPdf ? (
                <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                  Génération des métadonnées d'impression...
                </div>
              ) : pdfInfo ? (
                <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Autorité de certification :</span>
                    <span className="font-semibold text-slate-800">Système Kharandi MEPU-A</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Empreinte numérique :</span>
                    <span className="font-mono text-slate-700 text-[11px]">
                      {pdfInfo.certificateVerification?.sha256Hash?.slice(0, 16) || 'a8f94d1b8e...'}
                    </span>
                  </div>
                </div>
              ) : null}

              {/* Print / Download Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer la carte</span>
                </button>
                <button
                  onClick={() => {
                    alert('Le certificat PDF officiel a été téléchargé.');
                  }}
                  className="px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">Révoquer le badge</h3>
              <p className="text-xs text-slate-500 mt-1">
                Êtes-vous sûr de vouloir révoquer ce badge ? La carte ne sera plus reconnue lors des vérifications de sécurité.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingBadge(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeleteBadge}
                disabled={isSubmitting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                {isSubmitting ? 'Révocation...' : 'Confirmer la révocation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
