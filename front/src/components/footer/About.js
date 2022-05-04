import React from 'react';

export default function About() {

    return (
        <div className="mt-2 w-50 m-auto">

            <h1 className='text-center'>Qui sommes nous ?</h1>

            <p className='summary-mag mt-4'>Après des études de recherche en histoire, des amis passionnés décident de lancer leur propre magazine.
                L’idée est d’exploiter des sujets traités en totalité afin d’apporter à nos lecteurs un regard neuf sur les événements,
                à l’aide de témoignages, d’ouvrages et d’informations trouvés sur place.
                Nous choisissons d’explorer des sujets assez méconnus et proposons à nos lecteurs d’enrichir chaque thème avec des articles annexes disponible sur notre site internet.
                Nous sommes indépendants et s’autofinançons. Avec une approche grand public, nous partageons nos connaissances de manière ininterrompue sans discontinuité publicitaire.
                Nos magazines s’adressent donc aux passionnés, à ceux qui veulent enrichir leurs connaissances mais aussi aux simples curieux !
                Nous espérons que vous prendrez autant de plaisir à lire notre magazine que nous à l’avoir conçu.</p>

            <div className='d-flex flex-row-reverse mt-5'>
                <p>La Redaction</p>
            </div>

        </div >
    );
}