import { renderJuegos } from './modules/juegos';
// import { renderPersonajes } from './modules/personajes';
// import { renderTemplos } from './modules/templos';

export class App {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.setupNavigation();
    this.renderSection('juegos'); // Renderiza la sección por defecto
  }

  setupNavigation() {
    const navJuegos = document.getElementById('nav-juegos');
  // const navPersonajes = document.getElementById('nav-personajes');
  // const navTemplos = document.getElementById('nav-templos');

    navJuegos?.addEventListener('click', () => this.renderSection('juegos'));
  // navPersonajes?.addEventListener('click', () => this.renderSection('personajes'));
  // navTemplos?.addEventListener('click', () => this.renderSection('templos'));
  }

  renderSection(section: 'juegos') {
    switch (section) {
      case 'juegos':
        renderJuegos(this.container);
        break;
      // case 'personajes':
      //   renderPersonajes(this.container);
      //   break;
      // case 'templos':
      //   renderTemplos(this.container);
      //   break;
    }
  }
}