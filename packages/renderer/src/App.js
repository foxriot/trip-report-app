import React, { useEffect, useState } from "react";
import Home from "./pages/Home";
import { HashRouter, Route, Routes } from "react-router-dom";
import Spinner from "./components/Spinner";

export const AppContext = React.createContext({ log: [] });
let prefs = await window.databaseAPI.preferencesGet();

function App() {
  const [log, setLog] = useState([`${Date.now()} - Reset`]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [currentPrefs, setCurrentPrefs] = useState(prefs);
  const [percentComplete, setPercentComplete] = useState("0%");

  useEffect(() => {
    window.electronAPI.onProgressUpdate((_event, value) => {
      const percentage = Math.floor((1 - value) * 100 * 0.75);
      setPercentComplete(`${percentage}%`);
      setShowSpinner(value > 0 && value < 1 ? true : false);
    });
  }, []);
  useEffect(() => {
    window.electronAPI.onLogEvent((_event, value) => {
      setLog((log) => {
        if (!log) log = [`${Date.now()}`];
        const newLog = [...log];
        newLog.unshift(value);
        return newLog;
      });
    });
  }, [log]);

  return (
    <AppContext.Provider
      value={{
        log,
        prefs: currentPrefs,
        setPref: (pref, val) => {
          window.databaseAPI.preferencesSet({ ...currentPrefs, [pref]: val });
          setCurrentPrefs({ ...currentPrefs, [pref]: val });
        },
        setPrefs: (vals) => {
          window.databaseAPI.preferencesSet(vals);
          setCurrentPrefs(vals);
        }
      }}
    >
      <HashRouter>
        {showSpinner && <Spinner percentComplete={percentComplete} />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="instance/:id" element={<Home />} />
        </Routes>
      </HashRouter>
    </AppContext.Provider>
  );
}

export default App;
