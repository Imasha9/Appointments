import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppContent from "./components/AppContent";
import { AuthProvider } from "./components/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
