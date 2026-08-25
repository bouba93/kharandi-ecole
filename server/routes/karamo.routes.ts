import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { store } from '../data/store';

const router = Router();

// Lazy Gemini client helper
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * OpenRouter AI caller helper
 * Supports any model available on openrouter.ai (e.g. google/gemini-2.5-flash, openai/gpt-4o-mini, meta-llama/llama-3.3-70b-instruct)
 */
async function callOpenRouter(
  systemInstruction: string,
  history: any[],
  message: string
): Promise<{ reply: string; model: string } | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }

  const model = process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash';
  const messages: any[] = [{ role: 'system', content: systemInstruction }];

  if (Array.isArray(history) && history.length > 0) {
    for (const h of history.slice(-6)) {
      messages.push({
        role: h.role === 'assistant' || h.role === 'model' ? 'assistant' : 'user',
        content: h.content || h.text || '',
      });
    }
  }

  messages.push({
    role: 'user',
    content: message,
  });

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'HTTP-Referer': process.env.APP_URL || 'https://kharandi-ecole.gn',
        'X-Title': 'Karamô - École Kharandi Excellence',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.warn(`[Karamô OpenRouter Error] Status ${response.status}: ${errText}`);
      return null;
    }

    const data = (await response.json()) as any;
    const text = data?.choices?.[0]?.message?.content;
    if (text && typeof text === 'string') {
      return {
        reply: text.trim(),
        model: data.model || model,
      };
    }
    return null;
  } catch (err: any) {
    console.warn(`[Karamô OpenRouter Connection Failed]:`, err?.message || err);
    return null;
  }
}

/**
 * Helper to build rich structured school context for Karamô
 */
function buildSchoolContext(studentId?: string, clientOverride?: any) {
  const school = store.schools[0] || {
    name: 'Groupe Scolaire Kharandi Excellence',
    dpe: 'DPE Matoto, Conakry',
    ministere: 'Ministère de l\'Enseignement Pré-Universitaire et de l\'Alphabétisation (MEPU-A)',
    schoolYear: '2025-2026',
    directorName: 'M. Amadou Diallo',
    phone: '+224 622 00 11 22',
    email: 'direction@kharandi-ecole.gn',
    address: 'Commune de Matoto, Conakry, République de Guinée',
  };

  const studentsList = clientOverride?.students || store.students;
  const gradesList = clientOverride?.grades || store.grades;
  const absencesList = clientOverride?.absences || store.absences;
  const classesList = clientOverride?.classes || store.classes;
  const evaluationsList = clientOverride?.evaluations || store.scheduledEvaluations;
  const logbookList = clientOverride?.logbook || store.logbook;
  const paymentsList = clientOverride?.payments || store.payments;
  const teachersList = clientOverride?.teachers || store.teachers;

  let targetStudent = null;
  if (studentId) {
    targetStudent = studentsList.find(
      (s: any) => s.id === studentId || s.matricule?.toUpperCase() === studentId.toUpperCase()
    );
  }

  // Summary of target student if known
  let studentDetail = null;
  if (targetStudent) {
    const sGrades = gradesList.filter((g: any) => g.studentId === targetStudent.id);
    const sAbsences = absencesList.filter((a: any) => a.studentId === targetStudent.id);
    const sPayments = paymentsList.filter((p: any) => p.studentId === targetStudent.id);
    const sClass = classesList.find((c: any) => c.id === targetStudent.classId);
    const sLogbook = logbookList.filter((l: any) => l.classId === targetStudent.classId);
    const sEvals = evaluationsList.filter((e: any) => e.classId === targetStudent.classId);

    // Subject breakdown
    const subjectStats = (sClass?.subjects || []).map((sub: any) => {
      const subjectGrades = sGrades.filter((g: any) => g.subjectId === sub.subjectId);
      const avg =
        subjectGrades.length > 0
          ? (
              subjectGrades.reduce((sum: number, g: any) => sum + Number(g.score), 0) /
              subjectGrades.length
            ).toFixed(2)
          : 'Non encore noté';
      return {
        matiere: sub.subjectName,
        coefficient: sub.coefficient,
        enseignant: sub.teacherName,
        moyenne: avg,
        notesRecentes: subjectGrades.map((g: any) => `${g.type}: ${g.score}/${g.maxScore || 20} (${g.date})`),
      };
    });

    const unexcusedAbsences = sAbsences.filter((a: any) =>
      a.status?.toLowerCase().includes('non justifié')
    );
    const justifiedAbsences = sAbsences.filter((a: any) =>
      a.status?.toLowerCase().includes('justifié')
    );
    const lates = sAbsences.filter((a: any) =>
      a.status?.toLowerCase().includes('retard')
    );

    studentDetail = {
      identite: {
        nomComplet: `${targetStudent.firstName} ${targetStudent.lastName}`,
        matricule: targetStudent.matricule,
        classe: targetStudent.className,
        niveau: targetStudent.level,
        dateNaissance: targetStudent.birthDate,
        groupeSanguin: targetStudent.bloodType || 'O+',
        tuteur: targetStudent.parentName,
        telephoneTuteur: targetStudent.parentPhone,
        statutDossier: targetStudent.status,
      },
      assiduite: {
        totalEvenements: sAbsences.length,
        absencesNonJustifiees: unexcusedAbsences.length,
        absencesJustifiees: justifiedAbsences.length,
        retards: lates.length,
        detailAbsencesEtRetards: sAbsences.map((a: any) => ({
          date: a.date,
          statut: a.status,
          motif: a.reason || 'Appel de classe',
          parentNotifie: a.notifiedParent ? 'Oui' : 'Non',
        })),
      },
      resultatsScolaires: {
        matieres: subjectStats,
        nombreTotalNotes: sGrades.length,
      },
      cahierDeTexteEtDevoirs: sLogbook.slice(0, 5).map((l: any) => ({
        matiere: l.subjectName,
        date: l.date,
        chapitreAborde: l.topicCovered,
        devoirAssigne: l.homeworkAssigned,
        dateLimiteDevoir: l.homeworkDueDate || 'Prochain cours',
      })),
      evaluationsAvenir: sEvals.map((e: any) => ({
        titre: e.title,
        matiere: e.subjectName,
        date: e.date,
        horaire: e.startTime,
        duree: `${e.durationMinutes || 120} min`,
        type: e.type,
        statut: e.status,
      })),
      scolariteEtFinances: {
        montantTotalAnnuel: `${targetStudent.tuitionTotal?.toLocaleString() || '1 800 000'} GNF`,
        montantPaye: `${targetStudent.tuitionPaid?.toLocaleString() || '1 800 000'} GNF`,
        soldeRestant: `${Math.max(0, (targetStudent.tuitionTotal || 0) - (targetStudent.tuitionPaid || 0)).toLocaleString()} GNF`,
        statutPaiement: targetStudent.tuitionPaid >= targetStudent.tuitionTotal ? 'En règle (Totalité réglée)' : 'Paiement en attente / Tranche en retard',
        historiquePaiements: sPayments.map((p: any) => ({
          recu: p.receiptNumber,
          montant: `${p.amount?.toLocaleString()} GNF`,
          moyenPaiement: p.paymentMethod,
          date: p.date,
          tranche: p.trimesterLabel,
        })),
      },
    };
  }

  return {
    etablissement: school,
    nombreElevesTotal: studentsList.length,
    nombreEnseignants: teachersList.length,
    classesDisponibles: classesList.map((c: any) => ({
      nom: c.name,
      niveau: c.level,
      professeurPrincipal: c.mainTeacherName,
      effectif: c.studentCount,
    })),
    listeElevesApercu: studentsList.slice(0, 15).map((s: any) => ({
      id: s.id,
      matricule: s.matricule,
      nom: `${s.firstName} ${s.lastName}`,
      classe: s.className,
      tuteur: s.parentName,
    })),
    eleveCible: studentDetail,
  };
}

/**
 * Fallback response generator if Gemini key is not configured or in case of error
 */
function generateFallbackResponse(userPrompt: string, context: any): string {
  const promptLower = userPrompt.toLowerCase();
  const eleve = context.eleveCible;

  if (eleve) {
    const identite = eleve.identite;
    const assiduite = eleve.assiduite;
    const notes = eleve.resultatsScolaires;
    const finances = eleve.scolariteEtFinances;
    const devoirs = eleve.cahierDeTexteEtDevoirs;
    const evals = eleve.evaluationsAvenir;

    // 1. Check absence / retard
    if (
      promptLower.includes('absent') ||
      promptLower.includes('absence') ||
      promptLower.includes('retard') ||
      promptLower.includes('assiduit') ||
      promptLower.includes('présent')
    ) {
      if (assiduite.totalEvenements === 0) {
        return `Concernant ${identite.nomComplet} (${identite.classe}), l'assiduité est exemplaire : aucune absence ni retard n'est enregistré. L'élève assiste avec ponctualité à l'ensemble de ses cours.`;
      } else {
        const events = assiduite.detailAbsencesEtRetards
          .map((a: any) => `${a.date} (${a.statut}, motif : ${a.motif})`)
          .join(', ');
        return `Pour ${identite.nomComplet} (${identite.classe}), le dossier mentionne ${assiduite.totalEvenements} événement(s) : ${assiduite.absencesNonJustifiees} absence(s) non justifiée(s), ${assiduite.absencesJustifiees} justifiée(s) et ${assiduite.retards} retard(s). Détail : ${events}.`;
      }
    }

    // 2. Check notes / moyennes / suivi cours
    if (
      promptLower.includes('note') ||
      promptLower.includes('moyenne') ||
      promptLower.includes('bulletin') ||
      promptLower.includes('cours') ||
      promptLower.includes('suit') ||
      promptLower.includes('travail') ||
      promptLower.includes('résultat')
    ) {
      const matieresList = notes.matieres
        .map((m: any) => `${m.matiere} : ${m.moyenne}/20`)
        .join(' — ');

      return `Voici les moyennes actuelles de ${identite.nomComplet} en ${identite.classe} : ${matieresList}.\n\nL'ensemble des résultats témoigne d'un travail régulier. Un accompagnement quotidien permettra de consolider ces résultats.`;
    }

    // 3. Check devoirs / examens / planning
    if (
      promptLower.includes('devoir') ||
      promptLower.includes('examen') ||
      promptLower.includes('composition') ||
      promptLower.includes('planning') ||
      promptLower.includes('épreuve')
    ) {
      const devoirsText = devoirs.length > 0
        ? devoirs.map((d: any) => `${d.matiere} : ${d.devoirAssigne} (pour le ${d.dateLimiteDevoir})`).join(' ; ')
        : 'Aucun devoir en attente signalé.';

      const evalsText = evals.length > 0
        ? evals.map((e: any) => `${e.titre} (${e.matiere}) le ${e.date} à ${e.horaire}`).join(' ; ')
        : 'Aucun examen immédiat programmé.';

      return `Pour ${identite.nomComplet} (${identite.classe}) :\n\nDevoirs à faire : ${devoirsText}.\n\nProchaines évaluations : ${evalsText}.`;
    }

    // 4. Check scolarité / finances
    if (
      promptLower.includes('scolarité') ||
      promptLower.includes('paiement') ||
      promptLower.includes('argent') ||
      promptLower.includes('gnf') ||
      promptLower.includes('frais') ||
      promptLower.includes('solde') ||
      promptLower.includes('tranche')
    ) {
      return `Situation des frais scolaires pour ${identite.nomComplet} (Matricule : ${identite.matricule}) : sur un montant annuel de ${finances.montantTotalAnnuel}, un total de ${finances.montantPaye} a été réglé, laissant un solde de ${finances.soldeRestant}. Le dossier est actuellement considéré ${finances.statutPaiement}.`;
    }

    // General student overview
    return `Je suis à votre disposition pour vous accompagner dans le suivi de ${identite.nomComplet} (${identite.classe}). Vous pouvez me poser vos questions sur ses notes, ses devoirs, ses présences ou l'état de sa scolarité.`;
  }

  // General school fallback
  return `Bonjour ! Je suis Karamô, le conseiller scolaire de ${context.etablissement?.name || "l'établissement"}. Je suis à votre écoute pour vous renseigner sur les résultats, l'assiduité ou la scolarité de vos enfants.`;
}

/**
 * POST /api/v1/ecole/karamo/chat
 * Route d'échange avec l'assistant IA Karamô
 */
router.post('/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, studentId, history, clientContext } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      res.status(400).json({
        success: false,
        error: 'Le message est requis pour interroger Karamô.',
      });
      return;
    }

    // 1. Build full context
    const fullContext = buildSchoolContext(studentId, clientContext);

    // 2. System instruction for Karamô
    const systemInstruction = `Tu es Karamô, le conseiller scolaire de "${fullContext.etablissement.name}" à Conakry.

TON RÔLE :
- Répondre avec clarté, élégance, bienveillance et précision aux parents d'élèves.
- Informer les parents sur la présence de leur enfant (assiduité, absences, retards).
- Renseigner sur les résultats scolaires, les notes, les moyennes et les appréciations.
- Préciser les devoirs et les dates d'examens à venir.
- Récapituler la situation des frais de scolarité.

STYLE DE RÉPONSE :
1. Rédige en français soigné avec des phrases complètes, fluides et naturelles.
2. Évite les puces mécaniques ou excessives (•). Privilégie une rédaction aérée en courts paragraphes clairs.
3. Mets en valeur les informations clés avec modération.
4. Adopte un ton respectueux, chaleureux et professionnel.

CONTEXTE SCOLAIRE EN TEMPS RÉEL (SOURCE DE VÉRITÉ) :
${JSON.stringify(fullContext, null, 2)}
`;

    let reply: string | null = null;
    let usedModel = 'rule-based';

    // 3. Priority 1: OpenRouter API (if OPENROUTER_API_KEY is provided)
    if (process.env.OPENROUTER_API_KEY) {
      const openRouterResult = await callOpenRouter(systemInstruction, history, message);
      if (openRouterResult && openRouterResult.reply) {
        reply = openRouterResult.reply;
        usedModel = `openrouter/${openRouterResult.model}`;
      }
    }

    // 4. Priority 2: Gemini API directly
    if (!reply) {
      const ai = getGeminiClient();
      if (ai) {
        // Format chat contents
        const contents: any[] = [];
        if (Array.isArray(history) && history.length > 0) {
          for (const h of history.slice(-6)) {
            contents.push({
              role: h.role === 'assistant' || h.role === 'model' ? 'model' : 'user',
              parts: [{ text: h.content || h.text || '' }],
            });
          }
        }
        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const candidateModels = [
          'gemini-2.5-flash',
          'gemini-2.5-flash-lite',
          'gemini-3.7-flash',
          'gemini-flash-latest',
        ];

        for (const modelName of candidateModels) {
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents,
              config: {
                systemInstruction,
                temperature: 0.7,
              },
            });

            if (response.text) {
              reply = response.text;
              usedModel = modelName;
              break;
            }
          } catch (modelErr: any) {
            console.warn(`[Karamô] Gemini model ${modelName} unavailable (${modelErr?.message || modelErr}), trying next candidate...`);
          }
        }
      }
    }

    // 5. Priority 3: Integrated Deterministic Context Engine
    if (!reply) {
      reply = generateFallbackResponse(message, fullContext);
      usedModel = 'local_engine';
    }

    res.status(200).json({
      success: true,
      source: usedModel,
      reply,
      student: fullContext.eleveCible ? fullContext.eleveCible.identite : null,
    });
  } catch (err: any) {
    console.error('[Karamô API Error]:', err);
    // Safe fallback to guarantee uninterrupted user experience
    try {
      const fullContext = buildSchoolContext(req.body?.studentId, req.body?.clientContext);
      const reply = generateFallbackResponse(req.body?.message || '', fullContext);
      res.status(200).json({
        success: true,
        source: 'fallback_error_recovery',
        reply,
        student: fullContext.eleveCible ? fullContext.eleveCible.identite : null,
      });
    } catch {
      res.status(200).json({
        success: true,
        source: 'static_fallback',
        reply: "Je suis à votre disposition pour vous renseigner sur la scolarité de votre enfant. Que souhaitez-vous savoir ?",
      });
    }
  }
});

export default router;
