import React from 'react';
import { PaymentTransaction } from '../../types';
import { SCHOOL_INFO } from '../../data/initialData';
import { X, Printer, CheckCircle2, FileText, QrCode } from 'lucide-react';

interface ReceiptModalProps {
  payment: PaymentTransaction;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ payment, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#18bfd6]" />
            <h3 className="font-semibold text-slate-800">Reçu Officiel de Paiement</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Canvas */}
        <div className="p-8 bg-white text-slate-800 font-sans" id="printable-receipt">
          {/* Header */}
          <div className="text-center border-b border-slate-200 pb-4 mb-6">
            <p className="text-[10px] font-bold tracking-widest text-[#fcb303] uppercase">
              RÉPUBLIQUE DE GUINÉE
            </p>
            <p className="text-[10px] text-slate-500 italic mb-1">Travail - Justice - Solidarité</p>
            <h2 className="text-lg font-extrabold text-slate-900 uppercase tracking-tight">
              {SCHOOL_INFO.name}
            </h2>
            <p className="text-xs text-slate-600">{SCHOOL_INFO.address}</p>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">Tél : {SCHOOL_INFO.phone}</p>
          </div>

          {/* Receipt Title & Number */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
            <div>
              <span className="text-xs text-slate-500 block">N° Reçu de Caisse</span>
              <span className="font-mono text-base font-bold text-[#18bfd6]">{payment.receiptNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Date d'Émission</span>
              <span className="text-xs font-semibold text-slate-800">{payment.date}</span>
            </div>
          </div>

          {/* Student Info */}
          <div className="space-y-2 mb-6 text-xs border-b border-slate-200 pb-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 block">Nom & Prénom de l'Élève :</span>
                <span className="font-bold text-slate-900 text-sm">{payment.studentName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Matricule :</span>
                <span className="font-mono font-bold text-slate-800">{payment.matricule}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-slate-500 block">Classe :</span>
                <span className="font-semibold text-slate-800">{payment.className}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Motif du Versement :</span>
                <span className="font-semibold text-slate-800">{payment.trimesterLabel}</span>
              </div>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <table className="w-full text-xs text-left mb-6 border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                <th className="py-2 px-3 font-semibold">Désignation</th>
                <th className="py-2 px-3 font-semibold text-right">Montant (GNF)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-800">
                  Versement Scolarité {SCHOOL_INFO.schoolYear}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-medium">
                  {(payment.amount - payment.kharandiFee).toLocaleString()} GNF
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-600 italic">
                  Frais Forfait Kharandi École (Inclus)
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                  {payment.kharandiFee.toLocaleString()} GNF
                </td>
              </tr>
              <tr className="bg-emerald-50/60 font-bold border-t-2 border-slate-200">
                <td className="py-3 px-3 text-emerald-900">Total Perçu :</td>
                <td className="py-3 px-3 text-right font-mono text-emerald-900 text-sm">
                  {payment.amount.toLocaleString()} GNF
                </td>
              </tr>
            </tbody>
          </table>

          {/* Payment Method & Reference */}
          <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 mb-6 border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500">Mode de Règlement :</span>
              <span className="font-bold text-slate-800">{payment.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Référence Transaction :</span>
              <span className="font-mono font-semibold text-[#18bfd6]">{payment.transactionRef}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Téléphone de confirmation :</span>
              <span className="font-mono text-slate-700">{payment.phoneNumber}</span>
            </div>
          </div>

          {/* Stamp & Signatures */}
          <div className="grid grid-cols-2 gap-4 pt-2 text-[11px] items-end">
            <div className="text-center">
              <p className="text-slate-500 mb-8">Cachet de l'Établissement & Signature</p>
              <div className="inline-block border-2 border-dashed border-[#18bfd6] p-2 rounded-xl text-center rotate-[-3deg] bg-cyan-50/50">
                <CheckCircle2 className="w-5 h-5 text-[#18bfd6] mx-auto mb-1" />
                <span className="font-bold text-[#18bfd6] uppercase block text-[10px]">PAIEMENT VALIDE</span>
                <span className="text-[9px] text-slate-500 font-mono">Kharandi ERP</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-slate-500 mb-8">La Comptabilité</p>
              <p className="font-semibold text-slate-800 italic">{payment.issuedBy}</p>
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
            <span>Imprimer le Reçu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
