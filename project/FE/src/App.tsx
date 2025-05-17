import { Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import "react-loading-skeleton/dist/skeleton.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";

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
const AdminLogin = loadComponent(() => import("./pages/AdminLogin"));

function App() {
  const { authData } = useSelector((state: any) => state.authReducer);

  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <div className="App">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
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
            element={
              authData ? <Navigate to="/home" /> : <Navigate to="/auth" />
            }
          />
          <Route
            path="/auth"
            element={authData ? <Navigate to="/home" /> : <Auth />}
          />
          <Route
            path="admin/login"
            element={
              authData && authData.user?.isAdmin ? (
                <Navigate to="/admin" />
              ) : (
                <AdminLogin />
              )
            }
          />

          <Route
            path="/home/*"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="admin/*"
            element={
              <ProtectedRoute adminOnly={true}>
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/message"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bot"
            element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile/:id"
            element={
              <ProtectedRoute>
                <ProfileEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/friends/:id"
            element={
              <ProtectedRoute>
                <FriendsListPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
