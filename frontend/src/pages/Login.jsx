import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      if (user.role === 'employe') {
        navigate('/self-service');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <div>
            <div className="font-semibold text-gray-900">Portail RH</div>
            <div className="text-xs text-gray-400">Réseau micro-crèches</div>
          </div>
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-1">Connexion</h1>
        <p className="text-sm text-gray-500 mb-6">Accédez à votre espace RH</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="votre@email.fr"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* Comptes démo */}
        <div className="mt-6 border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-400 mb-2">Comptes démo :</p>
          <div className="flex flex-col gap-1">
            {[
              { email: 'admin@portailrh.fr', role: 'Super Admin' },
              { email: 'drh@portailrh.fr', role: 'DRH' },
              { email: 'directrice@portailrh.fr', role: 'Directrice' },
              { email: 'employe@portailrh.fr', role: 'Employé' },
              { email: 'comptable@portailrh.fr', role: 'Comptable' },
            ].map(c => (
              <button
                key={c.email}
                onClick={() => { setEmail(c.email); setPassword('Admin2026!'); }}
                className="text-left text-xs text-green-600 hover:text-green-800"
              >
                {c.role} — {c.email}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}