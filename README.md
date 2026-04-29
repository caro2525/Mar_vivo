# Mar Vivo – Simulador de Pesca Sustentable

## 📋 Descripción del Proyecto

**Mar Vivo** es una herramienta educativa de simulación de gestión pesquera mediante gamificación. Su objetivo principal es entender los patrones de conducta y estrategias de juego de diferentes usuarios en contextos de pesquerías, permitiendo investigar cómo los usuarios toman decisiones cuando se enfrentan a conflictos entre lucro económico y sostenibilidad ambiental.

El simulador crea un entorno interactivo donde los jugadores asumen el rol de pescadores que deben equilibrar sus necesidades de supervivencia, ganancias económicas y la salud del ecosistema marino. A través de decisiones estratégicas repetidas, el simulador captura datos sobre preferencias de usuario, riesgo-tolerancia y comprensión de sistemas complejos.

---

## 🎮 Características Principales

### 🌊 Sistema de Zonas Pesqueras

El simulador incluye tres zonas de pesca distintas, cada una con características únicas:

- **MANGLAR** - Aguas someras y productivas
  - Especies pequeñas y medianas (Robalo, Mojarra, Cangrejo, Camarón)
  - Bajo costo de combustible (5 unidades)
  - Ideal para principiantes
  - Impacto ecológico: Bajo a medio

- **ARRECIFE** - Ecosistema de alta biodiversidad
  - Especies valiosas y raras (Pez Ángel, Mero, Langosta, Pulpo)
  - Costo de combustible: 12 unidades
  - Requiere estrategia y paciencia
  - Impacto ecológico: Crítico - requiere manejo cuidadoso

- **MAR ABIERTO** - Pesca industrial
  - Especies grandes y de alto valor (Atún, Pargo, Dorado, Sierra)
  - Costo de combustible: 20 unidades
  - Mayor riesgo, mayores recompensas
  - Impacto ecológico: Muy alto - riesgo inmediato de colapso

### 🎣 Métodos de Pesca

Cinco métodos de pesca con diferentes características estratégicas:

1. **Anzuelo** - Tiempo: 4 seg | Eco: 0.5 | Precisión: 70%
   - Bajo impacto ambiental | Requiere precisión

2. **Red** - Tiempo: 6 seg | Eco: 2 | Precisión: 85%
   - Impacto moderado | Bonus en Mar Abierto (+40%)

3. **Trampa** - Tiempo: 8 seg | Eco: 1 | Precisión: 80%
   - Bajo impacto | Bonus en Manglar (+30%)

4. **Artesanal** - Tiempo: 5 seg | Eco: 0.3 | Precisión: 75%
   - Muy bajo impacto | Ideal para sostenibilidad

5. **Industrial** - Tiempo: 3 seg | Eco: 5 | Precisión: 95%
   - Alto impacto ambiental | Alto riesgo de colapso | Bonus en Mar Abierto (+60%)

### 💰 Sistema Económico

- **Dinero**: Moneda base, ganada vendiendo capturas
- **Mercado**: Los precios varían según la especie y disponibilidad
- **Compras**: Comida, agua y combustible para supervivencia
- **Almacén**: Inventario limitado (máx. 20 peces)
- **Dinámico**: Los precios de venta dependen de rareza y disponibilidad

### 🌡️ Sistema de Supervivencia

Tres medidores que deciden el éxito o fracaso del jugador:

| Variable | Descripción | Efectos |
|----------|-------------|---------|
| **Energía** | Stamina del pescador | Afecta velocidad y precisión en minijuegos |
| **Hambre** | Necesidad de alimento | Aumenta al trabajar, disminuye con comida |
| **Sed** | Necesidad de agua | Aumenta constantemente, crítica en zonas lejanas |

Dejar estas necesidades sin atender lleva al **Game Over**.

### 🌿 Sistema Ecológico (Eco)

- **Barra Eco**: Representa la salud del ecosistema marino (0-100%)
- **Impacto por método**: Cada método tiene un costo ecológico
- **Repoblación**: El ecosistema se recupera lentamente con el tiempo
- **Umbral crítico**: Por debajo del 20% aparecen advertencias
- **Colapso**: Si llega a 0%, las poblaciones de peces desaparecen
- **Estrategia clave**: El jugador debe equilibrar ganancias a corto plazo con sostenibilidad a largo plazo

### ⏰ Sistema de Tiempo y Clima

- **Ciclo Diario**: 06:00 a 22:00 en tiempo simulado
- **Estaciones**: Primavera, Verano, Otoño, Invierno (4 días = 1 ciclo)
- **Clima Dinámico**: Soleado, Nublado, Lluvia, Tormenta
- **Temperatura**: Varía según hora y estación
- **Tormentas**: Eventos aleatorios que reducen visibilidad y ponen en peligro al jugador

### 📖 Sistema de Bitácora (Logbook)

- **Descubrimiento**: Cada especie nueva se registra automáticamente
- **Bonus**: Completar la bitácora de una zona otorga bonificación de experiencia
- **Rareza**: Las especies raras dan más puntos de experiencia
- **Progresión**: Consultar la bitácora muestra progreso total

### 📊 Sistema de Progresión de Jugador

- **Nivel**: Novato → Aprendiz → Experimentado → Experto → Maestro
- **Experiencia**: Ganada por capturas, descubrimientos, y logros
- **Bonificadores**: Niveles más altos otorgan mejores precios de venta

### 💾 Sistema de Guardado

- **3 Ranuras**: El jugador puede guardar en 3 puntos diferentes
- **Información guardada**: Dinero, inventario, día, bitácora, eco, todas las variables
- **Cargar partida**: Continuar desde cualquier punto guardado

---

## 🎯 Variables del Juego

### Estado Global (G)

```javascript
{
  running: boolean,          // ¿Está activa la partida?
  day: number,               // Día actual (comienza en 1)
  hour: number,              // Hora actual (6-22)
  minute: number,            // Minuto actual (0-59)
  season: number,            // Estación (0-3: Primavera, Verano, Otoño, Invierno)
  weather: string,           // Estado del clima (sunny, cloudy, rain, storm)
  temp: number,              // Temperatura en °C
  zone: string,              // Zona actual (manglar, arrecife, abierto)
  method: string,            // Método de pesca seleccionado
  money: number,             // Dinero del jugador
  fuel: number,              // Combustible (0-100%)
  energy: number,            // Energía del jugador (0-100)
  hunger: number,            // Hambre del jugador (0-100)
  thirst: number,            // Sed del jugador (0-100)
  eco: number,               // Salud del ecosistema (0-100%)
  caught: number,            // Número total de peces capturados
  inventory: array,          // Array de peces en inventario
  logbook: object,           // Especies descubiertas por zona
  fishing: boolean,          // ¿Está pescando actualmente?
  storm: boolean             // ¿Hay tormenta activa?
}
```

### Variables de Zonas

Cada zona tiene información única:

```javascript
{
  name: string,              // Nombre de la zona
  species: string,           // Especies disponibles
  fuelCost: number           // Combustible necesario para desplazarse
}
```

### Variables de Métodos de Pesca

```javascript
{
  label: string,             // Nombre del método
  time: number,              // Tiempo del minijuego (ms)
  eco: number,               // Impacto ecológico
  bonus: object,             // Bonificador por zona
  miss: number               // Probabilidad de fallo (0-1)
}
```

### Variables de Especies

Cada especie tiene atributos únicos:

```javascript
{
  name: string,              // Nombre de la especie
  color: string,             // Color del sprite
  belly: string,             // Color del vientre
  fin: string,               // Color de las aletas
  weight: [min, max],        // Peso en kg
  value: [min, max],         // Valor en dinero
  rarity: number,            // Rareza (0-1)
  eco: number,               // Impacto de capturar esta especie
  desc: string,              // Descripción educativa
  release: boolean,          // ¿Se libera automáticamente?
  rare: boolean              // ¿Es una especie rara?
}
```

---

## 🎮 Mecánica de Juego

### Ciclo de Juego

1. **Seleccionar Zona** - Elegir dónde pescar (costo en combustible)
2. **Seleccionar Método** - Elegir técnica de pesca
3. **Minijuego de Pesca** - Precisión y timing
4. **Resultado** - Éxito o fracaso
5. **Gestión** - Vender, comprar, descansar
6. **Supervivencia** - Mantener energía, hambre, sed

### Minijuego de Pesca

- Visualización del icono del pez aproximándose
- Ventana de tiempo para "capturar"
- La precisión depende del nivel de energía del jugador
- Las especies raras son más difíciles de capturar

### Gestión del Tiempo

- El tiempo avanza más rápido durante la pesca
- El tiempo se detiene en menús
- Al llegar a las 22:00 llega la noche (Game Over si no hay refugio)

---

## 🎓 Aplicación Educativa

Mar Vivo fue diseñado como herramienta de investigación para:

- **Comprender decisiones bajo incertidumbre** - ¿Cuándo los usuarios eligen sostenibilidad vs. ganancia?
- **Analizar patrones de comportamiento** - Estrategias repetidas y evolución de decisiones
- **Estudiar collapse del ecosistema** - Cómo los usuarios responden a advertencias ecológicas
- **Evaluación de comprensión sistémica** - ¿Entienden usuarios las relaciones causa-efecto?

---

## 🛠️ Tecnologías

- **HTML5 Canvas** - Renderizado 2D y animaciones de pixel art
- **JavaScript Vanilla** - Lógica de juego sin dependencias externas
- **Web Audio API** - Efectos de sonido procedurales
- **Local Storage** - Sistema de guardado persistente
- **Responsive Design** - Compatible con pantallas horizontales y verticales

---

## 🚀 Cómo Jugar

1. Haz clic en **NUEVA PARTIDA** para comenzar
2. Selecciona una zona pesquera
3. Elige tu método de pesca
4. Completa el minijuego de pesca
5. Vende tus capturas en el mercado
6. Compra comida, agua y combustible para sobrevivir
7. Gestiona tu energía y el ecosistema marino
8. Descubre nuevas especies en la bitácora

**Objetivo**: Sobrevivir el mayor tiempo posible manteniendo el equilibrio entre ganancias y sostenibilidad.

---

## 📄 Licencia

Este proyecto es de naturaleza educativa y de investigación.