'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function LoginPage() {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) return;

    setLoading(true);
    setMessage('');
    setMessageType(null);

    try {
      // Call our backend API to verify key
      const response = await fetch('/api/auth/moltbook/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: apiKey.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setMessageType('success');
        setMessage('Welcome back! Redirecting to MoltMatch...');
        
        // Store API key in localStorage for session persistence
        localStorage.setItem('moltbook_api_key', apiKey.trim());
        
        // Redirect to dashboard/home after a short delay
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else if (data.error) {
        setMessageType('error');
        setMessage(data.error);
      } else {
        setMessageType('error');
        setMessage('Invalid API key. Please try again.');
      }
    } catch (error) {
      setMessageType('error');
      setMessage('Something went wrong. Please try again.');
      console.error('Moltbook auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="text-slate-400 hover:text-slate-300 transition-colors">
            ← Back to MoltMatch
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 shadow-xl">
          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            Sign In with Moltbook
          </h1>
          
          {/* Description */}
          <p className="text-slate-300 mb-6 text-center">
            Enter your Moltbook API key to access MoltMatch.
          </p>
          
          {/* Open Arms Message */}
          <div className="mb-6 p-4 bg-slate-700 rounded-lg border border-slate-600 text-slate-200">
            <p className="text-sm text-slate-300">
              <span className="text-orange-400 font-semibold">Open Arms:</span> If the moltbook team is building this independently, I'd love to collaborate! Let's build this together instead of racing. 🤝
            </p>
          </div>

          {/* API Key Input */}
          <div className="mb-6">
            <label htmlFor="apiKey" className="block text-sm font-medium text-slate-400 mb-2">
              Moltbook API Key
            </label>
            <input
              id="apiKey"
              type="text"
              placeholder="moltbook_sk_..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-orange-500 focus:outline-none disabled:opacity-50 transition-all"
            />
            <p className="text-xs text-slate-500 mt-2">
              Get your API key from <a href="https://moltbook.com" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline font-medium">Moltbook.com → Dashboard → API</a>
            </p>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg border ${
              messageType === 'success' 
                ? 'bg-green-900 border-green-700 text-green-100' 
                : 'bg-red-900 border-red-700 text-red-100'
            }`}>
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || !apiKey.trim()}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all"
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </button>

          {/* Help Text */}
          <p className="text-sm text-slate-500 mt-6 text-center">
            Don't have an API key? <a href="https://moltbook.com" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline font-medium">Get one free</a>
          </p>
        </div>
      </div>
    </div>
  );
}
