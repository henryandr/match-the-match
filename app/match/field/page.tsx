'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Player, Match, Team } from '@/lib/types';
import { getCurrentMatch, setCurrentMatch, getPlayers, saveMatch } from '@/lib/storage';
import { movePlayer, calculateBalanceScore } from '@/lib/algorithm';

export default function FieldPage() {
  const router = useRouter();
  const [match, setMatch] = useState<Match | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const currentMatch = getCurrentMatch();
    if (!currentMatch) {
      router.push('/match/setup');
      return;
    }

    setMatch(currentMatch);
    setPlayers(getPlayers());
  }, [router]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !match) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) return;

    const playerId = draggableId;
    let updatedTeamA = match.teamA;
    let updatedTeamB = match.teamB;

    if (source.droppableId === 'teamA' && destination.droppableId === 'teamB') {
      [updatedTeamA, updatedTeamB] = movePlayer(playerId, match.teamA, match.teamB, players);
    } else if (source.droppableId === 'teamB' && destination.droppableId === 'teamA') {
      [updatedTeamB, updatedTeamA] = movePlayer(playerId, match.teamB, match.teamA, players);
    }

    const updatedMatch = {
      ...match,
      teamA: updatedTeamA,
      teamB: updatedTeamB
    };

    setMatch(updatedMatch);
    setCurrentMatch(updatedMatch);
  };

  const handleSaveAndEvaluate = () => {
    if (match) {
      saveMatch(match);
      router.push('/evaluation');
    }
  };

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  const teamAPlayers = players.filter(p => match.teamA.playerIds.includes(p.id));
  const teamBPlayers = players.filter(p => match.teamB.playerIds.includes(p.id));
  const balanceScore = calculateBalanceScore(match.teamA, match.teamB);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/match/setup" className="text-blue-600 hover:text-blue-800 mb-2 inline-block">
            ← Volver a selección
          </Link>
          <h1 className="text-4xl font-bold text-gray-800">
            🏟️ Campo de Juego
          </h1>
          <p className="text-gray-600 mt-2">
            Arrastra jugadores entre equipos para ajustar manualmente
          </p>
        </div>

        {/* Balance Score */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-700">Balance del Partido</h3>
              <p className="text-sm text-gray-500">
                Diferencia de skills: {balanceScore}
                {balanceScore === 0 && ' - ¡Perfectamente equilibrado!'}
                {balanceScore <= 2 && balanceScore > 0 && ' - Muy equilibrado'}
                {balanceScore > 2 && balanceScore <= 5 && ' - Equilibrado'}
                {balanceScore > 5 && ' - Puede mejorarse'}
              </p>
            </div>
            <div className={`text-3xl ${balanceScore <= 2 ? 'text-green-500' : balanceScore <= 5 ? 'text-yellow-500' : 'text-red-500'}`}>
              {balanceScore <= 2 ? '😊' : balanceScore <= 5 ? '😐' : '😟'}
            </div>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Team A */}
            <Droppable droppableId="teamA">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`bg-white rounded-lg shadow-lg p-6 min-h-96 transition-colors ${
                    snapshot.isDraggingOver ? 'bg-blue-50 border-2 border-blue-400' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold" style={{ color: match.teamA.color }}>
                      {match.teamA.name}
                    </h2>
                    <div className="text-right">
                      <div className="text-3xl font-bold" style={{ color: match.teamA.color }}>
                        {match.teamA.totalSkill}
                      </div>
                      <div className="text-sm text-gray-500">Skill Total</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {teamAPlayers.map((player, index) => (
                      <Draggable key={player.id} draggableId={player.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              snapshot.isDragging
                                ? 'border-blue-500 shadow-lg bg-blue-50'
                                : 'border-blue-200 bg-blue-50 hover:border-blue-400'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-bold text-gray-800">{player.name}</div>
                                <div className="text-sm text-gray-600">
                                  {player.position.abbreviation} - {player.position.name}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-blue-600">{player.skillLevel}</div>
                                <div className="text-xs text-gray-500">skill</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>

                  {teamAPlayers.length === 0 && (
                    <div className="text-center text-gray-400 py-12">
                      <div className="text-4xl mb-2">👥</div>
                      <p>Arrastra jugadores aquí</p>
                    </div>
                  )}
                </div>
              )}
            </Droppable>

            {/* Team B */}
            <Droppable droppableId="teamB">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`bg-white rounded-lg shadow-lg p-6 min-h-96 transition-colors ${
                    snapshot.isDraggingOver ? 'bg-red-50 border-2 border-red-400' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold" style={{ color: match.teamB.color }}>
                      {match.teamB.name}
                    </h2>
                    <div className="text-right">
                      <div className="text-3xl font-bold" style={{ color: match.teamB.color }}>
                        {match.teamB.totalSkill}
                      </div>
                      <div className="text-sm text-gray-500">Skill Total</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {teamBPlayers.map((player, index) => (
                      <Draggable key={player.id} draggableId={player.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              snapshot.isDragging
                                ? 'border-red-500 shadow-lg bg-red-50'
                                : 'border-red-200 bg-red-50 hover:border-red-400'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-bold text-gray-800">{player.name}</div>
                                <div className="text-sm text-gray-600">
                                  {player.position.abbreviation} - {player.position.name}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-red-600">{player.skillLevel}</div>
                                <div className="text-xs text-gray-500">skill</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>

                  {teamBPlayers.length === 0 && (
                    <div className="text-center text-gray-400 py-12">
                      <div className="text-4xl mb-2">👥</div>
                      <p>Arrastra jugadores aquí</p>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Link
            href="/match/setup"
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
          >
            Rehacer Equipos
          </Link>
          <button
            onClick={handleSaveAndEvaluate}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            ✓ Guardar y Evaluar
          </button>
        </div>
      </div>
    </div>
  );
}
