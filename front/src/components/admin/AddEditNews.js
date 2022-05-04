import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'
import Alert from '../utils/Alert';
import NotConnected from '../utils/NotConnected';
import { UserContext } from '../utils/Context';

export default function AddEditNews() {

    const server = process.env.REACT_APP_BASE_URL_API;

    const { id } = useParams();
    const [alert, setAlert] = useState(null);
    const [edit, setEdit] = useState(false);
    const [news, setNews] = useState({});
    const user = useContext(UserContext);

    const clickSubmit = async (e) => {
        e.preventDefault();

        setAlert(null)

        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;

        if (!edit && (title === "" || content === "")) {
            setAlert({ error: "Renseigner tous les champs svp" })
        }
        else {
            let data = {};

            if (edit) {
                if (title !== '') data["title"] = title;
                if (content !== '') data["content"] = content;

                await axios.patch(server + 'news/' + news._id, data)
                    .then(res => {
                        setAlert(res.data)
                    })
            }
            else {
                data["title"] = title;
                data["content"] = content;

                await axios.post(server + 'news', data)
                    .then(res => {
                        setAlert(res.data)
                    })
            }
        }
    }

    useEffect(() => {
        const getNews = async (id) => {
            const server = process.env.REACT_APP_BASE_URL_API;
            const url = server + 'news/' + id;
            await axios.get(url)
                .then(res => {
                    setNews(res.data);
                })
        }
        if(id){
            setEdit(true);
            getNews(id);
        }
    }, [id]);

    if (user && user.isAdmin) {
        return (
            <div className='d-flex justify-content-center mt-3'>
                <div>
                    <h1 className="text-center fw-bold">{edit ? "Modifier l'actualité" : "Ajouter une actualité"}</h1>
                    <div className="form-group div-btn-form">

                        {alert ? <Alert alert={alert} /> : null}
                        {alert && alert.success !== undefined ?
                            alert.success === "Actualité créé !" ?
                                setTimeout(() => {
                                    window.location = "/news";
                                }, 2000)
                                : setTimeout(() => {
                                    window.location.reload(false);
                                }, 2000)
                            : null
                        }

                        <label className="fw-bold" htmlFor="title">{edit ? "Modifier le titre" : "Ajouter un titre"}</label>
                        <input type="text" className="form-control" id="title" placeholder={edit ? news.title : null} />

                        <label className="mt-3 fw-bold" htmlFor="content">{edit ? "Modifier le content" : "Ajouter un content"}</label>
                        <textarea type="text" className="form-control" id="content" placeholder={edit ? news.content : null} />

                    </div>

                    <div className="d-flex mt-3">
                        <button type="submit" className="btn btn-primary m-auto" onClick={clickSubmit}>Confirmer</button>
                    </div>
                </div>
            </div>
        );
    }
    else {
        return (
            <NotConnected />
        )
    }
}