// Team balancing algorithm
import { Player, Team, PositionZone } from './types';

/**
 * Main function to balance teams
 * Distribution strategy:
 * 1. Distribute goalkeepers (one to each team if possible)
 * 2. Calculate equal team sizes (odd players = +1 to one team)
 * 3. Distribute players by position (DEF and FWD priorities, MID flexible)
 * 4. Rebalance skills if there's significant difference (swap low-skill players)
 * 5. Handle extra player (if odd count) - lowest skill to team with highest score
 */
export function balanceTeams(players: Player[]): [Team, Team] {
  if (players.length < 2) {
    throw new Error('Need at least 2 players to create teams');
  }

  // Separate goalkeepers from field players
  const goalkeepers = players.filter(p => p.position.zone === 'GK');
  const fieldPlayers = players.filter(p => p.position.zone !== 'GK');

  // Initialize teams
  const teamAPlayers: Player[] = [];
  const teamBPlayers: Player[] = [];

  // Step 1: Distribute goalkeepers
  if (goalkeepers.length >= 2) {
    const sortedGKs = [...goalkeepers].sort((a, b) => b.skillLevel - a.skillLevel);
    teamAPlayers.push(sortedGKs[0]);
    teamBPlayers.push(sortedGKs[1]);
    
    // Add remaining goalkeepers to field players pool
    for (let i = 2; i < sortedGKs.length; i++) {
      fieldPlayers.push(sortedGKs[i]);
    }
  } else if (goalkeepers.length === 1) {
    teamAPlayers.push(goalkeepers[0]);
  }

  // Step 2: Calculate target team sizes
  const totalPlayers = players.length;
  const isOddCount = totalPlayers % 2 === 1;
  const baseTeamSize = Math.floor(totalPlayers / 2);
  const teamASize = baseTeamSize + (isOddCount ? 1 : 0);
  const teamBSize = baseTeamSize;

  // Current distribution after goalkeepers
  const currentFieldPlayersToDistribute = [...fieldPlayers];
  const playersNeeded = {
    teamA: teamASize - teamAPlayers.length,
    teamB: teamBSize - teamBPlayers.length
  };

  // Step 3: Distribute by position (prioritize DEF and FWD)
  const defenders = currentFieldPlayersToDistribute.filter(p => p.position.zone === 'DEF');
  const midfielders = currentFieldPlayersToDistribute.filter(p => p.position.zone === 'MID');
  const forwards = currentFieldPlayersToDistribute.filter(p => p.position.zone === 'FWD');

  // Sort each group by skill (descending)
  defenders.sort((a, b) => b.skillLevel - a.skillLevel);
  midfielders.sort((a, b) => b.skillLevel - a.skillLevel);
  forwards.sort((a, b) => b.skillLevel - a.skillLevel);

  // Distribute DEF and FWD first (high priority - must be balanced)
  distributeByPosition(defenders, teamAPlayers, teamBPlayers, teamASize, teamBSize);
  distributeByPosition(forwards, teamAPlayers, teamBPlayers, teamASize, teamBSize);
  
  // Distribute MID (low priority - flexible)
  distributeByPosition(midfielders, teamAPlayers, teamBPlayers, teamASize, teamBSize);

  // Step 4: Rebalance skills if there's significant difference
  rebalanceTeams(teamAPlayers, teamBPlayers, players);

  // Create team objects
  const teamASkill = calculateTotalSkill(teamAPlayers);
  const teamBSkill = calculateTotalSkill(teamBPlayers);

  const teamA: Team = {
    name: 'Equipo A',
    color: '#3B82F6', // Blue
    playerIds: teamAPlayers.map(p => p.id),
    totalSkill: teamASkill
  };

  const teamB: Team = {
    name: 'Equipo B',
    color: '#EF4444', // Red
    playerIds: teamBPlayers.map(p => p.id),
    totalSkill: teamBSkill
  };

  return [teamA, teamB];
}

/**
 * Distribute players from a position group between teams
 */
function distributeByPosition(
  players: Player[],
  teamAPlayers: Player[],
  teamBPlayers: Player[],
  teamAMaxSize: number,
  teamBMaxSize: number
): void {
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    
    // Check how many spaces are left in each team
    const teamASpaceLeft = teamAMaxSize - teamAPlayers.length;
    const teamBSpaceLeft = teamBMaxSize - teamBPlayers.length;
    
    // If both teams have space, alternate (prioritizing balance)
    if (teamASpaceLeft > 0 && teamBSpaceLeft > 0) {
      // Alternate: even indices to team A, odd to team B
      if (i % 2 === 0) {
        teamAPlayers.push(player);
      } else {
        teamBPlayers.push(player);
      }
    } else if (teamASpaceLeft > 0) {
      // Only team A has space
      teamAPlayers.push(player);
    } else if (teamBSpaceLeft > 0) {
      // Only team B has space
      teamBPlayers.push(player);
    }
    // If neither has space, skip (shouldn't happen with correct logic)
  }
}

/**
 * Rebalance teams by swapping low-skill players if skill difference is significant
 */
function rebalanceTeams(
  teamAPlayers: Player[],
  teamBPlayers: Player[],
  allPlayers: Player[]
): void {
  const MAX_ITERATIONS = 3;
  const SKILL_THRESHOLD = 5; // Minimum difference to trigger rebalance
  
  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    const teamASkill = calculateTotalSkill(teamAPlayers);
    const teamBSkill = calculateTotalSkill(teamBPlayers);
    const skillDifference = Math.abs(teamASkill - teamBSkill);

    // If difference is small enough, stop rebalancing
    if (skillDifference <= SKILL_THRESHOLD) {
      break;
    }

    // Team with lower skill should receive help
    const lowerTeam = teamASkill < teamBSkill ? teamAPlayers : teamBPlayers;
    const higherTeam = teamASkill < teamBSkill ? teamBPlayers : teamAPlayers;

    // Find lowest skill players in higher team (excluding goalkeepers if possible)
    const swappableLow = higherTeam
      .filter(p => p.position.zone !== 'GK')
      .sort((a, b) => a.skillLevel - b.skillLevel);

    // Find lowest skill players in lower team (excluding goalkeepers if possible)
    const swappableHigh = lowerTeam
      .filter(p => p.position.zone !== 'GK')
      .sort((a, b) => b.skillLevel - a.skillLevel);

    if (swappableLow.length > 0 && swappableHigh.length > 0) {
      // Swap: move weakest from high team to low team, move strongest from low team to high team
      const playerToMove = swappableLow[0];
      const playerToReceive = swappableHigh[0];

      const lowIndex = higherTeam.indexOf(playerToMove);
      const highIndex = lowerTeam.indexOf(playerToReceive);

      if (lowIndex > -1 && highIndex > -1) {
        higherTeam[lowIndex] = playerToReceive;
        lowerTeam[highIndex] = playerToMove;
      } else {
        break; // Stop if swap fails
      }
    } else {
      break; // Stop if no swappable players
    }
  }
}

/**
 * Calculate total skill of a group of players
 */
export function calculateTotalSkill(players: Player[]): number {
  return players.reduce((sum, player) => sum + player.skillLevel, 0);
}

/**
 * Calculate balance score (lower is better)
 * 0 means perfectly balanced
 */
export function calculateBalanceScore(teamA: Team, teamB: Team): number {
  return Math.abs(teamA.totalSkill - teamB.totalSkill);
}

/**
 * Recalculate team totals after manual changes
 */
export function recalculateTeam(team: Team, players: Player[]): Team {
  const teamPlayers = players.filter(p => team.playerIds.includes(p.id));
  return {
    ...team,
    totalSkill: calculateTotalSkill(teamPlayers)
  };
}

/**
 * Move a player from one team to another
 */
export function movePlayer(
  playerId: string,
  fromTeam: Team,
  toTeam: Team,
  allPlayers: Player[]
): [Team, Team] {
  const newFromTeam: Team = {
    ...fromTeam,
    playerIds: fromTeam.playerIds.filter(id => id !== playerId)
  };

  const newToTeam: Team = {
    ...toTeam,
    playerIds: [...toTeam.playerIds, playerId]
  };

  // Recalculate totals
  return [
    recalculateTeam(newFromTeam, allPlayers),
    recalculateTeam(newToTeam, allPlayers)
  ];
}

/**
 * Check if teams have a balanced position distribution
 */
export function checkPositionBalance(team: Team, players: Player[]): {
  hasGoalkeeper: boolean;
  defenderCount: number;
  midfielderCount: number;
  forwardCount: number;
} {
  const teamPlayers = players.filter(p => team.playerIds.includes(p.id));
  
  return {
    hasGoalkeeper: teamPlayers.some(p => p.position.zone === 'GK'),
    defenderCount: teamPlayers.filter(p => p.position.zone === 'DEF').length,
    midfielderCount: teamPlayers.filter(p => p.position.zone === 'MID').length,
    forwardCount: teamPlayers.filter(p => p.position.zone === 'FWD').length
  };
}
