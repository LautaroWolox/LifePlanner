import React from 'react';

export default function AccessDenied({ email }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0f0f0f] text-white p-4 text-center">
      <h1 className="text-3xl font-bold mb-4 text-red-500">Acceso Denegado</h1>
      <p className="text-white/60 mb-2">El usuario <span className="font-mono text-cyan-400">{email}</span> no tiene permisos.</p>
      <p className="text-sm text-white/40">Contacta al administrador.</p>
    </div>
  );
}