import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";

import App from "./app";

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);

