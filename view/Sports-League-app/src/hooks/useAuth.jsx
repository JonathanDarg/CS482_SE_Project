import { useEffect, useState } from 'react';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetch('/api/auth/session', { credentials: 'include' });
        if (!mounted) return;
        if (!res.ok) {
          // fallback to localStorage
          const ls = localStorage.getItem('user');
          if (ls) {
            const parsed = JSON.parse(ls);
            setUser(parsed);
            setIsLoggedIn(true);
            setIsAdmin(parsed.role === 'admin' || parsed.isAdmin === true);
          }
          return;
        }

        const data = await res.json();
        const u = data?.user || (data?.loggedIn ? data : null);
        if (!mounted) return;
        if (u) {
          setUser(u);
          setIsLoggedIn(true);
          setIsAdmin(u.role === 'admin' || u.isAdmin === true);
          // persist a minimal user for quick fallback
          try { localStorage.setItem('user', JSON.stringify({ name: u.name, role: u.role, isAdmin: u.isAdmin })); } catch (e) {}
        } else {
          setUser(null);
          setIsLoggedIn(false);
          setIsAdmin(false);
        }
      } catch (err) {
        const ls = localStorage.getItem('user');
        if (!mounted) return;
        if (ls) {
          const parsed = JSON.parse(ls);
          setUser(parsed);
          setIsLoggedIn(true);
          setIsAdmin(parsed.role === 'admin' || parsed.isAdmin === true);
        }
      }
    })();

    return () => { mounted = false; };
  }, []);

  return { user, isLoggedIn, isAdmin };
}
