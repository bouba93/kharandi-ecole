import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { PaymentTransaction, Student } from '../../types';
import { ReceiptModal } from '../common/ReceiptModal';
import { OrangeMtnPaymentModal } from '../common/OrangeMtnPaymentModal';
import {
  CreditCard,
  Smartphone,
  PlusCircle,
  Search,
  Printer,
  Send,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  PieChart,
} from 'lucide-react';

export const FinanceAccounting: React.FC = () => {
  const { students, payments, sendParentAlert, processPayment } = useSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentTransaction | null>(null);
  const [selectedStudentForPayment, setSelectedStudentForPayment] = useState<Student | null>(null);
  const [showManualPaymentModal, setShowManualPaymentModal] = useState(false);

  // Manual payment form
  const [manualStudentId, setManualStudentId] = useState(students[0]?.id || '');
  const [manualAmount, setManualAmount] = useState<number>(600000);
  const [manualMethod, setManualMethod] = useState<'Espèces' | 'Orange Money' | 'MTN MoMo' | 'Virement'>('Espèces');
  const [manualRef, setManualRef] = useState(`CASH-${Math.floor(1000 + Math.random() * 9000)}`);
  const [manualTrimester, setManualTrimester] = useState('1ère Tranche + Forfait Kharandi');

  // Relance state
  const [relanceSent, setRelanceSent] = useState<string | null>(null);

  const unpaidStudents = students.filter((s) => s.tuitionPaid < s.tuitionTotal);

  const filteredPayments = payments.filter(
    (p) =>
      p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.transactionRef.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendSMSNotification = (student: Student) => {
    const dueAmount = student.tuitionTotal - student.tuitionPaid;
    sendParentAlert({
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      parentPhone: student.parentPhone,
      title: 'Relance Scolarité',
      message: `Kharandi École : Cher parent (${student.parentName}), le solde de scolarité de ${student.firstName} présente un retard de ${dueAmount.toLocaleString()} GNF. Veuillez régler via Orange Money au +224 628 00 11 22 ou auprès de la caisse.`,
      type: 'payment_reminder',
      channel: 'SMS',
    });

    setRelanceSent(student.id);
    setTimeout(() => setRelanceSent(null), 3000);
  };

  const handleManualPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === manualStudentId);
    if (!st) return;

    const newPay = processPayment({
      studentId: st.id,
      amount: manualAmount,
      paymentMethod: manualMethod,
      transactionRef: manualRef,
      trimesterLabel: manualTrimester,
    });

    setShowManualPaymentModal(false);
    setSelectedReceipt(newPay);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-xs font-bold text-[#18bfd6] uppercase tracking-wider block">COMPTABILITÉ & RECOUVREMENT</span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Gestion des Frais de Scolarité & Mobile Money
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi des encaissements (Espèces, Orange Money, MTN MoMo), émission de reçus et relances automatiques.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowManualPaymentModal(true)}
            className="px-4 py-2.5 bg-[#18bfd6] hover:bg-[#15aabf] text-white font-bold text-xs rounded-xl shadow-sm transition-all inline-flex items-center space-x-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Enregistrer Caisse</span>
          </button>
        </div>
      </div>

      {/* Unpaid Relance Section */}
      {unpaidStudents.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="font-extrabold text-slate-900 text-sm">
                Relances Automatiques de Scolarité ({unpaidStudents.length} élèves en retard de paiement)
              </h3>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-2.5 py-0.5 rounded-full">
              Canal SMS & WhatsApp
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {unpaidStudents.map((std) => {
              const due = std.tuitionTotal - std.tuitionPaid;
              const isSent = relanceSent === std.id;

              return (
                <div
                  key={std.id}
                  className="bg-white p-3.5 rounded-xl border border-amber-200/80 flex items-center justify-between shadow-2xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">{std.firstName} {std.lastName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{std.className} • Parent: {std.parentPhone}</span>
                    <span className="text-xs font-bold font-mono text-rose-600 block mt-0.5">
                      Impayé : {due.toLocaleString()} GNF
                    </span>
                  </div>

                  <div className="flex flex-col items-end space-y-1">
                    <button
                      onClick={() => handleSendSMSNotification(std)}
                      disabled={isSent}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all inline-flex items-center space-x-1 ${
                        isSent
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                      }`}
                    >
                      <Send className="w-3 h-3" />
                      <span>{isSent ? 'SMS Envoyé !' : 'Relancer SMS'}</span>
                    </button>

                    <button
                      onClick={() => setSelectedStudentForPayment(std)}
                      className="text-[10px] text-[#18bfd6] hover:underline font-bold"
                    >
                      Payer Mobile Money
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter & History Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <h3 className="font-extrabold text-slate-900 text-sm">Historique des Transactions de Caisse</h3>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Chercher par nom, reçu, réf..."
              className="w-full text-xs bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-slate-800 focus:outline-none focus:border-[#18bfd6]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">N° Reçu</th>
                <th className="py-3 px-4">Élève & Classe</th>
                <th className="py-3 px-4">Motif du Versement</th>
                <th className="py-3 px-4">Mode & Réf</th>
                <th className="py-3 px-4 text-right">Montant Total</th>
                <th className="py-3 px-4 text-center">Reçu PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#18bfd6]">{p.receiptNumber}</td>
                  <td className="py-3 px-4">
                    <span className="font-extrabold text-slate-900 block">{p.studentName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{p.className}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{p.trimesterLabel}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800 block">{p.paymentMethod}</span>
                    <span className="text-[10px] font-mono text-slate-500">{p.transactionRef}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    {p.amount.toLocaleString()} GNF
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedReceipt(p)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[10px] inline-flex items-center space-x-1"
                    >
                      <Printer className="w-3.5 h-3.5 text-[#18bfd6]" />
                      <span>Reçu</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Payment Modal */}
      {showManualPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="font-extrabold text-slate-900 text-base mb-4">Enregistrer un Versement Caisse</h3>

            <form onSubmit={handleManualPaymentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sélectionnez l'Élève</label>
                <select
                  value={manualStudentId}
                  onChange={(e) => setManualStudentId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-[#18bfd6]"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.className}) - Impayé: {(s.tuitionTotal - s.tuitionPaid).toLocaleString()} GNF
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Motif</label>
                <input
                  type="text"
                  value={manualTrimester}
                  onChange={(e) => setManualTrimester(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#18bfd6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mode de Règlement</label>
                  <select
                    value={manualMethod}
                    onChange={(e) => setManualMethod(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#18bfd6]"
                  >
                    <option value="Espèces">Espèces (Caisse)</option>
                    <option value="Orange Money">Orange Money</option>
                    <option value="MTN MoMo">MTN MoMo</option>
                    <option value="Virement">Virement Bancaire</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Réf / Pièce</label>
                  <input
                    type="text"
                    value={manualRef}
                    onChange={(e) => setManualRef(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-[#18bfd6]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Montant perçu (GNF)</label>
                <input
                  type="number"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(Number(e.target.value))}
                  step={50000}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:border-[#18bfd6]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowManualPaymentModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#18bfd6] hover:bg-[#15aabf] text-white font-bold rounded-xl shadow-sm"
                >
                  Valider & Générer Reçu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal payment={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}

      {/* Online Mobile Money Payment Modal */}
      {selectedStudentForPayment && (
        <OrangeMtnPaymentModal
          student={selectedStudentForPayment}
          onClose={() => setSelectedStudentForPayment(null)}
          onSuccess={(p) => setSelectedReceipt(p)}
        />
      )}
    </div>
  );
};
