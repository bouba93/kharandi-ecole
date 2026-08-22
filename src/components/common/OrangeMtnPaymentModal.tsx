import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Student, PaymentTransaction } from '../../types';
import { X, Smartphone, CheckCircle, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

interface OrangeMtnPaymentModalProps {
  student: Student;
  onClose: () => void;
  onSuccess: (payment: PaymentTransaction) => void;
}

export const OrangeMtnPaymentModal: React.FC<OrangeMtnPaymentModalProps> = ({
  student,
  onClose,
  onSuccess,
}) => {
  const { processPayment } = useSchool();

  const [operator, setOperator] = useState<'Orange Money' | 'MTN MoMo'>('Orange Money');
  const [phoneNumber, setPhoneNumber] = useState(student.parentPhone || '+224 ');
  const [trimesterLabel, setTrimesterLabel] = useState('1ère Tranche + Forfait Kharandi 60 000 GNF');
  const [amount, setAmount] = useState<number>(600000); // 600,000 GNF default

  const [step, setStep] = useState<'input' | 'ussd_confirm' | 'success'>('input');
  const [ussdPin, setUssdPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPayment, setGeneratedPayment] = useState<PaymentTransaction | null>(null);

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim() || amount <= 0) return;
    setStep('ussd_confirm');
  };

  const handleConfirmUSSD = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const txRef =
        operator === 'Orange Money'
          ? `OM224-${Math.floor(100000 + Math.random() * 900000)}`
          : `MOMO224-${Math.floor(100000 + Math.random() * 900000)}`;

      const newPay = processPayment({
        studentId: student.id,
        amount,
        paymentMethod: operator,
        transactionRef: txRef,
        phoneNumber,
        trimesterLabel,
      });

      setGeneratedPayment(newPay);
      setIsLoading(false);
      setStep('success');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-[#18bfd6]" />
            <h3 className="font-semibold text-slate-800">Paiement Mobile Money Guinée</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content depending on Step */}
        <div className="p-6">
          {step === 'input' && (
            <form onSubmit={handleInitiatePayment} className="space-y-4">
              {/* Student info summary */}
              <div className="bg-cyan-50/60 rounded-xl p-3 border border-cyan-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-cyan-800 font-bold uppercase block">Élève Bénéficiaire</span>
                  <span className="font-bold text-slate-900 text-sm">{student.firstName} {student.lastName}</span>
                  <span className="text-xs text-slate-500 block font-mono">{student.matricule} • {student.className}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Reste à payer</span>
                  <span className="text-xs font-bold text-rose-600 font-mono">
                    {(student.tuitionTotal - student.tuitionPaid).toLocaleString()} GNF
                  </span>
                </div>
              </div>

              {/* Operator Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Sélectionnez votre Opérateur Mobile Money
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOperator('Orange Money')}
                    className={`flex items-center justify-center space-x-2 p-3 rounded-xl border-2 font-bold text-xs transition-all ${
                      operator === 'Orange Money'
                        ? 'border-orange-500 bg-orange-50 text-orange-900 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base">🍊</span>
                    <span>Orange Money</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOperator('MTN MoMo')}
                    className={`flex items-center justify-center space-x-2 p-3 rounded-xl border-2 font-bold text-xs transition-all ${
                      operator === 'MTN MoMo'
                        ? 'border-[#fcb303] bg-amber-50 text-amber-950 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base">💛</span>
                    <span>MTN MoMo</span>
                  </button>
                </div>
              </div>

              {/* Trimester / Fee Label */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Motif du versement
                </label>
                <select
                  value={trimesterLabel}
                  onChange={(e) => setTrimesterLabel(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-[#18bfd6]"
                >
                  <option value="1ère Tranche + Forfait Kharandi 60 000 GNF">1ère Tranche + Forfait Kharandi (60 000 GNF)</option>
                  <option value="2ème Tranche de Scolarité">2ème Tranche de Scolarité</option>
                  <option value="3ème Tranche & Solde Annuel">3ème Tranche & Solde Annuel</option>
                  <option value="Avance Frais d'Inscription">Avance Frais d'Inscription</option>
                </select>
              </div>

              {/* Amount input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Montant du versement (en GNF)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    step={50000}
                    min={60000}
                    className="w-full text-sm font-bold font-mono bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-3 pr-16 text-slate-900 focus:outline-none focus:border-[#18bfd6]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    GNF
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Inclus 60 000 GNF de redevance annuelle Kharandi École.
                </span>
              </div>

              {/* Phone number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Numéro de Téléphone du Compte ({operator})
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+224 628 00 11 22"
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-[#18bfd6]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#18bfd6] hover:bg-[#15aabf] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 mt-2"
              >
                <span>Initier la demande sur le téléphone</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 'ussd_confirm' && (
            <form onSubmit={handleConfirmUSSD} className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-[#fcb303] flex items-center justify-center mx-auto mb-2 animate-bounce">
                <Smartphone className="w-6 h-6 text-amber-700" />
              </div>

              <h4 className="font-bold text-slate-900 text-sm">
                Validation USSD sur le téléphone
              </h4>

              <p className="text-xs text-slate-600 leading-relaxed">
                Une notification USSD a été envoyée sur le numéro <strong className="font-mono text-slate-800">{phoneNumber}</strong>.
                Saisissez le code PIN secret à 4 chiffres ci-dessous pour simuler la validation.
              </p>

              <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-xs text-left space-y-1.5 shadow-inner">
                <p className="text-emerald-400 font-bold">
                  {operator === 'Orange Money' ? '*144# Orange Money Guinée' : '*144# MTN MoMo Guinée'}
                </p>
                <p>Transfert vers : Groupe Scolaire Kharandi</p>
                <p>Montant : <span className="text-[#fcb303] font-bold">{amount.toLocaleString()} GNF</span></p>
                <p className="text-slate-400 text-[10px]">Tapez votre PIN pour valider.</p>
              </div>

              <div>
                <input
                  type="password"
                  maxLength={4}
                  value={ussdPin}
                  onChange={(e) => setUssdPin(e.target.value)}
                  placeholder="••••"
                  className="w-32 text-center text-lg font-mono tracking-widest bg-slate-100 border border-slate-300 rounded-xl py-2 text-slate-900 focus:outline-none focus:border-[#18bfd6] mx-auto block"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || ussdPin.length < 4}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Traitement sécurisé en cours...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Valider & Effectuer le Paiement</span>
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'success' && generatedPayment && (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-base">Paiement Réussi !</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  La transaction a été validée avec succès sur {operator}.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-left space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">N° Reçu :</span>
                  <span className="font-bold text-slate-800">{generatedPayment.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Réf. Transaction :</span>
                  <span className="font-bold text-[#18bfd6]">{generatedPayment.transactionRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Montant Reçu :</span>
                  <span className="font-bold text-emerald-600">{generatedPayment.amount.toLocaleString()} GNF</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                Un SMS de confirmation d'encaissement a été automatiquement envoyé au parent ({phoneNumber}).
              </p>

              <button
                onClick={() => {
                  onSuccess(generatedPayment);
                  onClose();
                }}
                className="w-full py-2.5 bg-[#18bfd6] hover:bg-[#15aabf] text-white font-bold text-xs rounded-xl shadow transition-all"
              >
                Voir / Imprimer le Reçu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
