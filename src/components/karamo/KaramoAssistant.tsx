import React, { useState, useRef, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { karamoApi } from '../../services/api';
import {
  Bot,
  Send,
  Volume2,
  VolumeX,
  RotateCcw,
  UserCheck,
  GraduationCap,
  Calendar,
  CreditCard,
  BookOpen,
  Copy,
  Check,
  User,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  studentName?: string;
}

interface KaramoAssistantProps {
  isModal?: boolean;
  onClose?: () => void;
  defaultStudentId?: string;
}

export const KaramoAssistant: React.FC<KaramoAssistantProps> = ({
  isModal = false,
  onClose,
  defaultStudentId,
}) => {
  const {
    students,
    selectedStudentIdForParent,
    schoolInfo,
    classes,
    grades,
    attendance,
    scheduledEvaluations,
    logbook,
    payments,
    teacherAccounts,
  } = useSchool();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    defaultStudentId || selectedStudentIdForParent || (students[0]?.id || '')
  );

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Bonjour ! Je suis Karamô, votre conseiller scolaire à ${schoolInfo.name}.

Je suis à votre disposition pour vous renseigner sur les notes, l'assiduité, les devoirs et la scolarité de votre enfant. Que souhaitez-vous savoir aujourd'hui ?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentStudent = students.find((s) => s.id === selectedStudentId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (defaultStudentId) {
      setSelectedStudentId(defaultStudentId);
    } else if (selectedStudentIdForParent) {
      setSelectedStudentId(selectedStudentIdForParent);
    }
  }, [defaultStudentId, selectedStudentIdForParent]);

  // Speech Synthesis
  const handleToggleSpeak = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) {
      alert("La synthèse vocale n'est pas supportée par votre navigateur.");
      return;
    }

    if (isSpeaking && speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '').replace(/•/g, '-');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.95;

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };

    setSpeakingMessageId(msgId);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Historique réinitialisé. Je suis à votre écoute ! Que voulez-vous savoir sur **${
          currentStudent ? `${currentStudent.firstName} ${currentStudent.lastName}` : "l'élève"
        }** ?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const query = (customPrompt || inputValue).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      studentName: currentStudent ? `${currentStudent.firstName} ${currentStudent.lastName}` : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const clientContext = {
        students,
        classes,
        grades,
        attendance,
        evaluations: scheduledEvaluations,
        logbook,
        payments,
        teachers: teacherAccounts,
      };

      const historyPayload = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: (m.role === 'assistant' ? 'model' : 'user') as 'model' | 'user',
          content: m.content,
        }));

      const res = await karamoApi.chat({
        message: query,
        studentId: selectedStudentId || undefined,
        history: historyPayload,
        clientContext,
      });

      if (res.success && res.reply) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: res.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(res.error || 'Aucune réponse reçue de Karamô.');
      }
    } catch (err: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Je vous prie de m'excuser, une difficulté temporaire est survenue. Veuillez vérifier votre connexion ou reformuler votre question.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const quickPrompts = [
    {
      icon: UserCheck,
      label: 'Absences & Retards',
      prompt: `Est-ce que ${currentStudent ? currentStudent.firstName : 'mon enfant'} a été absent ou en retard récemment ?`,
    },
    {
      icon: GraduationCap,
      label: 'Notes & Moyennes',
      prompt: `Comment se passent ses cours ? Quelles sont les notes et moyennes de ${currentStudent ? currentStudent.firstName : 'l\'élève'} ?`,
    },
    {
      icon: Calendar,
      label: 'Devoirs & Évaluations',
      prompt: `Quels sont les devoirs à faire et les examens prévus pour sa classe ?`,
    },
    {
      icon: CreditCard,
      label: 'Statut de Scolarité',
      prompt: `Quel est l'état des paiements de scolarité pour ${currentStudent ? currentStudent.firstName : 'cet élève'} ?`,
    },
    {
      icon: BookOpen,
      label: 'Conseils Révision',
      prompt: `Quels conseils pratiques me donnez-vous pour aider ${currentStudent ? currentStudent.firstName : 'mon enfant'} à réviser ?`,
    },
  ];

  return (
    <div
      id="karamo-ia-assistant-container"
      className={`flex flex-col bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden ${
        isModal ? 'h-[85vh] max-h-[700px]' : 'min-h-[580px] h-[calc(100vh-14rem)]'
      }`}
    >
      {/* Light Clean Header */}
      <div className="bg-slate-50 px-4 sm:px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">Karamô</h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                En ligne
              </span>
            </div>
            <p className="text-xs text-slate-500">Assistant scolaire pour les parents</p>
          </div>
        </div>

        {/* Student Selector & History Reset */}
        <div className="flex items-center gap-2">
          {students.length > 1 && (
            <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} ({s.className})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleClearHistory}
            title="Effacer la conversation"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
            >
              Fermer
            </button>
          )}
        </div>
      </div>

      {/* Light Student Context Pill */}
      {currentStudent && (
        <div className="bg-white px-4 sm:px-6 py-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Élève :</span>
            <span className="font-semibold text-slate-900">
              {currentStudent.firstName} {currentStudent.lastName}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-mono">{currentStudent.matricule}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">{currentStudent.className}</span>
          </div>

          <span
            className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
              currentStudent.status === 'En règle'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {currentStudent.status}
          </span>
        </div>
      )}

      {/* Chat Messages Body (Clean Light) */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/40">
        {messages.map((message) => {
          const isAssistant = message.role === 'assistant';

          return (
            <div
              key={message.id}
              className={`flex gap-3 max-w-2xl ${isAssistant ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                  isAssistant
                    ? 'bg-amber-100 text-amber-900 border border-amber-200'
                    : 'bg-slate-900 text-white'
                }`}
              >
                {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-3.5 h-3.5" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  isAssistant
                    ? 'bg-white text-slate-800 border border-slate-200 shadow-xs'
                    : 'bg-slate-900 text-white shadow-xs'
                }`}
              >
                {/* Header */}
                <div
                  className={`flex items-center justify-between gap-4 mb-1 text-[10px] ${
                    isAssistant ? 'text-slate-400' : 'text-slate-300'
                  }`}
                >
                  <span className="font-semibold">{isAssistant ? 'Karamô' : 'Vous'}</span>
                  <span>{message.timestamp}</span>
                </div>

                {/* Content */}
                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-1">
                  {message.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {/* Bubble Actions */}
                {isAssistant && (
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px] text-slate-500">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleSpeak(message.content, message.id)}
                        className={`px-2 py-0.5 rounded flex items-center gap-1 transition-colors ${
                          isSpeaking && speakingMessageId === message.id
                            ? 'bg-amber-100 text-amber-900 font-semibold'
                            : 'hover:bg-slate-100 text-slate-600'
                        }`}
                        title="Écouter la réponse"
                      >
                        {isSpeaking && speakingMessageId === message.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-amber-700" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Écouter</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCopy(message.content, message.id)}
                        className="px-2 py-0.5 rounded hover:bg-slate-100 text-slate-600 flex items-center gap-1 transition-colors"
                        title="Copier le texte"
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copié</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copier</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-md mr-auto">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 border border-amber-200 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin text-amber-700" />
            </div>
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-600 flex items-center gap-2 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Karamô consulte les dossiers scolaires...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      <div className="bg-white px-4 sm:px-6 py-2.5 border-t border-slate-200 shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0 mr-1">
            Questions rapides :
          </span>
          {quickPrompts.map((qp, idx) => {
            const Icon = qp.icon;
            return (
              <button
                key={idx}
                disabled={isLoading}
                onClick={() => handleSendMessage(qp.prompt)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Icon className="w-3.5 h-3.5 text-slate-500" />
                <span>{qp.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Bar */}
      <div className="bg-white p-3 sm:p-4 border-t border-slate-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            placeholder={`Posez votre question à Karamô (absences, notes, devoirs, scolarité)...`}
            className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-lg px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
          />

          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium rounded-lg text-xs sm:text-sm flex items-center gap-1.5 transition-colors shrink-0 shadow-xs cursor-pointer disabled:cursor-not-allowed"
          >
            <span>Envoyer</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
