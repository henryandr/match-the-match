# 📖 Guía Completa de Estructura - Match the Match

## 🎯 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Cómo Cambiar Colores](#cómo-cambiar-colores)
4. [Cómo Cambiar Tamaños de Fuentes](#cómo-cambiar-tamaños-de-fuentes)
5. [Cómo Modificar el Algoritmo de Distribución](#cómo-modificar-el-algoritmo-de-distribución)
6. [Ubicación de Componentes Específicos](#ubicación-de-componentes-específicos)
7. [Sistema de Almacenamiento](#sistema-de-almacenamiento)
8. [Flujo de la Aplicación](#flujo-de-la-aplicación)

---

## 🏗️ Visión General

**Match the Match** es una aplicación Next.js 14+ con App Router que permite organizar partidos de fútbol amateur distribuyendo jugadores en equipos equilibrados.

**Tecnologías principales:**
- Next.js 16 (React 19)
- TypeScript
- Tailwind CSS 4
- LocalStorage para persistencia de datos
- @hello-pangea/dnd para drag & drop

---

## 📁 Estructura del Proyecto

```
match-the-match/
├── app/                          # Next.js App Router
│   ├── globals.css              # Estilos globales y configuración de Tailwind
│   ├── layout.tsx               # Layout raíz de la aplicación
│   ├── page.tsx                 # Página principal (/)
│   ├── players/                 # Gestión de jugadores
│   │   └── page.tsx            # Página /players
│   ├── match/                   # Configuración y visualización de partidos
│   │   ├── setup/              # Selección de jugadores
│   │   │   └── page.tsx       # Página /match/setup
│   │   └── field/              # Cancha con equipos formados
│   │       └── page.tsx       # Página /match/field
│   └── evaluation/             # Evaluación de partidos
│       └── page.tsx            # Página /evaluation
├── lib/                         # Lógica de negocio y utilidades
│   ├── algorithm.ts            # 🔥 Algoritmo de distribución de equipos
│   ├── positions.ts            # Definiciones de posiciones de fútbol
│   ├── storage.ts              # Funciones de LocalStorage
│   └── types.ts                # Definiciones de tipos TypeScript
├── public/                      # Archivos estáticos
├── package.json                # Dependencias del proyecto
├── next.config.ts              # Configuración de Next.js
├── tsconfig.json               # Configuración de TypeScript
├── postcss.config.mjs          # Configuración de PostCSS/Tailwind
└── eslint.config.mjs           # Configuración de ESLint
```

---

## 🎨 Cómo Cambiar Colores

### Colores del Tema General

Los colores del tema se definen en **`app/globals.css`**:

```css
:root {
  --background: #ffffff;    /* Color de fondo modo claro */
  --foreground: #171717;    /* Color de texto modo claro */
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;  /* Color de fondo modo oscuro */
    --foreground: #ededed;  /* Color de texto modo oscuro */
  }
}
```

**Para cambiar el color de fondo general:**
```css
:root {
  --background: #f0f9ff;  /* Ejemplo: azul muy claro */
}
```

### Colores de Gradientes de Fondo

Todas las páginas usan un gradiente de fondo definido con Tailwind CSS. Se encuentra en cada archivo de página:

**Archivo:** `app/page.tsx`, `app/players/page.tsx`, `app/match/setup/page.tsx`, `app/match/field/page.tsx`

```tsx
<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
```

**Cómo cambiar:**
```tsx
// Ejemplo 1: Gradiente naranja a rosa
<div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">

// Ejemplo 2: Gradiente púrpura a azul
<div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">

// Ejemplo 3: Sin gradiente, color sólido
<div className="min-h-screen bg-gray-100">
```

### Colores de los Equipos

**Archivo:** `lib/algorithm.ts` (líneas 59-67)

```typescript
const teamA: Team = {
  name: 'Equipo A',
  color: '#3B82F6', // 🔵 Azul - CAMBIAR AQUÍ
  playerIds: teamAPlayers.map(p => p.id),
  totalSkill: calculateTotalSkill(teamAPlayers)
};

const teamB: Team = {
  name: 'Equipo B',
  color: '#EF4444', // 🔴 Rojo - CAMBIAR AQUÍ
  playerIds: teamBPlayers.map(p => p.id),
  totalSkill: calculateTotalSkill(teamBPlayers)
};
```

**Ejemplos de colores:**
```typescript
// Verde y Naranja
teamA.color = '#10B981';  // Verde
teamB.color = '#F97316';  // Naranja

// Púrpura y Amarillo
teamA.color = '#8B5CF6';  // Púrpura
teamB.color = '#F59E0B';  // Amarillo

// Negro y Blanco
teamA.color = '#1F2937';  // Gris oscuro
teamB.color = '#F3F4F6';  // Gris claro
```

### Colores de Tarjetas y Botones

**Botones principales** (ejemplo en `app/page.tsx`):

```tsx
{/* Botón azul */}
<button className="bg-blue-600 hover:bg-blue-700 text-white ...">

{/* Botón verde */}
<button className="bg-green-600 hover:bg-green-700 text-white ...">

{/* Botón rojo */}
<button className="bg-red-600 hover:bg-red-700 text-white ...">
```

**Bordes de hover en tarjetas** (`app/page.tsx` líneas 54-62):

```tsx
<div className="... hover:border-blue-500">    {/* Borde azul */}
<div className="... hover:border-green-500">   {/* Borde verde */}
<div className="... hover:border-purple-500">  {/* Borde púrpura */}
```

### Colores de Posiciones de Jugadores

**Archivo:** `app/players/page.tsx` (líneas 83-89)

```typescript
const getPositionColor = (zone: string) => {
  switch (zone) {
    case 'GK': return 'bg-yellow-100 text-yellow-800';   // Arquero - Amarillo
    case 'DEF': return 'bg-blue-100 text-blue-800';      // Defensa - Azul
    case 'MID': return 'bg-green-100 text-green-800';    // Mediocampo - Verde
    case 'FWD': return 'bg-red-100 text-red-800';        // Delantero - Rojo
    default: return 'bg-gray-100 text-gray-800';
  }
};
```

**Cómo cambiar:**
```typescript
case 'GK': return 'bg-purple-100 text-purple-800';  // Arquero morado
case 'DEF': return 'bg-cyan-100 text-cyan-800';     // Defensa cyan
case 'MID': return 'bg-lime-100 text-lime-800';     // Mediocampo lima
case 'FWD': return 'bg-orange-100 text-orange-800'; // Delantero naranja
```

---

## 📏 Cómo Cambiar Tamaños de Fuentes

### Títulos Principales (h1)

**Ubicación:** Todas las páginas principales

**Página principal** (`app/page.tsx` línea 24):
```tsx
<h1 className="text-5xl font-bold text-gray-800 mb-4">
  ⚽ Match the Match
</h1>
```

**Cómo cambiar:**
```tsx
{/* Más pequeño */}
<h1 className="text-3xl font-bold ...">

{/* Tamaño normal */}
<h1 className="text-4xl font-bold ...">

{/* Más grande */}
<h1 className="text-6xl font-bold ...">

{/* Extra grande */}
<h1 className="text-7xl font-bold ...">
```

**Escalas de Tailwind:**
- `text-xs` - 0.75rem (12px)
- `text-sm` - 0.875rem (14px)
- `text-base` - 1rem (16px)
- `text-lg` - 1.125rem (18px)
- `text-xl` - 1.25rem (20px)
- `text-2xl` - 1.5rem (24px)
- `text-3xl` - 1.875rem (30px)
- `text-4xl` - 2.25rem (36px)
- `text-5xl` - 3rem (48px)
- `text-6xl` - 3.75rem (60px)
- `text-7xl` - 4.5rem (72px)
- `text-8xl` - 6rem (96px)
- `text-9xl` - 8rem (128px)

### Subtítulos y Descripciones

**Descripción principal** (`app/page.tsx` línea 27):
```tsx
<p className="text-xl text-gray-600">
  Organiza tus partidos de fútbol amateur
</p>
```

**Cómo cambiar:**
```tsx
<p className="text-lg text-gray-600">   {/* Más pequeño */}
<p className="text-2xl text-gray-600">  {/* Más grande */}
```

### Números de Estadísticas

**Contadores principales** (`app/page.tsx` línea 35):
```tsx
<div className="text-4xl font-bold text-blue-600 mb-2">
  {playerCount}
</div>
```

**Cómo cambiar:**
```tsx
<div className="text-5xl font-bold ...">  {/* Más grande */}
<div className="text-6xl font-bold ...">  {/* Aún más grande */}
```

### Títulos de Tarjetas

**Tarjetas de acciones** (`app/page.tsx` línea 58):
```tsx
<h2 className="text-2xl font-bold text-gray-800 mb-2">
  Gestionar Jugadores
</h2>
```

### Texto de Formularios y Labels

**Labels de formulario** (`app/players/page.tsx` línea 124):
```tsx
<label className="block text-gray-700 font-semibold mb-2">
  Nombre
</label>
```

**Para cambiar:**
```tsx
<label className="block text-sm text-gray-700 ...">    {/* Más pequeño */}
<label className="block text-base text-gray-700 ...">  {/* Normal */}
<label className="block text-lg text-gray-700 ...">    {/* Más grande */}
```

### Texto en Listas de Jugadores

**Nombres de jugadores** (`app/match/field/page.tsx` línea 156):
```tsx
<div className="font-bold text-gray-800">{player.name}</div>
<div className="text-sm text-gray-600">
  {player.position.abbreviation} - {player.position.name}
</div>
```

### Fuente Global del Body

**Archivo:** `app/globals.css` (línea 24)

```css
body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;  /* CAMBIAR AQUÍ */
}
```

**Ejemplos de fuentes:**
```css
/* Fuentes del sistema */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Fuentes Google (requiere importación) */
font-family: 'Roboto', sans-serif;
font-family: 'Inter', sans-serif;
font-family: 'Poppins', sans-serif;
```

---

## ⚙️ Cómo Modificar el Algoritmo de Distribución

El algoritmo está en **`lib/algorithm.ts`**. Es el corazón de la aplicación.

### Algoritmo Actual: 3 Pasos (Arqueros → Posiciones → Skills)

**Ubicación:** `lib/algorithm.ts` función `balanceTeams()`

**Cómo funciona actualmente:**

#### Paso 1: Distribución de Arqueros
- **Con 2+ arqueros**: Asigna el mejor a cada equipo (por skill)
- **Con 1 arquero**: Lo asigna al Equipo A y suma **3 puntos de skill bonus** para equilibrar
- **Sin arqueros**: Continúa con el paso 2

```typescript
// Código del Paso 1 (líneas 35-46)
if (goalkeepers.length >= 2) {
  const sortedGKs = [...goalkeepers].sort((a, b) => b.skillLevel - a.skillLevel);
  teamAPlayers.push(sortedGKs[0]);
  teamBPlayers.push(sortedGKs[1]);
  for (let i = 2; i < sortedGKs.length; i++) {
    fieldPlayers.push(sortedGKs[i]);
  }
} else if (goalkeepers.length === 1) {
  teamAPlayers.push(goalkeepers[0]);
  teamASkillBonus = 3; // ← Bonus por arquero único
}
```

#### Paso 2: Distribución por Posición
- Procesa cada zona táctica por separado (DEF → MID → FWD)
- Reparte jugadores alternadamente entre equipos
- Dentro de cada posición, ordena por skill descendente

```typescript
// Código del Paso 2 (líneas 48-68)
const positionZones: PositionZone[] = ['DEF', 'MID', 'FWD'];
for (const zone of positionZones) {
  const playersInZone = remainingPlayers.filter(p => p.position.zone === zone);
  playersInZone.sort((a, b) => b.skillLevel - a.skillLevel);
  
  for (let i = 0; i < playersInZone.length; i++) {
    if (i % 2 === 0) {
      teamAPlayers.push(playersInZone[i]);
    } else {
      teamBPlayers.push(playersInZone[i]);
    }
  }
}
```

#### Paso 3: Distribución por Skill (Segunda Iteración)
- Toma jugadores restantes no asignados
- Los ordena por skill descendente
- Los reparte greedy: al equipo con menor skill total

```typescript
// Código del Paso 3 (líneas 70-80)
remainingPlayers.sort((a, b) => b.skillLevel - a.skillLevel);
for (const player of remainingPlayers) {
  const teamASkill = calculateTotalSkill(teamAPlayers) + teamASkillBonus;
  const teamBSkill = calculateTotalSkill(teamBPlayers);
  
  if (teamASkill <= teamBSkill) {
    teamAPlayers.push(player);
  } else {
    teamBPlayers.push(player);
  }
}
```

### 📝 Modificación 1: Cambiar Criterio de Ordenamiento

**Actual:** Ordena solo por `skillLevel`

**Cambio:** Ordenar por posición también

```typescript
// ANTES (línea 18)
const sortedFieldPlayers = [...fieldPlayers].sort((a, b) => b.skillLevel - a.skillLevel);

// DESPUÉS - Priorizar delanteros primero
const sortedFieldPlayers = [...fieldPlayers].sort((a, b) => {
  // Primero ordenar por zona (FWD > MID > DEF)
  const zoneOrder = { 'FWD': 3, 'MID': 2, 'DEF': 1, 'GK': 0 };
  const zoneCompare = zoneOrder[b.position.zone] - zoneOrder[a.position.zone];
  if (zoneCompare !== 0) return zoneCompare;
  
  // Luego por skill
  return b.skillLevel - a.skillLevel;
});
```

### 📝 Modificación 2: Distribución Aleatoria

**Reemplazar el algoritmo greedy** con distribución aleatoria:

```typescript
// REEMPLAZAR las líneas 40-51 con:
// Mezclar jugadores aleatoriamente
const shuffled = [...sortedFieldPlayers].sort(() => Math.random() - 0.5);

// Distribuir alternadamente
shuffled.forEach((player, index) => {
  if (index % 2 === 0) {
    teamAPlayers.push(player);
  } else {
    teamBPlayers.push(player);
  }
});
```

### 📝 Modificación 3: Equilibrio por Posición

**Asegurar que cada equipo tenga jugadores de cada posición:**

```typescript
// REEMPLAZAR el algoritmo completo (líneas 40-51) con:

// Separar por posición
const defenders = sortedFieldPlayers.filter(p => p.position.zone === 'DEF');
const midfielders = sortedFieldPlayers.filter(p => p.position.zone === 'MID');
const forwards = sortedFieldPlayers.filter(p => p.position.zone === 'FWD');

// Distribuir cada posición por separado
const distributeByPosition = (players: Player[]) => {
  players.forEach((player, index) => {
    const teamASkill = calculateTotalSkill(teamAPlayers);
    const teamBSkill = calculateTotalSkill(teamBPlayers);
    
    if (teamASkill <= teamBSkill) {
      teamAPlayers.push(player);
    } else {
      teamBPlayers.push(player);
    }
  });
};

distributeByPosition(defenders);
distributeByPosition(midfielders);
distributeByPosition(forwards);
```

### 📝 Modificación 4: Ajustar Ponderación de Habilidad

**Cambiar cómo se calcula el skill total:**

**Ubicación:** Función `calculateTotalSkill()` (línea 78)

```typescript
// ANTES - Suma simple
export function calculateTotalSkill(players: Player[]): number {
  return players.reduce((sum, player) => sum + player.skillLevel, 0);
}

// DESPUÉS - Ponderar por posición
export function calculateTotalSkill(players: Player[]): number {
  return players.reduce((sum, player) => {
    let weight = 1;
    
    // Dar más peso a los delanteros
    if (player.position.zone === 'FWD') weight = 1.5;
    // Dar más peso a los arqueros
    if (player.position.zone === 'GK') weight = 2;
    
    return sum + (player.skillLevel * weight);
  }, 0);
}
```

### 📝 Modificación 5: Crear Equipos Desbalanceados Intencionalmente

**Para práctica o entrenamiento:**

```typescript
// REEMPLAZAR líneas 40-51
// Asignar los mejores al equipo A
const half = Math.floor(sortedFieldPlayers.length / 2);
const bestPlayers = sortedFieldPlayers.slice(0, half);
const restPlayers = sortedFieldPlayers.slice(half);

teamAPlayers.push(...bestPlayers);
teamBPlayers.push(...restPlayers);
```

### 📝 Modificación 6: Limitar Diferencia de Skill

**Rechazar distribuciones con mucho desbalance:**

```typescript
// AGREGAR después de crear equipos (después de línea 67)
// Verificar balance
const maxDifference = 5; // Máxima diferencia permitida
const difference = Math.abs(teamA.totalSkill - teamB.totalSkill);

if (difference > maxDifference) {
  // Re-intentar con algoritmo aleatorio
  throw new Error(`No se pudo crear equipos equilibrados. Diferencia: ${difference}`);
}
```

### 🔄 Cambiar Nombres de Equipos

**Ubicación:** `lib/algorithm.ts` (líneas 59 y 65)

```typescript
// CAMBIAR de:
name: 'Equipo A',
name: 'Equipo B',

// A (ejemplos):
name: 'Los Tigres',
name: 'Los Leones',

// O:
name: 'Juventus',
name: 'Real Madrid',

// O:
name: '🔵 Azules',
name: '🔴 Rojos',
```

---

## 🗺️ Ubicación de Componentes Específicos

### Página Principal (Home)

**Archivo:** `app/page.tsx`

**Componentes clave:**
- **Línea 24-28:** Título y descripción
- **Línea 33-46:** Tarjetas de estadísticas (jugadores y partidos)
- **Línea 51-90:** Tarjetas de acciones principales
- **Línea 95-113:** Instrucciones de uso

### Gestión de Jugadores

**Archivo:** `app/players/page.tsx`

**Componentes clave:**
- **Línea 97-110:** Header y botón "Agregar Jugador"
- **Línea 113-172:** Formulario de agregar/editar jugador
  - Línea 124-134: Campo de nombre
  - Línea 136-147: Selector de posición
  - Línea 149-161: Slider de habilidad (1-10)
- **Línea 175-249:** Lista de jugadores
  - Línea 198-245: Tarjeta individual de jugador
  - Línea 208-212: Badges de posición (colores)
  - Línea 214-228: Barra de progreso de habilidad

**Función de colores de posición:** Línea 83-89

### Configuración de Partido

**Archivo:** `app/match/setup/page.tsx`

**Componentes clave:**
- **Línea 71-81:** Header
- **Línea 84-106:** Estadísticas (jugadores seleccionados, por equipo, skill total)
- **Línea 109-120:** Botones de seleccionar/limpiar
- **Línea 123-174:** Grid de selección de jugadores
  - Línea 141-170: Tarjeta de jugador individual
  - Línea 146-153: Checkbox animado
- **Línea 177-189:** Botón de generar equipos

### Cancha de Juego (Field)

**Archivo:** `app/match/field/page.tsx`

**Componentes clave:**
- **Línea 84-95:** Header
- **Línea 98-115:** Tarjeta de balance/puntuación
- **Línea 117:** DragDropContext (inicio de drag & drop)
- **Línea 120-186:** Equipo A (droppable zone)
  - Línea 130-138: Header del equipo con nombre y skill
  - Línea 141-176: Lista de jugadores arrastrables
- **Línea 189-255:** Equipo B (droppable zone - estructura similar)
- **Línea 259-266:** Botón de guardar y evaluar

**Lógica de drag & drop:** Línea 26-56

### Posiciones de Fútbol

**Archivo:** `lib/positions.ts`

Define todas las posiciones disponibles con:
- **Línea 7-12:** Arquero (GK)
- **Línea 15-35:** Defensas (DC, LI, LD)
- **Línea 38-58:** Mediocampistas (VD, VC, VO)
- **Línea 61-81:** Delanteros (EI, ED, DC)

**Para agregar una nueva posición:**
```typescript
{
  id: 'rwb',                    // ID único
  name: 'Carrilero Derecho',    // Nombre completo
  abbreviation: 'CD',           // Abreviación
  zone: 'DEF',                  // Zona: GK, DEF, MID, FWD
  x: 30,                        // Posición X en campo (0-100)
  y: 85                         // Posición Y en campo (0-100)
}
```

---

## 💾 Sistema de Almacenamiento

**Archivo:** `lib/storage.ts`

Usa **LocalStorage** del navegador para persistir datos.

### Keys de Storage

```typescript
const PLAYERS_KEY = 'match-the-match-players';              // Lista de jugadores
const MATCHES_KEY = 'match-the-match-matches';              // Historial de partidos
const CURRENT_MATCH_KEY = 'match-the-match-current-match';  // Partido actual
```

### Funciones Principales

**Jugadores:**
- `getPlayers()` - Obtener todos los jugadores
- `addPlayer(player)` - Agregar nuevo jugador
- `updatePlayer(id, updates)` - Actualizar jugador
- `deletePlayer(id)` - Eliminar jugador
- `getPlayerById(id)` - Obtener jugador por ID

**Partidos:**
- `getMatches()` - Obtener historial de partidos
- `saveMatch(match)` - Guardar partido
- `getCurrentMatch()` - Obtener partido actual
- `setCurrentMatch(match)` - Establecer partido actual

**Utilidades:**
- `generateId()` - Generar ID único
- `clearAllData()` - Limpiar todo el storage

### Cómo Ver los Datos Guardados

**En el navegador:**
1. Abrir DevTools (F12)
2. Ir a la pestaña "Application"
3. En el menú izquierdo: Storage > Local Storage
4. Seleccionar tu dominio
5. Verás las keys: `match-the-match-players`, etc.

### Cómo Cambiar a Otra Forma de Almacenamiento

**Para cambiar a una API/Backend:**

1. Modificar `lib/storage.ts`
2. Reemplazar `localStorage.getItem()` con `fetch()`
3. Ejemplo:

```typescript
// ANTES
export function getPlayers(): Player[] {
  const data = localStorage.getItem(PLAYERS_KEY);
  return data ? JSON.parse(data) : [];
}

// DESPUÉS - con API
export async function getPlayers(): Promise<Player[]> {
  const response = await fetch('/api/players');
  return response.json();
}
```

---

## 🔄 Flujo de la Aplicación

### 1. Página Principal (`/`)

**Archivo:** `app/page.tsx`

- Muestra estadísticas generales
- 3 tarjetas de acción:
  - 👥 Gestionar Jugadores → `/players`
  - ⚽ Crear Partido → `/match/setup`
  - 🏟️ Ver Cancha → `/match/field`

### 2. Gestionar Jugadores (`/players`)

**Archivo:** `app/players/page.tsx`

**Flujo:**
1. Usuario ve lista de jugadores existentes
2. Click "Agregar Jugador" → Muestra formulario
3. Completa: nombre, posición, habilidad (1-10)
4. Submit → Llama `addPlayer()` en `lib/storage.ts`
5. Se guarda en LocalStorage
6. Lista se actualiza automáticamente

**Editar:**
1. Click en icono de editar en jugador
2. Formulario se pre-llena con datos
3. Modificar y guardar

**Eliminar:**
1. Click en icono de eliminar
2. Confirmar
3. Llama `deletePlayer()` en `lib/storage.ts`

### 3. Configurar Partido (`/match/setup`)

**Archivo:** `app/match/setup/page.tsx`

**Flujo:**
1. Carga lista de todos los jugadores desde `getPlayers()`
2. Usuario selecciona jugadores (checkbox)
3. Click "Generar Equipos Equilibrados"
4. Llama `balanceTeams()` en `lib/algorithm.ts`
5. Crea objeto `Match` con `teamA` y `teamB`
6. Guarda en `setCurrentMatch()` → LocalStorage
7. Redirige a `/match/field`

**Validaciones:**
- Mínimo 2 jugadores para crear equipos
- Muestra estadísticas en tiempo real

### 4. Ver Cancha (`/match/field`)

**Archivo:** `app/match/field/page.tsx`

**Flujo:**
1. Carga partido actual con `getCurrentMatch()`
2. Si no hay partido → Redirige a `/match/setup`
3. Muestra dos columnas: Equipo A y Equipo B
4. Usuario puede arrastrar jugadores entre equipos (drag & drop)
5. Al soltar, llama `movePlayer()` en `lib/algorithm.ts`
6. Recalcula skill totales automáticamente
7. Muestra score de balance en tiempo real
8. Click "Guardar y Evaluar" → Guarda partido y va a evaluación

**Características:**
- **Drag & Drop:** Biblioteca `@hello-pangea/dnd`
- **Recalculo automático:** Cada movimiento actualiza totales
- **Indicador de balance:** 😊 😐 😟 según diferencia

### 5. Evaluación (Opcional)

**Archivo:** `app/evaluation/page.tsx`

- Permite calificar el partido
- Guardar comentarios
- Historial de partidos

---

## 🎨 Guía Rápida de Cambios Comunes

### Cambio: Hacer botones más grandes

**Buscar en archivos:** `className="...px-6 py-3..."`

**Cambiar a:**
```tsx
className="px-8 py-4"  // Más grandes
className="px-10 py-5" // Aún más grandes
```

### Cambio: Modificar espaciado entre elementos

**Buscar:** `gap-6`, `space-y-4`, `mb-8`, etc.

**Escalas de Tailwind:**
- `gap-2` = 0.5rem (8px)
- `gap-4` = 1rem (16px)
- `gap-6` = 1.5rem (24px)
- `gap-8` = 2rem (32px)
- `gap-12` = 3rem (48px)

### Cambio: Esquinas redondeadas

**Buscar:** `rounded-lg`

**Opciones:**
```tsx
rounded-none  // Sin redondeo
rounded-sm    // Poco redondeo
rounded       // Redondeo normal
rounded-lg    // Redondeo grande
rounded-xl    // Muy redondeado
rounded-2xl   // Extra redondeado
rounded-full  // Círculo/píldora
```

### Cambio: Sombras de tarjetas

**Buscar:** `shadow-lg`, `shadow-md`

**Opciones:**
```tsx
shadow-sm     // Sombra sutil
shadow        // Sombra normal
shadow-md     // Sombra media
shadow-lg     // Sombra grande
shadow-xl     // Sombra muy grande
shadow-2xl    // Sombra extra grande
```

### Cambio: Animaciones y transiciones

**Buscar:** `transition-colors`, `hover:scale-105`

**Agregar animaciones:**
```tsx
// Escalar al hover
className="transition-transform hover:scale-105"

// Rotar
className="transition-transform hover:rotate-3"

// Mover hacia arriba
className="transition-transform hover:-translate-y-2"

// Cambio de opacidad
className="transition-opacity hover:opacity-80"
```

---

## 🛠️ Tipos TypeScript

**Archivo:** `lib/types.ts`

Define todas las interfaces y tipos de datos.

### Tipos Principales

```typescript
// Zona de posición
type PositionZone = 'GK' | 'DEF' | 'MID' | 'FWD';

// Posición en el campo
interface Position {
  id: string;
  name: string;
  abbreviation: string;
  zone: PositionZone;
  x: number;        // 0-100
  y: number;        // 0-100
}

// Jugador
interface Player {
  id: string;
  name: string;
  position: Position;
  skillLevel: number;  // 1-10
  createdAt: string;
}

// Equipo
interface Team {
  name: string;
  color: string;       // Hex color
  playerIds: string[];
  totalSkill: number;
}

// Partido
interface Match {
  id: string;
  date: string;
  selectedPlayerIds: string[];
  teamA: Team;
  teamB: Team;
  evaluation?: MatchEvaluation;
}
```

**Para agregar nuevos campos:**

1. Modificar la interface en `lib/types.ts`
2. Actualizar las funciones en `lib/storage.ts` si es necesario
3. Actualizar los formularios en las páginas correspondientes

---

## 📱 Responsive Design

Todos los layouts usan **Tailwind CSS Grid** con breakpoints:

- `sm:` - 640px+
- `md:` - 768px+
- `lg:` - 1024px+
- `xl:` - 1280px+
- `2xl:` - 1536px+

**Ejemplos en el código:**

```tsx
{/* 1 columna en móvil, 2 en tablet, 3 en desktop */}
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
```

**Modificar para más columnas:**
```tsx
className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
```

---

## 🚀 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Ejecutar producción
npm start

# Linter
npm run lint
```

---

## 🌐 Despliegue en Vercel

### Opción 1: Automático con Git (Recomendado)

1. Sube tu repositorio a GitHub
2. Ve a [Vercel.com](https://vercel.com)
3. Haz clic en "New Project"
4. Selecciona el repositorio de GitHub
5. Vercel detectará automáticamente Next.js
6. Haz clic en "Deploy"

**Después del primer deploy:**
- Vercel desplegará automáticamente en cada push a `main`
- Crea previews automáticos para cada Pull Request
- URL: `https://tu-proyecto.vercel.app`

### Opción 2: Con Vercel CLI

```bash
# Instalar globalmente
npm install -g vercel

# Desplegar (desde el directorio del proyecto)
vercel

# Para producción
vercel --prod

# Redeploy
vercel --prod --force
```

### Configuración en Vercel

**Dashboard → Project Settings:**
- **Framework Preset:** Next.js (automático)
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

**Environment Variables** (si las necesitas):
1. Ve a Settings → Environment Variables
2. Agrega `KEY=value`
3. Redeploy automáticamente

### Monitoreo

Vercel proporciona gratis:
- ✅ SSL automático con Let's Encrypt
- ✅ CDN global con compresión
- ✅ Analytics básicos
- ✅ Performance monitoring
- ✅ Logs de despliegue

---

## 📌 Resumen de Archivos Importantes

| Archivo | Propósito | Cuándo Modificar |
|---------|-----------|------------------|
| `app/globals.css` | Estilos globales, tema | Cambiar colores base, fuentes globales |
| `lib/algorithm.ts` | **Algoritmo de distribución** | Cambiar lógica de equipos |
| `lib/types.ts` | Definiciones TypeScript | Agregar nuevos campos/tipos |
| `lib/storage.ts` | Persistencia de datos | Cambiar almacenamiento |
| `lib/positions.ts` | Posiciones de fútbol | Agregar/modificar posiciones |
| `app/page.tsx` | Página principal | Cambiar home |
| `app/players/page.tsx` | Gestión de jugadores | Modificar formulario de jugadores |
| `app/match/setup/page.tsx` | Selección de jugadores | Cambiar UI de selección |
| `app/match/field/page.tsx` | Vista de cancha | Modificar drag & drop, visualización |

---

## 💡 Consejos para Cambios Estructurales

### ✅ Antes de Hacer Cambios

1. **Probar la aplicación actual** para entender el flujo
2. **Hacer backup** del código (Git commit)
3. **Verificar tipos TypeScript** después de cambios
4. **Probar en móvil y desktop** (responsive)

### ✅ Proceso Recomendado

1. **Identificar el archivo** usando esta guía
2. **Leer el código** alrededor del cambio
3. **Hacer cambio pequeño** primero
4. **Probar inmediatamente** con `npm run dev`
5. **Verificar efectos** en otras partes de la app
6. **Guardar cambio** si funciona

### ✅ Si Algo Sale Mal

1. **Revisar consola del navegador** (F12)
2. **Revisar terminal** de Next.js
3. **Verificar errores TypeScript** con `npm run lint`
4. **Revertir cambio** y probar de nuevo

---

## 🔍 Búsqueda Rápida

**Quiero cambiar...**

- **Color de fondo general** → `app/globals.css` línea 2-3
- **Gradiente de fondo** → Buscar `bg-gradient-to-br` en páginas
- **Colores de equipos** → `lib/algorithm.ts` líneas 60, 66
- **Algoritmo de distribución** → `lib/algorithm.ts` líneas 40-51
- **Título principal** → Buscar `text-5xl` o `text-4xl`
- **Tamaños de botones** → Buscar `px-6 py-3`
- **Posiciones disponibles** → `lib/positions.ts`
- **Nombres de equipos** → `lib/algorithm.ts` líneas 59, 65
- **Validación de jugadores mínimos** → `app/match/setup/page.tsx` línea 38
- **Almacenamiento de datos** → `lib/storage.ts`

---

## 📧 Notas Finales

Esta guía cubre los aspectos más importantes de la estructura de **Match the Match**. 

**Puntos clave:**
- La aplicación usa **Next.js App Router** con **TypeScript**
- Los estilos son con **Tailwind CSS** (clases utility-first)
- El algoritmo está en **`lib/algorithm.ts`** y es fácil de modificar
- Todo se guarda en **LocalStorage** del navegador
- Los cambios visuales se hacen modificando clases de Tailwind
- Los cambios de lógica se hacen en archivos de `lib/`

**Para cada cambio:**
1. Encuentra el archivo correcto en esta guía
2. Localiza las líneas específicas
3. Modifica con cuidado
4. Prueba inmediatamente

¡Buena suerte con tus modificaciones! 🚀⚽
