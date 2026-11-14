import React from 'react';
import { ProductDemoOnboarding } from './ProductDemoOnboarding';

interface OnboardingModalProps {
  isOpen: boolean;
  userName: string;
  onComplete: () => void;
  onAddFirstPlant: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = (props) => {
  return <ProductDemoOnboarding {...props} />;
};
