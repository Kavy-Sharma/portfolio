export function navigateWithReveal(navigate, to, event) {
  const x = event && event.clientX !== undefined ? event.clientX : (typeof window !== 'undefined' ? window.innerWidth / 2 : 500);
  const y = event && event.clientY !== undefined ? event.clientY : (typeof window !== 'undefined' ? window.innerHeight / 2 : 300);

  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--x', `${x}px`);
    document.documentElement.style.setProperty('--y', `${y}px`);
  }

  if (typeof document !== 'undefined' && document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.startViewTransition(() => {
      navigate(to);
    });
  } else {
    navigate(to);
  }
}
