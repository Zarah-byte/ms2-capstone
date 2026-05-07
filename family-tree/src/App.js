import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import GuestRoute from "./components/auth/GuestRoute";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/auth/PrivateRoute";
import ArchiveLayout from "./pages/ArchiveLayout";
import ArchiveHome from "./pages/ArchiveHome";
import ArchivePeople from "./pages/ArchivePeople";
import ArchiveStories from "./pages/ArchiveStories";
import ArchiveTree from "./pages/ArchiveTree";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";

const appStyles = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top, rgba(188, 161, 120, 0.18), transparent 30%), #f6f0e5",
  color: "#2f241c",
};

const mainStyles = {
  margin: "0 auto",
  maxWidth: "1120px",
  padding: "0 1.5rem 3rem",
};

function App() {
  return (
    <div style={appStyles}>
      <Navbar />
      <main style={mainStyles}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/archive" element={<ArchiveLayout />}>
              <Route index element={<ArchiveHome />} />
              <Route path="people" element={<ArchivePeople />} />
              <Route path="stories" element={<ArchiveStories />} />
              <Route path="tree" element={<ArchiveTree />} />
            </Route>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
