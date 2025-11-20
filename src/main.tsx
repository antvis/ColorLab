import { createRoot } from "react-dom/client";
import App from "./App.tsx";
// 手动全局引入 CSS Ant Design v4
import "antd/dist/antd.min.css";

createRoot(document.getElementById("root")!).render(<App />);
