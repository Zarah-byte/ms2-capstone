import { supabase } from "./supabaseClient";

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return data.user;
}

export function listenForAuthChanges(callback) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback({ event, session, user: session?.user ?? null });
  });

  return data.subscription;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function logout() {
  return signOut();
}

export async function getOnboardingState(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("onboarding_complete")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error("We could not read your archive profile right now. Please try again.");
  }

  return Boolean(data?.onboarding_complete);
}

export function requireAuth({ user, loading, redirectTo = "/login" }) {
  if (loading) {
    return { status: "loading" };
  }

  if (!user) {
    return { status: "redirect", to: redirectTo };
  }

  return { status: "allowed" };
}

export async function redirectIfLoggedIn({ user, loading }) {
  if (loading) {
    return { status: "loading" };
  }

  if (!user) {
    return { status: "allowed" };
  }

  const onboardingComplete = await getOnboardingState(user.id);

  return {
    status: "redirect",
    to: onboardingComplete ? "/archive" : "/onboarding",
  };
}
