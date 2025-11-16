import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ResultPage from "./pages/ResultPage";
function App() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
{/* <Route path="/result" element={<ResultPage />} /> */}

    </>
  );
}

export default App;