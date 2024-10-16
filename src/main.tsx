import React from "react";
import ReactDOM from "react-dom/client";
import Timer from "./Timer";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <div className="bg-red-400">
      <Timer />
    </div>
  </React.StrictMode>,
);
