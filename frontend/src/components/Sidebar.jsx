import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Home, LayoutDashboard, Bell, Building2, ShieldCheck,
  ClipboardList, Scale, Utensils, FileText, Users,
  Calendar, CreditCard, LogOut, Search
} from 'lucide-react';

const navigation = [
  { section: 'ACCUEIL', items: [
    { label: 'Hub central', icon: Home, path: '/dashboard' },
    { label: 'Bienvenue chez nous', icon: Home, path: '/bienvenue' },
  ]},
  { section: 'PILOTAGE', items: [
    { label: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Alertes', icon: Bell, path: '/alertes' },
  ]},
  { section: 'ÉTABLISSEMENTS & CONFORMITÉ', items: [
    { label: 'Établissements', icon: Building2, path: '/etablissements' },
    { label: 'Conformité dossiers', icon: ShieldCheck, path: '/conformite' },
    { label: 'Préparation contrôles', icon: ClipboardList, path: '/controles' },
    { label: 'Réglementaire', icon: Scale, path: '/reglementaire' },
    { label: 'HACCP & Hygiène', icon: Utensils, path: '/haccp' },
    { label: 'Protocoles', icon: FileText, path: '/protocoles' },
  ]},
  { section: 'RESSOURCES HUMAINES', items: [
    { label: 'Collaborateurs', icon: Users, path: '/collaborateurs' },
    { label: 'Plannings', icon: Calendar, path: '/plannings' },
    { label: 'Paie', icon: CreditCard, path: '/paie' },
  ]},
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col">
      
      {/* Logo */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">Focus</div>
            <div className="text-xs text-gray-400">Vivamini · Ressourcea · Castel · Karlina</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher dans le menu..."
            className="bg-transparent text-xs text-gray-600 outline-none w-full"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        {navigation.map((group) => (
          <div key={group.section} className="mb-4">
            <div className="text-xs font-medium text-gray-400 px-2 mb-1">
              {group.section}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-0.5 transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2 mb-2">
          <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-700 text-xs font-medium">
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </span>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-900">{user?.prenom}</div>
            <div className="text-xs text-gray-400">{user?.role}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={14} />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}