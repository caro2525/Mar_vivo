// SceneManager: registra y cambia escenas, separa lógica y render
export default class SceneManager {
  constructor() {
    this.scenes = {};
    this.current = null;
    this.transition = null;
  }

  add(name, scene) {
    this.scenes[name] = scene;
    scene.manager = this;
  }

  async change(name, data = {}) {
    if (!this.scenes[name]) throw new Error('Scene not found: ' + name);
    if (this.current && this.current.onExit) await this.current.onExit();
    this.current = this.scenes[name];
    if (this.current.onEnter) await this.current.onEnter(data);
  }

  update(dt) { if (this.current && this.current.update) this.current.update(dt); }
  render(ctx, w, h) { if (this.current && this.current.render) this.current.render(ctx, w, h); }
  handleEvent(e) { if (this.current && this.current.handleEvent) this.current.handleEvent(e); }
}
