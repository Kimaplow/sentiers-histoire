import React, { useState, useContext } from 'react';
import Alert from './utils/Alert';
import axios from 'axios';
import { UserContext } from './utils/Context';

export default function ForgotPassword() {

    const [alert, setAlert] = useState(null);
    const user = useContext(UserContext);

    const clickSubmit = async (e) => {
        e.preventDefault();

        const server = process.env.REACT_APP_BASE_URL_API;
        const email = e.target.email.value;
        const data = { "email": email };

        await axios
            .post(server + 'users/reset-password', data)
            .then(res => {
                console.log(res.data);
                setAlert(res.data)
            })
    }

    if (user) {
        window.location = "/";
    }
    else {
        return (
            <div className='d-flex justify-content-center'>

                <form onSubmit={clickSubmit}>

                    <h1 className='text-center m-auto mt-2'>Mot de passe oublié</h1>

                    {alert ? <Alert alert={alert} /> : null}
                    {alert ?
                        alert.success ?
                            setTimeout(() => {
                                window.location = "/";
                            }, 3000)
                            : setTimeout(() => {
                                window.location.reload(false)
                            }, 3000)
                        : null
                    }

                    <div className="form-group div-btn-form">
                        <label className="mt-2 fw-bold" htmlFor="email">Entrer votre email</label>
                        <input type="email" className="form-control" id="email" required />
                    </div>

                    <div className="d-flex mt-3">
                        <button type="submit" className="btn btn-primary m-auto">Réinitialiser le mot de passe</button>
                    </div>

                </form>

            </div>
        );
    }
}