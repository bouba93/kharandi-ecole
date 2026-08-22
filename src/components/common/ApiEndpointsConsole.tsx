import React, { useState } from 'react';
import {
  Terminal,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  Copy,
  Check,
  ChevronRight,
  Server,
  Layers,
  Code,
  ShieldCheck,
  Zap,
  Globe,
  Database,
  X
} from 'lucide-react';

interface EndpointDef {
  category: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  defaultPayload?: any;
  defaultParams?: Record<string, string>;
}

const ENDPOINTS: EndpointDef[] = [
  // 1. AUTHENTIFICATION
  {
    category: 'Authentification',
    method: 'POST',
    path: '/api/v1/ecole/activate',
    description: 'Activer un compte établissement scolaire avec le code d\'activation',
    defaultPayload: {
      school_name: 'Groupe Scolaire Kharandi Excellence',
      email: 'direction@kharandi.gn',
      phone: '+224 628 00 11 22',
      activation_code: 'KH-EXC-2025',
      address: 'Kaporo-Cité, Ratoma, Conakry',
      dpe: 'DCE de Ratoma',
      ministere: 'MEPU-A Guinée',
      admin_name: 'M. Diallo Mamadou',
    },
  },
  {
    category: 'Authentification',
    method: 'POST',
    path: '/api/v1/ecole/login',
    description: 'Connexion de la Direction / Administration générale',
    defaultPayload: {
      email: 'contact@kharandi-excellence.gn',
      password: 'password123',
    },
  },
  {
    category: 'Authentification',
    method: 'POST',
    path: '/api/v1/ecole/teacher/login',
    description: 'Connexion d\'un professeur ou enseignant',
    defaultPayload: {
      email: 'souleymane.camara@kharandi-excellence.gn',
      phone: '+224 622 11 22 33',
    },
  },

  // 2. ÉTABLISSEMENTS
  {
    category: 'Établissements',
    method: 'GET',
    path: '/api/v1/ecole/schools',
    description: 'Lister tous les établissements et leurs métriques agrégées',
  },
  {
    category: 'Établissements',
    method: 'POST',
    path: '/api/v1/ecole/schools',
    description: 'Créer / enregistrer une nouvelle école dans le système Kharandi',
    defaultPayload: {
      name: 'Complexe Scolaire Avenir de Kipé',
      subtext: 'Enseignement Général & Technique',
      address: 'Kipé Centre Émetteur, Conakry',
      phone: '+224 620 44 55 66',
      email: 'direction@avenir-kipe.gn',
      dpe: 'DCE Ratoma',
      ministere: 'MEPU-A Guinée',
      schoolYear: '2025-2026',
      currentTrimester: 1,
    },
  },
  {
    category: 'Établissements',
    method: 'GET',
    path: '/api/v1/ecole/schools/sch-gn-001',
    description: 'Obtenir les détails financiers et pédagogiques d\'un établissement',
  },
  {
    category: 'Établissements',
    method: 'PATCH',
    path: '/api/v1/ecole/schools/sch-gn-001',
    description: 'Mettre à jour les informations d\'un établissement',
    defaultPayload: {
      phone: '+224 628 00 11 22 / +224 664 33 44 55',
      currentTrimester: 1,
    },
  },
  {
    category: 'Établissements',
    method: 'DELETE',
    path: '/api/v1/ecole/schools/sch-gn-001',
    description: 'Supprimer / réinitialiser un établissement',
  },

  // 3. ÉLÈVES
  {
    category: 'Élèves',
    method: 'GET',
    path: '/api/v1/ecole/schools/sch-gn-001/students',
    description: 'Lister les élèves d\'un établissement avec filtres',
  },
  {
    category: 'Élèves',
    method: 'POST',
    path: '/api/v1/ecole/schools/sch-gn-001/students',
    description: 'Inscrire un nouvel élève et lui générer un matricule officiel',
    defaultPayload: {
      firstName: 'Salematou',
      lastName: 'Diallo',
      gender: 'F',
      birthDate: '2008-09-15',
      birthPlace: 'Labé',
      classId: 'cls-10-a',
      className: '10ème Année A (BEPC)',
      level: 'Collège',
      parentName: 'M. Thierno Diallo',
      parentPhone: '+224 629 11 22 33',
      parentEmail: 'thierno.diallo@gn.com',
      address: 'Lambanyi, Conakry',
      tuitionTotal: 1800000,
      tuitionPaid: 1800000,
    },
  },
  {
    category: 'Élèves',
    method: 'PATCH',
    path: '/api/v1/ecole/students/std-001',
    description: 'Mettre à jour les informations d\'un élève (scolarité, classe, contact)',
    defaultPayload: {
      tuitionPaid: 1800000,
      address: 'Kipé Centre, Conakry',
    },
  },
  {
    category: 'Élèves',
    method: 'DELETE',
    path: '/api/v1/ecole/students/std-006',
    description: 'Supprimer / radier un élève du registre scolaire',
  },

  // 4. CLASSES
  {
    category: 'Classes',
    method: 'GET',
    path: '/api/v1/ecole/classes',
    description: 'Lister les classes avec effectifs en temps réel',
  },
  {
    category: 'Classes',
    method: 'POST',
    path: '/api/v1/ecole/classes',
    description: 'Créer une nouvelle classe avec ses matières et son professeur principal',
    defaultPayload: {
      name: 'Terminale SS (Sciences Sociales)',
      level: 'Lycée',
      mainTeacherId: 'tch-diallo',
      mainTeacherName: 'Prof. Fatoumata Diallo',
      roomNumber: 'Salle 206',
    },
  },

  // 5. ENSEIGNANTS
  {
    category: 'Enseignants',
    method: 'GET',
    path: '/api/v1/ecole/teachers',
    description: 'Lister le corps professoral et les matières enseignées',
  },
  {
    category: 'Enseignants',
    method: 'POST',
    path: '/api/v1/ecole/teachers',
    description: 'Ajouter un nouveau professeur',
    defaultPayload: {
      name: 'Prof. Oumar Telly Diallo',
      email: 'oumar.diallo@kharandi-ecole.gn',
      phone: '+224 620 88 77 66',
      subjects: ['Biologie & SVT'],
      classIds: ['cls-t-sm1'],
      role: 'teacher',
    },
  },
  {
    category: 'Enseignants',
    method: 'GET',
    path: '/api/v1/ecole/teachers/tch-camara',
    description: 'Obtenir la fiche complète d\'un enseignant et ses classes assignées',
  },
  {
    category: 'Enseignants',
    method: 'POST',
    path: '/api/v1/ecole/teachers/tch-camara',
    description: 'Mettre à jour les coordonnées ou matières d\'un enseignant',
    defaultPayload: {
      phone: '+224 622 11 22 44',
      subjects: ['Mathématiques', 'Statistiques appliquées'],
    },
  },
  {
    category: 'Enseignants',
    method: 'DELETE',
    path: '/api/v1/ecole/teachers/tch-sow',
    description: 'Retirer un enseignant spécifique de l\'établissement',
  },
  {
    category: 'Enseignants',
    method: 'DELETE',
    path: '/api/v1/ecole/teachers',
    description: 'Suppression en masse d\'enseignants',
    defaultPayload: {
      teacher_ids: ['tch-test-01', 'tch-test-02'],
    },
  },

  // 6. NOTES
  {
    category: 'Notes & Évaluations',
    method: 'GET',
    path: '/api/v1/ecole/grades?trimester=1',
    description: 'Consulter les notes saisies avec filtres par classe/matière/trimestre',
  },
  {
    category: 'Notes & Évaluations',
    method: 'POST',
    path: '/api/v1/ecole/grades',
    description: 'Enregistrer une ou plusieurs notes d\'évaluation',
    defaultPayload: {
      grades: [
        {
          studentId: 'std-001',
          subjectId: 'sub-math-col',
          subjectName: 'Mathématiques',
          trimester: 1,
          type: 'Composition',
          score: 19,
          maxScore: 20,
          coefficient: 4,
          comment: 'Excellente prestation à l\'examen trimestriel',
        },
      ],
    },
  },

  // 7. ABSENCES
  {
    category: 'Assiduité & Absences',
    method: 'GET',
    path: '/api/v1/ecole/absences',
    description: 'Consulter l\'historique des appels et des retards',
  },
  {
    category: 'Assiduité & Absences',
    method: 'POST',
    path: '/api/v1/ecole/absences',
    description: 'Enregistrer l\'appel d\'une classe avec envoi automatique d\'alertes SMS aux parents',
    defaultPayload: {
      records: [
        {
          studentId: 'std-002',
          studentName: 'Ibrahima Sory Diallo',
          classId: 'cls-t-sm1',
          className: 'Terminale SM 1',
          date: new Date().toISOString().slice(0, 10),
          status: 'Absent Non Justifié',
          reason: 'Non présent à l\'appel de 8h',
          notifiedParent: true,
        },
      ],
    },
  },

  // 8. ESPACE PARENT
  {
    category: 'Espace Parent',
    method: 'GET',
    path: '/api/v1/ecole/parent/KH-2025-0101',
    description: 'Dossier complet de l\'élève (notes, moyennes, assiduité, devoirs, paiements)',
  },
  {
    category: 'Espace Parent',
    method: 'GET',
    path: '/api/v1/ecole/parents/students/std-001/badges',
    description: 'Badges scolaires numériques et QR codes de l\'élève',
  },
  {
    category: 'Espace Parent',
    method: 'GET',
    path: '/api/v1/ecole/parents/students/std-001/badges/bdg-001/pdf',
    description: 'Certificat et métadonnées d\'impression du badge scolaire',
  },

  // 9. BADGES SCOLAIRES
  {
    category: 'Badges Scolaires',
    method: 'POST',
    path: '/api/v1/ecole/schools/badges/issue',
    description: 'Émettre un badge scolaire numérique certifié pour un élève ou une classe',
    defaultPayload: {
      studentId: 'std-001',
      schoolId: 'sch-gn-001',
      badgeType: 'carte_scolaire',
      expiryDate: '2026-07-31',
    },
  },
  {
    category: 'Badges Scolaires',
    method: 'GET',
    path: '/api/v1/ecole/schools/badges/history/sch-gn-001',
    description: 'Consulter le registre d\'émission des badges de l\'établissement',
  },
  {
    category: 'Badges Scolaires',
    method: 'DELETE',
    path: '/api/v1/ecole/schools/badges/bdg-003',
    description: 'Révoquer et désactiver un badge scolaire',
  },
];

export const ApiEndpointsConsole: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDef>(ENDPOINTS[0]);
  const [customPath, setCustomPath] = useState<string>(ENDPOINTS[0].path);
  const [payloadText, setPayloadText] = useState<string>(
    ENDPOINTS[0].defaultPayload ? JSON.stringify(ENDPOINTS[0].defaultPayload, null, 2) : ''
  );
  const [isLoading, setIsLoading] = useState(false);
  const [responseResult, setResponseResult] = useState<any>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseDuration, setResponseDuration] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Tous');

  if (!isOpen) return null;

  const categories = ['Tous', ...Array.from(new Set(ENDPOINTS.map((e) => e.category)))];

  const filteredEndpoints = activeCategory === 'Tous'
    ? ENDPOINTS
    : ENDPOINTS.filter((e) => e.category === activeCategory);

  const handleSelectEndpoint = (ep: EndpointDef) => {
    setSelectedEndpoint(ep);
    setCustomPath(ep.path);
    setPayloadText(ep.defaultPayload ? JSON.stringify(ep.defaultPayload, null, 2) : '');
    setResponseResult(null);
    setResponseStatus(null);
    setResponseDuration(null);
  };

  const handleExecute = async () => {
    setIsLoading(true);
    setResponseResult(null);
    setResponseStatus(null);
    setResponseDuration(null);

    const startTime = performance.now();

    try {
      let bodyData: any = undefined;
      if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(selectedEndpoint.method) && payloadText.trim()) {
        try {
          bodyData = JSON.parse(payloadText);
        } catch {
          bodyData = payloadText;
        }
      }

      const res = await fetch(customPath, {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: bodyData !== undefined ? JSON.stringify(bodyData) : undefined,
      });

      const endTime = performance.now();
      setResponseDuration(Math.round(endTime - startTime));
      setResponseStatus(res.status);

      const json = await res.json().catch(() => ({ statusText: res.statusText }));
      setResponseResult(json);
    } catch (err: any) {
      const endTime = performance.now();
      setResponseDuration(Math.round(endTime - startTime));
      setResponseStatus(500);
      setResponseResult({ error: err.message || 'Erreur réseau de connexion au serveur' });
    } finally {
      setIsLoading(false);
    }
  };

  const copyResponse = () => {
    if (!responseResult) return;
    navigator.clipboard.writeText(JSON.stringify(responseResult, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMethodBadgeClass = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-sky-100 text-sky-800 border-sky-300 font-semibold';
      case 'POST':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold';
      case 'PATCH':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-semibold';
      case 'DELETE':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-semibold';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Console des Endpoints Backend</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  REST API v1 Actif
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Base URL : <code className="text-sky-300 font-mono">/api/v1/ecole/</code> • Testez et inspectez les requêtes en direct
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
            Domaines :
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Body Layout: Sidebar List + Playground */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Endpoints List */}
          <div className="w-1/3 min-w-[320px] max-w-sm border-r border-slate-200 overflow-y-auto bg-slate-50/50 p-3 space-y-2">
            {filteredEndpoints.map((ep, index) => {
              const isSelected =
                selectedEndpoint.path === ep.path && selectedEndpoint.method === ep.method;
              return (
                <button
                  key={`${ep.method}-${ep.path}-${index}`}
                  onClick={() => handleSelectEndpoint(ep)}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-sky-50 border-sky-400 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase border ${getMethodBadgeClass(
                        ep.method
                      )}`}
                    >
                      {ep.method}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">{ep.category}</span>
                  </div>
                  <div className="font-mono text-slate-800 font-semibold truncate text-[11px]">
                    {ep.path}
                  </div>
                  <p className="text-slate-500 line-clamp-1 text-[11px]">{ep.description}</p>
                </button>
              );
            })}
          </div>

          {/* Right Column: Interactive Tester & Result */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            {/* Request Bar */}
            <div className="p-4 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2.5 py-1 rounded text-xs font-mono uppercase border ${getMethodBadgeClass(
                    selectedEndpoint.method
                  )}`}
                >
                  {selectedEndpoint.method}
                </span>
                <input
                  type="text"
                  value={customPath}
                  onChange={(e) => setCustomPath(e.target.value)}
                  className="flex-1 font-mono text-sm px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  onClick={handleExecute}
                  disabled={isLoading}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-lg font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Envoi...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Exécuter</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-600">{selectedEndpoint.description}</p>
            </div>

            {/* Content Area: Split Request Payload & Response */}
            <div className="flex-1 flex overflow-hidden">
              {/* Request Payload Editor (if not GET or if has body) */}
              {['POST', 'PATCH', 'PUT', 'DELETE'].includes(selectedEndpoint.method) && (
                <div className="w-1/2 border-r border-slate-200 flex flex-col p-4 bg-slate-50/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-slate-500" />
                      Corps de la requête (JSON)
                    </span>
                    <button
                      onClick={() =>
                        setPayloadText(
                          selectedEndpoint.defaultPayload
                            ? JSON.stringify(selectedEndpoint.defaultPayload, null, 2)
                            : '{}'
                        )
                      }
                      className="text-[11px] text-sky-600 hover:underline"
                    >
                      Réinitialiser payload
                    </button>
                  </div>
                  <textarea
                    value={payloadText}
                    onChange={(e) => setPayloadText(e.target.value)}
                    className="flex-1 w-full font-mono text-xs p-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                    placeholder="Payload JSON..."
                  />
                </div>
              )}

              {/* Response Panel */}
              <div
                className={`flex-1 flex flex-col p-4 overflow-hidden ${
                  !['POST', 'PATCH', 'PUT', 'DELETE'].includes(selectedEndpoint.method)
                    ? 'w-full'
                    : 'w-1/2'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-slate-500" />
                      Réponse du serveur
                    </span>
                    {responseStatus !== null && (
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          responseStatus >= 200 && responseStatus < 300
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                            : 'bg-rose-100 text-rose-700 border border-rose-300'
                        }`}
                      >
                        HTTP {responseStatus}
                      </span>
                    )}
                    {responseDuration !== null && (
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {responseDuration} ms
                      </span>
                    )}
                  </div>

                  {responseResult && (
                    <button
                      onClick={copyResponse}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2 py-1 bg-slate-100 rounded border border-slate-200 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copier JSON</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="flex-1 bg-slate-900 rounded-xl p-3.5 overflow-auto text-slate-200 font-mono text-xs border border-slate-800 shadow-inner">
                  {responseResult ? (
                    <pre className="text-emerald-400">
                      {JSON.stringify(responseResult, null, 2)}
                    </pre>
                  ) : isLoading ? (
                    <div className="h-full flex items-center justify-center text-slate-400 gap-2">
                      <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>En attente de la réponse du serveur...</span>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-6">
                      <Zap className="w-8 h-8 text-slate-600 mb-2" />
                      <p className="font-sans text-xs text-slate-400 max-w-xs">
                        Cliquez sur <strong className="text-sky-400">"Exécuter"</strong> ci-dessus pour déclencher l'appel réseau vers le serveur Express.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Spécification Kharandi École v1 • Conforme Ministère MEPU-A & DCE</span>
          </div>
          <div className="flex items-center gap-3">
            <span>9 Groupes de routes intégrés</span>
            <button
              onClick={handleExecute}
              className="font-medium text-sky-600 hover:text-sky-700"
            >
              Relancer la requête
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
