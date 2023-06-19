import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FrontPage from "./components/front_page";
import Game from "./game";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/game" element={<Game />} />
        <Route path="/" element={<FrontPage />} />
      </Routes>
    </Router>
  );
}

export default App;
