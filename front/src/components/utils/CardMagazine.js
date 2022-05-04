import React, { useContext } from 'react';
import { UserContext } from '../utils/Context';

export default function CardMagazine(props) {

    const server = process.env.REACT_APP_BASE_URL_API;

    const tags = props.magazine.tags;
    const date = (props.magazine.date).substring(0, 10);
    const path = server + props.magazine.cover;
    const user = useContext(UserContext);

    return (
        <div className='mt-3'>
            <div className="card">
                <h3 className="card-header text-center">{props.magazine.title}</h3>
                <img className="card-mag-img" height={500} width={410} src={path} alt='cover' />
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">Prix : {props.magazine.price}€</li>
                    <li className="list-group-item">
                        {tags && tags.length ?
                            tags.map((tag, index) => {
                                return (
                                    <a href={"/tag/" + tag.name} key={index}><span className={index === 0 ? "badge" : "badge ms-1"} >{tag.name}</span></a>
                                )
                            })
                            : null
                        }
                    </li>
                </ul>
                <div className="card-body d-flex justify-content-around">
                    <a href={"/magazines/" + props.magazine._id} className="card-link ms-3">Voir le magazine</a>
                    {user ?
                        user.isAdmin ?
                            <a href={"/magazines/edit/" + props.magazine._id} className="card-link">Modifier le magazine</a>
                            : <form target="paypal" action="https://www.paypal.com/cgi-bin/webscr" method="post">
                                <input type="hidden" name="cmd" value="_s-xclick" />
                                <input type="hidden" name="hosted_button_id" value={props.magazine.id_paypal} />
                                <input type="submit" className='btn btn-link btn-card-mag' border="0" name="submit" alt="PayPal, le réflexe sécurité pour payer en ligne" value="Ajouter au panier"/>
                            </form>
                        : <button href="#" className="btn btn-link btn-card-mag" data-bs-toggle="tooltip" data-bs-placement="right" title="Connectez-vous pour ajouter ce magazine au panier !">Ajouter au panier</button>
                    }
                </div>
                <div className="card-footer text-muted">
                    Sortie le : {date}
                </div>
            </div>
        </div>
    );
}