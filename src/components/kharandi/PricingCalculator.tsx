import React, { useState } from 'react';
import { Check, Building2, ShieldCheck, FileCheck, Smartphone, Users, ArrowRight } from 'lucide-react';

export const PricingCalculator: React.FC = () => {
  const [studentCount, setStudentCount] = useState<number>(500);

  const pricePerStudent = 60000; // 60 000 GNF
  const totalAnnualFee = studentCount * pricePerStudent;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-8 border border-slate-800 text-center relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-extrabold border border-amber-500/30 mb-3 uppercase tracking-wider">
          FORFAIT CLAIR & SANS SURPRISE
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          Tarification Kharandi École
        </h1>

        <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Un abonnement annuel unique de <strong className="text-amber-400">60 000 GNF / élève / an</strong> déductible directement lors des frais d'inscription ou de scolarité.
        </p>

        {/* Pricing Card Highlight */}
        <div className="mt-8 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 max-w-md mx-auto shadow-2xl backdrop-blur-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">FORFAIT GLOBAL ÉTABLISSEMENT</span>
          <div className="my-3 flex items-baseline justify-center space-x-1">
            <span className="text-4xl font-black font-mono text-sky-400">60 000</span>
            <span className="text-sm font-bold text-slate-300">GNF / élève / an</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Zéro frais d'installation cachés • Inclus toutes les fonctionnalités & mises à jour.
          </p>
        </div>
      </div>

      {/* Simulator */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-slate-900 text-sky-400 rounded-xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Simulateur de Budget pour votre Établissement</h3>
            <p className="text-xs text-slate-500">Ajustez le curseur selon l'effectif global de votre école.</p>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-700">Effectif Total d'Élèves :</span>
            <span className="text-base font-mono text-sky-600 font-extrabold">{studentCount} élèves</span>
          </div>

          <input
            type="range"
            min={50}
            max={3000}
            step={25}
            value={studentCount}
            onChange={(e) => setStudentCount(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />

          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>50 élèves</span>
            <span>1 500 élèves</span>
            <span>3 000 élèves</span>
          </div>
        </div>

        {/* Simulation Output */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-900 text-white p-5 rounded-2xl text-center border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Redevance Annuelle Plateforme</span>
            <p className="text-2xl font-mono font-extrabold text-sky-400 mt-1">
              {totalAnnualFee.toLocaleString()} <span className="text-xs font-normal text-slate-300">GNF / an</span>
            </p>
          </div>

          <div className="bg-amber-50 p-5 rounded-2xl text-center border border-amber-200">
            <span className="text-[10px] font-bold text-amber-800 uppercase block">Impact sur l'Élève</span>
            <p className="text-2xl font-mono font-extrabold text-amber-950 mt-1">
              5 000 <span className="text-xs font-normal text-amber-800">GNF / mois</span>
            </p>
          </div>
        </div>
      </div>

      {/* Inclusions Feature Grid */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
        <h3 className="font-extrabold text-slate-900 text-base text-center">
          Services Complètement Inclus dans le Forfait Kharandi
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-sky-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="font-extrabold text-slate-900">ERP Complet multi-profils</h4>
            <p className="text-slate-500 text-[11px]">Accès Direction, Enseignants, Parents et Élèves sans limitation.</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <FileCheck className="w-4 h-4" />
            </div>
            <h4 className="font-extrabold text-slate-900">Bulletins de Notes PDF</h4>
            <p className="text-slate-500 text-[11px]">Calculs automatiques des moyennes et éditions instantanées.</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="font-extrabold text-slate-900">Badges Élèves avec QR</h4>
            <p className="text-slate-500 text-[11px]">Édition et impression des cartes d'identité scolaires sécurisées.</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
              <Smartphone className="w-4 h-4" />
            </div>
            <h4 className="font-extrabold text-slate-900">SMS & Mobile Money</h4>
            <p className="text-slate-500 text-[11px]">Alertes d'absences parents et paiements Orange Money / MTN MoMo.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
