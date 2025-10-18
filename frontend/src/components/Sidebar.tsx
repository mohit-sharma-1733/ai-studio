import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      id: 'generate', 
      label: 'Generate', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      )
    },
    { 
      id: 'history', 
      label: 'History', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];

  return (
    <div className={`sidebar-transition ${isCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen flex flex-col shadow-xl`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI Studio
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Create & Inspire</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="btn-icon ml-auto"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isCollapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title={isCollapsed ? item.label : undefined}
          >
            <span className={activeTab === item.id ? 'text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400'}>
              {item.icon}
            </span>
            {!isCollapsed && (
              <span className="ml-3 font-medium">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200`}
          title={isCollapsed ? (theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode') : undefined}
        >
          {theme === 'dark' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
          {!isCollapsed && (
            <span className="ml-3 font-medium">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>

        {/* Logout Button */}
        <button
          onClick={logout}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!isCollapsed && (
            <span className="ml-3 font-medium">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
