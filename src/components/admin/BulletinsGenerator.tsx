import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Award, Printer, Download, ChevronRight, CheckCircle2, FileText, QrCode, HeartPulse } from 'lucide-react';

export const BulletinsGenerator: React.FC = () => {
  const { students, classes, getStudentReportCard, schoolInfo } = useSchool();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3>(1);

  const reportCard = getStudentReportCard(selectedStudentId, selectedTrimester);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Bar Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Génération des Bulletins Officiels</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
              Bulletin Scolaire Officiel
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Calculs automatisés des moyennes pondérées par coefficient, classement et décisions du Conseil de classe.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Trimester Select */}
          <select
            value={selectedTrimester}
            onChange={(e) => setSelectedTrimester(Number(e.target.value) as 1 | 2 | 3)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-gn-green"
          >
            <option value={1}>1er Trimestre</option>
            <option value={2}>2ème Trimestre</option>
            <option value={3}>3ème Trimestre</option>
          </select>

          {/* Student Select */}
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-gn-green max-w-[240px]"
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
            className="px-4 py-2.5 bg-gn-green hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs transition-all inline-flex items-center gap-2 whitespace-nowrap"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer le Bulletin (A4)</span>
          </button>
        </div>
      </div>

      {/* Official Report Card Document View */}
      {reportCard ? (
        <div
          className="bg-white rounded-xl border border-slate-300 shadow-md p-6 sm:p-8 max-w-4xl mx-auto font-sans text-slate-900 relative overflow-hidden"
          id="printable-bulletin"
        >
          {/* Top National Ribbon */}
          <div className="h-2 w-full absolute top-0 left-0 flex">
            <div className="w-1/3 bg-gn-red"></div>
            <div className="w-1/3 bg-gn-yellow"></div>
            <div className="w-1/3 bg-gn-green"></div>
          </div>

          {/* Official Ministry Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-5 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              {/* Left Side: School Identity / Direction */}
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  {schoolInfo.name}
                </h3>
                <p className="text-[11px] text-slate-600 font-medium">{schoolInfo.address}</p>
                <p className="text-[10px] text-slate-500 font-mono">Tél : {schoolInfo.phone || '+224 622 00 00 00'}</p>
                <p className="text-[10px] text-slate-600 font-medium mt-1">
                  {schoolInfo.dpe}
                </p>
              </div>

              {/* Right Side: School Identity */}
              <div className="sm:text-right">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  {schoolInfo.name}
                </h3>
                <p className="text-[11px] text-slate-600 font-medium">{schoolInfo.address}</p>
                <p className="text-[10px] text-slate-500 font-mono">Tél : {schoolInfo.phone || '+224 622 00 00 00'}</p>
                <span className="inline-block mt-1 bg-slate-900 text-white font-mono font-bold text-[10px] px-2.5 py-0.5 rounded">
                  Année Scolaire {reportCard.schoolYear || schoolInfo.schoolYear || '2025-2026'}
                </span>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center mt-4">
              <h1 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider bg-slate-100 py-2 rounded-lg border border-slate-300 inline-block px-6">
                BULLETIN DE NOTES DU {selectedTrimester === 1 ? '1ER' : selectedTrimester === 2 ? '2ÈME' : '3ÈME'} TRIMESTRE
              </h1>
            </div>
          </div>

          {/* Student Profile Info Grid */}
          <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-300 mb-5 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-slate-500 block text-[11px]">Nom & Prénom(s) :</span>
              <span className="font-black text-slate-900 text-xs sm:text-sm">
                {reportCard.student.firstName} {reportCard.student.lastName}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Matricule National :</span>
              <span className="font-mono font-bold text-gn-green">{reportCard.student.matricule}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Classe & Niveau :</span>
              <span className="font-bold text-slate-800">
                {reportCard.student.className} ({reportCard.student.level})
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Groupe Sanguin :</span>
              <span className="font-bold text-gn-red">{reportCard.student.bloodType || 'O+'}</span>
            </div>

            <div className="sm:col-span-2">
              <span className="text-slate-500 block text-[11px]">Tuteur Responsable :</span>
              <span className="font-semibold text-slate-800">
                {reportCard.student.parentName} ({reportCard.student.parentPhone})
              </span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-500 block text-[11px]">Effectif de la classe :</span>
              <span className="font-bold text-slate-800 font-mono">{reportCard.totalStudentsInClass} élèves</span>
            </div>
          </div>

          {/* Official Grades Table */}
          <table className="w-full text-xs text-left mb-5 border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-900 text-white font-bold border-b border-slate-300">
                <th className="py-2 px-3 border border-slate-300">Matières d'Enseignement</th>
                <th className="py-2 px-2.5 text-center border border-slate-300">Coeff.</th>
                <th className="py-2 px-2.5 text-center border border-slate-300">Moy. /20</th>
                <th className="py-2 px-2.5 text-center border border-slate-300">Total Pondéré</th>
                <th className="py-2 px-3 border border-slate-300">Appréciations & Visa du Professeur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {reportCard.subjectAverages.map((sub) => {
                const totalWeighted = (Number(sub?.average ?? 0) * Number(sub?.coefficient ?? 1)).toFixed(1);
                return (
                  <tr key={sub.subjectId} className="hover:bg-slate-50">
                    <td className="py-2 px-3 border border-slate-300">
                      <span className="font-bold text-slate-900 block">{sub.subjectName}</span>
                      <span className="text-[10px] text-slate-500">{sub.teacherName}</span>
                    </td>
                    <td className="py-2 px-2.5 text-center font-mono font-bold border border-slate-300">
                      {sub.coefficient}
                    </td>
                    <td
                      className={`py-2 px-2.5 text-center font-mono font-extrabold text-xs border border-slate-300 ${
                        (sub?.average ?? 0) >= 14
                          ? 'text-emerald-800'
                          : (sub?.average ?? 0) >= 10
                          ? 'text-slate-900'
                          : 'text-gn-red'
                      }`}
                    >
                      {Number(sub?.average ?? 0).toFixed(2)}
                    </td>
                    <td className="py-2 px-2.5 text-center font-mono font-bold text-slate-800 border border-slate-300">
                      {totalWeighted}
                    </td>
                    <td className="py-2 px-3 text-slate-700 text-[11px] border border-slate-300 italic">
                      {sub.teacherAppreciation}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Summary Synthesis Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {/* Box 1: Averages & Rank */}
            <div className="bg-slate-900 text-white p-3.5 rounded-lg space-y-1.5 border border-slate-800">
              <span className="text-[10px] font-bold text-gn-yellow uppercase block tracking-wider">
                RÉSULTATS DE L'ÉLÈVE
              </span>
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-xs">Moyenne Générale :</span>
                <span className="text-lg font-mono font-extrabold text-emerald-400">
                  {reportCard.overallAverage} <span className="text-xs font-normal text-slate-400">/20</span>
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-700">
                <span className="text-slate-300 text-xs">Rang de l'élève :</span>
                <span className="text-sm font-mono font-bold text-gn-yellow">
                  {reportCard.classRank}e / {reportCard.totalStudentsInClass}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-300 pt-1">
                <span>Assiduité (Absences) :</span>
                <span>{reportCard.totalAbsences} h ({reportCard.unexcusedAbsences} h N.J)</span>
              </div>
            </div>

            {/* Box 2: Head Teacher Appreciation */}
            <div className="sm:col-span-2 bg-slate-50 p-3.5 rounded-lg border border-slate-300 text-xs flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-900 uppercase block mb-1 text-[11px]">
                  Appréciation du Conseil des Professeurs
                </span>
                <p className="text-slate-800 italic leading-relaxed">
                  "{reportCard.headTeacherAppreciation}"
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 mt-2 flex items-center justify-between">
                <span className="font-bold text-slate-900">Décision du Conseil :</span>
                <span className="font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  {reportCard.decision}
                </span>
              </div>
            </div>
          </div>

          {/* Signatures & Official Stamp */}
          <div className="grid grid-cols-3 gap-4 pt-4 text-[11px] items-end border-t-2 border-slate-900">
            <div className="text-center">
              <p className="font-semibold text-slate-700 mb-8">Le Professeur Principal</p>
              <p className="text-slate-400 text-[10px]">(Signature & Visa)</p>
            </div>

            <div className="text-center">
              <p className="font-semibold text-slate-700 mb-8">Visa des Parents / Tuteurs</p>
              <p className="text-slate-400 text-[10px]">(Signature)</p>
            </div>

            <div className="text-center">
              <p className="font-bold text-slate-900 mb-2">Le Chef d'Établissement</p>
              <div className="inline-block border-2 border-slate-900 p-2 rounded-lg bg-slate-50">
                <span className="font-black text-slate-900 uppercase block text-[9px]">{schoolInfo.name}</span>
                <span className="text-[8px] text-gn-green font-bold uppercase">Cachet & Signature Officielle</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 text-center text-slate-400 rounded-xl border border-slate-200">
          Sélectionnez un élève pour afficher son bulletin officiel.
        </div>
      )}
    </div>
  );
};
