import React, { useRef } from 'react';
import { Student } from '../../types';
import { useSchool } from '../../context/SchoolContext';
import { X, Printer, QrCode, ShieldCheck, HeartPulse } from 'lucide-react';

interface BadgeModalProps {
  student: Student;
  onClose: () => void;
}

export const BadgeModal: React.FC<BadgeModalProps> = ({ student, onClose }) => {
  const { schoolInfo } = useSchool();
  const badgeRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-gn-green" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Carte d'Identité Scolaire Officielle</h3>
              <p className="text-[11px] text-slate-500">Document Scolaire Officiel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Student Card Container */}
        <div className="p-6 flex flex-col items-center bg-slate-100">
          <div
            id="printable-badge"
            ref={badgeRef}
            className="w-[360px] bg-white text-slate-900 rounded-xl shadow-lg border-2 border-slate-300 relative overflow-hidden text-left"
          >
            {/* Top Guinean National Ribbon (Red, Yellow, Green) */}
            <div className="h-2 w-full flex">
              <div className="w-1/3 bg-gn-red"></div>
              <div className="w-1/3 bg-gn-yellow"></div>
              <div className="w-1/3 bg-gn-green"></div>
            </div>

             {/* School & Republic Header */}
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-center">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight mt-1">
                {schoolInfo.name}
              </h4>
              <p className="text-[9px] text-slate-600 font-medium">
                {schoolInfo.dpe}
              </p>
              
              <div className="mt-1 inline-block bg-sky-600 text-white font-bold text-[9px] uppercase px-3 py-0.5 rounded-full tracking-wider shadow-xs">
                CARTE D'IDENTITÉ SCOLAIRE • {schoolInfo.schoolYear || '2025-2026'}
              </div>
            </div>

            {/* Card Body: Photo & Student Core Info */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3.5">
                {/* Photo with official colored border */}
                <div className="w-20 h-24 rounded-lg overflow-hidden border-2 border-slate-800 shadow-sm shrink-0 bg-slate-200">
                  <img
                    src={student.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                    alt={`${student.firstName} ${student.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Main Identity */}
                <div className="space-y-1 text-xs">
                  <h3 className="text-sm font-black text-slate-900 uppercase leading-tight">
                    {student.firstName} {student.lastName}
                  </h3>
                  <p className="font-mono text-[11px] font-bold text-gn-green">
                    MAT : {student.matricule}
                  </p>
                  <p className="text-[11px] font-bold text-slate-800">
                    CLASSE : <span className="text-slate-900">{student.className} ({student.level})</span>
                  </p>
                  <p className="text-[10px] text-slate-600">
                    Né(e) le : <strong className="text-slate-800">{student.birthDate}</strong> à <strong className="text-slate-800">{student.birthPlace || 'Conakry'}</strong>
                  </p>
                </div>
              </div>

              {/* Medical & Family Contact Strip */}
              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 text-[10px] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Groupe Sanguin :</span>
                  <span className="inline-flex items-center gap-1 font-bold text-gn-red bg-white px-1.5 py-0.2 rounded border border-rose-200">
                    <HeartPulse className="w-3 h-3 text-gn-red" />
                    {student.bloodType || 'O+'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Tuteur Responsable :</span>
                  <span className="font-bold text-slate-900 truncate max-w-[170px]">{student.parentName}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Contact d'Urgence :</span>
                  <span className="font-mono font-bold text-slate-900">{student.emergencyContact || student.parentPhone}</span>
                </div>
              </div>

              {/* QR Verification & Stamp Box */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-white p-1 rounded border border-slate-300">
                    <QrCode className="w-7 h-7 text-slate-900" />
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 block uppercase font-bold">Vérification QR</span>
                    <span className="text-[9px] text-gn-green font-bold">Document Certifié</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[8px] text-slate-500 block uppercase font-semibold">Le Chef d'Établissement</span>
                  <span className="text-[9px] font-bold text-slate-800 uppercase italic">Cachet & Signature</span>
                </div>
              </div>
            </div>

            {/* Bottom Guinean National Ribbon */}
            <div className="h-1.5 w-full flex">
              <div className="w-1/3 bg-gn-red"></div>
              <div className="w-1/3 bg-gn-yellow"></div>
              <div className="w-1/3 bg-gn-green"></div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            Fermer
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold text-white bg-gn-green hover:bg-emerald-800 rounded-lg shadow-xs inline-flex items-center space-x-2 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer la Carte Scolaire</span>
          </button>
        </div>
      </div>
    </div>
  );
};
