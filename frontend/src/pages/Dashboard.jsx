import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import {
  TrendingUp, Users, AlertTriangle, CreditCard,
  UserCheck, Building2, BarChart3, ClipboardCheck
} from 'lucide-react';

const API = process.env.REACT_APP_API_URL;

const universMetier = [
  {
    label: 'RH',
    desc: 'Plannings, absences & paie',
    color: 'border-green-400',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    icon: UserCheck,
    links: ['Plannings', 'Absences', 'Préparation paie'],
    path: '/collaborateurs'
  },
  {
    label: 'Familles & Berceaux',
    desc: 'Inscriptions, contrats, présences',
    color: 'border-blue-400',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    icon: Users,
    links: ['Berceaux Entreprises', 'Qualité Familles'],
    path: '/familles'
  },
  {
    label: 'Établissements',
    desc: 'Sites, locaux, conformité, dossiers',
    color: 'border-orange-400',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    icon: Building2,
    links: ['Liste des sites', 'Conformité', 'Préparation contrôles'],
    path: '/etablissements'
  },
  {
    label: 'Budget & Finances',
    desc: 'PSU, dépenses, prévisionnel',
    color: 'border-amber-400',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    icon: BarChart3,
    links: ['Tableau de bord', 'Trésorerie', 'Recommandations'],
    path: '/budget'
  },
  {
    label: 'Réglementaire',
    desc: 'Agréments, échéances, CAF',
    color: 'border-purple-400',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    icon: ClipboardCheck,
    links: ['Conformité dossiers', 'HACCP'],
    path: '/reglementaire'
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`${API}/api/dashboard`, {
	headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
	})
      .then(res => setStats(res.data))
      .catch(console.error);
  }, []);

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <div className="text-xs text-green-600 font-medium uppercase tracking-wide mb-1">
          RESSOURCEA · FOCUS
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Bonjour {user?.prenom} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Vue centrale du réseau — {stats?.nb_sites || 0} établissements actifs · semaine en cours
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Taux d'occupation ETP</span>
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp size={16} className="text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-gray-900">{stats?.taux_occupation || 0}%</div>
          <div className="text-xs text-gray-400 mt-1">37 / 114 ETP cible</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Effectif</span>
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users size={16} className="text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-gray-900">{stats?.effectif || 0}</div>
          <div className="text-xs text-gray-400 mt-1">
            {stats?.cdi || 0} CDI · {stats?.cdd || 0} CDD · 0 alternance
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Alertes ouvertes</span>
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertTriangle size={16} className="text-red-500" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-gray-900">{stats?.alertes_ouvertes || 0}</div>
          <div className="text-xs text-gray-400 mt-1">
            {stats?.alertes_critiques || 0} critiques · 4 absences en attente
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Masse salariale (mois)</span>
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <CreditCard size={16} className="text-amber-600" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-gray-900">{stats?.masse_salariale || 0} k€</div>
          <div className="text-xs text-gray-400 mt-1">Base 54k€ · Var. 0€</div>
        </div>
      </div>

      {/* Univers métier */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Univers métier</h2>
        <span className="text-xs text-gray-400">Cliquez pour entrer dans un module</span>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {universMetier.map((u) => {
          const Icon = u.icon;
          return (
            <div
              key={u.label}
              onClick={() => {}}
              className={`bg-white rounded-xl border-t-4 ${u.color} border border-gray-100 p-4 cursor-pointer hover:shadow-sm transition-shadow`}
            >
              <div className={`w-8 h-8 ${u.iconBg} rounded-lg flex items-center justify-center mb-3`}>
                <Icon size={16} className={u.iconColor} />
              </div>
              <div className="font-medium text-gray-900 text-sm mb-1">{u.label}</div>
              <div className="text-xs text-gray-400 mb-3">{u.desc}</div>
              <div className="flex flex-col gap-1">
                {u.links.map(link => (
                  <span key={link} className="text-xs text-green-600 hover:text-green-800 cursor-pointer">
                    → {link}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}