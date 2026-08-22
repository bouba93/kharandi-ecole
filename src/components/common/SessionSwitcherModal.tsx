import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Role } from '../../types';
import {
  Building2,
  GraduationCap,
  Users,
  X,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Receipt,
} from 'lucide-react';

interface SessionSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SessionSwitcherModal: React.FC<SessionSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { role, setRole } = useSchool();

  if (!isOpen) return null;

  const handleSelectRole = (selectedRole: Role) => {
    setRole(selectedRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden space-y-0">
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center text-white font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Changer d'Espace / Session ERP</h3>
              <p className="text-xs text-slate-300">
                Sélectionnez le portail d'utilisation correspondant à votre compte dans l'établissement
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles Cards Grid */}
        <div className="p-6 bg-slate-50 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Admin / Direction Session */}
          <div
            onClick={() => handleSelectRole('admin')}
            className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
              role === 'admin'
                ? 'bg-white border-sky-500 ring-2 ring-sky-500/20 shadow-md'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-sky-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                {role === 'admin' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Session Active
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Direction & Administration</h4>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Compte : Dr. Diallo Mamadou</p>
              </div>

              <ul className="space-y-1.5 text-[11px] text-slate-600">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                  <span>Tableau de bord financier & caisse</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                  <span>Inscriptions & fiches élèves</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                  <span>Édition des bulletins officiels</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectRole('admin')}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                role === 'admin'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              <span>Accéder à la Direction</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Teacher Session */}
          <div
            onClick={() => handleSelectRole('teacher')}
            className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
              role === 'teacher'
                ? 'bg-white border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                {role === 'teacher' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Session Active
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Corps Enseignant</h4>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Compte : M. Camara Fodé</p>
              </div>

              <ul className="space-y-1.5 text-[11px] text-slate-600">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Cahier de texte digitalisé</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Grille de saisie des devoirs</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Appel journalier & absences</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectRole('teacher')}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                role === 'teacher'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              <span>Accéder au Portail Enseignant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Parent Session */}
          <div
            onClick={() => handleSelectRole('parent')}
            className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
              role === 'parent'
                ? 'bg-white border-amber-400 ring-2 ring-amber-400/30 shadow-md'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                {role === 'parent' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Session Active
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Portail Parents & Tuteurs</h4>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Compte : Mme Sow Aïssatou</p>
              </div>

              <ul className="space-y-1.5 text-[11px] text-slate-600">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                  <span>Bulletins de notes de l'élève</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                  <span>Paiement Orange / MTN MoMo</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                  <span>Notifications SMS de présence</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectRole('parent')}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                role === 'parent'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              <span>Ouvrir Portail Parent</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
          <p>
            Chaque espace de travail est étanche et propose les fonctionnalités réservées à son utilisateur.
          </p>
        </div>
      </div>
    </div>
  );
};
