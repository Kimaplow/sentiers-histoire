import "bootswatch/dist/journal/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserContext } from "./components/utils/Context";
import { useState, useEffect } from "react";
import axios from "axios";

import Header from "./components/Header";

import Register from './components/Register';
import Login from './components/Login';
import Account from "./components/Account";

import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

import Home from "./components/Home";
import Shop from "./components/Shop";
import Sub from "./components/Sub";
//import Articles from "./components/Articles";
import News from "./components/News";
import Search from "./components/Search";

import Magazine from "./components/Magazine";

import Footer from "./components/Footer";
import LegalNotice from "./components/footer/LegalNotice";
import About from "./components/footer/About";
import Faq from "./components/footer/Faq";
import Contact from "./components/footer/Contact";

import AddEditMagazines from "./components/admin/AddEditMagazines";
import AddEditArticles from "./components/admin/AddEditArticles";
import AddEditNews from "./components/admin/AddEditNews";

const App = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const server = process.env.REACT_APP_BASE_URL_API;
    const fetchToken = async () => {
      await axios({
        method: "get",
        url: server + 'users/jwt',
        withCredentials: true,
      })
        .then((res) => {
          setUserId(res.data);
        })
        .catch((err) => null);
    };
    fetchToken();

  }, [userId]);

  return (
    <div className="App">
      <UserContext.Provider value={userId}>
        <Router>
          <Header />
          <Routes>

            <Route exact path="/" element={<Home />} />
            <Route exact path="/shop" element={<Shop />} />
            <Route exact path="/sub" element={<Sub />} />
            {/*<Route exact path="/articles" element={<Articles />} />*/}
            <Route exact path="/news" element={<News />} />

            <Route exact path="/search/:word" element={<Search />} />
            <Route exact path="/tag/:word" element={<Search />} />

            <Route exact path="/register" element={<Register />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/account" element={<Account />} />

            <Route exact path="/forgot-password" element={<ForgotPassword />} />
            <Route exact path="/reset-password/:id/:token" element={<ResetPassword />} />

            <Route exact path="/magazines/:id" element={<Magazine />} />
            <Route exact path="/magazines/add" element={<AddEditMagazines />} />
            <Route exact path="/magazines/edit/:id" element={<AddEditMagazines />} />

            <Route exact path="/articles/add" element={<AddEditArticles />} />
            <Route exact path="/articles/edit/:id" element={<AddEditArticles />} />

            <Route exact path="/news/add" element={<AddEditNews />} />
            <Route exact path="/news/edit/:id" element={<AddEditNews />} />

            <Route exact path="/legal" element={<LegalNotice />} />
            <Route exact path="/about" element={<About />} />
            <Route exact path="/faq" element={<Faq />} />
            <Route exact path="/contact" element={<Contact />} />

          </Routes>
          <Footer />
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;