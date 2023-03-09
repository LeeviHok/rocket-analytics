import { useState } from 'react';

function useIsVisible(initialState) {
  const [isVisible, setIsVisible] = useState(initialState);

  function show() {
    setIsVisible(true);
  }

  function hide() {
    setIsVisible(false);
  }

  return [
    isVisible,
    show,
    hide,
  ];
}

export default useIsVisible;
