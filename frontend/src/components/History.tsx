import React from 'react';
import { useGenerations } from '../hooks/useGenerations';
import type { Generation } from '../services/api';

interface HistoryProps {
  onRestore: (generation: Generation) => void;
}

const History: React.FC<HistoryProps> = ({ onRestore }) => {
  const { data: generations = [], isLoading: loading, error } = useGenerations(20);

  if (loading) {
    return (
      <div className="card animate-fadeIn">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading your history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load history';
    return (
      <div className="card animate-fadeIn">
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-xl" role="alert">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm text-red-700 dark:text-red-400 font-medium">{errorMessage}</p>
              <p className="text-xs text-red-600 dark:text-red-500 mt-1">Please try refreshing the page</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (generations.length === 0) {
    return (
      <div className="card animate-fadeIn">
        <div className="text-center py-16">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mb-6">
            <svg className="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No History Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your generated images will appear here once you start creating
          </p>
          <button className="btn-primary">
            Create Your First Generation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Generation History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse and restore your previous AI generations
          </p>
        </div>
        <span className="badge badge-info text-lg px-4 py-2">
          {generations.length} {generations.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Grid of generations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {generations.map((generation, index) => (
          <div
            key={generation.id}
            className="card group cursor-pointer hover:scale-105 animate-slideUp"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => onRestore(generation)}
          >
            {/* Image */}
            <div className="relative overflow-hidden rounded-xl mb-4">
              <img
                src={generation.imageUrl}
                alt={generation.prompt}
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <button className="btn-primary w-full text-sm py-2">
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Restore
                  </button>
                </div>
              </div>
              {/* Status badge */}
              <div className="absolute top-4 right-4">
                <span className={`badge ${generation.status === 'completed' ? 'badge-success' : 'badge-warning'} shadow-lg`}>
                  {generation.status}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3">
              {/* Prompt */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Prompt
                </p>
                <p className="text-sm text-gray-900 dark:text-white font-medium line-clamp-2">
                  {generation.prompt}
                </p>
              </div>

              {/* Meta info */}
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    <span className="capitalize">{generation.style}</span>
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {new Date(generation.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
