import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CardMagazine from './utils/CardMagazine';

export default function Home() {

    const [magazines, setMagazines] = useState([]);

    useEffect(() => {
        const server = process.env.REACT_APP_BASE_URL_API;
        const getMagazines = async () => {
            let m = [];
            await axios.get(server + "magazines/home")
                .then(res => {
                    m = res.data;
                })
            setMagazines(m);
        }
        getMagazines();
    }, []);

    return (
        <div className='w-75 m-auto'>
            <h1 className='text-center m-auto mt-2'>Nos magazines les plus récents</h1>
            <div className='d-flex justify-content-around flex-wrap'>
                {magazines && magazines.length > 0 ?
                    magazines.map((magazine, index) => {
                        return (
                            <CardMagazine magazine={magazine} key={index} />
                        )
                    })
                    : <p className='text-center mt-3'>Aucun magazine :(</p>
                }
            </div>

        </div>
    );
}