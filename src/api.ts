import { fromFetch } from 'rxjs/fetch';
import { switchMap, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

const RAWG_API_KEY = 'be73fa1f33d94ca8969118d69c3c1ad5';
const RAWG_BASE_URL = 'https://api.rawg.io/api';

// RAWG platform IDs for Nintendo (excluyendo PC y Web):
// Switch: 7, Wii U: 10, Wii: 11, GameCube: 105, N64: 83, SNES: 79, NES: 49, 3DS: 8, DS: 9, GBA: 24, GBC: 43, GB: 26, Virtual Boy: 87
const NINTENDO_PLATFORM_IDS = [7,10,11,105,83,79,49,8,9,24,43,26,87];

// Busca juegos por nombre en RAWG solo en plataformas de Nintendo
export function searchGamesRAWG(query: string, pageSize = 10, page = 1): Observable<any> {
  const url = `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(query)}&page_size=${pageSize}&page=${page}&platforms=${NINTENDO_PLATFORM_IDS.join(',')}`;
  return fromFetch(url).pipe(
    switchMap(response => {
      if (response.ok) {
        return response.json();
      } else {
        return of({ error: true, message: `Error ${response.status}` } as any);
      }
    }),
    catchError(err => of({ error: true, message: err.message } as any))
  );
}