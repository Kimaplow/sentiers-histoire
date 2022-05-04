import React, { useEffect, useState } from 'react';
import Alert from './utils/Alert';
import NotConnected from './utils/NotConnected';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function ForgotPassword() {

    const { id } = useParams();
    const { token } = useParams();

    const [alert, setAlert] = useState(null);
    const [user, setUser] = useState({});

    useEffect(() => {
        const server = process.env.REACT_APP_BASE_URL_API;
        const getUser = () => {
            axios
                .get(server + "users/reset-password/" + id + "/" + token)
                .then(res => {
                    setUser(res.data)
                })
        }
        getUser()
    }, [id, token])

    const clickSubmit = async (e) => {
        e.preventDefault();

        const server = process.env.REACT_APP_BASE_URL_API;

        const mdp = e.target.mdp.value;
        const mdpConfirm = e.target.mdpConfirm.value;

        if (mdp !== mdpConfirm) {
            setAlert({ error: "mdp non identiques" })
        }
        else {
            const data = {
                "password": mdp
            };

            await axios
                        .post(server + 'users/reset/' + user.user + "/" + user.token, data)
                        .then(res => {
                            setAlert(res.data)
                        })
        }
    }

    console.log(user);

    if (user && !user.error) {
        return (
            <div className='d-flex justify-content-center'>

                <form onSubmit={clickSubmit}>

                    <h1 className='text-center m-auto mt-2'>Mot de passe oublié</h1>

                    {alert ? <Alert alert={alert} /> : null}
                    {alert ?
                        alert.success ?
                            setTimeout(() => {
                                window.location = "/login";
                            }, 3000)
                            : setTimeout(() => {
                                window.location.reload(false)
                            }, 3000)
                        : null
                    }

                    <div className="form-group div-btn-form">
                        <label className="mt-2 fw-bold" htmlFor="mdp">Entrer votre nouveau mot de passe</label>
                        <input type="password" className="form-control" id="mdp" required />
                    </div>

                    <div className="form-group div-btn-form">
                        <label className="mt-2 fw-bold" htmlFor="mdpConfirm">Confirmer votre nouveau mot de passe</label>
                        <input type="password" className="form-control" id="mdpConfirm" required />
                    </div>

                    <div className="d-flex mt-3">
                        <button type="submit" className="btn btn-primary m-auto">Confirmer le nouveau mot de passe</button>
                    </div>

                </form>

            </div>
        )
    }
    else {
        return (
            <NotConnected />
        )
    }

}