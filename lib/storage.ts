// LocalStorage utilities for data persistence
import { Player, Match } from './types';

const PLAYERS_KEY = 'match-the-match-players';
const MATCHES_KEY = 'match-the-match-matches';
const CURRENT_MATCH_KEY = 'match-the-match-current-match';

// Players
export function getPlayers(): Player[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(PLAYERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading players:', error);
    return [];
  }
}

export function savePlayers(players: Player[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
  } catch (error) {
    console.error('Error saving players:', error);
  }
}

export function addPlayer(player: Player): void {
  const players = getPlayers();
  players.push(player);
  savePlayers(players);
}

export function updatePlayer(id: string, updates: Partial<Player>): void {
  const players = getPlayers();
  const index = players.findIndex(p => p.id === id);
  
  if (index !== -1) {
    players[index] = { ...players[index], ...updates };
    savePlayers(players);
  }
}

export function deletePlayer(id: string): void {
  const players = getPlayers();
  const filtered = players.filter(p => p.id !== id);
  savePlayers(filtered);
}

export function getPlayerById(id: string): Player | undefined {
  const players = getPlayers();
  return players.find(p => p.id === id);
}

// Matches
export function getMatches(): Match[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(MATCHES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading matches:', error);
    return [];
  }
}

export function saveMatch(match: Match): void {
  const matches = getMatches();
  const index = matches.findIndex(m => m.id === match.id);
  
  if (index !== -1) {
    matches[index] = match;
  } else {
    matches.push(match);
  }
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
  }
}

export function getCurrentMatch(): Match | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem(CURRENT_MATCH_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading current match:', error);
    return null;
  }
}

export function setCurrentMatch(match: Match | null): void {
  if (typeof window === 'undefined') return;
  
  if (match === null) {
    localStorage.removeItem(CURRENT_MATCH_KEY);
  } else {
    localStorage.setItem(CURRENT_MATCH_KEY, JSON.stringify(match));
  }
}

// Utility to generate unique IDs
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
