import { ObservationChange, AdaptiveAiMode } from '../types';

export interface AnalyzePlantRequest {
  previousImage: string;
  currentImage: string;
  plantName: string;
  plantSpecies: string;
  humanCategories: string[];
  humanNote?: string;
  aiMode?: AdaptiveAiMode;
}

export interface AnalyzePlantResponse {
  source: 'gemini' | 'fallback';
  changes: ObservationChange[];
  reflectiveSummary: string;
  mode?: AdaptiveAiMode;
}

export async function requestPlantAnalysis(
  payload: AnalyzePlantRequest
): Promise<AnalyzePlantResponse> {
  // If the mode is strictly observe without AI, return an empty analysis immediately
  if (payload.aiMode === 'independent') {
    return {
      source: 'fallback',
      changes: [],
      reflectiveSummary: 'You observed independently without computational intervention.',
      mode: 'independent',
    };
  }

  try {
    const res = await fetch('/api/analyze-plant-observation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const data = await res.json();
    return {
      source: data.source || 'fallback',
      changes: (data.changes || []).map((c: any) => ({
        ...c,
        humanEvaluation: undefined, // Fresh for user evaluation
      })),
      reflectiveSummary: data.reflectiveSummary || 'Subtle light orientation and foliage movement noted.',
      mode: payload.aiMode || 'guided',
    };
  } catch (error) {
    console.warn('AI analysis service fallback:', error);
    return getFallbackAnalysis(payload);
  }
}

function getFallbackAnalysis(payload: AnalyzePlantRequest): AnalyzePlantResponse {
  const fallbackChanges: ObservationChange[] = [
    {
      category: 'orientation_change',
      confidence: 0.86,
      description: 'The upper foliage appears slightly more oriented toward the primary light source.',
      suggestedCue: 'Take another look at the posture of the taller stems relative to the light.',
      approximateLocation: { xPercent: 50, yPercent: 40 },
    },
    {
      category: 'new_growth',
      confidence: 0.92,
      description: 'A delicate fresh tip or uncurling sheath appears visible in the central canopy.',
      suggestedCue: 'Look closely near the center-upper section of the plant.',
      approximateLocation: { xPercent: 55, yPercent: 32 },
    },
  ];

  return {
    source: 'fallback',
    changes: fallbackChanges,
    reflectiveSummary: 'Visible light-seeking movement and healthy structural posture observed.',
    mode: payload.aiMode || 'guided',
  };
}
