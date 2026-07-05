import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Requests from "./pages/Requests";
import Resources from "./pages/Resources";
import SubmitRequest from "./pages/SubmitRequest";
import MapView from "./pages/MapView";
import History from "./pages/History";
import Footer from "./components/Footer";

function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <div className="container mt-4">

        <Routes>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/submit"
            element={<SubmitRequest />}
          />

          <Route
            path="/requests"
            element={<Requests />}
          />

          <Route
            path="/resources"
            element={<Resources />}
          />

          <Route
            path="/map"
            element={<MapView />}
          />

          <Route
            path="/history"
            element={<History />}
          />

        </Routes>

      </div>

    </BrowserRouter>
    

  );
  <BrowserRouter>

  <Navbar />

  <div className="container mt-4">

    <Routes>

      ...

    </Routes>

  </div>

  <Footer />

</BrowserRouter>

}

export default App;