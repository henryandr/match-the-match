'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Match, MatchEvaluation } from '@/lib/types';
import { getCurrentMatch, saveMatch } from '@/lib/storage';

export default function EvaluationPage() {
  const router = useRouter();
  const [match, setMatch] = useState<Match | null>(null);
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [comment, setComment] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadData = () => {
      const currentMatch = getCurrentMatch();
      if (!currentMatch) {
        router.push('/match/setup');
        return;
      }
      setMatch(currentMatch);
    };
    loadData();
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!match) return;

    const evaluation: MatchEvaluation = {
      rating,
      comment: comment.trim() || undefined,
      wasBalanced: rating >= 3
    };

    const updatedMatch: Match = {
      ...match,
      evaluation
    };

    saveMatch(updatedMatch);
    setSaved(true);

    setTimeout(() => {
      router.push('/');
    }, 2000);
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

  const ratingLabels = {
    1: { text: 'Muy Desbalanceado', emoji: '😞', color: 'text-red-600' },
    2: { text: 'Desbalanceado', emoji: '😟', color: 'text-orange-600' },
    3: { text: 'Aceptable', emoji: '😐', color: 'text-yellow-600' },
    4: { text: 'Bien Equilibrado', emoji: '😊', color: 'text-green-600' },
    5: { text: 'Perfectamente Equilibrado', emoji: '🤩', color: 'text-green-700' }
  };

  const currentRating = ratingLabels[rating];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/match/field" className="text-blue-600 hover:text-blue-800 mb-2 inline-block">
            ← Volver a campo
          </Link>
          <h1 className="text-4xl font-bold text-gray-800">
            ⭐ Evaluación del Partido
          </h1>
          <p className="text-gray-600 mt-2">
            Califica qué tan equilibrado quedó el partido
          </p>
        </div>

        {saved ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-green-600 mb-2">
              ¡Evaluación Guardada!
            </h2>
            <p className="text-gray-600">
              Redirigiendo al inicio...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            {/* Team Summary */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="text-center p-4 rounded-lg" style={{ backgroundColor: match.teamA.color + '20' }}>
                <h3 className="font-bold text-lg mb-2" style={{ color: match.teamA.color }}>
                  {match.teamA.name}
                </h3>
                <div className="text-3xl font-bold" style={{ color: match.teamA.color }}>
                  {match.teamA.totalSkill}
                </div>
                <div className="text-sm text-gray-600">{match.teamA.playerIds.length} jugadores</div>
              </div>
              <div className="text-center p-4 rounded-lg" style={{ backgroundColor: match.teamB.color + '20' }}>
                <h3 className="font-bold text-lg mb-2" style={{ color: match.teamB.color }}>
                  {match.teamB.name}
                </h3>
                <div className="text-3xl font-bold" style={{ color: match.teamB.color }}>
                  {match.teamB.totalSkill}
                </div>
                <div className="text-sm text-gray-600">{match.teamB.playerIds.length} jugadores</div>
              </div>
            </div>

            {/* Rating */}
            <div className="mb-8">
              <label className="block text-gray-700 font-bold mb-4 text-center">
                ¿Qué tan equilibrado estuvo el partido?
              </label>

              <div className="text-center mb-4">
                <div className="text-6xl mb-2">{currentRating.emoji}</div>
                <div className={`text-2xl font-bold ${currentRating.color}`}>
                  {currentRating.text}
                </div>
              </div>

              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value as 1 | 2 | 3 | 4 | 5)}
                    className={`w-12 h-12 rounded-full font-bold text-lg transition-all ${
                      rating >= value
                        ? 'bg-yellow-400 text-white transform scale-110'
                        : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-8">
              <label className="block text-gray-700 font-bold mb-2">
                Comentarios (opcional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Escribe tus observaciones sobre el partido..."
              />
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <Link
                href="/match/field"
                className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors text-center"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Guardar Evaluación
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
