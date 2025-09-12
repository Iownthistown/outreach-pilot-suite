import { useState, useEffect } from "react";
import OnboardingWidget from "./OnboardingWidget";
import OnboardingProgressBar from "./OnboardingProgressBar";

export default function OnboardingManager() {
  const [widgetState, setWidgetState] = useState<'widget' | 'bar' | 'hidden'>('widget');

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('onboarding-widget-state');
    if (savedState === 'bar' || savedState === 'hidden') {
      setWidgetState(savedState as 'bar' | 'hidden');
    }
  }, []);

  // Save state to localStorage
  const saveState = (state: 'widget' | 'bar' | 'hidden') => {
    setWidgetState(state);
    localStorage.setItem('onboarding-widget-state', state);
  };

  const handleDismissWidget = () => {
    saveState('bar');
  };

  const handleExpandFromBar = () => {
    saveState('widget');
  };

  const handleDismissBar = () => {
    saveState('hidden');
  };

  if (widgetState === 'hidden') {
    return null;
  }

  return (
    <>
      {widgetState === 'widget' && (
        <OnboardingWidget onDismiss={handleDismissWidget} />
      )}
      
      {widgetState === 'bar' && (
        <OnboardingProgressBar 
          onExpand={handleExpandFromBar}
          onDismiss={handleDismissBar}
        />
      )}
    </>
  );
}