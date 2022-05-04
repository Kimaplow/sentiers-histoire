import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import Alert from './utils/Alert';
import { UserContext } from './utils/Context';

export default function Articles() {

    const server = process.env.REACT_APP_BASE_URL_API;

    const [articles, setArticles] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [alert, setAlert] = useState(null);
    const user = useContext(UserContext);

    const getArticles = async (page) => {
        let m = [];
        await axios.get(server + "articles/page/" + page)
            .then(res => {
                m = res.data;
            })
        setArticles(m);
    }

    const getTotal = async () => {
        let t = 0;
        await axios.get(server + "articles/items")
            .then(res => {
                t = res.data
            })
        setTotal(t);
    }

    const handlePage = (nbr) => {
        setPage(nbr);
    }

    const renderPagination = () => {
        const nbrPage = Math.ceil(total / 12);
        let tab = [];
        for (let i = 1; i <= nbrPage; i++) {
            tab.push(
                <li className={page === i ? "page-item active" : "page-item"} key={i}>
                    <button className="page-link" onClick={() => handlePage(i)}>{i}</button>
                </li>
            )
        }
        return tab;
    }

    const handleDelete = async(id) => {
        await axios.delete(server + "articles/" + id)
            .then(res => {
                setAlert(res.data)
            })
    }

    useEffect(() => {
        getArticles(page);
        getTotal()
    }, [page]);

    return (
        <div id="articles">

            <h1 className='text-center m-auto mt-2'>Tous nos articles {user && user.isAdmin ? <a href='/articles/add'><i className="bi bi-plus-circle-fill"></i></a> : null}</h1>

            {alert ? <Alert alert={alert} /> : null}
            {alert && alert.success !== undefined ?
                alert.success === "Actualité supprimée !" ?
                    setTimeout(() => {
                        window.location.reload(false);
                    }, 2000)
                    : setTimeout(() => {
                        window.location.reload(false);
                    }, 2000)
                : null
            }

            {user ?
                user.isSub || user.isAdmin ?
                    articles && articles.length > 0 ?
                        <div>
                            <table className="table w-50 table-bordered text-center m-auto mt-2">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col">Titre</th>
                                        <th scope="col">Tag(s)</th>
                                        <th scope="col">Date de sortie</th>
                                        <th scope="col">Téléchargement</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {articles.map((article, index) => {
                                        let className = "";
                                        if (index % 2 === 0) {
                                            className = "table-active";
                                        }
                                        return (
                                            <tr className={className} key={index}>
                                                <th scope="row">{article.title}</th>
                                                <td>
                                                    {article.tags.map((tag, index) => {
                                                        return (
                                                            <a href={"/tag/" + tag.name} key={index}><span className="badge ms-1" >{tag.name}</span></a>
                                                        )
                                                    })
                                                    }
                                                </td>
                                                <td>{(article.date).substring(0, 10)}</td>
                                                <td>
                                                    {user && user.isAdmin ?
                                                        <div>
                                                            <a href={"/articles/edit/" + article._id} className="card-link ms-3">Modifier l'article</a>
                                                            <button className="btn btn-primary ms-3" onClick={() => handleDelete(article._id)}>Supprimer l'article</button>
                                                        </div>
                                                        : <a type="button" className="btn btn-primary" href={server + article.pdf} download={article.title}>Télécharger</a>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                    }
                                </tbody>
                            </table>
                            {total > 12 ?
                                <div className='d-flex mt-3 justify-content-center'>
                                    <ul className="pagination">
                                        {renderPagination().map((page) => {
                                            return (
                                                page
                                            )
                                        })

                                        }
                                    </ul>
                                </div>

                                : null
                            }
                        </div>
                        : <p className='text-center mt-3'>Pas encore d'articles :(</p>
                    : <p className='text-center mt-3'>Abonnez-vous pour accéder aux article ! <a href='/sub'>S'abonner</a></p>
                : <p className='text-center mt-3'>Connectez-vous pour accéder aux article ! <a href='/login'>Connexion</a></p>
            }
        </div>
    );
}