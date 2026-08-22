import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Role } from '../../types';
import {
  Building2,
  BookOpen,
  Users,
  ArrowRight,
  ShieldCheck,
  School,
  Phone,
  KeyRound,
} from 'lucide-react';

interface UnifiedLoginProps {
  onLoginSuccess?: () => void;
}

export const UnifiedLogin: React.FC<UnifiedLoginProps> = ({ onLoginSuccess }) => {
  const { schoolInfo, login, teacherAccounts, students } = useSchool();
  const [selectedRole, setSelectedRole] = useState<Role>('admin');
  const [identifier, setIdentifier] = useState('direction@ecole.gn');
  const [password, setPassword] = useState('direction2026');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const roleProfiles = {
    admin: {
      title: 'Direction',
      defaultId: 'direction@ecole.gn',
      defaultPass: 'direction2026',
      icon: Building2,
      placeholder: 'Email ou identifiant direction',
    },
    teacher: {
      title: 'Enseignants',
      defaultId: teacherAccounts[0]?.email || 'prof.camara@kharandi.gn',
      defaultPass: 'password123',
      icon: BookOpen,
      placeholder: 'Email ou code enseignant (ex: ENS-7721)',
    },
    parent: {
      title: 'Espace Parents',
      defaultId: students[0]?.parentPhone || '+224 622 34 56 78',
      defaultPass: students[0]?.parentPin || 'PAR-4891',
      icon: Users,
      placeholder: 'Téléphone parent ou matricule',
    },
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setIdentifier(roleProfiles[role].defaultId);
    setPassword(roleProfiles[role].defaultPass);
    setAuthError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    setTimeout(() => {
      const success = login({
        identifier: identifier.trim(),
        password: password.trim(),
        role: selectedRole,
      });

      setIsLoading(false);
      if (success) {
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        setAuthError('Identifiants incorrects.');
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-geometric-grid flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-lg w-full bg-white/95 backdrop-blur-md rounded-3xl border border-sky-200 shadow-2xl shadow-sky-500/10 overflow-hidden">
        {/* Top Header */}
        <div className="p-6 sm:p-8 text-center bg-gradient-to-b from-sky-50 to-white border-b border-sky-100">


          <div className="w-16 h-16 bg-gradient-to-tr from-sky-500 to-sky-600 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-sky-500/25 mb-3">
            <School className="w-8 h-8" />
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {schoolInfo.name}
          </h1>
          <p className="text-xs text-sky-700 font-semibold mt-1">
            Session {schoolInfo.schoolYear} • DPE {schoolInfo.dpe}
          </p>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Role selector tabs */}
          <div className="grid grid-cols-3 gap-2">
            {(['admin', 'teacher', 'parent'] as Role[]).map((r) => {
              const isSelected = selectedRole === r;
              const Icon = roleProfiles[r].icon;
              return (
                <button
                  key={r}
                  id={`login-tab-${r}`}
                  type="button"
                  onClick={() => handleRoleSelect(r)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                    isSelected
                      ? 'border-sky-500 bg-gradient-to-br from-sky-500 to-sky-600 text-white font-bold shadow-md shadow-sky-500/25 ring-2 ring-sky-200'
                      : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-sky-50 hover:border-sky-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-1 ${isSelected ? 'text-orange-200' : 'text-sky-600'}`} />
                  <span className="text-xs font-bold">{roleProfiles[r].title}</span>
                </button>
              );
            })}
          </div>

          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold text-center">
              {authError}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Identifiant / Email / Téléphone
              </label>
              <div className="relative">
                <input
                  id="login-identifier-input"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={roleProfiles[selectedRole].placeholder}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 font-medium text-xs sm:text-sm transition-all"
                  required
                />
                <Users className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {selectedRole === 'parent' ? 'Code PIN d\'accès' : 'Mot de passe'}
              </label>
              <div className="relative">
                <input
                  id="login-password-input"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 font-mono font-bold text-xs sm:text-sm transition-all"
                  required
                />
                <KeyRound className="w-4 h-4 text-orange-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              id="login-submit-button"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-5 bg-gradient-to-r from-sky-500 via-sky-600 to-orange-500 hover:from-sky-600 hover:to-orange-600 active:scale-[0.99] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 text-sm cursor-pointer"
            >
              {isLoading ? (
                <span>Connexion en cours...</span>
              ) : (
                <>
                  <span>Connexion • {roleProfiles[selectedRole].title}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts */}
          <div className="pt-4 border-t border-sky-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center">
              Accès rapide démo :
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  setIdentifier('direction@ecole.gn');
                  setPassword('direction2026');
                }}
                className="p-2.5 bg-sky-50 hover:bg-sky-100/80 border border-sky-200 rounded-xl text-center transition-all cursor-pointer"
              >
                <span className="font-bold text-sky-900 block text-xs">🏛️ Direction</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('teacher');
                  setIdentifier('prof.camara@kharandi.gn');
                  setPassword('password123');
                }}
                className="p-2.5 bg-sky-50 hover:bg-sky-100/80 border border-sky-200 rounded-xl text-center transition-all cursor-pointer"
              >
                <span className="font-bold text-sky-900 block text-xs">👨‍🏫 Enseignant</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('parent');
                  setIdentifier('+224 622 34 56 78');
                  setPassword('PAR-4891');
                }}
                className="p-2.5 bg-orange-50 hover:bg-orange-100/80 border border-orange-200 rounded-xl text-center transition-all cursor-pointer"
              >
                <span className="font-bold text-orange-900 block text-xs">👨‍👩‍👧 Parent</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
