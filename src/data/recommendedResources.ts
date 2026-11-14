import { ResourceCategory } from '../types';

export const RECOMMENDED_RESOURCES: ResourceCategory[] = [
  {
    id: 'plant_supports',
    name: 'Plant Supports',
    icon: '🪴',
    shortTagline: 'Moss poles, stakes & trellises',
    description: 'Structural supports that guide upward-climbing foliage and mimic the natural tree-trunk climbing habits of tropical epiphytes.',
    educationalTip: 'Climbing plants like Monsteras and Philodendrons produce larger, more mature leaves with deeper fenestrations when aerial roots can attach to a damp support.',
    suggestedForSpecies: ['Monstera Deliciosa', 'Epipremnum Aureum'],
    sampleItems: [
      {
        name: 'Extendable Sphagnum Moss Pole',
        description: 'Porous cylinder filled with natural sphagnum moss that retains moisture for aerial root anchoring.',
        suitability: 'Ideal for Monstera Deliciosa and climbing aroids reaching over 40cm.',
      },
      {
        name: 'Natural Coconut Coir Totem',
        description: 'Sturdy wooden core wrapped in fibrous natural coconut husk for stable vertical guiding.',
        suitability: 'Great for juvenile plants beginning their first vertical growth stage.',
      },
      {
        name: 'Soft Botanical Stem Ties',
        description: 'Cushioned green plant wire that secures heavy petioles without pinching vascular tissue.',
        suitability: 'Essential for gently guiding petioles toward supports.',
      },
    ],
  },
  {
    id: 'soil_media',
    name: 'Soil & Growing Media',
    icon: '🌱',
    shortTagline: 'Aerated aroid blends & drainage',
    description: 'Specialized potting components that prioritize root zone oxygenation and prevent compaction.',
    educationalTip: 'Indoor plant roots need air as much as moisture. Standard dense potting peat often suffocates roots; chunky amendments keep airflow active.',
    suggestedForSpecies: ['Monstera Deliciosa', 'Ficus Lyrata', 'Epipremnum Aureum'],
    sampleItems: [
      {
        name: 'Chunky Aroid Bark Blend',
        description: 'Orchid bark, coarse perlite, charcoal, and coconut coir chunks for rapid drainage.',
        suitability: 'Recommended for Monsteras and tropical foliage prone to soggy soil.',
      },
      {
        name: 'Horticultural Pumice & Perlite',
        description: 'Inorganic volcanic aeration media that prevents soil compaction over multi-year cycles.',
        suitability: 'Universal amendment to lighten heavy indoor soils.',
      },
      {
        name: 'Organic Earthworm Castings',
        description: 'Gentle, microbial-rich organic soil amendment that provides steady non-burning trace nutrients.',
        suitability: 'Seasonal top-dressing for active spring and summer growth.',
      },
    ],
  },
  {
    id: 'pots_planters',
    name: 'Pots & Planters',
    icon: '🏺',
    shortTagline: 'Breathable terracotta & drainage',
    description: 'Vessels designed with proper drainage holes to maintain balanced root moisture and airflow.',
    educationalTip: 'Unglazed terracotta allows soil to breathe through the pot walls, drying evenly from all sides and reducing the risk of root rot.',
    suggestedForSpecies: ['Ficus Lyrata', 'Monstera Deliciosa'],
    sampleItems: [
      {
        name: 'Heavy-Base Italian Terracotta Pot',
        description: 'Porous, unglazed natural clay with generous drainage aperture and stable base weight.',
        suitability: 'Ideal for top-heavy specimens like Fiddle Leaf Figs (Sol).',
      },
      {
        name: 'Matte Ceramic Cachepot with Inner Liner',
        description: 'Decorative outer stoneware vessel fitted with a removable transparent drainage nursery liner.',
        suitability: 'Perfect for shelf plants (Cleo) where saucer spills must be prevented.',
      },
    ],
  },
  {
    id: 'watering_tools',
    name: 'Watering Tools',
    icon: '💧',
    shortTagline: 'Targeted pour & moisture checks',
    description: 'Instruments that help you gauge root moisture accurately rather than relying on guesswork.',
    educationalTip: 'Testing soil moisture 2 to 3 inches below the surface before watering is the single most reliable habit for healthy indoor plants.',
    suggestedForSpecies: ['Monstera Deliciosa', 'Ficus Lyrata', 'Epipremnum Aureum'],
    sampleItems: [
      {
        name: 'Long-Spout Stainless Watering Can',
        description: 'Precision gooseneck spout designed to deliver water directly to the soil line without wetting foliage.',
        suitability: 'Universal for all indoor companion plants.',
      },
      {
        name: 'Dual-Probe Soil Moisture Meter',
        description: 'Battery-free galvanic sensor that measures electrical conductivity at root level.',
        suitability: 'Helpful for deep pots where surface soil is dry while bottom remains damp.',
      },
      {
        name: 'Brass Fine Mist Atomizer',
        description: 'Produces a soft microscopic haze for cleaning dust from broad leaf surfaces.',
        suitability: 'Ideal for maintaining clean leaf surfaces on Ficus and Monstera.',
      },
    ],
  },
  {
    id: 'lighting',
    name: 'Indoor Lighting',
    icon: '💡',
    shortTagline: 'Full-spectrum supplemental illumination',
    description: 'Warm full-spectrum LED fixtures that supplement seasonal daylight shortfalls without harsh purple glare.',
    educationalTip: 'Indoor light intensity drops by over 50% just two feet away from a window glass. Supplemental light sustains vibrant variegation through winter.',
    suggestedForSpecies: ['Ficus Lyrata', 'Epipremnum Aureum'],
    sampleItems: [
      {
        name: 'Warm White Full-Spectrum LED Bulb (E26)',
        description: '3000K daylight-spectrum LED bulb that fits into standard home light fixtures.',
        suitability: 'Excellent for dark room corners or north-facing plant nooks.',
      },
      {
        name: 'Clamp-On Gooseneck Plant Light with Timer',
        description: 'Adjustable arm with integrated 8/12 hour cycle for quiet automated daily coverage.',
        suitability: 'Convenient for floating bookshelves and desktop plants.',
      },
    ],
  },
  {
    id: 'fertilizer_nutrients',
    name: 'Fertilizer & Nutrients',
    icon: '🌾',
    shortTagline: 'Gentle organic liquid sustenance',
    description: 'Mild, plant-based nutritional amendments that nourish soil biology without chemical burn.',
    educationalTip: 'Fertilize only when you observe active new leaves or stems. Never fertilize dormant, drought-stressed, or freshly repotted plants.',
    suggestedForSpecies: ['Monstera Deliciosa', 'Epipremnum Aureum', 'Ficus Lyrata'],
    sampleItems: [
      {
        name: 'Cold-Pressed Liquid Seaweed & Kelp',
        description: 'Naturally derived bio-stimulant rich in micro-minerals and root development hormones.',
        suitability: 'Gentle monthly supplement during active spring and summer.',
      },
      {
        name: 'Balanced Organic Bio-Fertilizer (3-1-2)',
        description: 'Plant-derived nitrogen, phosphorus, and potassium ratio tailored for indoor green foliage.',
        suitability: 'Supports healthy leaf size and vibrant chlorophyll pigment.',
      },
    ],
  },
];
