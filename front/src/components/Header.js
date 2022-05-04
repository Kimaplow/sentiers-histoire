import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import "./css/header.css";
import { UserContext } from './utils/Context';
import cookie from "js-cookie";
import axios from "axios";

export default function Header() {

    const server = process.env.REACT_APP_BASE_URL_API;

    const url = window.location.pathname;
    const navigate = useNavigate();
    const user = useContext(UserContext);

    const className = "nav-item nav-link text-white";

    const handleChange = (e) => {
        let str = e.target.value;
        let l = str.length - 1;
        if (str[l] === " ") {
            let input = document.getElementById("search");
            input.value = str.substring(0, l);
        }
    }

    const search = () => {
        let search = document.getElementById("search");
        let value = search.value;
        if (value !== "") {
            navigate(`/search/${value}`);
            search.value = "";
        }
    }

    const removeCookie = (key) => {
        if (window !== "undefined") {
            cookie.remove(key, { expires: 1 });
        }
    }

    const logout = async () => {
        await axios({
            method: "get",
            url: server + 'users/logout',
            withCredentials: true,
        })
            .then(() => removeCookie("jwt"))
            .catch((err) => null);

        window.location = "/";
    }

    return (
        <div id='header'>

            <nav className="navbar navbar-expand-xl navbar-dark p-0">
                <div className="d-flex w-75 container-fluid">

                    <a href="/" className="navbar-brand me-5"><img height="80" src="/Logolsdh.jpg" alt='logo' /></a>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarColor01">
                        <form className="d-flex">
                            <input className="form-control" type="text" placeholder="Rechercher" id="search" onChange={handleChange} />
                            <button type="button" className="btn btn-secondary my-2 my-sm-0" onClick={() => search()}><i className="bi bi-search"></i></button>
                        </form>
                        <ul className="navbar-nav me-auto menu-central">
                            <li className="nav-item">
                                <a href="/news" className={url === "/news" ? className + " h" : className + ""}>Actualités</a>
                            </li>
                            <li className="nav-item">
                                <a href="/sub" className={url === "/sub" ? className + " h" : className + ""}>Abonnement</a>
                            </li>
                            <li className="nav-item">
                                <a href="/shop" className={url === "/shop" ? className + " h" : className + ""}>Boutique</a>
                            </li>
                            {/*}
                            <li className="nav-item">
                                <a href="/articles" className={url === "/articles" ? className + " h" : className}>Articles</a>
                            </li>
                            */}
                        </ul>
                        <div className='d-flex navbar-nav'>
                            {user ?
                                <div className='d-flex navbar-nav'>
                                    <li className="nav-item">
                                        <a href="/account" className={url === "/account" ? className + " h" : className}>Compte</a>
                                    </li>
                                    <li className="nav-item">
                                        <button type="button" className={className + ' btn'} onClick={logout}>Déconnexion</button>
                                    </li>
                                </div>
                                : <div className='d-flex navbar-nav'>
                                    <li className="nav-item">
                                        <a href="/register" className={url === "/register" ? className + " h" : className}>Inscription</a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="/login" className={url === "/login" ? className + " h" : className}>Connexion</a>
                                    </li>
                                </div>
                            }
                        </div>

                    </div>
                </div>
            </nav>

        </div >
    );
}