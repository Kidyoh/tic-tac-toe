import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FrontPage from "./components/front_page";
import Game from "./game";
// import HomePage from "./components/homepage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/game" element={<Game />} />
        <Route path="/frontpage" element={<FrontPage />} />
        <Route path="/" element={<FrontPage />} />
      </Routes>
    </Router>
  );
}

export default App;
