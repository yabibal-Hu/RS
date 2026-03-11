import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("/service-worker.js")
//     .then(() => console.log("✅ Service Worker registered"))
//     .catch((err) => console.log("❌ Service Worker registration failed:", err));
// }

createRoot(document.getElementById("root")!).render(
  <div className="patternBg h-fit pt-1">
    <App />
  </div>
);


