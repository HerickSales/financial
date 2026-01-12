import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CreditCard, FolderOpen, Users, Plus } from 'lucide-react';

interface HeaderProps {
  onNewTransaction?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewTransaction }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/transacoes', label: 'Transações', icon: CreditCard },
    { path: '/categorias', label: 'Categorias', icon: FolderOpen },
    { path: '/usuarios', label: 'Usuários', icon: Users }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1
                className="text-2xl font-bold"
                style={{
                  background: 'linear-gradient(to right, #3B82F6, #8B5CF6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                FinanceApp
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-base"
                  style={{
                    backgroundColor: active ? '#3B82F6' : 'transparent',
                    color: active ? 'white' : 'rgb(55, 65, 81)'
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Icon size={18} className="mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Button */}
          <div className="flex items-center">
            <button
              onClick={onNewTransaction}
              className="flex items-center px-4 py-2 text-white rounded-lg transition-base font-medium"
              style={{ backgroundColor: '#10B981' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10B981'}
            >
              <Plus size={20} className="mr-2" />
              <span className="hidden sm:inline">Nova Transação</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center justify-around py-2 border-t border-gray-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center py-2 px-3 rounded-lg transition-base"
                style={{
                  color: active ? '#3B82F6' : 'rgb(107, 114, 128)'
                }}
              >
                <Icon size={20} />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;
