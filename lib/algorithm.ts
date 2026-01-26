// Team balancing algorithm
import { Player, Team, PositionZone } from './types';

/**
 * Main function to balance teams
 * Distribution strategy:
 * 1. Distribute goalkeepers (with skill bonus if only 1 GK)
 * 2. Distribute players by position to balance each position zone
 * 3. Distribute remaining players by skill level
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
  let teamASkillBonus = 0; // Bonus skill for single goalkeeper scenario

  // Step 1: Distribute goalkeepers
  if (goalkeepers.length >= 2) {
    // Sort goalkeepers by skill
    const sortedGKs = [...goalkeepers].sort((a, b) => b.skillLevel - a.skillLevel);
    teamAPlayers.push(sortedGKs[0]);
    teamBPlayers.push(sortedGKs[1]);
    
    // Add remaining goalkeepers to field players
    for (let i = 2; i < sortedGKs.length; i++) {
      fieldPlayers.push(sortedGKs[i]);
    }
  } else if (goalkeepers.length === 1) {
    // Only one goalkeeper, assign to team A and add skill bonus
    teamAPlayers.push(goalkeepers[0]);
    teamASkillBonus = 3;
  }

  // Step 2: Distribute players by position
  const remainingPlayers = [...fieldPlayers];
  const positionZones: PositionZone[] = ['DEF', 'MID', 'FWD'];

  for (const zone of positionZones) {
    const playersInZone = remainingPlayers.filter(p => p.position.zone === zone);
    
    // Sort by skill descending
    playersInZone.sort((a, b) => b.skillLevel - a.skillLevel);

    // Distribute players from this position zone
    for (let i = 0; i < playersInZone.length; i++) {
      const player = playersInZone[i];
      
      // Alternate between teams for balanced position distribution
      if (i % 2 === 0) {
        teamAPlayers.push(player);
      } else {
        teamBPlayers.push(player);
      }
      
      // Remove from remaining players
      const index = remainingPlayers.indexOf(player);
      if (index > -1) {
        remainingPlayers.splice(index, 1);
      }
    }
  }

  // Step 3: Distribute remaining players by skill level
  // Sort remaining players by skill (descending)
  remainingPlayers.sort((a, b) => b.skillLevel - a.skillLevel);

  for (const player of remainingPlayers) {
    // Calculate current skill including bonus
    const teamASkill = calculateTotalSkill(teamAPlayers) + teamASkillBonus;
    const teamBSkill = calculateTotalSkill(teamBPlayers);

    if (teamASkill <= teamBSkill) {
      teamAPlayers.push(player);
    } else {
      teamBPlayers.push(player);
    }
  }

  // Create team objects with skill bonus applied
  const teamASkill = calculateTotalSkill(teamAPlayers) + teamASkillBonus;
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
    totalSkill: calculateTotalSkill(teamBPlayers)
  };

  return [teamA, teamB];
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
