import React from 'react';
import { useGenerations } from '../hooks/useGenerations';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const { data: generations = [], isLoading: loading } = useGenerations(10);

  const totalGenerations = generations.length;
  const successfulGenerations = generations.filter(g => g.status === 'completed').length;
  const recentGenerations = generations.slice(0, 5);

  const stats = [
    {
      title: 'Total Generations',
      value: totalGenerations,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Successful',
      value: successfulGenerations,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'This Week',
      value: generations.filter(g => {
        const date = new Date(g.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return date > weekAgo;
      }).length,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome Back! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Here's what's happening with your AI creations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="card group hover:scale-105 cursor-pointer animate-slideUp"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`p-4 rounded-2xl ${stat.bgColor} ${stat.textColor} group-hover:scale-110 transition-transform duration-200`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Generations */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Recent Generations
          </h2>
          <span className="badge badge-info">
            {recentGenerations.length} items
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : recentGenerations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
              No generations yet
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Start creating amazing AI-generated images!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentGenerations.map((gen, index) => (
              <div 
                key={gen.id} 
                className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group cursor-pointer animate-slideUp"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative">
                  <img
                    src={gen.imageUrl}
                    alt="Generated"
                    className="w-20 h-20 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-shadow duration-200"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate mb-1">
                    {gen.prompt}
                  </p>
                  <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                      {gen.style}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(gen.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <span className={`badge ${gen.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                  {gen.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Start Creating
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Upload an image and let AI transform it into something amazing
              </p>
              <button 
                onClick={() => setActiveTab('generate')}
                className="btn-primary text-sm py-2 px-4"
              >
                Generate Now
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                View History
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Browse through all your previous AI generations
              </p>
              <button 
                onClick={() => setActiveTab('history')}
                className="btn-secondary text-sm py-2 px-4"
              >
                Browse History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
