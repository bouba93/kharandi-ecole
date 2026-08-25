import React, { useState } from 'react';
import { Bot, X } from 'lucide-react';
import { KaramoAssistant } from './KaramoAssistant';
import { useSchool } from '../../context/SchoolContext';

export const KaramoFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { role, selectedStudentIdForParent } = useSchool();

  // Karamô is strictly in the Parent space
  if (role !== 'parent') {
    return null;
  }

  return (
    <>
      {/* Floating Action Trigger Button */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
        {!isOpen && (
          <div className="bg-white text-slate-800 text-[11px] font-medium px-3 py-1.5 rounded-full shadow-md border border-slate-200 flex items-center gap-1.5 animate-bounce hidden sm:flex">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Une question ? Demandez à <strong>Karamô</strong></span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Ouvrir l'assistant Karamô"
          className="w-12 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 p-0.5 shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer flex items-center justify-center border border-slate-700 group"
        >
          {isOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-amber-400" />
          )}
        </button>
      </div>

      {/* Floating Modal Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
            <KaramoAssistant
              isModal={true}
              onClose={() => setIsOpen(false)}
              defaultStudentId={selectedStudentIdForParent}
            />
          </div>
        </div>
      )}
    </>
  );
};
