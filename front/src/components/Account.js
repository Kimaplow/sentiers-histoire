import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Alert from './utils/Alert';
import NotConnected from './utils/NotConnected';
import { UserContext } from './utils/Context';
import cookie from "js-cookie";

export default function Account() {

    const server = process.env.REACT_APP_BASE_URL_API;

    const [alert, setAlert] = useState(null);
    const [alertEmail, setAlertEmail] = useState(null);
    const [alertMdp, setAlertMdp] = useState(null);
    const user = useContext(UserContext);
    //const [sub, setSub] = useState({});

    /*
    const getSub = async () => {
        await axios({
            method: "get",
            url: server + "subs",
            withCredentials: true,
        })
            .then(res => {
                setSub(res.data)
            })
    }
    */

    const changeName = async (e) => {
        e.preventDefault();
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;

        if (firstName !== "" || lastName !== "") {
            const data = {};
            if (firstName !== "") data["firstName"] = firstName
            if (lastName !== "") data["lastName"] = lastName
            await axios.patch(server + "users/" + user._id, data, { withCredentials: true })
                .then(res => {
                    setAlert(res.data)
                })
        }
    }

    const changeEmail = async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;

        if (email !== "") {
            const data = {
                email: email
            }
            await axios.patch(server + "users/" + user._id, data, { withCredentials: true })
                .then(res => {
                    setAlertEmail(res.data)
                })
        }
    }

    const ChangeMdp = async (e) => {
        e.preventDefault();
        const mdp = document.getElementById('mdp').value;
        const mdpConfirm = document.getElementById('mdpConfirm').value;

        if ((mdp !== mdpConfirm) || mdp === "") {
            setAlertMdp({ error: "Mdp non identiques" })
        }
        else {
            const data = {
                password: mdp
            }
            await axios.patch(server + "users/" + user._id, data, { withCredentials: true })
                .then(res => {
                    setAlertMdp(res.data)
                })
        }
    }

    const removeCookie = (key) => {
        if (window !== "undefined") {
            cookie.remove(key, { expires: 1 });
        }
    }

    const handleDeleteAccount = async (e) => {
        e.preventDefault();

        const u = user;
        await axios({ method: "get", url: server + 'users/logout', withCredentials: true })
            .then(() => removeCookie("jwt"))
            .catch((err) => null)

        await axios.delete(server + "users/" + u._id)
            .then(res => {
                console.log(res.data);
                setAlert(res.data);
            })

        setTimeout(() => {
            window.location = "/";
        }, 3000)
    }

    useEffect(() => {
        if (user && user.isSub) {
            //getSub();
        }
    }, [user])

    if (user) {
        return (

            <div id="profile" className='d-flex flex-column'>

                <h1 className="text-center fw-bold mt-2">Bonjour {user.firstName}</h1>

                {/* 

                {user.isAdmin ? <p className='text-center mt-4'>Vous êtes abonné(e) à vie :)</p>
                    : user.isSub ?
                        <div>
                            <p className='text-center mt-4'>Votre abonnement a débuté le : {sub.startDate ? sub.startDate.substring(0, 10) : null}</p>
                            <p className='text-center'>Votre abonnement prendra fin le : {sub.endDate ? sub.endDate.substring(0, 10) : null}</p>
                        </div>
                        : <div className='d-flex flex-column justify-content-center mt-3'>
                            <h4 className='text-center'>Vous n'êtes pas abonné(e) :(</h4>
                            <a href="/sub" className='text-center'>S'abonner</a>
                        </div>
                }

                <hr className='w-25 m-auto mt-3' />
                <hr className='w-25 m-auto' />
                <hr className='w-25 m-auto' />

                */}

                <div className='d-flex flex-column'>

                    <div className="form-group div-btn-form m-auto">

                        {alert ? <Alert alert={alert} /> : null}
                        {alert && (alert.success !== undefined && alert.success !== "Compte supprimé !") ?
                            setTimeout(() => {
                                window.location.reload(false);
                            }, 2000)
                            : null
                        }

                        <label className="mt-2 fw-bold" htmlFor="firstName">Changer votre prénom</label>
                        <input type="text" className="form-control" id="firstName" placeholder={user.firstName} />

                        <label className="mt-3 fw-bold" htmlFor="lastName">Changer votre nom</label>
                        <input type="text" className="form-control" id="lastName" placeholder={user.lastName} />

                    </div>

                    <div className="d-flex mt-3">
                        <button type="submit" className="btn btn-primary m-auto" onClick={(e) => changeName(e)}>Confirmer les changements</button>
                    </div>

                </div>

                <hr className='w-25 m-auto mt-3' />
                <hr className='w-25 m-auto' />
                <hr className='w-25 m-auto' />

                <div>

                    <div className="form-group div-btn-form m-auto">

                        {alertEmail ? <Alert alert={alertEmail} /> : null}
                        {alertEmail && alertEmail.success !== undefined ?
                            setTimeout(() => {
                                window.location.reload(false);
                            }, 2000)
                            : null
                        }

                        <label className="mt-3 fw-bold" htmlFor="email">Changer votre email</label>
                        <input type="email" className="form-control" id="email" placeholder={user.email} />

                    </div>

                    <div className="d-flex mt-3">
                        <button type="submit" className="btn btn-primary m-auto" onClick={(e) => changeEmail(e)}>Changer l'adresse email</button>
                    </div>

                </div>

                <hr className='w-25 m-auto mt-3' />
                <hr className='w-25 m-auto' />
                <hr className='w-25 m-auto' />

                <div>

                    <div className="form-group div-btn-form m-auto">

                        {alertMdp ? <Alert alert={alertMdp} /> : null}
                        {alertMdp && alertMdp.success !== undefined ?
                            setTimeout(() => {
                                window.location.reload(false);
                            }, 2000)
                            : null
                        }

                        <label className="mt-3 fw-bold" htmlFor="mdp">Entrer votre nouveau mot de passe</label>
                        <input type="password" className="form-control" id="mdp" />

                        <label className="mt-3 fw-bold" htmlFor="mdpConfirm">Confirmer votre nouveau mot de passe</label>
                        <input type="password" className="form-control" id="mdpConfirm" />

                    </div>

                    <div className="d-flex mt-3">
                        <button type="submit" className="btn btn-primary m-auto" onClick={(e) => ChangeMdp(e)}>Changer le mot de passe</button>
                    </div>

                </div>

                <hr className='w-25 m-auto mt-3' />
                <hr className='w-25 m-auto' />
                <hr className='w-25 m-auto' />

                <div className="d-flex mt-5">
                    <button type="button" className="btn btn-outline-primary m-auto" onClick={(e) => handleDeleteAccount(e)}>Supprimer le compte</button>
                </div>

            </div>
        )
    }
    else {
        return (
            <NotConnected />
        )
    }


}