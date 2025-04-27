
import { useState, useEffect } from 'react';

export function useAnimation(initialState: boolean = false, duration: number = 300) {
  const [isActive, setIsActive] = useState(initialState);
  const [isVisible, setIsVisible] = useState(initialState);
  
  useEffect(() => {
    let timeout: number;
    
    if (isActive) {
      setIsVisible(true);
    } else {
      timeout = window.setTimeout(() => {
        setIsVisible(false);
      }, duration);
    }
    
    return () => clearTimeout(timeout);
  }, [isActive, duration]);
  
  return {
    isActive,
    isVisible,
    activate: () => setIsActive(true),
    deactivate: () => setIsActive(false),
    toggle: () => setIsActive(prev => !prev),
  };
}

export function useDelayedMount(shouldMount: boolean, delayTime: number = 500) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    let mountTimeout: number;
    let unmountTimeout: number;
    
    if (shouldMount && !isMounted) {
      mountTimeout = window.setTimeout(() => {
        setIsMounted(true);
      }, 10); // Small delay for mounting
    } else if (!shouldMount && isMounted) {
      unmountTimeout = window.setTimeout(() => {
        setIsMounted(false);
      }, delayTime);
    }
    
    return () => {
      clearTimeout(mountTimeout);
      clearTimeout(unmountTimeout);
    };
  }, [shouldMount, delayTime, isMounted]);
  
  return isMounted;
}
