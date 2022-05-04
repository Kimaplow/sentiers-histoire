import React from 'react';

export default function LegalNotice() {

    return (
        <div className="mt-2 w-50 m-auto">
            
            <h2 className="text-center">Mentions légales</h2>

            <h4 className='mt-5'>Identification</h4>
            <p>Les mentions obligatoires que le site internet d'un entrepreneur individuel doit afficher pour permettre son identification sont :</p>
            <ul>
                <li>Nom et prénom</li>
                <li>Adresse de domicile</li>
                <li>Numéro de téléphone et adresse de courrier électronique</li>
                <li>Nom du directeur ou du codirecteur de la publication et celui du responsable de la rédaction s'il en existe</li>
                <li>Nom, dénomination ou raison sociale et adresse et numéro de téléphone de l'hébergeur de son site</li>
            </ul>

            <h4>Activité</h4>
            <p>Pour une activité commerciale, les mentions obligatoires sont les suivantes :</p>
            <ul>
                <li>Numéro d'inscription au registre du commerce et des sociétés</li>
                <li>Numéro individuel d'identification fiscale</li>
                <li>Conditions générales de vente (CGV) incluant le prix TTC en euros, les frais et date de livraison, les modalités de paiement, le service après vente, le droit de rétractation, la durée de l'offre, le coût de la communication à distance</li>
            </ul>

            <h4>Mentions sur l'utilisation de cookies</h4>
            <p>Un cookie est un outil informatique qui permet de tracer et d'analyser le comportement d'un usager sur internet (sa navigation sur internet, sur un site, dans une application, etc.).</p>
            <p>Les cookies soumis au consentement des internautes sont ceux ayant pour but de personnaliser les publicités et ceux liés aux réseaux sociaux.</p>
            <p>En matière de cookies vis-à-vis de l'internaute, vous devez :</p>
            <ul>
                <li>Expliquer l'utilité et l'utilisation des cookies</li>
                <li>Obtenir son consentement</li>
                <li>Lui fournir un moyen de les refuser</li>
            </ul>
            <p>Le consentement donné par le client est enregistré pendant 13 mois maximum.</p>

            <h4>Mentions sur l'utilisation de données personnelles</h4>
            <p>Sur votre site marchand, vous collectez les données personnelles de vos clients (nom, adresse, etc.). Vous pouvez constituer des fichiers de clients avec ses données, qui vous servent par exemple à des campagnes de promotion.</p>
            <p>Vous devez demander et obtenir le consentement de l'internaute pour le traitement de ses données.</p>
            <p>Vous devez mentionner les informations suivantes :</p>
            <ul>
                <li>Coordonnées du délégué à la protection des données (DPO ou DPD) s'il en existe un dans votre entreprise, ou d'une personne pouvant être contactée sur ces questions</li>
                <li>Finalité poursuivie par le traitement auquel les données sont destinées</li>
                <li>Caractère obligatoire ou facultatif des réponses et conséquences pour l'internaute s'il ne répond pas à la question</li>
                <li>Destinataire des données</li>
                <li>Droit du client à s'opposer, à accéder et à rectifier ses données</li>
                <li>Au besoin, transferts de données à caractère personnel envisagés à destination d'un État n'appartenant pas à l'Union européenne</li>
                <li>Autorisation légale de leur traitement (il peut s'agir du consentement de l'internaute, de l'exécution d'un contrat de vente, du respect d'un texte juridique)</li>
                <li>Mentionner que le client peut déposer une plainte auprès de la Cnil</li>
            </ul>

            <p>Site soumis aux articles L410-1 à L490-14</p>

        </div>
    );
}