# Mar Vivo - Documentación para Agentes de IA

## 📋 Resumen Ejecutivo

**Proyecto**: Mar Vivo - Simulador de Pesca Sustentable
**Objetivo**: Herramienta educativa de gamificación para entender patrones de conducta y estrategias de usuarios en contextos de pesquerías
**Estado**: En desarrollo activo
**Fecha última actualización**: 30 de abril de 2026

---

## 🏗️ Estructura del Proyecto

```
Mar_vivo/
├── pesca_sustentable_1.html    (Archivo principal - contiene todo: HTML, CSS, JS)
├── README.md                    (Documentación general del proyecto)
└── README_for_IA.md            (Este archivo - para agentes de IA)
```

**Nota**: El proyecto es un archivo HTML único y autocontenido (~4000+ líneas).

---

## 🎮 Descripción de Funcionalidades Implementadas

### 1. **Sistema de Zonas de Pesca** ✅
- **3 zonas disponibles**: Manglar, Arrecife, Mar Abierto
- Cada zona tiene:
  - Descripción de riesgo
  - Costo de combustible
  - Especie disponibles únicas
  - Características visuales diferenciadas
- Accesible mediante botones en la barra de acción

### 2. **Selección de Especies Objetivo** ✅ (RECIENTE)
- Cuando el jugador abre una zona, aparece:
  - Mapa visual de la zona
  - Lista de especies con checkboxes
  - Hint visual de equipos recomendados
- Las especies objetivo se guardan en `G.targetSpecies`
- Si hay objetivos, solo se puede pescar esas especies

### 3. **Sistema de Equipos/Métodos** ✅ (RECIENTE)
- **5 métodos de pesca**:
  - `anzuelo` - Bajo impacto eco, bueno para arrecife
  - `red` - Impacto moderado, bueno para mar abierto
  - `trampa` - Bajo impacto, bueno para manglar
  - `artesanal` - Muy bajo impacto, sostenible
  - `industrial` - Alto impacto, rápido pero dañino

### 4. **Validación de Equipo** ✅ (RECIENTE)
- Cada especie tiene `equipment: ['method1', 'method2']`
- Al pescar, se valida:
  - Si hay objetivos, la captura debe ser objetivo
  - El método actual debe estar en el equipo válido de la especie
  - Mensajes de error descriptivos si falla

### 5. **Minijuego de Pesca** ✅
- Interfaz interactiva tipo "barra de precisión"
- Bonificación según timing
- Tasa de éxito depende de energía del jugador

### 6. **Sistema de Supervivencia** ✅
- **3 medidores**: Energía, Hambre, Sed
- Decrecen con el tiempo y actividades
- Game Over si alguno llega a 0

### 7. **Sistema Ecológico (ECO)** ✅
- Barra que representa salud del océano (0-100%)
- Cada captura reduce ECO según la especie y método
- Repoblación lenta durante el tiempo
- Colapso si llega a 0

### 8. **Tiempo y Clima** ✅
- Ciclo diario 06:00-22:00
- 4 estaciones (Primavera, Verano, Otoño, Invierno)
- Clima dinámico (Soleado, Nublado, Lluvia, Tormenta)
- Tormentas afectan gameplay

### 9. **Economía** ✅
- Dinero como moneda principal
- Venta de capturas con precios dinámicos
- Mercado/Cantina para comprar comida, agua, combustible
- Inventario limitado (max 20 peces)

### 10. **Bitácora de Especies** ✅
- Registro automático de especies capturadas
- Bonificación por especies raras
- Bonificación por completar zona
- Toast visual cuando se descubre especie nueva

### 11. **Sistema de Guardado** ✅ (ACTUALIZADO)
- 3 ranuras de guardado
- Guarda: día, hora, dinero, combustible, inventario, logbook, **targetSpecies**, **equipment**, etc.
- Carga completa del estado del juego

### 12. **HUD (Interfaz)** ✅
- Panel superior con dinero, combustible, energía, hambre, sed
- Panel de tiempo (hora, día, estación, clima)
- Indicador de zona
- Log de mensajes
- Barra de acciones inferior

### 13. **Animaciones y Pixel Art** ✅
- Olas animadas
- Pájaros (pelícanos, gaviotas, playeros)
- Aldea con NPCs
- Peces detallados por especie
- Efectos de partículas

### 14. **Audio Procedural** ✅
- Tonos generados dinámicamente
- Efectos para: pesca, captura, error, evento raro, tormentas, nivel up, guardado

### 15. **Responsividad** ✅
- Soporta horizontal y vertical
- Escalamiento adaptativo
- Puntos de ruptura para pantallas pequeñas

---

## 📊 Estructura de Datos Clave

### Estado Global (G)
```javascript
{
  // Tiempo
  day, hour, minute, season, weather, temp,
  
  // Ubicación y métodos
  zone, method, methodIdx,
  
  // Recursos
  money, fuel, energy, hunger, thirst,
  
  // Juego
  eco, caught, inventory, logbook,
  
  // Control de flujo
  fishing, storm, running,
  
  // NUEVO: Objetivos y equipos
  targetSpecies: [],      // Especies a capturar
  equipment: ['anzuelo'], // Métodos disponibles
  
  // Timers
  fishTimer, tickTimer, stormTimer
}
```

### Especies (SPECIES)
```javascript
{
  manglar: [
    {
      name, color, belly, fin,
      weight: [min, max],
      value: [min, max],
      rarity, eco,
      equipment: ['method1', 'method2'], // NUEVO
      desc,
      crab/octopus/lobster/shrimp/squid: boolean (opcional),
      release: boolean,
      rare: boolean
    },
    ...
  ],
  arrecife: [...],
  abierto: [...]
}
```

### Métodos (METHOD_INFO)
```javascript
{
  anzuelo: { label, time, eco, bonus, miss },
  red: { ... },
  trampa: { ... },
  artesanal: { ... },
  industrial: { ... }
}
```

### Zonas (ZONE_DETAILS)
```javascript
{
  manglar/arrecife/abierto: {
    name, desc, color, waterColor,
    riskLevel, fuelCost,
    species: [array de nombres]
  }
}
```

---

## 🔧 Funciones Principales Actualizadas Recientemente

### Sistema de Objetivos de Especies
- **`toggleTargetSpecies(speciesName)`** - Agrega/quita especie de objetivos
- **`updateEquipmentHint()`** - Muestra equipos recomendados según objetivos
- **`openZoneMap(zone)`** - MODIFICADA: Ahora muestra checkboxes de especies
- **`openFishSelect()`** - MODIFICADA: Filtra por objetivos si existen

### Validación
- **`startFishingWithType(preferredFish)`** - MODIFICADA: Valida especies objetivo y equipos

### Guardado
- **`getState()`** - Incluye `targetSpecies` y `equipment`
- **`startGame(saved)`** - Restaura `targetSpecies` y `equipment`

---

## 📋 Lo que Falta por Hacer

### En Progreso (Option B: NPC Boats + Population Model)

- [ ] **Phase 2: Visual Integration** - Mostrar más/menos peces según población
- [ ] **Phase 3: NPC Boats** - Barcos NPC que pescan y compiten por recursos
  - [ ] Entidades de barcos NPC (2-3 por zona)
  - [ ] Animaciones de pesca
  - [ ] Sistemas de IA para barcos
  - [ ] Visualización en canvas

### Funcionalidades Pendientes (Futuro)

- [ ] **Sistema de Permisos**: Diferentes métodos permiten capturar diferentes especies
- [ ] **Desbloqueables de Equipos**: Ganar nuevos métodos de pesca progresivamente
- [ ] **Límites de Captura por Día**: Restricción regulatoria (e.g., máx 5 atunes/día)
- [ ] **Sistema de Cuotas**: Cuota total por especie en la zona
- [ ] **NPC Interactivos**: Diálogos con pescadores y autoridades
- [ ] **Sistema de Misiones Expandido**: Más variedad, dinámicas cambiantes
- [ ] **Comparativa de Estrategias**: Analytics de decisiones del jugador
- [ ] **Exportación de Datos**: Para investigación (logs, decisiones, patrones)
- [ ] **Modos Dificultad**: Fácil, Normal, Hardcore
- [ ] **Tutorial Interactivo**: Primer juego guiado
- [ ] **Achievements/Logros**: Sistema de reconocimientos

### Mejoras de UX

- [ ] **Mejor feedback visual**: Indicadores más claros de validación
- [ ] **Tooltips informativos**: Ayuda contextual en selección de especies
- [ ] **Animación de selección**: Transiciones más suaves
- [ ] **Dark mode**: Opción alternativa de tema

### Optimizaciones

- [ ] **Refactorización del código**: Separar HTML/CSS/JS en archivos
- [ ] **Compresión**: Minificar código para producción
- [ ] **Caching**: Mejor gestión de memoria
- [ ] **Persistencia en nube**: Guardado en servidor

---

## 🎯 Cambios Recientes

### Actualización 1: UI Reorganizada + Modal de Métodos (29 de abril de 2026)

**Reorganización de Botones de Acción:**
- ✅ Agrupados por categoría: ZONAS, PESCA, COMERCIO, INFO, ACCIONES
- ✅ Cada grupo en su propio contenedor visual con borde y etiqueta
- ✅ Mejor jerarquía visual y organización

**Sistema de Selección de Métodos Mejorado:**
- ✅ Reemplazo de botón cíclico por modal comprensivo
- ✅ Modal muestra los 5 métodos con íconos emoji:
  - 🎣 ANZUELO - Bajo impacto, preciso
  - 🥅 RED - Versátil, impacto moderado
  - 🪤 TRAMPA - Selectivo, bueno para crustáceos
  - 🚣 ARTESANAL - Sostenible, mínimo impacto
  - ⚙️ INDUSTRIAL - Rápido, alto impacto
- ✅ Estadísticas visibles para cada método:
  - Tiempo (duración del minijuego)
  - ECO (impacto ambiental)
  - Zona Bonus (dónde es más eficiente)
  - Fallo (probabilidad de error)
- ✅ Selección visual con estado "seleccionado" destacado
- ✅ CSS y estilos para mejor UX

**Cambios en Lógica:**
- ✅ `changeMethod()`: Ahora abre modal en lugar de ciclar
- ✅ `openMethodSelect()`: Nuevo - Genera opciones de métodos
- ✅ `selectMethodType()`: Nuevo - Selecciona método con feedback visual
- ✅ `closeMethodSelect()`: Nuevo - Cierra modal
- ✅ `confirmMethodSelection()`: Nuevo - Confirma selección y actualiza HUD

---

### Actualización 2: Sistema de Población de Especies (30 de abril de 2026)

**Modelo de Población Simple**:
- ✅ `G.populations`: Nuevo objeto que rastrea población de cada especie por zona
- ✅ Inicialización basada en rareza:
  - Común (rareza 0.5-0.6): 50-60 población
  - Poco común (0.3-0.4): 35-45
  - Raro (0.15-0.3): 20-30
  - Muy raro (0.03-0.1): 10-15
  - Con ±5 variación aleatoria

**Funciones de Población**:
- ✅ `initPopulations()`: Inicializa poblaciones al comenzar juego
- ✅ `getPopulation(zone, species)`: Obtiene población actual
- ✅ `reducePopulation(zone, species, amount)`: Reduce por captura
- ✅ `replenishPopulations()`: Recuperación diaria basada en ECO

**Repoblamiento Diario**:
- ✅ Llamado en `gameTick()` al cambiar día
- ✅ Tasa de repoblamiento según ECO:
  - ECO ≥ 70: +1 por especie/día
  - ECO 40-70: +0.5 por especie/día
  - ECO < 40: +0.25 por especie/día
- ✅ Población máxima sostenible: 60 por especie

**Integración con Captura**:
- ✅ Cada captura reduce población por 1
- ✅ Mensajes inteligentes de advertencia:
  - Población ≤ 0: "⚠️ Especie agotada. Cambia de zona."
  - Población ≤ 5: "⚠️ Especie casi desaparece."
  - Población ≤ 15: "📉 Población baja."

**Persistencia**:
- ✅ `getState()`: Guarda `populations` en slots de guardado
- ✅ `startGame()`: Restaura `populations` al cargar
- ✅ Inicializa si faltan en carga de archivo antiguo

---

## 🗺️ Flujo de Juego Actual

```
INICIO
  ↓
Pantalla de Título (NUEVA PARTIDA / CARGAR / CÓMO JUGAR)
  ↓
HUD Visible + Mundo de Juego
  ↓
Seleccionar Zona [NUEVA UI: Checkboxes de Especies]
  ↓
Elegir Método de Pesca
  ↓
Presionar PESCAR → Abre Selección de Especies [FILTRA POR OBJETIVOS]
  ↓
Validación [NUEVO]:
  • ¿Hay objetivos? → ¿Es objetivo? Si no → ERROR
  • ¿Equipos válidos? → ¿Método permitido? Si no → ERROR
  ↓
Minijuego de Pesca
  ↓
Resultado: Captura, Venta, etc.
  ↓
Flujo continuo hasta Game Over o Guardar
```

---

## 💾 Estructura de Archivos del Código

El archivo `pesca_sustentable_1.html` está organizado en secciones:

### Secciones Principales (en orden de aparición)
1. **Meta y Estilos CSS** (~360 líneas)
2. **HTML DOM** (~150 líneas)
3. **Sistema de Almacenamiento** (~20 líneas)
4. **Motor de Sonido** (~40 líneas)
5. **Configuración de Pantalla** (~30 líneas)
6. **Estado Global (G)** (~1 línea - objeto)
7. **Definiciones de Especies** (~50 líneas)
8. **Información de Zonas y Métodos** (~15 líneas)
9. **Canvas Setup e Inicialización** (~100 líneas)
10. **Sistemas de Renderizado** (~500 líneas - olas, pájaros, peces, aldea)
11. **Lógica de Pesca** (~400 líneas)
12. **Sistema de Zonas** (~200 líneas) ← MODIFICADO
13. **Sistema de Tiempo** (~100 líneas)
14. **Economia y Mercado** (~300 líneas)
15. **UI y HUD** (~200 líneas)
16. **Sistema de Guardado** (~150 líneas)
17. **Minijuego de Pesca** (~100 líneas)
18. **Eventos y Físicas** (~100 líneas)

---

## 🔑 Funciones Clave para Futuros Desarrollos

### Para Agregar Nuevas Especies
```javascript
// 1. Agregar a SPECIES[zone]
const newSpecies = {
  name: 'Especie Nueva',
  color: '#color',
  belly: '#color',
  fin: '#color',
  weight: [min, max],
  value: [min, max],
  rarity: 0.5,
  eco: 2,
  equipment: ['anzuelo', 'red'],  // IMPORTANTE
  desc: 'Descripción educativa'
};

// 2. Renderizado automático en drawFish() y showCatchPopup()
```

### Para Agregar Nuevos Métodos
```javascript
// 1. Agregar a G.methods y METHOD_INFO
METHOD_INFO.nuevoMetodo = {
  label: 'Nuevo Método',
  time: 5000,        // ms para minijuego
  eco: 1,            // impacto ecológico
  bonus: { zone: 1.2 },
  miss: 0.25         // probabilidad de error
};

// 2. Agregar equipo a especies según uso
```

### Para Agregar Nuevas Zonas
```javascript
// 1. Agregar a ZONE_DETAILS
// 2. Agregar a ZONE_INFO
// 3. Crear entrada en SPECIES
// 4. Agregar botón en HTML
// 5. Crear canvas de renderizado en drawZoneMapCanvas()
```

---

## 🐛 Comportamientos Especiales a Tener en Cuenta

### Especies Protegidas
- **`release: true`** - Se liberan automáticamente al capturar
- Ejemplos: Mantarraya, Marlín, Ballena Jorobada
- NO dan dinero pero dan puntos ECO y registro en bitácora

### Especies Raras
- **`rare: true`** - Generan evento especial con sonido y modal
- Ejemplos: Calamar Gigante, Ballena Jorobada
- Dan puntos ECO adicionales

### Criaturas Especiales
- `crab: true` / `shrimp: true` / `lobster: true` / `octopus: true` / `squid: true`
- Afecta renderizado de sprite
- Renderizado especial en logbook y catch popup

### Impacto Ecológico
- Cada especie tiene `eco: número` (impacto base)
- Método multiplica: `METHOD_INFO[method].eco`
- Fórmula: `G.eco -= method.eco * species.eco`

---

## 🎨 Paleta de Colores CSS

```javascript
--ocean-deep: #0a1628     // Fondo oscuro
--ocean-mid: #0d2240      // Elementos medios
--ocean-surf: #1a4a6b     // Elementos de interfaz
--wave: #5dade2           // Primario (azul claro)
--sand: #f0d080           // Secundario (arena)
--sand-dark: #c8a84b
--green: #27ae60          // Éxito/OK
--green-dark: #1e8449
--red: #e74c3c            // Error/Peligro
--gold: #f1c40f           // Destacado
--white: #ecf0f1          // Texto principal
--ui-bg: rgba(8,18,35,0.96)
--ui-border: #2980b9
```

---

## 📱 Puntos de Ruptura Responsivos

- **Paisaje (Horizontal)**: Default - barras laterales
- **Retrato (Vertical)**: Layouts compactos en tapa/bottom
- **Pequeño Retrato** (`max-width: 430px`): Elementos más compactos

---

## 🔍 Notas Importantes para Agentes de IA

### 1. El archivo es HTML puro (SPA)
- No hay build step
- No hay dependencias externas (excepto Web Audio API)
- Todo funciona en navegador moderno (Chrome, Firefox, Safari, Edge)

### 2. Canvas rendering es complejo
- Pixel art renderizado a mano con `ctx.fillRect()`
- Animaciones con `requestAnimationFrame` simulado por `renderLoop()`
- Escala de píxeles adaptativa (`PS` variable)

### 3. Sistema de timers múltiples
- `G.fishTimer` - Minijuego de pesca
- `G.tickTimer` - Ciclo principal del juego (cada 6s)
- `G.stormTimer` - Tormenta activa
- Limpiar al cambiar estado para evitar memory leaks

### 4. Storage es sincrónico
- `window.storage` abstrae localStorage
- Las operaciones son `await` pero rápidas localmente

### 5. Reglas de validación complejas
- Energía < 5 → No pescar
- Inventario = 20 → No pescar
- En tormenta → No pescar
- Combustible insuficiente → No viajar
- NUEVO: Especie objetivo + Equipo válido → Validar al pescar

---

## 📈 Métricas Relevantes para Investigación

El juego captura automáticamente:
- Dinero ganado/gastado por día
- Peces capturados por tipo
- Métodos más usados
- Zonas visitadas
- Decisiones bajo presión (energía baja, eco bajo)
- Tiempos de decisión (sesiones)
- Cambios de estrategia

Próximo: Exportar estos datos para análisis

---

## 🚀 Próximos Pasos Sugeridos

### Completados ✅ (30 de abril de 2026)

1. **UI y UX:**
   - ✅ Reorganización de botones por categoría
   - ✅ Modal de selección de métodos con estadísticas
   - ✅ Feedback visual mejorado para métodos

2. **Sistema de Población:**
   - ✅ Modelo simple de población de especies
   - ✅ Repoblamiento diario basado en ECO
   - ✅ Mensajes de advertencia cuando especies escasean
   - ✅ Persistencia en guardados

### En Progreso 🔄 (Próxima sesión)

1. **Phase 2: Integración Visual**
   - Ajustar cantidad de peces visibles según población
   - Más peces cuando hay muchos, menos cuando escasean

2. **Phase 3: Barcos NPC**
   - Crear entidades de barcos NPC (2-3 por zona)
   - Implementar IA para barcos (pescar cada 45-90 segundos)
   - Visualizar barcos en el canvas (más pequeños que el jugador)
   - Barcos reducen población con sus capturas
   - Barcos aparecen/desaparecen según disponibilidad de peces

### Mediano plazo (2-3 sesiones después)

- Sistema de desbloqueables de equipos
- Límites/cuotas por especie
- NPC interactivos con diálogos
- Analytics dashboard

### Largo plazo (futuro)

- Exportación de datos de investigación
- Versión multijugador (webSocket)
- Modos de dificultad
- Personalización visual

---

## 📞 Contacto/Notas

Este proyecto es educativo y de investigación. Diseñado para entender patrones de conducta en usuarios bajo dilemas de sostenibilidad vs. lucro.

**Última actualización**: 30 de abril de 2026
**Última versión**: Con sistema de población de especies y modal de selección de métodos mejorada
