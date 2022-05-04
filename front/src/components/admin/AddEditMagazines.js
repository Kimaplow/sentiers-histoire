import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'
import Alert from '../utils/Alert';
import NotConnected from '../utils/NotConnected';
import { UserContext } from '../utils/Context';

export default function AddEditMagazines() {

    const server = process.env.REACT_APP_BASE_URL_API;

    const { id } = useParams();
    const [alert, setAlert] = useState(null);
    const [edit, setEdit] = useState(false);
    const [magazine, setMagazine] = useState({});
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
        const paypal = document.getElementById("paypal").value;
        const price = document.getElementById("price").value;
        const stock = document.getElementById("stock").value;
        const isbn = document.getElementById("isbn").value;
        const summary = document.getElementById("summary").value;
        const cover = document.getElementById("cover").files[0];

        if (!edit && (title === "" || paypal === "" || price === "" || stock === "" || summary === "" || cover === undefined)) {
            setAlert({ error: "Renseigner tous les champs svp" })
        }
        else {
            const data = new FormData();

            if (edit) {
                if (title !== '') data.append("title", title);
                if (paypal !== '') data.append("id_paypal", paypal);
                if (price !== '') data.append("price", price);
                if (stock !== '') data.append("stock", stock);
                if (isbn !== '') data.append("isbn", isbn);
                if (summary !== '') data.append("summary", summary);
                if (cover !== undefined) data.append("cover", cover);

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

                await axios.patch(server + 'magazines/' + id, data)
                    .then(res => {
                        setAlert(res.data)
                    })

            }
            else {
                data.append("title", title);
                data.append("id_paypal", paypal);
                data.append("price", price);
                tags.forEach(tag => {
                    data.append("tags[]", tag.name);
                });
                data.append("stock", stock);
                data.append("isbn", isbn);
                data.append("summary", summary);
                data.append("cover", cover);

                await axios.post(server + 'magazines', data)
                    .then(res => {
                        setAlert(res.data)
                    })
            }
        }
    }

    useEffect(() => {
        const getMagazine = async (id) => {
            const server = process.env.REACT_APP_BASE_URL_API;
            const url = server + 'magazines/' + id;
            await axios.get(url)
                .then(res => {
                    setMagazine(res.data);
                    setTags(res.data.tags);
                    setTagsOrigin(res.data.tags);
                })
        }
        if (id) {
            setEdit(true);
            getMagazine(id);
        }
    }, [id]);

    if(user && user.isAdmin){
        return (
            <div className='d-flex justify-content-center mt-3'>
    
                <div>
    
                    <h1 className="text-center fw-bold">{edit ? "Modifier le magazine" : "Ajouter le titre"}</h1>
    
                    <div className="form-group div-btn-form">
    
                        {alert ? <Alert alert={alert} /> : null}
                        {alert && alert.success !== undefined ?
                            alert.success === "Magazine créé !" ?
                                setTimeout(() => {
                                    window.location = "/";
                                }, 2000)
                                : setTimeout(() => {
                                    window.location.reload(false);
                                }, 2000)
                            : null
                        }
    
                        <label className="fw-bold" htmlFor="cover">{edit ? "Modifier la couverture" : "Ajouter la couverture"}</label>
                        <input type="file" className="form-control" id="cover" required />

                        <label className="mt-2 fw-bold" htmlFor="paypal">{edit ? "Modifier l'id paypal" : "Ajouter l'id paypal"}</label>
                        <input type="text" className="form-control" id="paypal" placeholder={edit ? magazine.id_paypal : ""} required />
    
                        <label className="mt-2 fw-bold" htmlFor="title">{edit ? "Modifier le titre" : "Ajouter le titre"}</label>
                        <input type="text" className="form-control" id="title" placeholder={edit ? magazine.title : ""} required />
    
                        <label className="mt-2 fw-bold" htmlFor="price">{edit ? "Modifier le prix" : "Ajouter le prix"}</label>
                        <input type="number" step={0.01} className="form-control" id="price" placeholder={edit ? magazine.price : ""} required />
    
                        <label className="mt-2 fw-bold" htmlFor="stock">{edit ? "Modifier le stock" : "Ajouter le stock"}</label>
                        <input type="number" step={1} className="form-control" id="stock" placeholder={edit ? magazine.stock : ""} />
    
                        <label className="mt-3 fw-bold" htmlFor="tags">{edit ? "Modifier le(s) tag(s)" : "Ajouter le(s) tag(s)"}</label>
                        <input type="text" className="form-control" id="tags" placeholder="tag" onChange={handleChange} onKeyPress={addTag} />
                        <div>
                            {tags.length > 0 ?
                                tags.map((tag, index) => {
                                    return (
                                        <a href="#!" key={index}><span className={index === 0 ? "badge" : "badge ms-1"}>{tag.name} <i className="bi bi-x-lg" onClick={() => deleteTag(tag)}></i></span></a>
                                    )
                                })
                                : null
                            }
                        </div>
    
                        <label className="mt-2 fw-bold" htmlFor="isbn">{edit ? "Modifier l'ISBN" : "Ajouter l'ISBN"}</label>
                        <input type="text" className="form-control" id="isbn" placeholder={edit ? magazine.isbn : ""} />
    
                        <label className="mt-3 fw-bold" htmlFor="summary">{edit ? "Modifier le résumé" : "Ajouter le résumé"}</label>
                        <textarea type="text" className="form-control" id="summary" placeholder={edit ? magazine.summary : ""} />
    
                    </div>
    
                    <div className="d-flex mt-3">
                        <button type="button" className="btn btn-primary m-auto" onClick={clickSubmit}>Confirmer</button>
                    </div>
    
                </div>
    
            </div>
    
        );
    }
    else{
        return(
            <NotConnected />
        )
    }

    
}