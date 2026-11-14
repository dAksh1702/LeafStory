import React, { useState } from 'react';
import { Plant } from '../types';
import { X, Upload } from 'lucide-react';
import { SAMPLE_CAPTURE_PHOTOS } from '../data/demoData';

interface NewPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePlant: (newPlant: Plant) => void;
}

export const NewPlantModal: React.FC<NewPlantModalProps> = ({ isOpen, onClose, onSavePlant }) => {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [locationNotes, setLocationNotes] = useState('');
  const [coverImage, setCoverImage] = useState(SAMPLE_CAPTURE_PHOTOS[0].url);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPlant: Plant = {
      id: `plant_${Date.now()}`,
      name: name.trim(),
      species: species.trim() || 'Houseplant Specimen',
      daysTogether: 1,
      coverImage,
      firstObservationDate: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      latestObservationDate: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      locationNotes: locationNotes.trim() || 'Living area window',
    };

    onSavePlant(newPlant);
    onClose();
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) setCoverImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF8F5] border border-[#E7E2D7] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#76877A] hover:text-[#16281D] p-1.5 rounded-lg cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
            New Companion
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#16281D] font-normal tracking-tight mt-0.5">
            Add a Plant Profile
          </h2>
          <p className="font-serif italic text-xs text-[#566B5C] mt-1">
            Begin recording your quiet observations with this specimen.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#76877A] font-sans font-medium mb-1.5">
              Plant Nickname *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fernie, Luna, or Milo"
              className="w-full px-4 py-2.5 rounded-xl border border-[#DDD7CC] bg-white text-sm font-sans text-[#16281D] focus:border-[#16281D] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#76877A] font-sans font-medium mb-1.5">
              Botanical Species
            </label>
            <input
              type="text"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              placeholder="e.g. Monstera Deliciosa, Ficus Lyrata"
              className="w-full px-4 py-2.5 rounded-xl border border-[#DDD7CC] bg-white text-sm font-sans text-[#16281D] focus:border-[#16281D] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#76877A] font-sans font-medium mb-1.5">
              Environment & Location
            </label>
            <input
              type="text"
              value={locationNotes}
              onChange={(e) => setLocationNotes(e.target.value)}
              placeholder="e.g. East windowsill, gentle morning sunlight"
              className="w-full px-4 py-2.5 rounded-xl border border-[#DDD7CC] bg-white text-sm font-sans text-[#16281D] focus:border-[#16281D] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#76877A] font-sans font-medium mb-2">
              Initial Reference Photo
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#EAE5DC] border border-[#DDD7CC] shrink-0">
                <img
                  src={coverImage}
                  alt="Plant preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-2">
                <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#DDD7CC] hover:border-[#16281D] text-xs font-sans text-[#16281D] rounded-xl cursor-pointer transition-all">
                  <Upload className="w-3.5 h-3.5 text-[#203D2A]" />
                  <span>Upload custom photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFile}
                    className="hidden"
                  />
                </label>
                <div className="text-[11px] text-[#76877A] font-sans">
                  Or use default sample reference
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E7E2D7]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-sans text-[#76877A] hover:text-[#16281D] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-2.5 rounded-xl bg-[#16281D] text-white hover:bg-[#233F2E] font-sans text-xs font-semibold cursor-pointer transition-all shadow-xs disabled:opacity-50"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
