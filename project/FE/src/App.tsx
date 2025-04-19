import { Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
// import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const loadComponent = (importFunc: any) =>
  React.lazy(() =>
    importFunc().catch((err: any) => {
      console.error("Error loading component:", err);
      return { default: () => <div>Error loading page.</div> };
    })
  );
const Home = loadComponent(() => import("./pages/Home"));
const Auth = loadComponent(() => import("./pages/Auth"));
const ProfilePage = loadComponent(() => import("./pages/ProfilePage"));
const Messages = loadComponent(() => import("./pages/Messages"));
const Chatbot = loadComponent(() => import("./pages/Chatbot"));
const ProfileEdit = loadComponent(() => import("./pages/ProfileEdit"));
const Admin = loadComponent(() => import("./pages/Admin"));
const Settings = loadComponent(() => import("./pages/Settings"));

function App() {
  const user = useSelector((state: any) => state.authReducer.authData);

  // Check dark mode setting and apply it
  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="home" /> : <Navigate to="auth" />}
        />
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="../auth" />}
        />
        <Route
          path="/auth"
          element={user ? <Navigate to="../home" /> : <Auth />}
        />
        <Route
          path="/profile/:id"
          element={user ? <ProfilePage /> : <Navigate to="../auth" />}
        ></Route>
        <Route
          path="/message"
          element={user ? <Messages /> : <Navigate to="../auth" />}
        />
        <Route
          path="/bot"
          element={user ? <Chatbot /> : <Navigate to="../auth" />}
        />
        <Route
          path="/edit-profile/:id"
          element={user ? <ProfileEdit /> : <Navigate to="../auth" />}
        />
        <Route
          path="/settings"
          element={user ? <Settings /> : <Navigate to="../auth" />}
        />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Suspense>
  );
}

export default App;
