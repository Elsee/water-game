# TROUBLESHOOTING.md — Common Issues and Solutions

## Canvas / Rendering

### Black / Empty Canvas

**Problem:** Canvas appears black or nothing is rendered.

**Solutions:**
- Check that `setup.ts` is called in `useEffect` with the correct ref.
- Verify that `renderer.init()` receives a real DOM element (not null).
- Ensure `gameLoop.start()` is called after `renderer.init()`.
- Check browser console for errors.
- For Canvas2D: make sure `ctx.clearRect()` is called before drawing each frame.

### Objects Not Visible

**Problem:** Game runs but objects don't appear.

**Solutions:**
- Check object colors — they might match the background.
- Verify coordinates — objects might be outside canvas bounds.
- Ensure `renderer.render()` is called every frame.
- Check that entities are added to the world before the loop starts.
- For Canvas2D: verify `ctx.fillStyle` is set before `fillRect()`.

### Canvas Blurry on Retina Displays

**Problem:** Canvas looks blurry on high-DPI screens.

**Solution:** Use `devicePixelRatio`:

```typescript
const dpr = window.devicePixelRatio || 1;
canvas.width = width * dpr;
canvas.height = height * dpr;
canvas.style.width = width + 'px';
canvas.style.height = height + 'px';
ctx.scale(dpr, dpr);
```

### PixiJS: Nothing Renders

**Problem:** PixiJS application initializes but nothing shows.

**Solutions:**
- Ensure `PIXI.Application.init()` completes (it's async).
- Check that canvas is added to the DOM.
- Verify order: init → addChild → render.
- Make sure sprites have valid textures and positions.

### Three.js: Black Screen

**Problem:** Three.js scene is black.

**Solutions:**
- Add light: `new THREE.AmbientLight(0xffffff, 1)`.
- Check camera position — it might not be looking at objects.
- Verify objects are within camera's field of view.
- Ensure `renderer.render(scene, camera)` is called in the loop.

---

## Gameplay

### Objects "Jitter" or Teleport

**Problem:** Movement is not smooth, objects jump around.

**Solutions:**
- Use fixed timestep (already in `game-loop.ts`).
- Don't use `Date.now()` — use `performance.now()`.
- Ensure dt is passed in seconds, and velocities are in px/sec.
- Check that movement is applied in the update loop, not render.

### Objects Pass Through Each Other

**Problem:** Collision detection fails at high speeds.

**Solutions:**
- At high velocities, objects can "tunnel" through each other. Reduce speed or increase object sizes.
- Check system order: collision must run AFTER movement.
- Implement collision resolve that pushes objects apart.
- Consider continuous collision detection for very fast objects.

### Controls Not Working

**Problem:** Keyboard or mouse input doesn't affect the game.

**Solutions:**
- Ensure InputSystem listens to events on the canvas, not window.
- Canvas needs `tabIndex={0}` and `focus()` for keyboard events.
- Or listen on `window` — but then arrow keys scroll the page. Add `e.preventDefault()`.
- Check that `isKeyDown()` is called correctly in your systems.

### Game Won't Pause

**Problem:** Pause button doesn't stop the game.

**Solutions:**
- Verify `gameLoop.stop()` is actually called.
- Check that `gameStore.gameStatus` changes to `'paused'`.
- Ensure React re-renders the pause overlay.
- Make sure input system ignores input when paused.

---

## React / Store

### React Doesn't Update on Score Change

**Problem:** Score changes in store but UI doesn't update.

**Solutions:**
- Use `useSelector(gameStore, (s) => s.score)` with a selector.
- Don't mutate the object — always return new: `{ ...prev, score: newScore }`.
- Import `useSelector` from `@tanstack/react-store`, NOT from `@tanstack/store`.
- Check that `gameActions.addScore()` is actually being called.

### Infinite Re-render Loop

**Problem:** Component re-renders infinitely.

**Solutions:**
- NEVER call `gameStore.setState()` inside React render.
- Store updates should only happen in engine (via gameActions).
- Don't put store subscriptions in useEffect without proper dependencies.

### useEffect Called Twice

**Problem:** useEffect runs twice on mount.

**Note:** React 18 StrictMode calls effects twice in dev mode. This is normal.

**Solutions:**
- Ensure cleanup function properly cleans up: `gameLoop.stop(); renderer.destroy()`.
- Don't rely on useEffect running only once — make it idempotent.

---

## Build / Rsbuild

### Module Not Found

**Problem:** Import fails with "Cannot find module".

**Solutions:**
- Check that package is installed: `npm install <package>`.
- Verify import path (relative vs absolute).
- Restart dev server: `npm run dev`.
- For Three.js: install `@types/three` for TypeScript.

### TypeScript Errors

**Problem:** Type errors in engine or renderer code.

**Solutions:**
- Check `tsconfig.json` — `strict: true` is enabled.
- For Three.js: install `@types/three`.
- For PixiJS: types are built-in, but check version compatibility.
- Don't use `any` — create proper interfaces.

### Build Fails

**Problem:** `npm run build` fails.

**Solutions:**
- Run `npm run lint` to catch issues early.
- Check for circular imports.
- Ensure all imports have correct extensions (`.ts`, `.tsx`).
- Clear `node_modules/.cache` and retry.

---

## Common Engine Issues

### Entities Not Moving

**Problem:** Entities stay in place.

**Solutions:**
- Check that MovementSystem is added to World.
- Verify velocity is set on entities.
- Ensure dt (delta time) is non-zero.
- Check that `world.update()` is called in the game loop.

### Score Not Increasing

**Problem:** Collision happens but score doesn't change.

**Solutions:**
- Verify CollisionSystem emits events via EventBus.
- Check that ScoreSystem listens to the correct event.
- Ensure `gameActions.addScore()` is called with positive value.
- Check that entities have correct tags for collision detection.

### Memory Leak

**Problem:** Game gets slower over time.

**Solutions:**
- Ensure dead entities are removed from World.
- Check that event listeners are cleaned up on destroy.
- Verify `gameLoop.stop()` and `renderer.destroy()` are called on unmount.
- Look for arrays that grow without bound (particles, projectiles).

---

## Quick Debug Checklist

```
[ ] Console has no errors
[ ] Canvas ref is not null
[ ] Game loop is started
[ ] Entities are added to world
[ ] Renderer is initialized
[ ] Store updates are immutable
[ ] Event listeners are cleaned up
[ ] Cleanup function runs on unmount
```
