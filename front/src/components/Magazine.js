import React, { useEffect, useState, useContext } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { UserContext } from './utils/Context';
import Alert from './utils/Alert';
import "./css/magazine.css"

export default function Magazine() {

    const server = process.env.REACT_APP_BASE_URL_API;

    const { id } = useParams();
    const [magazine, setMagazine] = useState(null);
    const [alert, setAlert] = useState(null);
    const user = useContext(UserContext);

    useEffect(() => {
        const server = process.env.REACT_APP_BASE_URL_API;
        const getMagazine = async (id) => {
            let m = null;
            const url = server + "magazines/" + id;
            await axios.get(url)
                .then(res => {
                    m = res.data
                })
            setMagazine(m);
        }
        getMagazine(id);
    }, [id]);

    const handleDelete = async (id) => {
        axios.delete(server + "magazines/" + id)
            .then(res => {
                setAlert(res.data)
            })
    }

    return (
        <div id="magazine">

            {alert ? <Alert alert={alert} /> : null}
            {alert && alert.success !== undefined ?
                alert.success === "Magazine supprimé !" ?
                    setTimeout(() => {
                        window.location = "/shop";
                    }, 2000)
                    : setTimeout(() => {
                        window.location.reload(false);
                    }, 2000)
                : null
            }

            {magazine ?

                <div className="magazine-card m-3">
                    <img width="500" height="700" src={server + magazine.cover} alt='cover' />
                    <div className="magazine-info ms-5">
                        <h2>{magazine.title}</h2>
                        <p><strong>Résumé :</strong></p>
                        <p className='summary-mag'>{magazine.summary}</p>
                        <p><strong>Prix :</strong> {magazine.price}€</p>
                        <p>
                            {magazine.tags.map((tag, index) => {
                                return (
                                    <a href={"/tag/" + tag.name} key={index}><span className={index === 0 ? "badge" : "badge ms-1"} >{tag.name}</span></a>
                                )
                            })}
                        </p>
                        <form target="paypal" action="https://www.paypal.com/cgi-bin/webscr" method="post">
                            <input type="hidden" name="cmd" value="_s-xclick" />
                            <input type="hidden" name="hosted_button_id" value={magazine.id_paypal} />
                            <input type="submit" className={user ? 'btn btn-primary' : 'btn btn-primary disabled'} border="0" name="submit" alt="PayPal, le réflexe sécurité pour payer en ligne" value="Ajouter au panier" />
                        </form>
                        {/*<h6 className="mt-1">ISBN : {magazine.isbn}</h6>*/}
                        {user && user.isAdmin ? <button type="button" className="btn btn-primary mt-3" onClick={() => handleDelete(magazine._id)}>Supprimer le magazine</button> : null}
                    </div>
                </div>
                : <h3 className="text-center mt-3">Ce magazine n'existe pas</h3>
            }
        </div>
    );
}