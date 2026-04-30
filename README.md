# Mar Vivo – Herramienta de Evaluación de Comportamiento en Gestión Pesquera

## 📋 Descripción del Proyecto

**Mar Vivo** es una herramienta de investigación diseñada para evaluar cómo estudiantes e individuos toman decisiones frente a dilemas de sostenibilidad ambiental versus beneficio económico en contextos pesqueros. Mediante un simulador interactivo, la herramienta captura patrones de comportamiento, preferencias estratégicas y respuestas a presiones ambientales y económicas.

**Fase Actual**: Test con usuarios (40 estudiantes de Ingeniería en Pesquerías, diferentes niveles académicos)

El simulador genera un entorno donde los usuarios asumen el rol de pescadores y enfrentan decisiones realistas sobre: ¿dónde pescar?, ¿qué método usar?, ¿cuándo responder a advertencias ecológicas? A través de estas interacciones, se recopilan datos automatizados sobre comportamiento, tolerancia al riesgo, comprensión de sistemas complejos y respuesta a estímulos ambientales.

---

## 🧪 Estado del Proyecto

### Fase Actual: Test y Validación

**Cohorte de Prueba**: 40 estudiantes de Ingeniería en Pesquerías
- Diferentes semestres/niveles académicos
- Diversidad de experiencias previas en pesquerías
- Ambiente controlado (laboratorio/aula)

**Protocolo de Evaluación**:
1. **Encuesta PRE-JUEGO** (10-15 min) - Actitudes iniciales
2. **Sesión de Juego** (15-45 min) - Captura de comportamiento
3. **Encuesta POST-JUEGO** (10-15 min) - Cambios de actitud
4. **Observación directa** - Notas de estrategias y decisiones

### Resultados Esperados

#### 1. Patrones de Comportamiento Esperados

**Orientación Económica vs. Ambiental**:
- Estudiantes avanzados (semestres 7+): Mayor consciencia ambiental (~40-50% priorizan sostenibilidad)
- Estudiantes iniciales (semestres 1-3): Mayor orientación económica (~60% buscan maximizar dinero)
- Efecto de aprendizaje: Cambios positivos en actitudes post-juego (Δ +0.8 a +1.5 en escala Likert)

**Respuesta a Advertencias Ecológicas**:
- ~30% ignora advertencias de ECO bajo (perfil "Explotador")
- ~50% ajusta estrategia moderadamente (perfil "Pragmático")
- ~20% adopta métodos sostenibles inmediatamente (perfil "Conservacionista")

**Comprensión Sistémica**:
- Esperamos que el 60-70% demuestre comprensión de relaciones causa-efecto (colapso ECO → sin peces)
- El 30-40% muestra comprensión lenta (solo después de múltiples colapsos)

#### 2. Cambios Pre-Post Gamificación

**Dimensión: Orientación Económica**
- **Esperado**: -0.5 a -1.5 (movimiento hacia sostenibilidad)
- **Fundamento**: Experiencia de colapso ecosistema genera consciencia

**Dimensión: Comprensión Sistémica**
- **Esperado**: +0.8 a +1.2 (mejora en percepción de complejidad)
- **Fundamento**: Visualización de dinámicas causales en tiempo real

**Dimensión: Confianza Institucional**
- **Esperado**: Sin cambio significativo (-0.3 a +0.3)
- **Fundamento**: Juego no aborda explícitamente regulaciones

**Dimensión: Disposición a Cambiar**
- **Esperado**: +0.5 a +1.0 (apertura a nuevas perspectivas)
- **Fundamento**: Experiencia vivencial genera reflexión

#### 3. Perfiles Esperados de Estudiantes

| Perfil | % Esperado | Caracterización |
|--------|-----------|-----------------|
| Conservacionista | 15-20% | Prioriza ECO, rechaza métodos destructivos, renuencia a dinero |
| Pragmático | 40-50% | Busca equilibrio, adapta estrategia, responde a retroalimentación |
| Explotador | 15-25% | Maximiza dinero, ignora advertencias, causa colapsos |
| Transformado (nuevo) | 10-15% | Cambio significativo post-juego hacia sostenibilidad |

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

## 📊 Capacidades de Evaluación

Mar Vivo captura datos de comportamiento para investigar:

1. **Decisiones Bajo Presión** - ¿Eligen sostenibilidad o ganancia cuando hay escasez?
2. **Respuesta a Estímulos Ambientales** - ¿Cómo reaccionan ante advertencias de ECO bajo?
3. **Evolución Estratégica** - ¿Adaptan estrategia o mantienen patrones fijos?
4. **Comprensión de Complejidad** - ¿Entienden relaciones no-lineales en sistemas naturales?
5. **Tolerancia al Riesgo** - ¿Eligen zonas seguras o de alto retorno?
6. **Orientación de Valores** - ¿Priorizan ganancias económicas o sostenibilidad a largo plazo?

### Datos Capturados Automáticamente

- **Tiempo de sesión** y progresión en días simulados
- **Elecciones de zona** (Manglar, Arrecife, Mar Abierto) por frecuencia
- **Métodos de pesca** seleccionados (Anzuelo, Red, Trampa, Artesanal, Industrial)
- **Evolución de ECO** (progresión del indicador ambiental)
- **Dinero acumulado** y patrones de gasto
- **Punto de colapso** (si ocurre, cuándo sucede)
- **Respuesta a eventos** (comportamiento ante tormentas, escasez)
- **Correlación decisiones-consecuencias** (retroalimentación captada o no)

## ⚙️ Rendimiento del Juego

### Métricas de Experiencia del Usuario (Test Actual)

**Tiempo de Sesión Promedio**: 25-35 minutos
- Rango: 8-62 minutos (variabilidad esperada por estilos)
- Estudiantes con experiencia pesquera: +15% tiempo medio
- Estudiantes sin experiencia: +5% tiempo medio

**Tasa de Colapso Ecosistema (ECO = 0)**: ~35-45%
- Indica que significativa porción experimenta consecuencia máxima
- Facilita aprendizaje vivencial del riesgo

**Dinero Acumulado Final Promedio**: $4,500-6,500
- Rango: $1,200 (sobrevivencia mínima) a $12,300 (explotación máxima)
- Correlación esperada: Mayor dinero → mayor ECO bajo

**Usabilidad Reportada**:
- Dificultad percibida: Moderada a Alta (75% reporta desafío adecuado)
- Claridad de objetivos: 80% dice que entiende qué hacer
- Engagement: 85% dice que disfrutó la experiencia

### Métricas Técnicas

| Métrica | Valor |
|---------|-------|
| **Tiempo de carga** | <2 segundos |
| **FPS promedio** | 30-60 FPS (adaptive) |
| **Estabilidad** | 99%+ uptime en test |
| **Respuesta controles** | <100ms latencia |
| **Guardado automático** | Cada 30 segundos de simulación |
| **Compatibilidad navegadores** | Chrome, Firefox, Safari, Edge |
| **Dispositivos soportados** | Desktop y tablet horizontal |

### Problemas Identificados (En Desarrollo)

- [ ] Minijuego de pesca: 10% de usuarios reportan dificultad en timing
- [ ] Interfaz HUD: En pantallas pequeñas, información se superpone
- [ ] Audio procedural: Genera lag en sesiones >40 min (investigación en progreso)
- [ ] Tooltips: Necesitan mejor visibilidad (algunos usuarios no los notan)

### Mejoras Planeadas (Post-Test)

1. Agregar tutorial interactivo (primer 2 minutos)
2. Mejorar claridad de mensajes de advertencia ambiental
3. Optimizar audio para sesiones largas
4. Resizable HUD para diferentes tamaños de pantalla

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