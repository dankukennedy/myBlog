import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store"; // Adjust path to your store
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* The Provider MUST be the parent of App */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
