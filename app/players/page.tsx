'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Player } from '@/lib/types';
import { getPlayers, addPlayer, deletePlayer, generateId } from '@/lib/storage';
import { POSITIONS, getDefaultPosition } from '@/lib/positions';

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [positionId, setPositionId] = useState('cm');
  const [skillLevel, setSkillLevel] = useState(5);

  useEffect(() => {
    // Initial data load on mount
    const initialPlayers = getPlayers();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlayers(initialPlayers);
  }, []);

  const loadPlayers = () => {
    setPlayers(getPlayers());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const position = POSITIONS.find(p => p.id === positionId) || getDefaultPosition();

    if (editingPlayer) {
      // Update existing player
      const updatedPlayers = players.map(p =>
        p.id === editingPlayer.id
          ? { ...p, name, position, skillLevel }
          : p
      );
      setPlayers(updatedPlayers);
      if (typeof window !== 'undefined') {
        localStorage.setItem('match-the-match-players', JSON.stringify(updatedPlayers));
      }
    } else {
      // Add new player
      const newPlayer: Player = {
        id: generateId(),
        name,
        position,
        skillLevel,
        createdAt: new Date().toISOString()
      };
      addPlayer(newPlayer);
    }

    resetForm();
    loadPlayers();
  };

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setName(player.name);
    setPositionId(player.position.id);
    setSkillLevel(player.skillLevel);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este jugador?')) {
      deletePlayer(id);
      loadPlayers();
    }
  };

  const resetForm = () => {
    setName('');
    setPositionId('cm');
    setSkillLevel(5);
    setEditingPlayer(null);
    setShowForm(false);
  };

  const getPositionColor = (zone: string) => {
    switch (zone) {
      case 'GK': return 'bg-yellow-100 text-yellow-800';
      case 'DEF': return 'bg-blue-100 text-blue-800';
      case 'MID': return 'bg-green-100 text-green-800';
      case 'FWD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/" className="text-blue-600 hover:text-blue-800 mb-2 inline-block">
              ← Volver al inicio
            </Link>
            <h1 className="text-4xl font-bold text-gray-800">
              👥 Gestión de Jugadores
            </h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Cancelar' : '+ Agregar Jugador'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {editingPlayer ? 'Editar Jugador' : 'Nuevo Jugador'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nombre del jugador"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Posición
                </label>
                <select
                  value={positionId}
                  onChange={(e) => setPositionId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {POSITIONS.map(pos => (
                    <option key={pos.id} value={pos.id}>
                      {pos.name} ({pos.abbreviation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Nivel de Habilidad: {skillLevel}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>1 (Principiante)</span>
                  <span>10 (Experto)</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  {editingPlayer ? 'Actualizar' : 'Agregar'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Players List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Lista de Jugadores ({players.length})
          </h2>

          {players.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">⚽</div>
              <p className="text-xl">No hay jugadores registrados</p>
              <p className="mt-2">Agrega tu primer jugador para comenzar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map(player => (
                <div
                  key={player.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-800">
                      {player.name}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getPositionColor(player.position.zone)}`}>
                      {player.position.abbreviation}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2">
                    {player.position.name}
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Habilidad</span>
                      <span className="font-semibold">{player.skillLevel}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${player.skillLevel * 10}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(player)}
                      className="flex-1 bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors text-sm font-semibold"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(player.id)}
                      className="flex-1 bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors text-sm font-semibold"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
