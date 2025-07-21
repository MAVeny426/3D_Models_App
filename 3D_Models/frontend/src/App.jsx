import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login.jsx";
import Signup from "./Pages/Signup.jsx";
// import ExploreModel from "./Pages/ExploreModel.jsx";
import ModelDetails from "./Pages/ModelDetails.jsx";
import Footer from "./Components/Footer.jsx";
import Collections from "./Components/Collections.jsx";
import Upload from "./Pages/Upload.jsx";
import Albums from "./Pages/Albums.jsx";
import Upload3DView from "./Pages/Upload3DView.jsx";
import ContactUs from "./Pages/ContactUs.jsx";
import AboutUs from "./Pages/AboutUs.jsx";
import Profile from "./Pages/Profile.jsx";

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Router>
        <Routes>
        
        <Route path='/' element={<Home />} />
        <Route path='/Signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          {/* <Route path='/explore-models' element={<ExploreModel />} /> */}
          <Route path='/model/:modelId' element={<ModelDetails />} />
          <Route path='/Footer' element={<Footer/>} /> 
          <Route path="/collections" element={<Collections />} />
          <Route path="/Upload" element={<Upload />} />
          <Route path="/Albums" element={<Albums />} />
          <Route path="/Upload3DView/:id" element={<Upload3DView />} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
