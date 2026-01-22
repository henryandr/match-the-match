'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Player, Match } from '@/lib/types';
import { getPlayers, generateId, setCurrentMatch } from '@/lib/storage';
import { balanceTeams } from '@/lib/algorithm';

export default function MatchSetupPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);

  useEffect(() => {
    const loadData = () => {
      setPlayers(getPlayers());
    };
    loadData();
  }, []);

  const handleTogglePlayer = (playerId: string) => {
    setSelectedPlayerIds(prev =>
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handleSelectAll = () => {
    setSelectedPlayerIds(players.map(p => p.id));
  };

  const handleClearAll = () => {
    setSelectedPlayerIds([]);
  };

  const handleGenerateTeams = () => {
    if (selectedPlayerIds.length < 2) {
      alert('Necesitas al menos 2 jugadores para crear equipos');
      return;
    }

    const selectedPlayers = players.filter(p => selectedPlayerIds.includes(p.id));

    try {
      const [teamA, teamB] = balanceTeams(selectedPlayers);

      const match: Match = {
        id: generateId(),
        date: new Date().toISOString(),
        selectedPlayerIds,
        teamA,
        teamB
      };

      setCurrentMatch(match);
      router.push('/match/field');
    } catch (error) {
      alert('Error al generar equipos: ' + (error as Error).message);
    }
  };

  const selectedPlayers = players.filter(p => selectedPlayerIds.includes(p.id));
  const totalSkill = selectedPlayers.reduce((sum, p) => sum + p.skillLevel, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-2 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-4xl font-bold text-gray-800">
            ⚽ Configurar Partido
          </h1>
          <p className="text-gray-600 mt-2">
            Selecciona los jugadores que participarán en el partido
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-blue-600">
              {selectedPlayerIds.length}
            </div>
            <div className="text-gray-600">Jugadores Seleccionados</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-green-600">
              {Math.floor(selectedPlayerIds.length / 2)}
            </div>
            <div className="text-gray-600">Jugadores por Equipo</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-purple-600">
              {totalSkill}
            </div>
            <div className="text-gray-600">Skill Total</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleSelectAll}
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
          >
            Seleccionar Todos
          </button>
          <button
            onClick={handleClearAll}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Limpiar Selección
          </button>
        </div>

        {/* Players Grid */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Lista de Jugadores ({players.length})
          </h2>

          {players.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-xl">No hay jugadores disponibles</p>
              <Link
                href="/players"
                className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Agregar Jugadores
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map(player => (
                <div
                  key={player.id}
                  onClick={() => handleTogglePlayer(player.id)}
                  className={`
                    border-2 rounded-lg p-4 cursor-pointer transition-all
                    ${selectedPlayerIds.includes(player.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-blue-300'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-6 h-6 rounded border-2 flex items-center justify-center
                      ${selectedPlayerIds.includes(player.id)
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300'
                      }
                    `}>
                      {selectedPlayerIds.includes(player.id) && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{player.name}</h3>
                      <p className="text-sm text-gray-600">
                        {player.position.name} - Skill: {player.skillLevel}/10
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Generate Button */}
        {selectedPlayerIds.length >= 2 && (
          <div className="text-center">
            <button
              onClick={handleGenerateTeams}
              className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-xl hover:bg-green-700 transition-colors shadow-lg"
            >
              🎲 Generar Equipos Equilibrados
            </button>
            <p className="text-gray-600 mt-2">
              Se distribuirán {selectedPlayerIds.length} jugadores en 2 equipos
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
