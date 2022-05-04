import axios from 'axios';
import React, { useContext, useState } from 'react';
import Alert from './utils/Alert';
import { UserContext } from './utils/Context';

export default function Login() {

    const server = process.env.REACT_APP_BASE_URL_API;

    const [alert, setAlert] = useState(null);
    const user = useContext(UserContext);

    const clickSubmit = async (e) => {
        e.preventDefault();

        setAlert(null)

        const email = e.target.email.value;
        const password = e.target.password.value;

        const data = {
            email: email,
            password: password
        }

        await axios({
            method: "post",
            mode: 'same-origin',
            url: server + 'users/login',
            withCredentials: true,
            data
        })
            .then((res) => {
                setAlert(res.data)
            })
    }

    if(user){
        window.location = "/account"
    }

    return (
        <div className='d-flex justify-content-center'>

            <form onSubmit={clickSubmit}>

                <h1 className='text-center m-auto mt-2'>Connexion</h1>

                <div className="form-group div-btn-form">

                    {alert ? <Alert alert={alert} /> : null}
                    {alert && alert.success !== undefined ?
                        setTimeout(() => {
                            window.location = "/account"
                        }, 2000)
                        : null
                    }

                    <label className="mt-2 fw-bold" htmlFor="email">Entrer votre email</label>
                    <input type="email" className="form-control" id="email" placeholder="" required />

                    <label className="mt-3 fw-bold" htmlFor="password">Entrer votre mot de passe</label>
                    <input type="password" className="form-control" id="password" placeholder="" required />
                </div>

                <div className="text-center">
                    <a href="/forgot-password">Mot de passe oublié ?</a>
                </div>

                <div className="d-flex mt-3">
                    <button type="submit" className="btn btn-primary m-auto">SE CONNECTER</button>
                </div>

            </form>

        </div>

    );
}