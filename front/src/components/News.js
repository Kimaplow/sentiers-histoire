import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import Alert from './utils/Alert';
import { UserContext } from './utils/Context';

export default function News() {

    const server = process.env.REACT_APP_BASE_URL_API;

    const [news, setNews] = useState(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [alert, setAlert] = useState(null);
    const user = useContext(UserContext);

    const handlePage = (nbr) => {
        setPage(nbr);
    }

    const renderPagination = () => {
        const nbrPage = Math.ceil(total / 4);
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

    const handleDelete = async (id) => {
        setAlert(null)
        await axios.delete(server + "news/" + id)
            .then(res => {
                setAlert(res.data)
            })
    }

    useEffect(() => {
        const server = process.env.REACT_APP_BASE_URL_API;

        const getActualites = async (page) => {
            let n = [];
            await axios.get(server + 'news/page/' + page)
                .then(res => {
                    n = res.data;
                })
            setNews(n);
        }
    
        const getTotal = async () => {
            let t = 0;
            await axios.get(server + 'news/items')
                .then(res => {
                    t = res.data
                })
            setTotal(t);
        }
        getActualites(page);
        getTotal();
    }, [page]);

    return (
        <div id="news">
            <h1 className='text-center fw-weight mt-2'>Les actualités du site {user && user.isAdmin ? <a href='/news/add'><i className="bi bi-plus-circle-fill"></i></a> : null}</h1>

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

            {news && news.length > 0 ?
                <div className="accordion w-50 m-auto" id="accordionActu">
                    {news.map((n, index) => {
                        return (
                            <div className="accordion-item" key={index}>
                                <h2 className="accordion-header" id={"heading-" + index}>
                                    <button className="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse-" + index} aria-expanded="false" aria-controls={"collapse-" + index}>
                                        {n.title} ({n.date.substring(0, 10)})
                                    </button>
                                </h2>
                                <div id={"collapse-" + index} className="accordion-collapse collapse" aria-labelledby={"heading-" + index} data-bs-parent="#accordionActu">
                                    <div className="accordion-body">
                                        <div className='m-auto summary-mag' style={{ whiteSpace: 'pre-wrap' }}>
                                            {n.content}
                                        </div>
                                        {user && user.isAdmin ?
                                            <div className='mt-3'>
                                                <a href={"/news/edit/" + n._id} className="card-link">Modifier l'actualité</a>
                                                <button type="button" className="btn btn-primary ms-3" onClick={() => handleDelete(n._id)}>Supprimer l'actualité</button>
                                            </div>

                                            : null
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {total > 4 ?
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
                : <p className='text-center mt-3'>Aucune actualités :(</p>
            }
        </div>
    );
}