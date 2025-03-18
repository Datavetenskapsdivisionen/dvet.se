import "./styles/styles.less";
import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./app-routes";
import { getLanguageCookie } from "./util";
import LanguageSelector from "./components/pages/language-select-page";

const App = () => {
  return (
    <>
      { getLanguageCookie() ? <RouterProvider router={router} /> : <LanguageSelector /> }
    </>
  );
};

export default App;
