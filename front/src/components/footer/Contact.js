import React, { useState } from 'react';
import axios from 'axios';
import Alert from '../utils/Alert';

export default function Contact() {

    const server = process.env.REACT_APP_BASE_URL_API;

    const [alert, setAlert] = useState(null);

    const clickSubmit = async (e) => {
        e.preventDefault();

        const lastName = e.target.nom.value;
        const firstName = e.target.prenom.value;
        const email = e.target.email.value;
        const subject = e.target.subject.value;
        const message = e.target.message.value;

        const data = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            subject: subject,
            message: message
        }

        await axios.post(server + 'users/mail', data)
            .then(res => {
                setAlert(res.data)
            })

    }

    return (
        <div className='d-flex justify-content-center'>

            <form onSubmit={clickSubmit}>

                <h1 className='text-center m-auto mt-2'>Contact</h1>

                {alert ? <Alert alert={alert} /> : null}
                {alert && alert.success !== undefined ?
                    alert.success === "Message envoyé !" ?
                        setTimeout(() => {
                            window.location = "/";
                        }, 2000)
                        : setTimeout(() => {
                            window.location.reload(false);
                        }, 2000)
                    : null
                }

                <div className="form-group div-btn-form">
                    <label className="mt-2 fw-bold" htmlFor="prenom">Entrer votre prénom</label>
                    <input type="text" className="form-control" id="prenom" required />

                    <label className="mt-3 fw-bold" htmlFor="nom">Entrer votre nom</label>
                    <input type="text" className="form-control" id="nom" required />

                    <label className="mt-3 fw-bold" htmlFor="email">Entrer votre email</label>
                    <input type="email" className="form-control" id="email" required />

                    <label className="mt-3 fw-bold" htmlFor="subject">Entrer le sujet</label>
                    <input type="text" className="form-control" id="subject" required />

                    <label className="mt-3 fw-bold" htmlFor="message">Entrer votre message</label>
                    <textarea type="text" className="form-control" id="message" required />
                </div>

                <div className="d-flex mt-3">
                    <button type="submit" className="btn btn-primary m-auto">Envoyer le message</button>
                </div>

            </form>

        </div>

    );
}