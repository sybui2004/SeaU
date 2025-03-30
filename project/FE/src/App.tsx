import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
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
function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/home" element={<Home />} />
          <Route path="/:username/profile" element={<ProfilePage />} />
          <Route path="/message" element={<Messages />} />
          <Route path="/bot" element={<Chatbot />} />
          <Route path="/:username/edit-profile" element={<ProfileEdit />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
