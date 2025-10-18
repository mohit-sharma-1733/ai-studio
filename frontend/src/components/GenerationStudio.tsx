import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreateGeneration } from '../hooks/useGenerations';
import type { Generation } from '../services/api';
import ImageUpload from './ImageUpload';

const styles = [
  { 
    value: 'realistic', 
    label: 'Realistic', 
    icon: '📸',
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Photo-realistic'
  },
  { 
    value: 'artistic', 
    label: 'Artistic', 
    icon: '🎨',
    gradient: 'from-purple-500 to-pink-500',
    description: 'Creative art'
  },
  { 
    value: 'cartoon', 
    label: 'Cartoon', 
    icon: '🎭',
    gradient: 'from-orange-500 to-red-500',
    description: 'Fun animated'
  },
  { 
    value: 'abstract', 
    label: 'Abstract', 
    icon: '🌈',
    gradient: 'from-green-500 to-teal-500',
    description: 'Conceptual'
  },
];

interface GenerationStudioProps {
  initialImage?: string;
  initialPrompt?: string;
  initialStyle?: string;
  onSuccess?: () => void;
}

const GenerationStudio: React.FC<GenerationStudioProps> = ({
  initialImage = '',
  initialPrompt = '',
  initialStyle = styles[0].value,
  onSuccess
}) => {
  const createGeneration = useCreateGeneration();
  const [image, setImage] = useState<string>(initialImage);
  const [prompt, setPrompt] = useState<string>(initialPrompt);
  const [style, setStyle] = useState<string>(initialStyle);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Generation | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setImage(initialImage);
    setPrompt(initialPrompt);
    setStyle(initialStyle);
  }, [initialImage, initialPrompt, initialStyle]);

  useEffect(() => {
    if (createGeneration.isPending) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [createGeneration.isPending]);

  const handleGenerate = async () => {
    if (!image || !prompt) {
      setError('Please upload an image and enter a prompt');
      return;
    }
    setError('');
    setResult(null);
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const data = await createGeneration.mutateAsync({
        data: {
          prompt,
          style,
          imageUpload: image,
        },
        signal: controller.signal,
      });
      setProgress(100);
      setTimeout(() => {
        setResult(data);
        setRetryCount(0);
        if (onSuccess) onSuccess();
      }, 300);
    } catch (err: any) {
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        setError('Generation aborted');
      } else if (err.response?.status === 503) {
        setError('Model overloaded. Please try again.');
        setRetryCount(prev => prev + 1);
      } else {
        setError(err.response?.data?.error || 'An error occurred');
      }
    } finally {
      setAbortController(null);
    }
  };

  const handleRetry = () => {
    if (retryCount < 3) {
      handleGenerate();
    }
  };

  const handleAbort = () => {
    abortController?.abort();
  };

  const selectedStyle = styles.find(s => s.value === style) || styles[0];

  return (
    <div className="max-w-6xl mx-auto">
        {/* Compact Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
            AI Image Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Transform your images with AI magic ✨</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Inputs */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Main Input Card */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    📸 Upload Image
                  </label>
                  <ImageUpload onImageSelect={setImage} />
                </div>

                {/* Prompt */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    ✍️ Describe Your Vision
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="textarea-field"
                    rows={4}
                    placeholder="e.g., Transform into a futuristic cyberpunk scene with neon lights..."
                  />
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {prompt.length > 0 ? '✓ Prompt added' : 'Add a creative prompt'}
                    </span>
                    <span className={`text-xs font-medium ${prompt.length > 450 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                      {prompt.length}/500
                    </span>
                  </div>
                </div>

                {/* Style Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    🎨 Choose Style
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {styles.map((s) => (
                      <motion.button
                        key={s.value}
                        onClick={() => setStyle(s.value)}
                        className={`relative p-3 rounded-xl border-2 transition-all ${
                          style === s.value
                            ? 'border-transparent shadow-lg scale-105'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {style === s.value && (
                          <motion.div
                            className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-10 rounded-xl`}
                            layoutId="selectedStyle"
                          />
                        )}
                        <div className="relative text-center">
                          <div className="text-3xl mb-1">{s.icon}</div>
                          <div className="text-xs font-bold text-gray-800 dark:text-gray-200">{s.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{s.description}</div>
                        </div>
                        {style === s.value && (
                          <div className="absolute top-1 right-1">
                            <div className={`w-5 h-5 bg-gradient-to-br ${s.gradient} rounded-full flex items-center justify-center`}>
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <div className="flex gap-3 pt-2">
                  <motion.button
                    onClick={handleGenerate}
                    disabled={createGeneration.isPending || !image || !prompt}
                    className="btn-primary flex-1 relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {createGeneration.isPending ? (
                      <>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        />
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating... {Math.round(progress)}%
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Generate Image
                      </>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {createGeneration.isPending && (
                      <motion.button
                        onClick={handleAbort}
                        className="btn-danger px-4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-3 rounded-lg"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="flex items-start">
                        <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
                          {error.includes('overloaded') && retryCount < 3 && !createGeneration.isPending && (
                            <button
                              onClick={handleRetry}
                              className="mt-2 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium underline"
                            >
                              Retry ({retryCount}/3)
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Preview/Result */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="sticky top-6">
              <AnimatePresence mode="wait">
                {createGeneration.isPending ? (
                  <motion.div
                    key="loading"
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="text-center">
                      <motion.div
                        className="w-24 h-24 mx-auto mb-4 relative"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full opacity-20 blur-xl"></div>
                        <div className="absolute inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full flex items-center justify-center">
                          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                      </motion.div>
                      
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Creating Magic</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Please wait...</p>
                      
                      <div className="mb-4">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{Math.round(progress)}%</p>
                      </div>

                      <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                        <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
                          ✨ Analyzing image...
                        </motion.p>
                        <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>
                          🎨 Applying {selectedStyle.label.toLowerCase()} style...
                        </motion.p>
                        <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}>
                          🚀 Generating masterpiece...
                        </motion.p>
                      </div>
                    </div>
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="result"
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  >
                    <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      <div className="flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <h3 className="font-bold">Complete!</h3>
                          <p className="text-xs opacity-90">Your image is ready</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <motion.div
                        className="relative group mb-4"
                        whileHover={{ scale: 1.02 }}
                      >
                        <img 
                          src={result.imageUrl} 
                          alt="Generated" 
                          className="w-full rounded-lg shadow-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button className="bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-medium">
                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                          </button>
                        </div>
                      </motion.div>
                      
                      <div className="space-y-2 text-xs">
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                          <p className="text-gray-500 dark:text-gray-400 font-semibold mb-1">PROMPT</p>
                          <p className="text-gray-700 dark:text-gray-300">{result.prompt}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                            <p className="text-gray-500 dark:text-gray-400 font-semibold mb-1">STYLE</p>
                            <p className="text-gray-700 dark:text-gray-300 capitalize">{result.style}</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                            <p className="text-gray-500 dark:text-gray-400 font-semibold mb-1">CREATED</p>
                            <p className="text-gray-700 dark:text-gray-300">{new Date(result.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Preview</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Your generated image will appear here</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
  );
};

export default GenerationStudio;
