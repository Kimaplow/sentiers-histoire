import React from 'react';
//import { UserContext } from './utils/Context';

export default function Abonnement() {

    //const user = useContext(UserContext);

    return (

        <div className="abonnement">

            <h1 className='text-center m-auto mt-2'>Pourquoi s'abonner ?</h1>

            <div className="abonnement-card mt-3">

                <div className="card border-secondary mb-3">
                    <div className="card-header text-center fw-bold">Sans abonnement</div>
                    <div className="card-body">
                        <ul type="square">
                            <li>Pas d'accès aux Articles</li>
                            <li>Achetez les magazines à l'unité</li>
                        </ul>
                    </div>
                </div>

                <div className="card border-secondary mb-3 ms-3">
                    <div className="card-header text-center fw-bold">Avec abonnement</div>
                    <div className="card-body">
                        <ul type="square">
                            <li>Accès exclusif aux articles</li>
                            <li>Reçu des magazines en format papier chez vous</li><br />
                        </ul>
                        <h3 className='text-center'>BIENTÔT</h3>
                        {/*<div className="d-flex">
                            {user ?
                                abo
                                : <button type="button" className="btn btn-primary m-auto disabled">Connectez-vous pour vous abonner</button>
                            }
                        </div>
                        */}
                    </div>
                </div>

            </div>
        </div>
    );
}