import { searchGamesRAWG } from '../api';


// Función para obtener detalles de un juego por id de RAWG
function fetchGameDetailsRAWG(id: number): Promise<any> {
  const apiKey = 'be73fa1f33d94ca8969118d69c3c1ad5';
  return fetch(`https://api.rawg.io/api/games/${id}?key=${apiKey}`)
    .then(res => res.ok ? res.json() : Promise.reject('No se pudo cargar detalles'));
}


let allGames: any[] = [];
let allPlatforms: string[] = [];
let currentPage = 1;
const PAGE_SIZE = 12;
let selectedPlatforms: string[] = [];
let sortOrder: 'asc' | 'desc' = 'desc';

export function renderJuegos(container: HTMLElement, page = 1) {
  currentPage = page;
  container.innerHTML = `<div class="flex justify-center items-center min-h-[40vh]"><span class="text-white text-lg animate-pulse">Cargando juegos de Zelda...</span></div>`;

  // Si ya tenemos los juegos, solo renderizamos
  if (allGames.length > 0) {
    renderWithFilters();
    return;
  }

  // Cargar todos los juegos de Zelda (RAWG permite hasta 500 resultados)
  let loadedGames: any[] = [];
  let pageApi = 1;
  const PAGE_API_SIZE = 40;
  const maxPages = 13; // 13*40=520, RAWG limita a 500

  async function fetchAll() {
    while (pageApi <= maxPages) {
      const res = await fetch(`https://api.rawg.io/api/games?key=be73fa1f33d94ca8969118d69c3c1ad5&search=zelda&page_size=${PAGE_API_SIZE}&page=${pageApi}&platforms=7,10,11,105,83,79,49,8,9,24,43,26,87`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        loadedGames = loadedGames.concat(data.results);
        if (!data.next) break;
      } else {
        break;
      }
      pageApi++;
    }
    allGames = loadedGames.filter((game: any) => {
      const name = (game.name || '').toLowerCase();
      const platforms = (game.platforms || []).map((p: any) => (p.platform.name || '').toLowerCase());
      return name.includes('zelda') && !platforms.some((p: string) => p === 'pc' || p === 'web');
    });
    allPlatforms = Array.from(new Set(allGames.flatMap((g: any) => (g.platforms || []).map((p: any) => p.platform.name)))).sort();
    renderWithFilters();
  }
  fetchAll();

  function renderWithFilters() {
    let filtered = allGames;
    if (selectedPlatforms.length > 0) {
      filtered = filtered.filter((g: any) =>
        g.platforms && g.platforms.some((p: any) => selectedPlatforms.includes(p.platform.name))
      );
    }
    filtered = filtered.slice().sort((a: any, b: any) => {
      const dateA = a.released ? new Date(a.released).getTime() : 0;
      const dateB = b.released ? new Date(b.released).getTime() : 0;
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    renderGames(filtered.slice(start, end), totalPages, filtered.length);
  }

  function renderGames(gamesToShow: any[], totalPages: number, totalFiltered: number) {
        container.innerHTML = `
          <section class="w-full max-w-7xl mx-auto">
            <div class="pt-8"></div>
            <form id="filters-form" class="flex flex-wrap gap-6 mb-8 justify-center items-center bg-gradient-to-r from-emerald-950/80 via-stone-900/80 to-amber-900/60 p-4 rounded-2xl border-2 border-amber-400/30 shadow-lg">
              <div class="flex flex-col items-center">
                <label class="text-amber-200 font-bold mb-1">Ordenar por fecha</label>
                <select id="sort-order" class="rounded-lg px-3 py-2 bg-stone-800 text-emerald-200 border border-amber-400/40 focus:ring-2 focus:ring-emerald-400 outline-none">
                  <option value="desc">Más nuevos primero</option>
                  <option value="asc">Más antiguos primero</option>
                </select>
              </div>
              <div class="flex flex-col items-center">
                <label class="text-amber-200 font-bold mb-1">Consolas</label>
                <div id="platform-checkboxes" class="flex flex-wrap gap-2 max-w-xs justify-center">
                  ${allPlatforms.map(p => `
                    <label class="flex items-center gap-1 bg-stone-800/80 px-2 py-1 rounded-lg border border-amber-400/20 cursor-pointer hover:bg-emerald-900/40 transition">
                      <input type="checkbox" value="${p}" class="platform-checkbox accent-emerald-400">
                      <span class="text-xs text-emerald-100">${p}</span>
                    </label>
                  `).join('')}
                </div>
              </div>
            </form>
            <h1 class="zelda-title text-3xl md:text-4xl mb-8 text-center text-emerald-400 drop-shadow-lg">Juegos de The Legend of Zelda</h1>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
              ${gamesToShow.map((game: any, idx: number) => `
                <button class="card-zelda bg-gradient-to-br from-emerald-900/90 via-amber-200/60 to-yellow-600/80 p-4 flex flex-col items-center rounded-2xl shadow-xl border border-amber-400/40 hover:scale-105 transition-transform duration-200 focus:outline-none" data-idx="${idx}">
                  <img src="${game.background_image || 'https://static.wikia.nocookie.net/zelda_gamepedia_en/images/9/9a/Triforce_Artwork.png'}" alt="${game.name}" class="rounded-xl mb-3 w-full h-48 object-cover bg-stone-900/40 shadow-md border border-amber-100/20">
                  <span class="text-emerald-100 font-bold text-lg text-center line-clamp-2">${game.name}</span>
                  <span class="text-xs text-amber-200 mt-1">${game.released || ''}</span>
                  <div class="mt-2 flex flex-wrap gap-1 justify-center">
                    ${(game.platforms || []).map((p: any) => `<span class="bg-amber-900/60 text-amber-100 text-xs px-2 py-0.5 rounded-full">${p.platform.name}</span>`).join('')}
                  </div>
                </button>
              `).join('')}
            </div>
            <div class="flex justify-center items-center gap-4 mt-8">
              <button class="btn-zelda px-4 py-2" id="prev-page" ${currentPage <= 1 ? 'disabled' : ''}>&larr; Anterior</button>
              <span class="text-emerald-200 font-bold">Página ${currentPage} de ${totalPages} &mdash; <span class="text-xs">${totalFiltered} juegos</span></span>
              <button class="btn-zelda px-4 py-2" id="next-page" ${currentPage >= totalPages ? 'disabled' : ''}>Siguiente &rarr;</button>
            </div>
          </section>
          <div id="zelda-modal-root"></div>
        `;

        // Eventos de paginación
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        prevBtn?.addEventListener('click', () => {
          if (currentPage > 1) {
            currentPage--;
            renderWithFilters();
          }
        });
        nextBtn?.addEventListener('click', () => {
          currentPage++;
          renderWithFilters();
        });

        // Modal: mostrar detalles al pulsar un juego
        const modalRoot = document.getElementById('zelda-modal-root');
        const gameBtns = container.querySelectorAll('[data-idx]');
        gameBtns.forEach(btn => {
          btn.addEventListener('click', async () => {
            const idx = parseInt((btn as HTMLElement).getAttribute('data-idx')!);
            const game = gamesToShow[idx];
            if (!modalRoot) return;
            modalRoot.innerHTML = `
              <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div class="bg-stone-900 rounded-2xl shadow-2xl max-w-lg w-full p-6 relative border-4 border-amber-400/40 flex flex-col items-center">
                  <span class='text-emerald-200 text-lg animate-pulse mb-4'>Cargando detalles...</span>
                </div>
              </div>
            `;
            try {
              const details = await fetchGameDetailsRAWG(game.id);
              modalRoot.innerHTML = `
                <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                  <div class="bg-stone-900 rounded-2xl shadow-2xl max-w-lg w-full p-6 relative border-4 border-amber-400/40">
                    <button class="absolute top-2 right-2 text-amber-200 hover:text-emerald-300 text-2xl font-bold" id="close-modal">&times;</button>
                    <img src="${details.background_image || 'https://static.wikia.nocookie.net/zelda_gamepedia_en/images/9/9a/Triforce_Artwork.png'}" alt="${details.name}" class="rounded-xl mb-4 w-full h-56 object-cover bg-stone-900/40 shadow-md border border-amber-100/20">
                    <h2 class="zelda-title text-2xl mb-2 text-emerald-300">${details.name}</h2>
                    <p class="text-amber-100 mb-2 text-sm">${details.released ? `Lanzamiento: <b>${details.released}</b>` : ''}</p>
                    <div class="mb-2 flex flex-wrap gap-2">
                      ${(details.platforms || []).map((p: any) => `<span class="bg-amber-900/60 text-amber-100 text-xs px-2 py-0.5 rounded-full">${p.platform.name}</span>`).join('')}
                    </div>
                    <p class="text-emerald-100 text-sm mb-2">${details.genres?.map((g: any) => g.name).join(', ') || ''}</p>
                    <p class="text-amber-200 text-xs mb-2">${details.esrb_rating ? `ESRB: ${details.esrb_rating.name}` : ''}</p>
                    <div class="my-4 p-3 bg-emerald-950/60 rounded-lg border-l-4 border-amber-400/60 max-h-48 overflow-y-auto text-white text-sm text-left shadow-inner">
                      ${details.description_raw
                        ? (details.description_raw.length > 400
                            ? details.description_raw.slice(0, 400) + '...'
                            : details.description_raw)
                        : 'Sin descripción disponible.'}
                    </div>
                    <a href="${details.website || '#'}" target="_blank" rel="noopener" class="btn-zelda mt-4 inline-block ${details.website ? '' : 'pointer-events-none opacity-50'}">Sitio oficial</a>
                  </div>
                </div>
              `;
              document.getElementById('close-modal')?.addEventListener('click', () => {
                modalRoot.innerHTML = '';
              });
            } catch (e) {
              modalRoot.innerHTML = `<div class='fixed inset-0 bg-black/60 flex items-center justify-center z-50'><div class='bg-stone-900 rounded-2xl shadow-2xl max-w-lg w-full p-6 relative border-4 border-amber-400/40 flex flex-col items-center'><span class='text-red-400'>No se pudo cargar detalles.</span><button class='btn-zelda mt-4' id='close-modal'>Cerrar</button></div></div>`;
              document.getElementById('close-modal')?.addEventListener('click', () => {
                modalRoot.innerHTML = '';
              });
            }
          });
        });

        // Filtros
        const sortSelect = document.getElementById('sort-order') as HTMLSelectElement;
        if (sortSelect) {
          sortSelect.value = sortOrder;
          sortSelect.onchange = () => {
            sortOrder = sortSelect.value as 'asc' | 'desc';
            currentPage = 1;
            renderWithFilters();
          };
        }
        // Checkbox filtering
        const platformCheckboxes = Array.from(document.querySelectorAll('.platform-checkbox')) as HTMLInputElement[];
        platformCheckboxes.forEach(cb => {
          cb.checked = selectedPlatforms.includes(cb.value);
          cb.onchange = () => {
            selectedPlatforms = platformCheckboxes.filter(c => c.checked).map(c => c.value);
            currentPage = 1;
            renderWithFilters();
          };
        });
      }
  }
