import React from 'react';

export default function Faq() {

    return (

        <div>

            <h1 className='text-center mt-2'>Foire aux questions</h1>

            <div className="d-flex flex-column">

                <div className='faq d-flex flex-wrap w-50 m-auto justify-content-around'>

                    <div className="card border-secondary">
                        <div className="card-header">Question 1</div>
                        <div className="card-body">
                            <h4 className="card-title">Comment contacter le service client ?</h4>
                            <p className="card-text">En vous rendant sur la page <a href="/contact">contact</a> vous y trouverez les personnes à contacter en cas de problème.</p>
                        </div>
                    </div>

                    <div className="card border-secondary">
                        <div className="card-header">Question 2</div>
                        <div className="card-body">
                            <h4 className="card-title">Peut-on acheter un magazine sans être abonner.</h4>
                            <p className="card-text">Oui, il est possible de commander un magazine sans être abonner en le payant directement mais
                                vous ne profitez pas des magazines exclusifs.</p>
                        </div>
                    </div>

                    <div className="card border-secondary">
                        <div className="card-header">Question 3</div>
                        <div className="card-body">
                            <h4 className="card-title">Comment retourner le magazine reçu s'il est abimé ?</h4>
                            <p className="card-text">Nous envoyer un message sur la page <a href="/contact">contact</a></p>
                        </div>
                    </div>

                </div>

                <div className='faq d-flex flex-wrap w-50 m-auto justify-content-around mt-3'>

                    <div className="card border-secondary">
                        <div className="card-header">Question 4</div>
                        <div className="card-body">
                            <h4 className="card-title">Combien de temps dure le delai de livraison.</h4>
                            <p className="card-text">La date d'expédition du colis est consultable à tout moment sur le site Internet.
                                Compter entre 2 et 3 jours pour un envoi en France Métropolitaine</p>
                        </div>
                    </div>

                    <div className="card border-secondary">
                        <div className="card-header">Question 5</div>
                        <div className="card-body">
                            <h4 className="card-title">Comment avoir des informations sur l'état de ma commande ?</h4>
                            <p className="card-text">Vous pouvez consulter par vous même l'état de votre commande sur le site en vous munissant de votre numéro de commande et de votre nom
                                ou en nous envoyant un mail dans lequel vous nous précisez votre numéro de commande</p>
                        </div>
                    </div>

                    <div className="card border-secondary">
                        <div className="card-header">Question 6</div>
                        <div className="card-body">
                            <h4 className="card-title">Comment puis-je être prévenu de la prochaine parution d'une revue ?</h4>
                            <p className="card-text">En étant abonné vous serez alerté directement via votre boîte mail.</p>
                        </div>
                    </div>

                </div>



            </div>
        </div >
    );
}