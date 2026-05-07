import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getOnboardingState } from "../lib/auth";
import { supabase } from "../lib/supabaseClient";

const inputStyles = {
  background: "#fffaf1",
  border: "1px solid rgba(79, 56, 36, 0.14)",
  borderRadius: "14px",
  padding: "0.95rem 1rem",
};

function getReadableAuthError(error) {
  if (!error) {
    return "Something went wrong. Please try again.";
  }

  if (error.message?.toLowerCase().includes("invalid login credentials")) {
    return "That email and password combination was not recognized.";
  }

  if (error.message?.toLowerCase().includes("email not confirmed")) {
    return "Your email address still needs to be confirmed before you can enter the archive.";
  }

  return error.message;
}

function Login() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [authAction, setAuthAction] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    setRedirecting(true);
  }, [loading, user]);

  const handleSignUp = async (event) => {
    event.preventDefault();
    setAuthAction("signup");
    setRedirecting(false);
    setError("");
    setMessage("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(getReadableAuthError(signUpError));
      setAuthAction("");
      return;
    }

    setAuthAction("");

    if (data.user) {
      navigate("/onboarding", { replace: true });
      return;
    }

    setMessage("Your account was created. Check your email to confirm your address, then continue to onboarding.");
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    setAuthAction("signin");
    setRedirecting(false);
    setError("");
    setMessage("");

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(getReadableAuthError(signInError));
      setAuthAction("");
      return;
    }

    try {
      setRedirecting(true);
      const onboardingComplete = await getOnboardingState(data.user.id);
      navigate(onboardingComplete ? "/archive" : "/onboarding", { replace: true });
    } catch (profileError) {
      setError(profileError.message);
      setRedirecting(false);
      setAuthAction("");
      return;
    }

    setAuthAction("");
  };

  const initialLoading = loading || redirecting;
  const signingIn = authAction === "signin";
  const signingUp = authAction === "signup";
  const disableActions = initialLoading || signingIn || signingUp;

  return (
    <section
      style={{
        display: "grid",
        gap: "1.5rem",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        padding: "1rem 0 3rem",
      }}
    >
      <div
        style={{
          background: "linear-gradient(180deg, rgba(255, 250, 243, 0.95), rgba(240, 228, 208, 0.95))",
          border: "1px solid rgba(79, 56, 36, 0.08)",
          borderRadius: "24px",
          padding: "2rem",
        }}
      >
        <p style={{ letterSpacing: "0.12em", textTransform: "uppercase" }}>Archive Access</p>
        <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 3.6rem)", lineHeight: 0.98 }}>
          Enter a room kept for memory.
        </h1>
        <p style={{ color: "#6d5745" }}>
          Sign in to continue shaping your family archive, or create a private space for names,
          stories, photographs, and lineage.
        </p>
        {initialLoading ? (
          <p style={{ color: "#6d5745", marginBottom: 0 }}>
            {loading ? "Checking for an existing session..." : "Opening the right room for you..."}
          </p>
        ) : null}
      </div>

      <form
        onSubmit={handleSignIn}
        style={{
          background: "rgba(255, 252, 246, 0.92)",
          border: "1px solid rgba(79, 56, 36, 0.1)",
          borderRadius: "24px",
          display: "grid",
          gap: "1rem",
          padding: "2rem",
        }}
      >
        <input
          aria-label="Email"
          autoComplete="email"
          disabled={disableActions}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          style={inputStyles}
          type="email"
          value={email}
        />
        <input
          aria-label="Password"
          autoComplete="current-password"
          disabled={disableActions}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          style={inputStyles}
          type="password"
          value={password}
        />
        {error ? <p style={{ color: "#9b2c2c", margin: 0 }}>{error}</p> : null}
        {message ? <p style={{ color: "#355b3d", margin: 0 }}>{message}</p> : null}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <button
            disabled={disableActions}
            style={{
              background: disableActions ? "#8f7c6d" : "#2f241c",
              border: "none",
              borderRadius: "999px",
              color: "#f8f2e8",
              cursor: disableActions ? "wait" : "pointer",
              padding: "0.85rem 1.25rem",
            }}
            type="submit"
          >
            {signingIn ? "Entering..." : "Enter"}
          </button>
          <button
            disabled={disableActions}
            onClick={handleSignUp}
            style={{
              background: "transparent",
              border: "1px solid rgba(79, 56, 36, 0.2)",
              borderRadius: "999px",
              color: "#2f241c",
              cursor: disableActions ? "wait" : "pointer",
              padding: "0.85rem 1.25rem",
            }}
            type="button"
          >
            {signingUp ? "Creating..." : "Create Archive"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default Login;
