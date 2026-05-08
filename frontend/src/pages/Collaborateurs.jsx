import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Search, Plus, ChevronDown } from 'lucide-react';

const API = process.env.REACT_APP_API_URL;

const statutBadge = (statut) => {
  switch (statut) {
    case 'actif':
      return <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full font-medium">ACTIF</span>;
    case 'periode_essai':
      return <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full font-medium">PÉRIODE D'ESSAI</span>;
    case 'archive':
      return <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full font-medium">ARCHIVÉ</span>;
    default:
      return null;
  }
};

const contratBadge = (contrat) => (
  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
    {contrat}
  </span>
);

const tabs = ['Liste & fiches', 'Dossiers & conformité', 'Fins de contrat', 'Scan IA', 'Diff'];

export default function Collaborateurs() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/employees`, {
	headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
	})
      .then(res => setEmployees(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = employees.filter(e =>
    `${e.prenom} ${e.nom} ${e.poste} ${e.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const actifs = employees.filter(e => e.statut === 'actif').length;
  const essai = employees.filter(e => e.statut === 'periode_essai').length;

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <div className="text-xs text-green-600 font-medium uppercase tracking-wide mb-1">
          GIE RESSOURCEA · SUITE RH
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Collaborateurs & dossiers RH</h1>
        <p className="text-sm text-gray-500 mt-1">
          Liste des collaborateurs · 20 rubriques de conformité documentaire · workflows signatures
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-100 mb-6">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === i
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        <>
          {/* Stats + CTA */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">
              {actifs} actif·ve·s · {essai} en période d'essai
            </span>
            <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              <Plus size={16} />
              Ajouter un·e collaborateur·trice
            </button>
          </div>

          {/* Filtres */}
          <div className="flex gap-3 mb-4">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1">
              <Search size={14} className="text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un collaborateur..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="text-sm outline-none w-full text-gray-600"
              />
            </div>
            <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600">
              Tous les sites <ChevronDown size={14} />
            </button>
            <label className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" className="rounded" />
              Inclure archivé·e·s
            </label>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">MAT.</th>
                  <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">NOM</th>
                  <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">POSTE</th>
                  <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">AFFECTATION</th>
                  <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">CONTRAT</th>
                  <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">STATUT</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center text-sm text-gray-400 py-8">
                      Chargement...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-sm text-gray-400 py-8">
                      Aucun collaborateur trouvé
                    </td>
                  </tr>
                ) : (
                  filtered.map((emp) => (
                    <tr key={emp.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer">
                      <td className="px-4 py-3 text-xs text-gray-400 font-mono">{emp.matricule}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-green-700 text-xs font-medium">
                              {emp.prenom[0]}{emp.nom[0]}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {emp.prenom} {emp.nom}
                            </div>
                            <div className="text-xs text-gray-400">{emp.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{emp.poste}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {emp.sites?.nom || '—'}
                      </td>
                      <td className="px-4 py-3">{contratBadge(emp.contrat)}</td>
                      <td className="px-4 py-3">{statutBadge(emp.statut)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab !== 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400 text-sm">Module en cours de développement</p>
        </div>
      )}
    </Layout>
  );
}