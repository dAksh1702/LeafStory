import React, { useState } from 'react';
import { ArrowRight, Sparkles, Check } from 'lucide-react';

interface LightweightReflectionStepProps {
  onComplete: (question: string, answer: string) => void;
}

export const LightweightReflectionStep: React.FC<LightweightReflectionStepProps> = ({
  onComplete,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [customNote, setCustomNote] = useState<string>('');

  const question = 'Did looking with LeafStory change what you noticed today?';
  const options = [
    'Yes, I noticed a subtle detail I might have missed.',
    'A little—it reminded me to look closer at stem posture.',
    'Not really—my own eyes had already captured it all.',
  ];

  const handleFinish = () => {
    const finalAnswer = selectedAnswer
      ? customNote.trim()
        ? `${selectedAnswer} (${customNote.trim()})`
        : selectedAnswer
      : 'Mindfully observed and saved.';
    onComplete(question, finalAnswer);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 sm:py-20 text-center animate-fade-in">
      <div className="w-12 h-12 rounded-full bg-[#EFECE5] text-[#16281D] flex items-center justify-center mx-auto mb-4">
        <Sparkles className="w-5 h-5" />
      </div>

      <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
        Mindful Reflection
      </span>
      <h2 className="font-serif text-2xl sm:text-3xl text-[#16281D] font-normal tracking-tight mt-1">
        {question}
      </h2>
      <p className="font-serif italic text-xs sm:text-sm text-[#4E6153] mt-2 font-light">
        “A quiet pause before saving this observation into your plant’s living archive.”
      </p>

      {/* 3 Lightweight Choices */}
      <div className="mt-8 space-y-3 text-left">
        {options.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelectedAnswer(opt)}
            className={`w-full p-4 rounded-2xl border text-xs sm:text-sm font-sans transition-all cursor-pointer flex items-center justify-between ${
              selectedAnswer === opt
                ? 'border-[#16281D] bg-[#EDE8DE] font-semibold text-[#16281D] shadow-xs'
                : 'border-[#DDD7CC] bg-white text-[#4A5E50] hover:border-[#16281D]/40'
            }`}
          >
            <span>{opt}</span>
            {selectedAnswer === opt && <Check className="w-4 h-4 text-[#16281D] shrink-0" />}
          </button>
        ))}
      </div>

      {selectedAnswer && (
        <div className="mt-4 text-left">
          <input
            type="text"
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder="Optional thought: What made you look differently today?"
            className="w-full p-3 rounded-xl border border-[#DDD7CC] bg-white text-xs font-sans text-[#16281D] focus:border-[#16281D] outline-none"
          />
        </div>
      )}

      {/* Save Action */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleFinish}
          disabled={!selectedAnswer}
          className={`flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs sm:text-sm font-sans font-medium transition-all shadow-xs ${
            selectedAnswer
              ? 'bg-[#16281D] text-[#FAF8F5] hover:bg-[#233F2E] cursor-pointer active:scale-98'
              : 'bg-[#D6CFC3] text-[#867E72] cursor-not-allowed'
          }`}
        >
          <span>Save to Growth Story</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
