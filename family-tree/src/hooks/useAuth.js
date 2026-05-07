import { useEffect, useState } from "react";
import { getCurrentSession, listenForAuthChanges } from "../lib/auth";

function useAuth() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getCurrentSession()
      .then((nextSession) => {
        if (isMounted) {
          setSession(nextSession);
          setUser(nextSession?.user ?? null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      });

    const subscription = listenForAuthChanges(({ session: nextSession, user: nextUser }) => {
      if (isMounted) {
        setSession(nextSession);
        setUser(nextUser);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, user, loading };
}

export default useAuth;
