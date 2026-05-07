// This file provides a hook to read and update family member records from Supabase.
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function useFamily() {
  const [family, setFamily] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFamily = useCallback(async () => {
    const { data, error } = await supabase.from("family_members").select("*");
    if (!error) {
      setFamily(data || []);
    }
    setLoading(false);
  }, []);

  const addFamilyMember = useCallback(async (member) => {
    const { data, error } = await supabase.from("family_members").insert(member).select().single();
    if (!error && data) {
      setFamily((prev) => [...prev, data]);
    }
    return { data, error };
  }, []);

  useEffect(() => {
    fetchFamily();
  }, [fetchFamily]);

  return { family, loading, fetchFamily, addFamilyMember };
}

export default useFamily;
