// Predefined positions for football/soccer
import { Position } from './types';

export const POSITIONS: Position[] = [
  // Goalkeeper
  {
    id: 'gk',
    name: 'Arquero',
    abbreviation: 'GK',
    zone: 'GK',
    x: 10,
    y: 50
  },
  
  // Defenders
  {
    id: 'cb',
    name: 'Defensa Central',
    abbreviation: 'DC',
    zone: 'DEF',
    x: 25,
    y: 50
  },
  {
    id: 'lb',
    name: 'Lateral Izquierdo',
    abbreviation: 'LI',
    zone: 'DEF',
    x: 25,
    y: 20
  },
  {
    id: 'rb',
    name: 'Lateral Derecho',
    abbreviation: 'LD',
    zone: 'DEF',
    x: 25,
    y: 80
  },
  
  // Midfielders
  {
    id: 'cdm',
    name: 'Volante Defensivo',
    abbreviation: 'VD',
    zone: 'MID',
    x: 40,
    y: 50
  },
  {
    id: 'cm',
    name: 'Volante Central',
    abbreviation: 'VC',
    zone: 'MID',
    x: 50,
    y: 50
  },
  {
    id: 'cam',
    name: 'Volante Ofensivo',
    abbreviation: 'VO',
    zone: 'MID',
    x: 60,
    y: 50
  },
  
  // Forwards
  {
    id: 'lw',
    name: 'Extremo Izquierdo',
    abbreviation: 'EI',
    zone: 'FWD',
    x: 75,
    y: 20
  },
  {
    id: 'rw',
    name: 'Extremo Derecho',
    abbreviation: 'ED',
    zone: 'FWD',
    x: 75,
    y: 80
  },
  {
    id: 'st',
    name: 'Delantero Centro',
    abbreviation: 'DC',
    zone: 'FWD',
    x: 85,
    y: 50
  }
];

export function getPositionById(id: string): Position | undefined {
  return POSITIONS.find(p => p.id === id);
}

export function getPositionsByZone(zone: string): Position[] {
  return POSITIONS.filter(p => p.zone === zone);
}

export function getDefaultPosition(): Position {
  return POSITIONS.find(p => p.zone === 'MID') || POSITIONS[0];
}
