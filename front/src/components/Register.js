import axios from 'axios';
import React, { useContext, useState } from 'react';
import Alert from './utils/Alert';
import { UserContext } from './utils/Context';

export default function Register() {

    const server = process.env.REACT_APP_BASE_URL_API;

    const [alert, setAlert] = useState(null);
    const [alertMdp, setAlertMdp] = useState(null);
    const user = useContext(UserContext);

    const clickSubmit = async (e) => {
        e.preventDefault();

        setAlert(null);
        setAlertMdp(null);

        const nom = e.target.nom.value;
        const prenom = e.target.prenom.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;

        if(password === confirmPassword){
            const data = {
                lastName: nom,
                firstName: prenom,
                email: email,
                password: password
            }
    
            await axios.post(server + 'users', data)
                .then((res) => {
                    setAlert(res.data);
                })
        }
        else{
            setAlertMdp({error : "Les mdp ne sont pas identiques"})
        }
    }

    if(user){
        window.location = "/profile"
    }

    return (
        <div className='d-flex justify-content-center'>

            <form onSubmit={clickSubmit}>

                <h1 className='text-center m-auto mt-2'>Inscription</h1>

                <div className="form-group div-btn-form">

                    {alert || alertMdp ? <Alert alert={alert ? alert : alertMdp}/>: null}
                    {alert && alert.success !== undefined ?
                        setTimeout(() => {
                            window.location = "/login"
                        }, 2000)
                        : null
                    }

                    <label className="fw-bold mt-2" htmlFor="prenom">Entrer votre prénom</label>
                    <input type="text" className="form-control" id="prenom" required />

                    <label className="mt-3 fw-bold" htmlFor="nom">Entrer votre nom</label>
                    <input type="text" className="form-control" id="nom" required />

                    <label className="mt-3 fw-bold" htmlFor="email">Entrer votre email</label>
                    <input type="email" className="form-control" id="email" required />

                    <label className="mt-3 fw-bold" htmlFor="password">Entrer votre mot de passe</label>
                    <input type="password" className="form-control" id="password" required />

                    <label className="mt-3 fw-bold" htmlFor="confirmPassword">Confirmer votre mot de passe</label>
                    <input type="password" className="form-control" id="confirmPassword" required />

                </div>

                <div className="d-flex mt-3">
                    <button type="submit" className="btn btn-primary m-auto">S'INSCRIRE</button>
                </div>

            </form>

        </div>

    );
}