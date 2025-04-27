import { Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
// import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoutes";

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
const SearchResults = loadComponent(() => import("./pages/SearchResults"));
const FriendsListPage = loadComponent(() => import("./pages/FriendsList"));
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
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="home" /> : <Navigate to="auth" />}
          />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/search"
            element={
              <PrivateRoute>
                <SearchResults />
              </PrivateRoute>
            }
          />
          <Route
            path="/auth"
            element={user ? <Navigate to="../home" /> : <Auth />}
          />
          <Route
            path="/profile/:id"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/message"
            element={
              <PrivateRoute>
                <Messages />
              </PrivateRoute>
            }
          />
          <Route
            path="/bot"
            element={
              <PrivateRoute>
                <Chatbot />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-profile/:id"
            element={
              <PrivateRoute>
                <ProfileEdit />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route
            path="/friends/:id"
            element={
              <PrivateRoute>
                <FriendsListPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
