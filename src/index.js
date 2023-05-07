import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { generateJsonLdData } from "./data/json-ld-generator";

import "./index.css";

// Generating the Json LD
const jsonLdData = generateJsonLdData();
const jsonLdScript = document.getElementById("json-ld-data");
jsonLdScript.innerText = JSON.stringify(jsonLdData);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter basename={process.env.REACT_APP_URI}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
