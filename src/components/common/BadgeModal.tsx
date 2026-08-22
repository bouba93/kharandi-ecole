import React, { useRef } from 'react';
import { Student } from '../../types';
import { SCHOOL_INFO } from '../../data/initialData';
import { X, Printer, Download, ShieldCheck, QrCode } from 'lucide-react';

interface BadgeModalProps {
  student: Student;
  onClose: () => void;
}

export const BadgeModal: React.FC<BadgeModalProps> = ({ student, onClose }) => {
  const badgeRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#18bfd6]" />
            <h3 className="font-semibold text-slate-800">Badge Scolaire Digital</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badge Card Container (Printable) */}
        <div className="p-6 flex flex-col items-center">
          <div
            ref={badgeRef}
            className="w-[320px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-5 shadow-2xl border-2 border-[#fcb303]/40 relative overflow-hidden text-center"
          >
            {/* Watermark / Background Ornament */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#18bfd6]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-[#fcb303]/10 rounded-full blur-2xl pointer-events-none" />

            {/* School Header */}
            <div className="border-b border-slate-700/80 pb-3 mb-4">
              <span className="text-[10px] font-semibold tracking-wider text-[#fcb303] uppercase block">
                RÉPUBLIQUE DE GUINÉE
              </span>
              <h4 className="text-sm font-bold tracking-tight text-white uppercase leading-snug">
                {SCHOOL_INFO.name}
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">{SCHOOL_INFO.dpe}</p>
            </div>

            {/* Student Photo */}
            <div className="relative inline-block mb-3">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#18bfd6] shadow-md mx-auto bg-slate-700">
                <img
                  src={student.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                  alt={`${student.firstName} ${student.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#fcb303] text-slate-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shadow">
                ÉLÈVE
              </span>
            </div>

            {/* Name & Class */}
            <h3 className="text-lg font-bold text-white leading-tight mt-1">
              {student.firstName} {student.lastName}
            </h3>
            <p className="text-xs font-semibold text-[#18bfd6] mt-0.5">{student.className}</p>

            {/* Details Table */}
            <div className="mt-4 bg-slate-800/80 rounded-xl p-3 text-left text-xs space-y-1.5 border border-slate-700/50">
              <div className="flex justify-between">
                <span className="text-slate-400">Matricule :</span>
                <span className="font-mono font-bold text-white">{student.matricule}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Né(e) le :</span>
                <span className="text-slate-200">{student.birthDate} ({student.birthPlace})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tuteur :</span>
                <span className="text-slate-200 truncate max-w-[150px]">{student.parentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Urgence :</span>
                <span className="font-mono text-[#fcb303]">{student.parentPhone}</span>
              </div>
            </div>

            {/* QR Code & Kharandi Footer */}
            <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-left">
                <div className="bg-white p-1 rounded-lg">
                  <QrCode className="w-8 h-8 text-slate-900" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase">Vérification QR</span>
                  <span className="text-[10px] text-emerald-400 font-bold">Actif • 2025/2026</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[9px] text-slate-400 block">Propulsé par</span>
                <span className="text-xs font-bold text-[#18bfd6]">Kharandi École</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-200/60 transition-colors"
          >
            Fermer
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#18bfd6] hover:bg-[#15aabf] rounded-xl shadow-sm inline-flex items-center space-x-2 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer Badge</span>
          </button>
        </div>
      </div>
    </div>
  );
};
