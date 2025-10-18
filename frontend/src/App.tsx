import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import GenerationStudio from './components/GenerationStudio';
import History from './components/History';
import type { Generation } from './services/api';

const Studio: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [currentStyle, setCurrentStyle] = useState('realistic');
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleRestore = (generation: Generation) => {
    setCurrentImage(generation.imageUrl);
    setCurrentPrompt(generation.prompt);
    setCurrentStyle(generation.style);
    setActiveTab('generate');
  };

  const handleGenerationSuccess = () => {
    setRefreshHistory(prev => prev + 1);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'generate':
        return (
          <GenerationStudio
            initialImage={currentImage}
            initialPrompt={currentPrompt}
            initialStyle={currentStyle}
            onSuccess={handleGenerationSuccess}
          />
        );
      case 'history':
        return <History onRestore={handleRestore} key={refreshHistory} />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Studio /> : <Auth />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
