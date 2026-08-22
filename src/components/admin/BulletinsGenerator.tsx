import React, { useState, useRef } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SCHOOL_INFO } from '../../data/initialData';
import { Award, Printer, Download, ChevronRight, CheckCircle2, FileText, QrCode } from 'lucide-react';

export const BulletinsGenerator: React.FC = () => {
  const { students, classes, getStudentReportCard } = useSchool();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3>(1);

  const reportCard = getStudentReportCard(selectedStudentId, selectedTrimester);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Bar Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block">
            ÉVALUATION & SUIVI PÉDAGOGIQUE
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Génération des Bulletins Trimestriels de Notes
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Calculs automatisés des moyennes pondérées par coefficient, classement de classe et décision du Conseil.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          {/* Trimester Select */}
          <select
            value={selectedTrimester}
            onChange={(e) => setSelectedTrimester(Number(e.target.value) as 1 | 2 | 3)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-sky-500"
          >
            <option value={1}>1er Trimestre</option>
            <option value={2}>2ème Trimestre</option>
            <option value={3}>3ème Trimestre</option>
          </select>

          {/* Student Select */}
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-sky-500 max-w-[220px]"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.firstName} {s.lastName} ({s.className})
              </option>
            ))}
          </select>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all inline-flex items-center space-x-2 whitespace-nowrap"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer Bulletin PDF</span>
          </button>
        </div>
      </div>

      {/* Report Card Document View */}
      {reportCard ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 max-w-4xl mx-auto font-sans text-slate-800" id="printable-bulletin">
          {/* Official Ministry Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6">
            <div className="flex justify-between items-start text-center md:text-left">
              <div>
                <p className="text-[10px] font-extrabold tracking-widest text-amber-500 uppercase">
                  RÉPUBLIQUE DE GUINÉE
                </p>
                <p className="text-[10px] text-slate-500 italic">Travail - Justice - Solidarité</p>
                <p className="text-[11px] font-semibold text-slate-700 mt-1">{SCHOOL_INFO.ministere}</p>
                <p className="text-[10px] text-slate-500">{SCHOOL_INFO.dpe}</p>
              </div>

              <div className="text-right">
                <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">
                  {SCHOOL_INFO.name}
                </h3>
                <p className="text-[11px] text-slate-600">{SCHOOL_INFO.address}</p>
                <span className="inline-block mt-1 bg-slate-900 text-sky-400 font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                  Année Scolaire {reportCard.schoolYear}
                </span>
              </div>
            </div>

            <div className="text-center mt-4">
              <h1 className="text-lg font-black text-slate-900 uppercase tracking-wider bg-slate-100 py-1.5 rounded-xl border border-slate-200 inline-block px-8">
                BULLETIN DE NOTES — {selectedTrimester === 1 ? '1ER' : selectedTrimester === 2 ? '2ÈME' : '3ÈME'} TRIMESTRE
              </h1>
            </div>
          </div>

          {/* Student Profile Info Grid */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6 text-xs grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <span className="text-slate-500 block">Nom & Prénom :</span>
              <span className="font-extrabold text-slate-900 text-sm">{reportCard.student.firstName} {reportCard.student.lastName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Matricule :</span>
              <span className="font-mono font-bold text-sky-600">{reportCard.student.matricule}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Classe & Niveau :</span>
              <span className="font-bold text-slate-800">{reportCard.student.className} ({reportCard.student.level})</span>
            </div>
            <div>
              <span className="text-slate-500 block">Effectif de Classe :</span>
              <span className="font-bold text-slate-800 font-mono">{reportCard.totalStudentsInClass} élèves</span>
            </div>
          </div>

          {/* Grades Table */}
          <table className="w-full text-xs text-left mb-6 border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-800 text-white font-bold border-b border-slate-300">
                <th className="py-2.5 px-3 border border-slate-300">Matière & Enseignant</th>
                <th className="py-2.5 px-3 text-center border border-slate-300">Coeff.</th>
                <th className="py-2.5 px-3 text-center border border-slate-300">Moy. /20</th>
                <th className="py-2.5 px-3 border border-slate-300">Appréciation Pédagogique</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {reportCard.subjectAverages.map((sub) => (
                <tr key={sub.subjectId} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 border border-slate-300">
                    <span className="font-bold text-slate-900 block">{sub.subjectName}</span>
                    <span className="text-[10px] text-slate-500 italic">{sub.teacherName}</span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold border border-slate-300">
                    {sub.coefficient}
                  </td>
                  <td className={`py-2.5 px-3 text-center font-mono font-extrabold text-sm border border-slate-300 ${
                    sub.average >= 14 ? 'text-emerald-700' : sub.average >= 10 ? 'text-slate-800' : 'text-rose-600'
                  }`}>
                    {sub.average.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 text-[11px] border border-slate-300 italic">
                    {sub.teacherAppreciation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary & Decision Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Box 1: Averages & Rank */}
            <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2 border border-slate-800">
              <span className="text-[10px] font-bold text-amber-400 uppercase block">BILAN SYNTHÉTIQUE</span>
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-xs">Moyenne Générale :</span>
                <span className="text-xl font-mono font-extrabold text-sky-400">
                  {reportCard.overallAverage} <span className="text-xs font-normal text-slate-400">/20</span>
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                <span className="text-slate-300 text-xs">Rang dans la classe :</span>
                <span className="text-sm font-mono font-bold text-amber-400">
                  {reportCard.classRank}e / {reportCard.totalStudentsInClass}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                <span>Absences signalées :</span>
                <span>{reportCard.totalAbsences} ({reportCard.unexcusedAbsences} non justifiées)</span>
              </div>
            </div>

            {/* Box 2: Head Teacher Appreciation */}
            <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-900 uppercase block mb-1">
                  Appréciation du Professeur Principal
                </span>
                <p className="text-slate-700 italic leading-relaxed">
                  "{reportCard.headTeacherAppreciation}"
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 mt-2 flex items-center justify-between">
                <span className="font-bold text-slate-900">Décision du Conseil de Classe :</span>
                <span className="font-extrabold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-200">
                  {reportCard.decision}
                </span>
              </div>
            </div>
          </div>

          {/* Signatures & Stamp */}
          <div className="grid grid-cols-2 gap-8 pt-4 text-[11px] items-end border-t border-slate-200">
            <div className="text-center">
              <p className="text-slate-500 mb-8">Signature des Parents / Tuteurs</p>
              <p className="text-slate-400 font-mono text-[10px]">(Date & Visa)</p>
            </div>

            <div className="text-center">
              <p className="text-slate-500 mb-8">Le Chef d'Établissement & Sceau</p>
              <div className="inline-block border-2 border-slate-900 p-2 rounded-xl bg-slate-50">
                <span className="font-extrabold text-slate-900 uppercase block text-[10px]">{SCHOOL_INFO.name}</span>
                <span className="text-[9px] text-sky-600 font-bold font-mono">BULLETIN CERTIFIÉ KHARANDI</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 text-center text-slate-400 rounded-2xl">
          Sélectionnez un élève pour afficher son bulletin.
        </div>
      )}
    </div>
  );
};
