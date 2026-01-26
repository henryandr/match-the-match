# Match the Match ⚽

Aplicación web responsive para organizar partidos de fútbol amateur, distribuyendo jugadores en equipos equilibrados.

## 🎯 Descripción

Match the Match es una aplicación que permite:
- Gestionar una base de datos de jugadores con sus posiciones y habilidades
- Seleccionar jugadores para un partido específico
- Dividir automáticamente a los jugadores en dos equipos equilibrados
- Visualizar los equipos en una cancha de fútbol
- Realizar ajustes manuales con drag & drop
- Evaluar la calidad de la distribución de equipos

## 🏗️ Arquitectura

### Tech Stack

**Frontend:**
- Next.js 16+ (React framework)
- TypeScript (Type safety)
- Tailwind CSS (Styling)
- React DnD (Drag and drop)

**Almacenamiento:**
- LocalStorage (Persistencia de datos del lado del cliente)
- IndexedDB (Para futuras mejoras con mayor volumen de datos)

**Decisiones de Arquitectura:**
- **Next.js App Router**: Routing moderno y rendimiento optimizado
- **TypeScript**: Type safety y mejor experiencia de desarrollo
- **Tailwind CSS**: Diseño responsive rápido y mantenible
- **Client-side storage**: Simplicidad inicial, sin necesidad de backend
- **Componentes modulares**: Separación clara de responsabilidades

## 📊 Modelo de Datos

### Player (Jugador)
```typescript
interface Player {
  id: string;
  name: string;
  position: Position;
  skillLevel: number; // 1-10
  secondaryPositions?: Position[];
  createdAt: Date;
}
```

### Position (Posición)
```typescript
interface Position {
  id: string;
  name: string;
  abbreviation: string;
  zone: 'GK' | 'DEF' | 'MID' | 'FWD';
  x: number; // Coordenada X en el campo (0-100)
  y: number; // Coordenada Y en el campo (0-100)
}
```

Posiciones predefinidas:
- **GK**: Arquero
- **DEF**: Defensa Central, Lateral Derecho, Lateral Izquierdo
- **MID**: Volante Defensivo, Volante Central, Volante Ofensivo
- **FWD**: Extremo Derecho, Extremo Izquierdo, Delantero Centro

### Match (Partido)
```typescript
interface Match {
  id: string;
  date: Date;
  selectedPlayerIds: string[];
  teamA: Team;
  teamB: Team;
  evaluation?: MatchEvaluation;
}
```

### Team (Equipo)
```typescript
interface Team {
  name: string;
  color: string;
  playerIds: string[];
  totalSkill: number;
}
```

### MatchEvaluation (Evaluación)
```typescript
interface MatchEvaluation {
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  wasBalanced: boolean;
}
```

## 🎲 Algoritmo de Balanceo

El algoritmo utiliza un enfoque de 4 pasos para garantizar equipos equilibrados:

### 1. Distribución de Arqueros
- **Con 2+ arqueros**: Asigna el mejor arquero a cada equipo (ordenados por skill)
- **Con 1 arquero**: Lo asigna al Equipo A
- **Sin arqueros**: Los jugadores se distribuyen normalmente

### 2. Cálculo de Tamaños Equitativos
- **Número par**: Ambos equipos tienen exactamente el mismo número de jugadores
- **Número impar**: Un equipo tiene 1 jugador más (el Equipo A)
- El jugador extra (si es impar) será utilizado para nivelar skills

### 3. Distribución por Posiciones (Prioridades)
- **Alta prioridad** (Defensas y Delanteros): Se distribuyen alternadamente para balance posicional
  - Cuando hay múltiples jugadores de la misma posición (ej: 2 laterales izquierdos), se reparten uno a cada equipo
- **Baja prioridad** (Volantes/Mediocampistas): Se distribuyen con mayor flexibilidad
- Dentro de cada grupo de posición, se ordena por skill descendente

### 4. Rebalanceo de Skills (Segunda Iteración)
- Calcula la diferencia de skills entre equipos
- Si la diferencia es mayor a 5 puntos, realiza **intercambios inteligentes**:
  - Identifica al jugador más débil del equipo fuerte
  - Identifica al jugador más fuerte del equipo débil
  - Los intercambia para nivelar
- Repite hasta 3 veces o hasta alcanzar balance

```typescript
function balanceTeams(players: Player[]): [Team, Team] {
  // Step 1: Distribuir arqueros
  const goalkeepers = players.filter(p => p.position.zone === 'GK');
  
  // Step 2: Calcular tamaños de equipo
  const totalPlayers = players.length;
  const isOddCount = totalPlayers % 2 === 1;
  const teamASize = Math.floor(totalPlayers / 2) + (isOddCount ? 1 : 0);
  const teamBSize = Math.floor(totalPlayers / 2);
  
  // Step 3: Distribuir por posición (DEF → FWD → MID)
  distributeByPosition(defenders, teamA, teamB, playersNeeded);
  distributeByPosition(forwards, teamA, teamB, playersNeeded);
  distributeByPosition(midfielders, teamA, teamB, playersNeeded);
  
  // Step 4: Rebalancear si hay diferencia > 5 puntos
  rebalanceTeams(teamA, teamB, players);
  
  return [teamA, teamB];
}
```

## 📱 Flujo de Pantallas

### 1. Home / Dashboard
- Resumen de jugadores en la base de datos
- Accesos rápidos a funciones principales
- Últimos partidos

### 2. Gestión de Jugadores
- Lista de jugadores con filtros
- Formulario agregar/editar jugador
- Confirmación de eliminación

### 3. Configuración de Partido
- Selección de jugadores disponibles (checkboxes)
- Definir número de jugadores por equipo
- Botón "Generar Equipos"

### 4. Visualización de Equipos
- Cancha de fútbol dividida en dos mitades
- Jugadores posicionados según su rol
- Colores diferenciados por equipo
- Panel con scores de cada equipo

### 5. Ajustes Manuales
- Drag & drop entre equipos
- Actualización en tiempo real de scores
- Botón "Guardar y Evaluar"

### 6. Evaluación
- Rating de 1-5 estrellas
- Campo de comentarios opcional
- Opciones: "Muy justa", "Aceptable", "Desbalanceada"
- Guardar para mejoras futuras

## 🚀 Instalación y Uso

### Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/match-the-match.git
cd match-the-match

# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build producción
npm run build

# Iniciar en producción
npm start

# Linting
npm run lint
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Despliegue en Vercel

**Opción 1: Con Git (Recomendado)**

1. Sube tu repositorio a GitHub
2. Ve a [Vercel.com](https://vercel.com) e inicia sesión
3. Haz clic en "New Project"
4. Importa tu repositorio de GitHub
5. Vercel detectará automáticamente que es un proyecto Next.js
6. Haz clic en "Deploy"

**Opción 2: Con CLI de Vercel**

```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# Desplegar desde el directorio del proyecto
vercel

# Para producción
vercel --prod
```

**Configuración automática:**
- Framework: Next.js (detectado automáticamente)
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**Variables de entorno:** (si las necesitas)
1. En el dashboard de Vercel, ve a Settings → Environment Variables
2. Agrega las variables necesarias
3. Redeploy automáticamente

**Tu aplicación estará disponible en:**
```
https://tu-proyecto.vercel.app
```

Vercel ofrece:
- ✅ SSL automático
- ✅ CDN global
- ✅ Deployments automáticos en cada push a main
- ✅ Preview de pull requests
- ✅ Analytics y monitoreo

## 📁 Estructura del Proyecto

```
match-the-match/
├── app/
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Home/Dashboard
│   ├── players/                # Gestión de jugadores
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── match/                  # Configuración y visualización
│   │   ├── setup/
│   │   │   └── page.tsx
│   │   └── field/
│   │       └── page.tsx
│   └── evaluation/
│       └── page.tsx
├── components/
│   ├── PlayerCard.tsx
│   ├── PlayerForm.tsx
│   ├── SoccerField.tsx
│   ├── TeamPanel.tsx
│   └── DraggablePlayer.tsx
├── lib/
│   ├── types.ts                # Definiciones TypeScript
│   ├── storage.ts              # LocalStorage helpers
│   ├── algorithm.ts            # Algoritmo de balanceo
│   └── positions.ts            # Configuración de posiciones
├── public/
│   └── images/
└── README.md
```

## 🔮 Mejoras Futuras

### Corto Plazo
- [ ] Sistema de autenticación de usuarios
- [ ] Compartir composiciones de equipos por link
- [ ] Modo offline con service workers

### Mediano Plazo
- [ ] Historial de partidos con estadísticas
- [ ] Múltiples formaciones tácticas (4-4-2, 4-3-3, etc.)
- [ ] Sistema de rating de jugadores basado en resultados
- [ ] Exportar equipos a PDF/imagen

### Largo Plazo
- [ ] Backend con base de datos real (PostgreSQL)
- [ ] Sistema de ligas y torneos
- [ ] Estadísticas avanzadas por jugador
- [ ] Machine Learning para mejorar el algoritmo de balanceo
- [ ] Aplicación móvil nativa (React Native)
- [ ] Chat en tiempo real para organización
- [ ] Sistema de notificaciones

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👥 Autor

Henry Andrés - Match the Match

---

⚽ ¡Que disfrutes organizando tus partidos de fútbol!
