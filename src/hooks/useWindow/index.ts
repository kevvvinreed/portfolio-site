import { useEffect, useState } from 'react';
const useWindow = () => {
  const [windowCtx, setWindowCtx] = useState({ width: 0, height: 0, y: 0 });

  useEffect(() => {
    setWindowCtx({
      width: window.innerWidth,
      height: window.innerHeight,
      y: window.scrollY,
    });
  }, []);

  useEffect(() => {
    const update = () => {
      setWindowCtx({
        width: window.innerWidth,
        height: window.innerHeight,
        y: window.scrollY,
      });
    };
    window.addEventListener('resize', () => update());
    window.addEventListener('scroll', () => update());
    return () => {
      window.removeEventListener('resize', () => update());
      window.removeEventListener('scroll', () => update());
    };
  }, []);

  return {
    windowWidth: windowCtx.width,
    windowHeight: windowCtx.height,
    windowY: windowCtx.y,
  };
};

export default useWindow;
