// src/App.tsx
import React from 'react';
import ThemeDiv from './themeComponent/themeView';
import './App.scss';
import Header from './components/Header/Header';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import routes from './router';
import IndexLayout from './layout';
const App: React.FC = () => {
  return (
    <Router   future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}
  >
     <IndexLayout></IndexLayout>
     </Router>
  );
};

export default App;
