import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { 
  Award, 
  Printer, 
  Palette, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  HeartPulse, 
  Image as ImageIcon,
  Layout,
  Sliders
} from 'lucide-react';

export const BulletinBadgeStudio: React.FC = () => {
  const { schoolInfo, updateSchoolInfo, students, getStudentReportCard } = useSchool();
  
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3>(1);

  // Customization State
  const [accentColor, setAccentColor] = useState<'sky' | 'emerald' | 'orange' | 'purple' | 'indigo' | 'rose'>(
    (schoolInfo as any).accentColor || 'sky'
  );
  const [badgeStyle, setBadgeStyle] = useState<'modern' | 'classic' | 'minimal'>('modern');
  const [bulletinLayout, setBulletinLayout] = useState<'standard' | 'compact' | 'detailed'>('standard');
  const [customLogo, setCustomLogo] = useState(schoolInfo.logoUrl || '');
  const [directorName, setDirectorName] = useState(schoolInfo.directorName || 'Dr. Mamadou Cellou Diallo');
  const [customStampText, setCustomStampText] = useState('DOCUMENT SCOLAIRE OFFICIEL & CERTIFIÉ');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const reportCard = getStudentReportCard(selectedStudentId, selectedTrimester);
  const student = students.find(s => s.id === selectedStudentId) || students[0];

  const handleSavePreferences = () => {
    updateSchoolInfo({
      logoUrl: customLogo,
      directorName: directorName,
      ...({ accentColor, badgeStyle, bulletinLayout } as any)
    });
    setSuccessMessage("Personnalisation des bulletins et badges enregistrée avec succès !");
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handlePrint = (elementId: string) => {
    window.print();
  };

  const colorThemes = {
    sky: { primary: 'from-sky-500 to-sky-600', bg: 'bg-sky-500', text: 'text-sky-700', border: 'border-sky-300', badgeBg: 'bg-sky-600' },
    emerald: { primary: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-300', badgeBg: 'bg-emerald-600' },
    orange: { primary: 'from-orange-500 to-orange-600', bg: 'bg-orange-500', text: 'text-orange-700', border: 'border-orange-300', badgeBg: 'bg-orange-600' },
    purple: { primary: 'from-purple-500 to-purple-600', bg: 'bg-purple-500', text: 'text-purple-700', border: 'border-purple-300', badgeBg: 'bg-purple-600' },
    indigo: { primary: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-500', text: 'text-indigo-700', border: 'border-indigo-300', badgeBg: 'bg-indigo-600' },
    rose: { primary: 'from-rose-500 to-rose-600', bg: 'bg-rose-500', text: 'text-rose-700', border: 'border-rose-300', badgeBg: 'bg-rose-600' },
  };

  const currentTheme = colorThemes[accentColor] || colorThemes.sky;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-sky-600 text-white flex items-center justify-center shadow-md">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Studio de Personnalisation • Bulletins & Badges</h1>
              <p className="text-xs text-slate-500">Personnalisez les couleurs, le design, les logos et la typographie de vos documents officiels.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSavePreferences}
            className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-orange-500 hover:from-sky-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-orange-200" />
            <span>Enregistrer le Design</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Grid: Controls vs Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Customization Controls */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Palette className="w-4 h-4 text-sky-500" />
              <span>Options de Style & Couleurs</span>
            </h2>

            {/* Color Palette Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Palette de Couleurs Principale
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(colorThemes) as Array<keyof typeof colorThemes>).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setAccentColor(c)}
                    className={`p-2.5 rounded-xl border text-xs font-bold capitalize flex items-center justify-center gap-2 transition-all ${
                      accentColor === c
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-sky-50'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full bg-${c}-500 inline-block`}></span>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Logo URL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Logo de l'Établissement (URL d'image)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customLogo}
                  onChange={(e) => setCustomLogo(e.target.value)}
                  placeholder="https://..."
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:border-sky-500"
                />
                <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Director Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nom du Signataire (Directeur / Proviseur)
              </label>
              <input
                type="text"
                value={directorName}
                onChange={(e) => setDirectorName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Stamp Text */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mention du Cachet Officiel
              </label>
              <input
                type="text"
                value={customStampText}
                onChange={(e) => setCustomStampText(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Badge Style */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Style de la Carte d'Identité Scolaire
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['modern', 'classic', 'minimal'] as const).map((sty) => (
                  <button
                    key={sty}
                    type="button"
                    onClick={() => setBadgeStyle(sty)}
                    className={`p-2 rounded-xl border text-xs font-bold capitalize transition-all ${
                      badgeStyle === sty
                        ? 'border-sky-500 bg-sky-50 text-sky-800 shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {sty}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector for Preview Student & Trimester */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Élève en Aperçu
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-sky-500"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.className})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Trimestre du Bulletin
                </label>
                <select
                  value={selectedTrimester}
                  onChange={(e) => setSelectedTrimester(Number(e.target.value) as 1 | 2 | 3)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-sky-500"
                >
                  <option value={1}>1er Trimestre</option>
                  <option value={2}>2ème Trimestre</option>
                  <option value={3}>3ème Trimestre</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Previews (Bulletin & Badge) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Bulletin Preview Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-sky-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-500" />
                <h3 className="font-bold text-slate-900 text-sm">Aperçu Dynamique du Bulletin</h3>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer Bulletin</span>
              </button>
            </div>

            {/* Live Bulletin Document Container */}
            {reportCard && student && (
              <div className="bg-white rounded-xl border border-slate-300 p-6 shadow-sm relative overflow-hidden text-slate-900 font-sans" id="printable-bulletin">
                {/* Accent Header Ribbon */}
                <div className={`h-2 w-full absolute top-0 left-0 bg-gradient-to-r ${currentTheme.primary}`}></div>

                {/* Bulletin Header */}
                <div className="border-b-2 border-slate-900 pb-4 mb-4 pt-2 flex justify-between items-start">
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-tight text-slate-900">
                      {schoolInfo.name}
                    </h2>
                    <p className="text-[11px] text-slate-600">{schoolInfo.address}</p>
                    <p className="text-[10px] text-slate-500 font-mono">Tél : {schoolInfo.phone}</p>
                    <p className="text-[10px] text-slate-600 font-bold mt-1">{schoolInfo.dpe}</p>
                  </div>

                  <div className="text-right">
                    <span className="inline-block bg-slate-900 text-white font-mono font-bold text-[10px] px-2.5 py-0.5 rounded">
                      Année {schoolInfo.schoolYear}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">{customStampText}</p>
                  </div>
                </div>

                {/* Title */}
                <div className="text-center mb-4">
                  <span className={`text-xs sm:text-sm font-black uppercase tracking-wider bg-slate-100 py-1.5 px-6 rounded-lg border border-slate-300 inline-block ${currentTheme.text}`}>
                    BULLETIN DE NOTES • {selectedTrimester === 1 ? '1ER' : selectedTrimester === 2 ? '2ÈME' : '3ÈME'} TRIMESTRE
                  </span>
                </div>

                {/* Student Info Box */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Élève :</span>
                    <span className="font-black text-slate-900">{student.firstName} {student.lastName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Matricule :</span>
                    <span className="font-mono font-bold text-sky-600">{student.matricule}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Classe :</span>
                    <span className="font-bold text-slate-800">{student.className}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Moyenne Trimestrielle :</span>
                    <span className={`font-black text-sm ${currentTheme.text}`}>
                      {reportCard?.generalAverage !== undefined && reportCard?.generalAverage !== null ? reportCard.generalAverage.toFixed(2) : '0.00'} / 20
                    </span>
                  </div>
                </div>

                {/* Grades Table Summary */}
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900 text-white">
                        <th className="p-2.5 rounded-l-lg">Matière</th>
                        <th className="p-2.5 text-center">Coef</th>
                        <th className="p-2.5 text-center">Moyenne /20</th>
                        <th className="p-2.5 text-center">Rang</th>
                        <th className="p-2.5 rounded-r-lg">Appréciation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      {reportCard.subjectAverages.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-900">{item.subjectName}</td>
                          <td className="p-2.5 text-center font-mono">{item.coefficient}</td>
                          <td className={`p-2.5 text-center font-bold font-mono ${(item?.average ?? 0) >= 10 ? 'text-emerald-700' : 'text-rose-600'}`}>
                            {item?.average !== undefined && item?.average !== null ? item.average.toFixed(2) : '0.00'}
                          </td>
                          <td className="p-2.5 text-center font-mono">{item.rank}</td>
                          <td className="p-2.5 text-slate-600 italic text-[11px]">{item.appreciation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer Signoff */}
                <div className="pt-4 border-t border-slate-200 flex justify-between items-end text-xs">
                  <div>
                    <p className="text-[10px] text-slate-500">Décision du Conseil : <strong className="text-slate-800 uppercase">{(reportCard?.generalAverage ?? 0) >= 10 ? 'Tableau d\'Honneur / Admis(e)' : 'Avertissement / Soutien Requis'}</strong></p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Le Chef d'Établissement</p>
                    <p className="text-xs font-black text-slate-900 mt-4">{directorName}</p>
                    <span className="text-[9px] text-slate-400 italic">(Cachet & Signature)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Badge Preview Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-sky-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-slate-900 text-sm">Aperçu Dynamique de la Carte d'Identité Scolaire</h3>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer Carte</span>
              </button>
            </div>

            {/* Live Student Badge */}
            {student && (
              <div className="flex justify-center p-4 bg-slate-100 rounded-xl">
                <div className="w-[360px] bg-white text-slate-900 rounded-2xl shadow-xl border-2 border-slate-300 relative overflow-hidden text-left">
                  {/* Top Accent Ribbon */}
                  <div className={`h-2.5 w-full bg-gradient-to-r ${currentTheme.primary}`}></div>

                  {/* Header */}
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 text-center">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">
                      {schoolInfo.name}
                    </h4>
                    <p className="text-[9px] text-slate-600 font-medium">
                      {schoolInfo.dpe}
                    </p>
                    <div className={`mt-1.5 inline-block ${currentTheme.badgeBg} text-white font-bold text-[9px] uppercase px-3 py-0.5 rounded-full tracking-wider shadow-xs`}>
                      CARTE D'IDENTITÉ SCOLAIRE • {schoolInfo.schoolYear}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-20 h-24 rounded-lg overflow-hidden border-2 border-slate-800 shadow-sm shrink-0 bg-slate-200">
                        <img
                          src={student.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                          alt={`${student.firstName} ${student.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-1 text-xs">
                        <h3 className="text-sm font-black text-slate-900 uppercase leading-tight">
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className={`font-mono text-[11px] font-bold ${currentTheme.text}`}>
                          MAT : {student.matricule}
                        </p>
                        <p className="text-[11px] font-bold text-slate-800">
                          CLASSE : <span className="text-slate-900">{student.className}</span>
                        </p>
                        <p className="text-[10px] text-slate-600">
                          Né(e) le : <strong className="text-slate-800">{student.birthDate}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Contact Strip */}
                    <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 text-[10px] space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium">Groupe Sanguin :</span>
                        <span className="inline-flex items-center gap-1 font-bold text-rose-600 bg-white px-1.5 py-0.2 rounded border border-rose-200">
                          <HeartPulse className="w-3 h-3 text-rose-600" />
                          {student.bloodType || 'O+'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium">Tuteur :</span>
                        <span className="font-bold text-slate-900">{student.parentName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium">Urgence :</span>
                        <span className="font-mono font-bold text-slate-900">{student.parentPhone}</span>
                      </div>
                    </div>

                    {/* QR Verification */}
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-white p-1 rounded border border-slate-300">
                          <QrCode className="w-7 h-7 text-slate-900" />
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-500 block uppercase font-bold">Vérification QR</span>
                          <span className={`text-[9px] font-bold ${currentTheme.text}`}>Document Certifié</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[8px] text-slate-500 block uppercase font-semibold">Le Directeur</span>
                        <span className="text-[9px] font-bold text-slate-800 uppercase italic">{directorName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Accent Ribbon */}
                  <div className={`h-2 w-full bg-gradient-to-r ${currentTheme.primary}`}></div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
