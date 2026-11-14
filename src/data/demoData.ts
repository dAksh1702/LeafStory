import { Plant, ObservationRecord } from '../types';
import { DEMO_PLANTS } from './demoPlants';
import { DEMO_OBSERVATIONS } from './demoObservations';

export const INITIAL_PLANTS: Plant[] = DEMO_PLANTS;
export const INITIAL_OBSERVATIONS: ObservationRecord[] = DEMO_OBSERVATIONS;

export const SAMPLE_CAPTURE_PHOTOS = [
  {
    label: 'Stage 1 — Early Potting',
    url: '/src/assets/images/milo_monstera_early_1792440419360.jpg',
    description: 'Two juvenile leaves with early splits',
  },
  {
    label: 'Stage 2 — Tender New Leaf',
    url: '/src/assets/images/milo_monstera_mid_1792440432733.jpg',
    description: 'Bright lime leaf unfurling upright',
  },
  {
    label: 'Stage 3 — Full Canopy',
    url: '/src/assets/images/milo_monstera_full_1792440447034.jpg',
    description: 'Deep fenestrations and expansive posture',
  },
];
