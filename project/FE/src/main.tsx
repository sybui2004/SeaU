import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.tsx";
import store from "./store/ReduxStore.ts";
import { Provider } from "react-redux";
import { HashRouter, Route, Routes } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <HashRouter>
      <StrictMode>
        <Routes>
          <Route path="*" element={<App />} />
        </Routes>
      </StrictMode>
    </HashRouter>
  </Provider>
);
