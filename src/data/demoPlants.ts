import { Plant } from '../types';

export const DEMO_PLANTS: Plant[] = [
  {
    id: 'plant_milo',
    name: 'Milo',
    species: 'Monstera Deliciosa',
    daysTogether: 94,
    coverImage: '/src/assets/images/milo_monstera_full_1792440447034.jpg',
    firstObservationDate: 'July 27, 2026',
    latestObservationDate: 'October 29, 2026',
    locationNotes: 'East-facing window sill with gentle morning sunlight',
    createdAt: '2026-07-27T08:30:00Z',
  },
  {
    id: 'plant_sol',
    name: 'Sol',
    species: 'Ficus Lyrata (Fiddle Leaf Fig)',
    daysTogether: 71,
    coverImage: '/src/assets/images/sol_ficus_early_1794009507803.jpg',
    firstObservationDate: 'August 15, 2026',
    latestObservationDate: 'October 25, 2026',
    locationNotes: 'Living room corner adjacent to south-facing terrace glass',
    createdAt: '2026-08-15T09:15:00Z',
  },
  {
    id: 'plant_cleo',
    name: 'Cleo',
    species: 'Epipremnum Aureum (Golden Pothos)',
    daysTogether: 113,
    coverImage: '/src/assets/images/cleo_pothos_mid_1794009519642.jpg',
    firstObservationDate: 'July 01, 2026',
    latestObservationDate: 'October 22, 2026',
    locationNotes: 'Reclaimed oak floating shelf in dining area',
    createdAt: '2026-07-01T10:00:00Z',
  },
];
