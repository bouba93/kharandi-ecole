import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Student, BloodGroup } from '../../types';
import { BadgeModal } from '../common/BadgeModal';
import {
  Users,
  Search,
  Plus,
  QrCode,
  FileText,
  X,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  HeartPulse,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';

export const StudentsDirectory: React.FC = () => {
  const { students, classes, addStudent, deleteStudent, schoolInfo } = useSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string>('Tous');
  const [selectedStudentForBadge, setSelectedStudentForBadge] = useState<Student | null>(null);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<Student | null>(null);

  // New Student Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [birthDate, setBirthDate] = useState('2009-04-12');
  const [birthPlace, setBirthPlace] = useState('Conakry');
  const [classId, setClassId] = useState(classes[0]?.id || '');
  
  // Médical & Contact
  const [bloodType, setBloodType] = useState<BloodGroup>('O+');
  const [medicalNotes, setMedicalNotes] = useState('R.A.S');
  const [emergencyContact, setEmergencyContact] = useState('+224 620 00 00 00');
  
  // Tuteurs & Parents
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('+224 622 ');
  const [parentEmail, setParentEmail] = useState('');
  const [address, setAddress] = useState('Ratoma, Conakry');
  
  const [fatherName, setFatherName] = useState('');
  const [fatherPhone, setFatherPhone] = useState('+224 620 ');
  const [fatherJob, setFatherJob] = useState('');
  const [motherName, setMotherName] = useState('');
  const [motherPhone, setMotherPhone] = useState('+224 628 ');
  const [motherJob, setMotherJob] = useState('');
  const [tutorRelationship, setTutorRelationship] = useState('Père');

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      `${s.firstName} ${s.lastName} ${s.matricule} ${s.parentPhone} ${s.bloodType || ''}`
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
      bloodType,
      medicalNotes,
      emergencyContact: emergencyContact || parentPhone,
      parentName: parentName || fatherName || motherName || 'Tuteur Légal',
      parentPhone: parentPhone || fatherPhone || '+224 620 00 00 00',
      parentEmail: parentEmail || '',
      address,
      fatherName,
      fatherPhone,
      fatherJob,
      motherName,
      motherPhone,
      motherJob,
      tutorRelationship,
      enrollmentDate: new Date().toISOString().split('T')[0],
      tuitionTotal: targetClass.level === 'Lycée' ? 2200000 : targetClass.level === 'Collège' ? 1800000 : 1400000,
      tuitionPaid: 0,
      status: 'En retard',
    });

    setShowAddModal(false);
    setFirstName('');
    setLastName('');
    setParentName('');
    setFatherName('');
    setMotherName('');
    setMedicalNotes('R.A.S');
  };

  return (
    <div className="space-y-6">
      {/* Top Header with Guinean national banner accent */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="h-1.5 w-full absolute top-0 left-0 flex">
          <div className="w-1/3 bg-gn-red"></div>
          <div className="w-1/3 bg-gn-yellow"></div>
          <div className="w-1/3 bg-gn-green"></div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">Registre National des Élèves</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {filteredStudents.length} {filteredStudents.length === 1 ? 'élève inscrit' : 'élèves inscrits'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {schoolInfo.name} • Registre officiel des effectifs, santé, contacts des parents et cartes scolaires.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-gn-green hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Inscrire un élève</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom, matricule, groupe sanguin, téléphone..."
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-slate-800 focus:outline-none focus:border-gn-green font-medium"
          />
        </div>

        {/* Class Filter Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Filtrer par classe :</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-800 focus:outline-none focus:border-gn-green font-semibold"
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
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Élève</th>
                <th className="py-3 px-4">Matricule</th>
                <th className="py-3 px-4">Classe</th>
                <th className="py-3 px-4">Groupe Sanguin</th>
                <th className="py-3 px-4">Parent / Contact</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    Aucun élève trouvé pour cette recherche.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Name & Photo */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-slate-200">
                          {std.photoUrl ? (
                            <img src={std.photoUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            `${std.firstName.slice(0, 1)}${std.lastName.slice(0, 1)}`
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {std.firstName} {std.lastName}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {std.gender === 'F' ? 'Fille' : 'Garçon'} • Né(e) le {std.birthDate} ({std.birthPlace})
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Matricule */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{std.matricule}</td>

                    {/* Class */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{std.className}</span>
                      <span className="text-[10px] text-slate-500 block">{std.level}</span>
                    </td>

                    {/* Blood Group */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-xs bg-rose-50 text-gn-red border border-rose-200">
                        <HeartPulse className="w-3 h-3 text-gn-red" />
                        {std.bloodType || 'N/R'}
                      </span>
                    </td>

                    {/* Parent Contact */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block">{std.parentName}</span>
                      <span className="font-mono text-[11px] text-slate-600 block">{std.parentPhone}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${
                          std.status === 'En règle'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {std.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedStudentForBadge(std)}
                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-gn-green transition-colors border border-emerald-200 inline-flex items-center gap-1 font-semibold"
                        title="Carte d'identité scolaire officielle (Charte GN)"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span className="hidden xl:inline text-[11px]">Carte</span>
                      </button>

                      <button
                        onClick={() => setSelectedStudentDetail(std)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Fiche individuelle complète"
                      >
                        <FileText className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Confirmer la suppression de l'élève ${std.firstName} ${std.lastName} (${std.matricule}) ?`)) {
                            deleteStudent(std.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-gn-red transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* National header banner */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Formulaire d'Inscription Scolaire</h3>
                <p className="text-xs text-slate-500">Enregistrement Élève</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterStudent} className="space-y-4 text-xs">
              {/* Section: Identité de l'élève */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 text-xs block">1. Identité de l'Élève</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Prénom(s) *</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ex: Kadiatou"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Nom de famille *</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Ex: Barry"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Genre *</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as 'M' | 'F')}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green font-medium"
                    >
                      <option value="M">Masculin (Garçon)</option>
                      <option value="F">Féminin (Fille)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Date de naissance *</label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Lieu de naissance *</label>
                    <input
                      type="text"
                      value={birthPlace}
                      onChange={(e) => setBirthPlace(e.target.value)}
                      placeholder="Ex: Mamou, Conakry..."
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Classe d'affectation *</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green font-bold"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — Niveau {c.level} (Titulaire : {c.mainTeacherName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Section: Santé & Médical */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-3">
                <div className="flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-gn-red" />
                  <span className="font-bold text-slate-800 text-xs">2. Fiche Médicale & Urgence</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Groupe Sanguin *</label>
                    <select
                      value={bloodType}
                      onChange={(e) => setBloodType(e.target.value as BloodGroup)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-gn-red font-bold focus:outline-none focus:border-gn-green"
                    >
                      <option value="O+">O+ (Le plus fréquent)</option>
                      <option value="O-">O- (Donneur universel)</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+ (Receveur universel)</option>
                      <option value="AB-">AB-</option>
                      <option value="Inconnu">Non renseigné / En attente d'analyse</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Contact d'Urgence Médicale</label>
                    <input
                      type="text"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="+224 622 ..."
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Observations médicales / Allergies</label>
                  <input
                    type="text"
                    value={medicalNotes}
                    onChange={(e) => setMedicalNotes(e.target.value)}
                    placeholder="Ex: Asthme, port de lunettes, allergie pénicilline ou R.A.S"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green"
                  />
                </div>
              </div>

              {/* Section: Parents et Tuteurs */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 text-xs block">3. Parents & Coordonnées</span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Nom du Père</label>
                    <input
                      type="text"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      placeholder="Ex: Ousmane Barry"
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Téléphone Père</label>
                    <input
                      type="text"
                      value={fatherPhone}
                      onChange={(e) => setFatherPhone(e.target.value)}
                      placeholder="+224 622 ..."
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Profession Père</label>
                    <input
                      type="text"
                      value={fatherJob}
                      onChange={(e) => setFatherJob(e.target.value)}
                      placeholder="Ex: Commerçant, Ingénieur"
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Nom de la Mère</label>
                    <input
                      type="text"
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      placeholder="Ex: Hadja Rabiatou Diallo"
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Téléphone Mère</label>
                    <input
                      type="text"
                      value={motherPhone}
                      onChange={(e) => setMotherPhone(e.target.value)}
                      placeholder="+224 628 ..."
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Profession Mère</label>
                    <input
                      type="text"
                      value={motherJob}
                      onChange={(e) => setMotherJob(e.target.value)}
                      placeholder="Ex: Enseignante, Médecin"
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-slate-200">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Tuteur Principal *</label>
                    <input
                      type="text"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="Ex: Ousmane Barry"
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green font-semibold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Téléphone Alertes SMS *</label>
                    <input
                      type="text"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder="+224 622 34 56 78"
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green font-mono font-semibold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Lien de parenté</label>
                    <select
                      value={tutorRelationship}
                      onChange={(e) => setTutorRelationship(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green"
                    >
                      <option value="Père">Père</option>
                      <option value="Mère">Mère</option>
                      <option value="Oncle">Oncle</option>
                      <option value="Tante">Tante</option>
                      <option value="Frère/Sœur">Frère / Sœur</option>
                      <option value="Tuteur Légal">Tuteur Légal</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Adresse de résidence (Commune / Quartier) *</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ex: Quartier Kipé, Commune de Ratoma, Conakry"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gn-green"
                    required
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gn-green hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs"
                >
                  Valider et Enregistrer l'Élève
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gn-red"></div>
                <div className="w-3 h-3 rounded-full bg-gn-yellow"></div>
                <div className="w-3 h-3 rounded-full bg-gn-green"></div>
                <h3 className="font-bold text-slate-900 text-sm ml-1">Dossier Individuel de l'Élève</h3>
              </div>
              <button onClick={() => setSelectedStudentDetail(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Header profile card */}
              <div className="flex items-center gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base overflow-hidden border border-slate-300 shrink-0">
                  {selectedStudentDetail.photoUrl ? (
                    <img src={selectedStudentDetail.photoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    `${selectedStudentDetail.firstName.slice(0, 1)}${selectedStudentDetail.lastName.slice(0, 1)}`
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">
                    {selectedStudentDetail.firstName} {selectedStudentDetail.lastName}
                  </h4>
                  <p className="font-mono text-gn-green font-bold">{selectedStudentDetail.matricule}</p>
                  <p className="text-slate-600 font-medium">
                    {selectedStudentDetail.className} • {selectedStudentDetail.level}
                  </p>
                </div>
              </div>

              {/* Medical summary */}
              <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gn-red flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4" /> Données Médicales
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white text-gn-red font-bold text-xs border border-rose-200">
                    Groupe : {selectedStudentDetail.bloodType || 'Non renseigné'}
                  </span>
                </div>
                <p className="text-slate-700">
                  <span className="font-semibold text-slate-800">Observations : </span>
                  {selectedStudentDetail.medicalNotes || 'R.A.S'}
                </p>
                <p className="text-slate-700">
                  <span className="font-semibold text-slate-800">Contact d'urgence : </span>
                  <span className="font-mono">{selectedStudentDetail.emergencyContact || selectedStudentDetail.parentPhone}</span>
                </p>
              </div>

              {/* Family details */}
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block border-b border-slate-200 pb-1">Famille & Tuteurs</span>
                <div className="flex justify-between"><span className="text-slate-500">Tuteur responsable :</span><span className="font-bold text-slate-900">{selectedStudentDetail.parentName} ({selectedStudentDetail.tutorRelationship || 'Tuteur'})</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Téléphone SMS :</span><span className="font-mono font-bold text-slate-900">{selectedStudentDetail.parentPhone}</span></div>
                {selectedStudentDetail.fatherName && (
                  <div className="flex justify-between"><span className="text-slate-500">Père :</span><span className="font-medium text-slate-800">{selectedStudentDetail.fatherName} {selectedStudentDetail.fatherJob ? `(${selectedStudentDetail.fatherJob})` : ''}</span></div>
                )}
                {selectedStudentDetail.motherName && (
                  <div className="flex justify-between"><span className="text-slate-500">Mère :</span><span className="font-medium text-slate-800">{selectedStudentDetail.motherName} {selectedStudentDetail.motherJob ? `(${selectedStudentDetail.motherJob})` : ''}</span></div>
                )}
                <div className="flex justify-between"><span className="text-slate-500">Adresse :</span><span className="text-slate-800">{selectedStudentDetail.address}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Date d'inscription :</span><span className="text-slate-800">{selectedStudentDetail.enrollmentDate}</span></div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  onClick={() => {
                    setSelectedStudentForBadge(selectedStudentDetail);
                    setSelectedStudentDetail(null);
                  }}
                  className="px-4 py-2.5 bg-gn-green hover:bg-emerald-800 text-white font-bold rounded-lg inline-flex items-center gap-2 shadow-xs"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Imprimer la Carte Scolaire (Charte GN)</span>
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

