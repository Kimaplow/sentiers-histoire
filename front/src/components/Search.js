import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CardMagazine from '../components/utils/CardMagazine';
import { useParams } from 'react-router-dom';

export default function Search() {

    const { word } = useParams();

    const route = window.location.pathname.split('/')[1];

    const [magazines, setMagazines] = useState([]);
    const [articles, setArticles] = useState([]);

    const [totalMagazine, setTotalMagazine] = useState(0);
    const [totalArticle, setTotalArticle] = useState(0);

    const [showMag, setShowMag] = useState(false);
    const [showArticles, setShowArticles] = useState(false);

    const [page, setPage] = useState(1);

    const clickMag = () => {
        setShowArticles(false);
        setShowMag(true);
        setPage(1);
    }

    const clickArticle = () => {
        setShowMag(false);
        setShowArticles(true);
        setPage(1);
    }

    const renderPaginationMagazine = () => {
        const nbrPage = Math.ceil(totalMagazine / 12);
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

    const renderPaginationArticle = () => {
        const nbrPage = Math.ceil(totalArticle / 12);
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

    const handlePage = (nbr) => {
        setPage(nbr);
    }

    useEffect(() => {
        const server = process.env.REACT_APP_BASE_URL_API;
        const getMagazines = async (word, page, route) => {
            if(route === "search"){
                await axios.get(server + "magazines/page/" + page + "/word/" + word)
                .then(res => {
                    setMagazines(res.data);
                })
            }
            else{
                await axios.get(server + "tags/" + word + "/magazines/page/" + page)
                .then(res => {
                    setMagazines(res.data);
                })
            }
        }
    
        const getTotalMagazine = async (word, route) => {
            if(route === "search"){
                await axios.get(server + "magazines/items/word/" + word)
                .then(res => {
                    setTotalMagazine(res.data);
                })
            }
            else{
                await axios.get(server + "tags/" + word + "/magazines/items")
                .then(res => {
                    setTotalMagazine(res.data.items);
                })
            }
        }
    
        const getArticles = async (word, page) => {
            if(route === "search"){
                await axios.get(server + "articles/page/" + page + "/word/" + word)
                .then(res => {
                    setArticles(res.data);
                })
            }
            else{
                await axios.get(server + "tags/" + word + "/articles/page/" + page)
                .then(res => {
                    console.log(res);
                    setArticles(res.data);
                })
            }
        }
    
        const getTotalArticle = async (word) => {
            if(route === "search"){
                await axios.get(server + "articles/items/word/" + word)
                .then(res => {
                    setTotalArticle(res.data);
                })
            }
            else{
                await axios.get(server + "tags/" + word + "/articles/items")
                .then(res => {
                    console.log(res);
                    setTotalArticle(res.data.items);
                })
            }
        }

        getMagazines(word, page, route);
        getTotalMagazine(word, route);
        getArticles(word, page, route);
        getTotalArticle(word, route);
        
    }, [word, page, route]);

    return (
        <div>
            <p className='text-center fw-bold m-auto'>Résultat(s) pour : "{word}"</p>

            <div className="d-flex justify-content-center mt-1">
                <button type="submit" className="btn btn-primary" onClick={clickMag}>Magazines {totalMagazine}</button>
                <button type="submit" className="btn btn-primary ms-2" onClick={clickArticle}>Articles {totalArticle}</button>
            </div>


            {showMag ?
                magazines && magazines.length > 0 ?
                    <div>
                        <div className='d-flex w-75 m-auto flex-wrap justify-content-around'>
                            {magazines.map((magazine, index) => {
                                return (
                                    <CardMagazine magazine={magazine} key={index} />
                                )
                            })
                            }
                        </div>
                        {totalMagazine > 12 ?
                            <div className='d-flex mt-3 justify-content-center'>
                                <ul className="pagination">
                                    {renderPaginationMagazine().map((page) => {
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
                    : <p className='text-center mt-2'>Pas de magazine trouvé :(</p>
                : null
            }

            {showArticles ?
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
                                            <td><button type="button" className="btn btn-primary" href="#" download={article.title} >Télécharger</button></td>
                                        </tr>
                                    )
                                })
                                }
                            </tbody>
                        </table>

                        {totalArticle > 12 ?
                            <div className='d-flex mt-3 justify-content-center'>
                                <ul className="pagination">
                                    {renderPaginationArticle().map((page) => {
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

                    : <p className='text-center mt-2'>Pas d'article trouvé :(</p>

                : null
            }
        </div>
    );
}