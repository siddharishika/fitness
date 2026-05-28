import React from "react";

import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store.js";
import { Container, ThemeProvider } from "react-bootstrap";
import Navigation from "./Components/Navigation.jsx";
import { AuthProvider } from "./Components/Utils/AuthProvider";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider
    breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
    minBreakpoint="xxs"
    >
      <Provider store={store}>
        <BrowserRouter>
          <AuthProvider>
            {/* <ThemeProvider
              breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
              minBreakpoint="xxs"
            > */}

            <div>
              <Navigation />
            </div>
            <Container className="mt-3">
              <App />
            </Container>
            {/* </ThemeProvider>; */}
          </AuthProvider>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
