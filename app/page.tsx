'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPlayers, getMatches } from '@/lib/storage';

export default function Home() {
  const [playerCount, setPlayerCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);

  useEffect(() => {
    const loadData = () => {
      setPlayerCount(getPlayers().length);
      setMatchCount(getMatches().length);
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            ⚽ Match the Match
          </h1>
          <p className="text-xl text-gray-600">
            Organiza tus partidos de fútbol amateur
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {playerCount}
            </div>
            <div className="text-gray-600">Jugadores Registrados</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {matchCount}
            </div>
            <div className="text-gray-600">Partidos Organizados</div>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Manage Players */}
          <Link href="/players">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
              <div className="text-4xl mb-4">👥</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Gestionar Jugadores
              </h2>
              <p className="text-gray-600">
                Agrega, edita o elimina jugadores de tu base de datos
              </p>
            </div>
          </Link>

          {/* Create Match */}
          <Link href="/match/setup">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500">
              <div className="text-4xl mb-4">⚽</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Crear Partido
              </h2>
              <p className="text-gray-600">
                Selecciona jugadores y genera equipos equilibrados
              </p>
            </div>
          </Link>

          {/* View Field */}
          <Link href="/match/field">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-500">
              <div className="text-4xl mb-4">🏟️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Ver Cancha
              </h2>
              <p className="text-gray-600">
                Visualiza los equipos en el campo de juego
              </p>
            </div>
          </Link>
        </div>

        {/* Instructions */}
        <div className="mt-12 max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            ¿Cómo funciona?
          </h3>
          <ol className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="font-bold text-blue-600 mr-3">1.</span>
              <span>Agrega jugadores a tu base de datos con sus posiciones y nivel de habilidad</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-blue-600 mr-3">2.</span>
              <span>Selecciona los jugadores que participarán en el partido</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-blue-600 mr-3">3.</span>
              <span>El algoritmo distribuirá automáticamente los equipos de forma equilibrada</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-blue-600 mr-3">4.</span>
              <span>Visualiza los equipos en la cancha y realiza ajustes manuales si lo deseas</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-blue-600 mr-3">5.</span>
              <span>Evalúa qué tan equilibrado quedó el partido</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
