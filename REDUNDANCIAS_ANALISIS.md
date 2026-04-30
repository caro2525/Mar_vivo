# Análisis de Redundancias - Mar Vivo

**Fecha:** 2026-04-30  
**Estadísticas del archivo:**
- Total líneas: 4489
- Funciones: 114
- Event listeners: 4
- Inline onclick handlers: 48
- getElementById calls: 91

---

## 1. ⚠️ REDUNDANCIA CRÍTICA: Funciones de Dibujo de Edificios

### Problema
Funciones como `drawMarket()`, `drawRepairShop()`, `drawCantina()`, `drawCooperativa()` siguen el **mismo patrón exacto**:
1. Calcular ancho, alto y escala
2. Dibujar sombra
3. Dibujar base de piedra con patrón de ladrillos
4. Dibujar sección de madera superior
5. Dibujar techo con tejas
6. Dibujar ventanas con luz nocturna
7. Dibujar puerta/acceso
8. Dibujar letrero

### Líneas afectadas
- `drawMarket()` (2005-2091, ~86 líneas)
- `drawRepairShop()` (2094-2175, ~81 líneas)
- `drawCantina()` (1969-2004, ~35 líneas)
- `drawCooperativa()` (2215-2290, ~75 líneas)
- `drawLighthouse()` (2178-2250, ~72 líneas)
- `drawDock()` (2310-2400, ~90 líneas)

### Impacto
- **~400+ líneas de código duplicado** con pequeñas variaciones
- Cambios en lógica de dibujo requieren actualizar 6+ funciones
- Mantenimieto difícil y propenso a inconsistencias

### Solución posible
Crear una función genérica `drawBuilding(x, GY, W, BU, config)` que acepte:
```javascript
{
  width: factor,
  height: factor,
  stoneColors: [],
  woodColor: '#c0bcc0',
  roofColor: '#2a3040',
  windowStyle: 'double|single|garage',
  doorStyle: 'double|garage',
  signText: 'MERCADO',
  signColor: '#f1c40f'
}
```

---

## 2. ⚠️ REDUNDANCIA ALTA: Acceso repetido al DOM sin cacheo

### Problema
91 llamadas a `getElementById()` que **nunca cachean resultados**. Cada función que actualiza HUD, modal, o logs busca el elemento cada vez.

### Ejemplos
```javascript
// updateHUD() - línea 3592
document.getElementById('hud-money').textContent='$'+G.money;
document.getElementById('hud-fuel').textContent=...;
document.getElementById('hud-caught').textContent=...;
document.getElementById('hud-inv').textContent=...;
document.getElementById('hud-day').textContent=...;
// ... 6+ más

// logMsg() - línea 3617
const log=document.getElementById('message-log');
// ... se busca cada vez que hay un mensaje
```

### Impacto
- **Rendimiento:** Búsquedas DOM costosas en cada actualización
- **Frecuencia:** updateHUD() se llama constantemente (frame loop)
- Se podría mejorar: ~50% mejora en rendimiento DOM

### Solución posible
Cachear referencias al inicio:
```javascript
const DOM_CACHE = {
  hudMoney: null,
  hudFuel: null,
  hudCaught: null,
  messageLog: null,
  // ... etc
};

function initDOMCache() {
  DOM_CACHE.hudMoney = document.getElementById('hud-money');
  DOM_CACHE.hudFuel = document.getElementById('hud-fuel');
  // ...
}
```

---

## 3. 🔴 REDUNDANCIA ALTA: Manejadores de eventos inline vs addEventListener

### Problema
Mezcla de patrones:
- **48 onclick inline** en HTML: `onclick="sellItem('Dorado')"`
- **4 addEventListener** en JavaScript
- Inconsistencia: dificulta mantenimiento y testing

### Líneas afectadas
Esparcido por todo el HTML:
- Botones de tienda (10+)
- Botones de método de pesca (6+)
- Controles generales (20+)

### Impacto
- Difícil buscar todos los handlers
- No puedo usar event delegation
- Código menos mantenible

### Solución posible
Convertir todos a `addEventListener` con event delegation:
```javascript
document.getElementById('market-items').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-sell-item]');
  if (btn) sellItem(btn.dataset.sellItem);
});
```

---

## 4. 🟠 REDUNDANCIA MEDIA: Lógica de venta duplicada

### Problema
`sellItem()` y `sellAllItem()` tienen lógica muy similar:
```javascript
// sellItem() - línea 3498
const idx=G.inventory.findIndex(i=>i.name===name);
const moneyBefore=G.money;
Logger.log('sale', {...});
G.money+=p; it.qty--;
logMsg('Vendiste 1...','success');
SFX.sell(); openMarket(); updateHUD();

// sellAllItem() - línea 3506
const idx=G.inventory.findIndex(i=>i.name===name);
const moneyBefore=G.money;
Logger.log('sale', {...});
G.money+=tv;
logMsg('Vendiste todo...','success');
SFX.sell(); openMarket(); updateHUD();
```

### Impacto
- Solo diferencia es cantidad (`qty: 1` vs `qty: qty`)
- Cambios en lógica requieren actualizar 2 funciones

### Solución posible
```javascript
function sellItem(name, qty = 1) {
  // lógica única que maneja ambos casos
}
```

---

## 5. 🟠 REDUNDANCIA MEDIA: Dibujo de peces en múltiples contextos

### Problema
`drawFish()` es una función, pero también hay código de dibujo de peces duplicado en:
- `openLogbook()` - línea 3560-3586 (dibuja peces en mini-canvas)
- Código similar para mostrar peces en otros modales

### Impacto
- Cambios en apariencia de peces requieren actualizar 2-3 lugares
- Si se quiere añadir nuevo tipo de pez, hay que hacerlo en múltiples funciones

---

## 6. 🟠 REDUNDANCIA MEDIA: Actualización de barras de progreso

### Problema
Código repetido para actualizar cada barra (energy, hunger, thirst, eco):
```javascript
// Línea 3610-3614
['energy','hunger','thirst'].forEach(k=>
  document.getElementById('bar-'+k).style.width=G[k]+'%'
);
document.getElementById('bar-eco').style.width=G.eco+'%';
// ... luego cambiar color manualmente
```

Patrones similares aparecen en:
- `updateHUD()`
- Cálculos de colores basados en valores

### Impacto
- Si cambio formato de barras, debo actualizar en varios lugares
- Código frágil si agrego nuevas barras

---

## 7. 🟡 REDUNDANCIA BAJA: Configuración de métodos de pesca

### Problema
Posible que haya definición de métodos de pesca dispersa (métodos, bonificadores, costos).

### Líneas afectadas
- `METHOD_INFO` (estructura central)
- Posibles validaciones duplicadas en `fishingClick()`

### Impacto
- Media - si solo hay un lugar centralizado, es manejable

---

## 8. 🟡 REDUNDANCIA BAJA: Manejo modal/overlay

### Problema
Funciones para abrir/cerrar modales son simples, pero patrones similares:
```javascript
function openModal(t,c) { ... }
function closeModal() { ... }
function openZoneMap(zone) { ... }
function closeZoneMap() { ... }
function openLogbook() { ... }
function showHelp() { ... }
```

### Impacto
- Bajo - son funciones cortas
- Pero si necesito agregar animaciones, transiciones, etc., habrá duplicación

---

## Resumen de Redundancias por Severidad

| Severidad | Tipo | Líneas | Impacto |
|-----------|------|--------|--------|
| 🔴 CRÍTICA | Funciones draw edificios | ~400 | Alto - mantenimiento |
| 🔴 CRÍTICA | getElementById sin cacheo | ~91 calls | Alto - rendimiento |
| 🟠 ALTA | Eventos onclick inline | ~48 handlers | Alto - mantenimiento |
| 🟠 MEDIA | Lógica venta duplicada | ~30 | Medio - funcionalidad |
| 🟠 MEDIA | Dibujo de peces | ~25 | Medio - mantenimiento |
| 🟠 MEDIA | Barras de progreso | ~20 | Medio - escalabilidad |
| 🟡 BAJA | Config métodos | Dispersa | Bajo |
| 🟡 BAJA | Manejo de modales | ~30 | Bajo |

---

## Recomendaciones

### Prioridad 1: Refactorizar funciones draw (crítica)
- Crear función genérica `drawBuilding()`
- Ahorraría ~300 líneas
- Mejoraría mantenibilidad significativamente

### Prioridad 2: Cachear referencias DOM (crítica)
- Crear `initDOMCache()` al inicio
- Reemplazar 91 `getElementById` con cache
- Mejora de rendimiento inmediata

### Prioridad 3: Unificar eventos (alta)
- Convertir todos los onclick a addEventListener
- Usar event delegation
- Mejoraría mantenibilidad y testing

### Prioridad 4: Consolidar lógica duplicada (media)
- Fusionar `sellItem()` y `sellAllItem()`
- Consolidar dibujo de peces
- Mejoraría escalabilidad

---

## Próximos pasos
¿Quieres que empecemos por una de estas áreas? Te sugiero:
1. **Primero:** Cacheo DOM (rápido, impacto inmediato en rendimiento)
2. **Luego:** Refactor draw buildings (grande pero muy impactante)
3. **Finalmente:** Unificar eventos (mejora arquitectura)
