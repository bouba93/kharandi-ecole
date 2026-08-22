import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Student, LevelCategory } from '../../types';
import { BadgeModal } from '../common/BadgeModal';
import {
  Users,
  Search,
  Plus,
  ShieldCheck,
  CreditCard,
  QrCode,
  Phone,
  Mail,
  MapPin,
  Calendar,
  X,
  FileText,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const StudentsDirectory: React.FC = () => {
  const { students, classes, addStudent, updateStudent, deleteStudent } = useSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string>('Tous');
  const [selectedStudentForBadge, setSelectedStudentForBadge] = useState<Student | null>(null);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<Student | null>(null);

  // New Student Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [birthDate, setBirthDate] = useState('2008-05-10');
  const [birthPlace, setBirthPlace] = useState('Conakry');
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('+224 ');
  const [parentEmail, setParentEmail] = useState('');
  const [address, setAddress] = useState('Ratoma, Conakry');
  const [tuitionTotal, setTuitionTotal] = useState(1800000); // 1.8M GNF default

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      `${s.firstName} ${s.lastName} ${s.matricule} ${s.parentPhone}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesClass = selectedClassId === 'Tous' || s.classId === selectedClassId;
    return matchesSearch && matchesClass;
  });

  const handleRegisterStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    const targetClass = classes.find((c) => c.id === classId) || classes[0];

    addStudent({
      firstName,
      lastName,
      gender,
      birthDate,
      birthPlace,
      classId: targetClass.id,
      className: targetClass.name,
      level: targetClass.level,
      parentName: parentName || 'Tuteur Légal',
      parentPhone: parentPhone || '+224 620 00 00 00',
      parentEmail: parentEmail || 'parent@kharandi.gn',
      address,
      enrollmentDate: new Date().toISOString().split('T')[0],
      tuitionTotal: Number(tuitionTotal),
      tuitionPaid: 0,
      status: 'En retard',
    });

    setShowAddModal(false);
    setFirstName('');
    setLastName('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block">
            DOSSIERS SCOLAIRES & MATRICULES
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Répertoire Général des Élèves & Badges
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestion des inscriptions, suivi des dossiers, contacts tuteurs et génération de badges d'identité scolaires.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all inline-flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Inscrire un Nouvel Élève</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom, matricule, téléphone..."
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-slate-800 focus:outline-none focus:border-[#18bfd6]"
          />
        </div>

        {/* Class Filter Dropdown */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Classe :</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-[#18bfd6] w-full md:w-auto font-semibold"
          >
            <option value="Tous">Toutes les classes ({students.length})</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({students.filter((s) => s.classId === c.id).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Élève</th>
                <th className="py-3.5 px-4">Matricule</th>
                <th className="py-3.5 px-4">Classe & Niveau</th>
                <th className="py-3.5 px-4">Parent / Contact</th>
                <th className="py-3.5 px-4 text-right">Scolarité (GNF)</th>
                <th className="py-3.5 px-4 text-center">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Aucun élève ne correspond à votre recherche.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Name & Photo */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={std.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                          alt={std.firstName}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-extrabold text-slate-900 text-sm block">
                            {std.firstName} {std.lastName}
                          </span>
                          <span className="text-[10px] text-slate-400">Né(e) le {std.birthDate}</span>
                        </div>
                      </div>
                    </td>

                    {/* Matricule */}
                    <td className="py-3 px-4 font-mono font-bold text-[#18bfd6]">{std.matricule}</td>

                    {/* Class */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">{std.className}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{std.level}</span>
                    </td>

                    {/* Parent Contact */}
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800 block">{std.parentName}</span>
                      <span className="text-[10px] font-mono text-[#fcb303] font-bold">{std.parentPhone}</span>
                    </td>

                    {/* Tuition Progress */}
                    <td className="py-3 px-4 text-right font-mono">
                      <span className="font-bold text-slate-900 block">
                        {std.tuitionPaid.toLocaleString()} GNF
                      </span>
                      <span className="text-[10px] text-slate-400">
                        sur {std.tuitionTotal.toLocaleString()} GNF
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          std.status === 'En règle'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {std.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => setSelectedStudentForBadge(std)}
                        className="p-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-[#18bfd6] transition-colors"
                        title="Générer Badge Scolaire avec QR Code"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setSelectedStudentDetail(std)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Fiche Élève Détaillée"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200 my-8">
            <h3 className="font-extrabold text-slate-900 text-base mb-4">Inscrire un Nouvel Élève</h3>

            <form onSubmit={handleRegisterStudent} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ex : Kadiatou"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#18bfd6]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nom de Famille</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ex : Diallo"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#18bfd6]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Genre</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'M' | 'F')}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#18bfd6]"
                  >
                    <option value="M">Masculin (M)</option>
                    <option value="F">Féminin (F)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date Naissance</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#18bfd6]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lieu Naissance</label>
                  <input
                    type="text"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    placeholder="Ex : Conakry"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#18bfd6]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Classe d'Affectation</label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#18bfd6]"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.level})
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t border-slate-100 pt-3 mt-3">
                <span className="text-[10px] font-bold text-[#fcb303] uppercase block mb-2">
                  INFORMATIONS PARENT / TUTEUR
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nom du Parent</label>
                    <input
                      type="text"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="Ex : M. Ousmane Barry"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#18bfd6]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tél. SMS / Mobile Money</label>
                    <input
                      type="text"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder="+224 622 00 11 22"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#18bfd6] font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Total Frais Annuel (GNF)</label>
                <input
                  type="number"
                  value={tuitionTotal}
                  onChange={(e) => setTuitionTotal(Number(e.target.value))}
                  step={100000}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#18bfd6] font-mono font-bold"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#18bfd6] hover:bg-[#15aabf] text-white font-bold rounded-xl shadow-sm"
                >
                  Valider l'Inscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Detail Drawer */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-extrabold text-slate-900 text-base">Fiche Scolaire Élève</h3>
              <button onClick={() => setSelectedStudentDetail(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <img
                  src={selectedStudentDetail.photoUrl}
                  alt={selectedStudentDetail.firstName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#18bfd6]"
                />
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">
                    {selectedStudentDetail.firstName} {selectedStudentDetail.lastName}
                  </h4>
                  <p className="font-mono font-bold text-[#18bfd6]">{selectedStudentDetail.matricule}</p>
                  <p className="text-slate-500">{selectedStudentDetail.className} ({selectedStudentDetail.level})</p>
                </div>
              </div>

              <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between"><span className="text-slate-500">Parent/Tuteur :</span><span className="font-semibold">{selectedStudentDetail.parentName}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Téléphone Parent :</span><span className="font-mono text-[#fcb303] font-bold">{selectedStudentDetail.parentPhone}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Adresse :</span><span>{selectedStudentDetail.address}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Versement Effectué :</span><span className="font-bold text-emerald-600 font-mono">{selectedStudentDetail.tuitionPaid.toLocaleString()} GNF</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Reste à Payer :</span><span className="font-bold text-rose-600 font-mono">{(selectedStudentDetail.tuitionTotal - selectedStudentDetail.tuitionPaid).toLocaleString()} GNF</span></div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => {
                    setSelectedStudentForBadge(selectedStudentDetail);
                    setSelectedStudentDetail(null);
                  }}
                  className="px-4 py-2 bg-[#18bfd6] text-white font-bold rounded-xl shadow-sm inline-flex items-center space-x-1.5"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Imprimer Badge</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Badge Modal */}
      {selectedStudentForBadge && (
        <BadgeModal student={selectedStudentForBadge} onClose={() => setSelectedStudentForBadge(null)} />
      )}
    </div>
  );
};
