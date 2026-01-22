// Type definitions for Match the Match application

export type PositionZone = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface Position {
  id: string;
  name: string;
  abbreviation: string;
  zone: PositionZone;
  x: number; // Field X coordinate (0-100)
  y: number; // Field Y coordinate (0-100)
}

export interface Player {
  id: string;
  name: string;
  position: Position;
  skillLevel: number; // 1-10
  secondaryPositions?: Position[];
  createdAt: string;
}

export interface Team {
  name: string;
  color: string;
  playerIds: string[];
  totalSkill: number;
}

export interface MatchEvaluation {
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  wasBalanced: boolean;
}

export interface Match {
  id: string;
  date: string;
  selectedPlayerIds: string[];
  teamA: Team;
  teamB: Team;
  evaluation?: MatchEvaluation;
}

export interface MatchSetup {
  selectedPlayerIds: string[];
  playersPerTeam?: number;
}
