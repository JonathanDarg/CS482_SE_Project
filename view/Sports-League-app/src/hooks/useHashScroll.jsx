import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Reusable hook that smooth-scrolls to the element matching the URL hash,
// subtracting the sticky navbar height so headings are not hidden.
export default function useHashScroll(opts = { retryCount: 20, retryDelay: 100 }) {
  const location = useLocation();

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const id = hash.slice(1);

      const attemptScroll = () => {
        const el = document.getElementById(id);
        if (!el) return false;
        const nav = document.querySelector('nav');
        const navHeight = nav ? nav.offsetHeight : 0;
        const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 8;
        window.scrollTo({ top, behavior: 'smooth' });
        return true;
      };

      if (attemptScroll()) return;

      let tries = 0;
      const interval = setInterval(() => {
        tries += 1;
        if (attemptScroll() || tries >= (opts.retryCount || 20)) {
          clearInterval(interval);
        }
      }, opts.retryDelay || 100);
    };

    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  
  }, [location, opts.retryCount, opts.retryDelay]);
}
