import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import RulesPage from "./pages/RulesPage";
import ProcessorPage from "./pages/ProcessorPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/rules" replace />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/processor" element={<ProcessorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;