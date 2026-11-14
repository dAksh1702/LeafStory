import React from 'react';
import { Plant, ObservationRecord, ActiveView } from '../types';
import { Plus, ChevronRight, ArrowRight, Sprout, Calendar } from 'lucide-react';

interface MyGardenScreenProps {
  plants: Plant[];
  observations: ObservationRecord[];
  onSelectPlant: (plantId: string) => void;
  onOpenNewPlantModal: () => void;
  setActiveView: (view: ActiveView) => void;
}

export const MyGardenScreen: React.FC<MyGardenScreenProps> = ({
  plants,
  observations,
  onSelectPlant,
  onOpenNewPlantModal,
  setActiveView,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-[#E7E2D7]">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
            Living Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#16281D] font-normal tracking-tight mt-1">
            My Garden
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-[#4E6153] mt-1.5 font-light">
            “Each plant is an invitation to observe slow life unfolding.”
          </p>
        </div>

        <button
          onClick={onOpenNewPlantModal}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#16281D] text-[#FAF8F5] hover:bg-[#233F2E] font-sans text-xs font-semibold cursor-pointer transition-all shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Plant</span>
        </button>
      </div>

      {/* Grid of Plant Cards Emphasizing Photography */}
      {plants.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-[#DDD7CC] rounded-3xl bg-[#FAF8F5]">
          <Sprout className="w-10 h-10 text-[#76877A] mx-auto mb-3" />
          <h3 className="font-serif text-2xl text-[#16281D]">Every story starts with one observation.</h3>
          <p className="text-xs text-[#76877A] font-sans mt-1 max-w-sm mx-auto">
            Bring a companion plant into your digital sanctuary and begin noticing subtle changes.
          </p>
          <button
            onClick={onOpenNewPlantModal}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#16281D] text-[#FAF8F5] text-xs font-sans font-medium cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add your first plant</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plants.map((plant) => {
            const plantObs = observations.filter((o) => o.plantId === plant.id);
            const latestObs = plantObs[plantObs.length - 1];

            return (
              <div
                key={plant.id}
                onClick={() => {
                  onSelectPlant(plant.id);
                  setActiveView('plant_profile');
                }}
                className="group cursor-pointer rounded-3xl overflow-hidden border border-[#E7E2D7] bg-[#FAF8F5] hover:border-[#16281D]/40 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Dominant Photography */}
                  <div className="relative aspect-[4/3] bg-[#EAE5DC] overflow-hidden">
                    <img
                      src={plant.coverImage}
                      alt={plant.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-3 left-3 bg-[#16281D]/80 backdrop-blur-xs text-[#FAF8F5] text-[11px] font-sans px-2.5 py-1 rounded-md">
                      {plant.daysTogether} days together
                    </div>
                  </div>

                  {/* Specimen Details */}
                  <div className="p-6">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#76877A] font-sans mb-1">
                      <span>{plant.species}</span>
                      <span>{plantObs.length} observations</span>
                    </div>

                    <h3 className="font-serif text-2xl text-[#16281D] font-normal group-hover:text-[#284934] transition-colors">
                      {plant.name}
                    </h3>

                    {latestObs && (
                      <p className="font-serif italic text-xs text-[#566B5C] mt-2 line-clamp-2 leading-relaxed">
                        “{latestObs.humanNote || 'Observation recorded.'}”
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-xs font-sans text-[#76877A] mt-4 pt-3 border-t border-[#E7E2D7]">
                      <Calendar className="w-3.5 h-3.5 text-[#566B5C]" />
                      <span>Last observed: {plant.latestObservationDate}</span>
                    </div>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="px-6 pb-6 pt-2">
                  <div className="flex items-center justify-between w-full p-3 rounded-xl bg-[#EDE8DE] group-hover:bg-[#E3DDCF] text-xs font-sans font-medium text-[#16281D] transition-colors">
                    <span>Continue Story</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
