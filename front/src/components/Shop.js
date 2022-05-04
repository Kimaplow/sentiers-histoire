import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import CardMagazine from './utils/CardMagazine';
import { UserContext } from './utils/Context';

export default function Shop() {

    const [magazines, setMagazines] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const user = useContext(UserContext);

    const handlePage = (nbr) => {
        setPage(nbr);
    }

    const renderPagination = () => {
        const nbrPage = Math.ceil(total / 12);
        let tab = [];
        for (let i = 1; i <= nbrPage; i++) {
            tab.push(
                <li className={page === i ? "page-item active": "page-item"} key={i}>
                    <button className="page-link" onClick={() => handlePage(i)}>{i}</button>
                </li>
            )
        }
        return tab;
    }

    useEffect(() => {
        const server = process.env.REACT_APP_BASE_URL_API;
        const getMagazines = async (page) => {
            let m = [];
            await axios.get(server + "magazines/page/" + page)
                .then(res => {
                    m = res.data;
                })
            setMagazines(m);
        }
    
        const getTotal = async () => {
            let t = 0;
            await axios.get(server + "magazines/items")
                .then(res => {
                    t = res.data
            })
            setTotal(t);
        }
        getMagazines(page);
        getTotal();
    }, [page]);

    return (
        <div className='w-75 m-auto'>
            <h1 className='text-center m-auto mt-2'>Tous nos magazines {user && user.isAdmin ? <a href='/magazines/add'><i className="bi bi-plus-circle-fill"></i></a> : null}</h1>
            <div className='d-flex flex-wrap justify-content-around'>
                {magazines && magazines.length > 0 ?
                    magazines.map((magazine, index) => {
                        return (
                            <CardMagazine magazine={magazine} key={index} />
                        )
                    })
                    : <p className='text-center mt-3'>Aucun magazine :(</p>
                }
            </div>


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
    );
}