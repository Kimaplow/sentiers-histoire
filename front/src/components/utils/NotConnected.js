import React from 'react';

export default function NotConnected() {

    return (
        <div className='d-flex flex-column justify-content-center mt-3'>
            <h3 className='text-center'>Accès non autorisé</h3>
            <a href="/" className='text-center'>Retour à l'accueil</a>
        </div>
    )
}