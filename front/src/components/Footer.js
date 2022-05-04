import React from 'react';
import "./css/footer.css";

export default function Footer() {

    return (
        <div className="footer d-flex justify-content-around align-items-center">

            <a href="/legal" className="text-white">Mentions légales</a>
            <a href="/about" className="text-white">Qui sommes-nous ?</a>
            <a href="/faq" className="text-white">FAQ</a>
            <a href="/contact" className="text-white">Contact</a>

        </div>
    );
}