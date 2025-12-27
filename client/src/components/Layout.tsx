import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Wrench, Box, Users, Calendar, LayoutDashboard, List, Activity, Bell, Search, Menu, X, LogOut, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Define navigation items with role requirements
  const allNavItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard', gradient: 'from-blue-500 to-purple-600', roles: ['admin', 'member'] },
    { to: '/requests', icon: Wrench, label: 'Kanban', gradient: 'from-purple-500 to-pink-600', roles: ['admin', 'member'] },
    { to: '/requests-all', icon: List, label: 'All Requests', gradient: 'from-pink-500 to-red-600', roles: ['admin', 'member'] },
    { to: '/calendar', icon: Calendar, label: 'Calendar', gradient: 'from-cyan-500 to-blue-600', roles: ['admin', 'member'] },
    { to: '/equipment', icon: Box, label: 'Equipment', gradient: 'from-green-500 to-teal-600', roles: ['admin'] },
    { to: '/teams', icon: Users, label: 'Teams', gradient: 'from-yellow-500 to-orange-600', roles: ['admin'] },
    { to: '/activity', icon: Activity, label: 'Activity', gradient: 'from-indigo-500 to-purple-600', roles: ['admin', 'member'] },
  ];

  // Filter nav items based on user role
  const navItems = allNavItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)' }}>
      {/* Modern Header with Gradient */}
      <header className="glass sticky top-0 z-50 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  GearGuard
                </h1>
                <p className="text-xs text-gray-500 font-medium">Maintenance Tracker</p>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search equipment, requests..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/60 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 placeholder-gray-400 text-sm"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2.5 text-gray-600 hover:text-purple-600 transition-colors rounded-xl hover:bg-white/60">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>
              
              {/* User Profile Menu */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-xl hover:bg-white/60 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-gray-700">{user.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        {user.role === 'admin' ? (
                          <><Shield className="h-3 w-3" /> Admin</>
                        ) : (
                          <><User className="h-3 w-3" /> Member</>
                        )}
                      </p>
                    </div>
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {user.role === 'admin' ? 'Administrator' : 'Team Member'}
                          </span>
                        </div>
                        {user.role === 'admin' && user.managerId && (
                          <div className="mt-2 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-purple-200">
                            <p className="text-xs text-gray-500">Manager ID</p>
                            <p className="text-sm font-mono font-semibold text-purple-700">{user.managerId}</p>
                          </div>
                        )}
                        {user.role === 'member' && user.team && (
                          <p className="text-xs text-gray-500 mt-1">
                            Team: {user.team.name}
                          </p>
                        )}
                        {user.department && (
                          <p className="text-xs text-gray-500 mt-1">
                            Dept: {user.department}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-purple-600"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modern Navigation */}
      <nav className="glass border-b border-white/20 shadow-md sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex space-x-2 py-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group relative flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-xl`}></div>
                    )}
                    <item.icon className={`relative h-5 w-5 mr-2 transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`} />
                    <span className="relative">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                      isActive
                        ? 'text-white bg-gradient-to-r ' + item.gradient
                        : 'text-gray-600 hover:bg-white/60'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content with Animation */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-container">
        {children}
      </main>

      {/* Footer */}
      <footer className="glass border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Wrench className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">
                © 2025 GearGuard. All rights reserved.
              </span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-purple-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-purple-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-purple-600 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
