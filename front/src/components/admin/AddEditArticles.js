import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'
import Alert from '../utils/Alert';
import NotConnected from '../utils/NotConnected';
import { UserContext } from '../utils/Context';

export default function AddEditArticle() {

    const server = process.env.REACT_APP_BASE_URL_API;

    const { id } = useParams();
    const [alert, setAlert] = useState(null);
    const [edit, setEdit] = useState(false);
    const [article, setArticle] = useState({});
    const [tags, setTags] = useState([]);
    const [tagsOrigin, setTagsOrigin] = useState([]);
    const user = useContext(UserContext);

    const handleChange = (e) => {
        let str = e.target.value;
        let l = str.length - 1;
        if (str[l] === " ") {
            let input = document.getElementById("tags");
            input.value = str.substring(0, l);
        }
    }

    const addTag = (e) => {
        let value = e.target.value;
        if (e.key === "Enter") {
            let t = [];
            tags.forEach(tag => {
                t.push(tag)
            });
            t.push({ name: value })
            setTags(t);
            e.target.value = "";
        }
    }

    const deleteTag = (tagDelete) => {
        let t = tags.filter(tag => tag !== tagDelete)
        setTags(t)
    }

    const clickSubmit = async (e) => {
        e.preventDefault();

        setAlert(null)

        const title = document.getElementById("title").value;
        const pdf = document.getElementById("pdf").files[0];

        if (!edit && (title === "" || pdf === undefined || tags.length === 0)) {
            setAlert({ error: "Renseigner tous les champs svp" })
        }
        else {
            const data = new FormData();

            if (edit) {
                if (title !== '') data.append("title", title);
                if (pdf !== undefined) data.append("pdf", pdf);
                if (tags !== tagsOrigin) {
                    let tagsDelete = tagsOrigin.filter(x => !tags.includes(x));
                    if (tagsDelete.length > 0) {
                        tagsDelete.forEach(tag => {
                            data.append("tagsDelete[]", tag.name);
                        })
                    }
                    tags.forEach(tag => {
                        if (!tag._id) {
                            data.append("tags[]", tag.name);
                        }
                    });
                }

                await axios.patch(server + 'articles/' + article._id, data)
                    .then(res => {
                        setAlert(res.data)
                    })
            }
            else {
                data.append("title", title);
                data.append("pdf", pdf);
                tags.forEach(tag => {
                    data.append("tags[]", tag.name);
                });

                await axios.post(server + 'articles', data)
                    .then(res => {
                        setAlert(res.data)
                    })
            }
        }
    }

    useEffect(() => {
        const getArticle = async (id) => {
            const server = process.env.REACT_APP_BASE_URL_API;
            const url = server + 'articles/' + id;
            await axios.get(url)
                .then(res => {
                    setArticle(res.data);
                    setTags(res.data.tags);
                    setTagsOrigin(res.data.tags);
                })
        }
        if (id) {
            setEdit(true);
            getArticle(id);
        }
    }, [id]);

    if (user && user.isAdmin) {
        return (
            <div className='d-flex justify-content-center mt-3'>

                <div>

                    <h1 className="text-center fw-bold">{edit ? "Modifier l'article" : "Ajouter un article"}</h1>

                    <div className="form-group div-btn-form">

                        {alert ? <Alert alert={alert} /> : null}
                        {alert && alert.success !== undefined ?
                            alert.success === "Article créé !" ?
                                setTimeout(() => {
                                    window.location = "/articles";
                                }, 2000)
                                : setTimeout(() => {
                                    window.location.reload(false);
                                }, 2000)
                            : null
                        }

                        <label className="fw-bold" htmlFor="titre">{edit ? "Modifier le titre" : "Ajouter un titre"}</label>
                        <input type="text" className="form-control" id="title" placeholder={edit ? article.title : null} />

                        <label className="mt-3 fw-bold" htmlFor="tags">{edit ? "Modifier le(s) tag(s)" : "Ajouter le(s) tag(s)"}</label>
                        <input type="text" className="form-control" id="tags" onChange={handleChange} onKeyPress={addTag} />
                        <div>
                            {tags.length > 0 ?
                                tags.map((tag, index) => {
                                    return (
                                        <span key={index} className={index === 0 ? "badge" : "badge ms-1"}>{tag.name} <i className="bi bi-x-lg" onClick={() => deleteTag(tag)}></i></span>
                                    )
                                })
                                : null
                            }
                        </div>

                        <label className="mt-3 fw-bold" htmlFor="pdf">{edit ? "Modifier le pdf" : "Ajouter un pdf"}</label>
                        <input type="file" className="form-control" id="pdf" />

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