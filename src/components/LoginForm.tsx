// Prebuilt login form - keeps auth UI boilerplate small

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface LoginFormProps {
  identifierLabel?: string;
  secretLabel?: string;
  submitLabel?: string;
  className?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function LoginForm({
  identifierLabel = 'Email',
  secretLabel = 'Password',
  submitLabel = 'Sign in',
  className,
  onSuccess,
  onError,
}: LoginFormProps) {
  const { signIn, isLoading, error } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [secret, setSecret] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await signIn(identifier, secret);
      onSuccess?.();
    } catch (caught) {
      onError?.(caught as Error);
    }
  };

  return (
    <form
      className={[
        'w-full max-w-sm space-y-4 rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm',
        'backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onSubmit={handleSubmit}
    >
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">
          {identifierLabel}
        </label>
        <input
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-300/60"
          type="text"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          autoComplete="username"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">
          {secretLabel}
        </label>
        <input
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-300/60"
          type="password"
          value={secret}
          onChange={(event) => setSecret(event.target.value)}
          autoComplete="current-password"
        />
      </div>
      <button
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={isLoading}
      >
        {isLoading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        )}
        {submitLabel}
      </button>
      {error && (
        <p role="alert" className="text-sm text-rose-600 animate-pulse">
          {error.message}
        </p>
      )}
    </form>
  );
}
