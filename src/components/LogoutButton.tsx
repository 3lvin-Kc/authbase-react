// Prebuilt logout button - quick sign out UI

import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface LogoutButtonProps {
  label?: string;
  className?: string;
  onSignedOut?: () => void;
}

export function LogoutButton({ label = 'Sign out', className, onSignedOut }: LogoutButtonProps) {
  const { signOut, isLoading } = useAuth();

  const handleClick = async () => {
    await signOut();
    onSignedOut?.();
  };

  return (
    <button
      type="button"
      className={[
        'inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm',
        'transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-400/40 border-t-slate-700" />
      )}
      {label}
    </button>
  );
}
