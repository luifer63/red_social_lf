import React, { useEffect, useState } from 'react'
import avatar from '../../assets/img/user.png'

import { Global } from '../../helpers/Global'
import { useParams, Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { PublicationList } from '../publication/PublicationList'

export const Feed = () => {

    const { auth } = useAuth()
    const params = useParams()
    const [publications, setPublications] = useState([])
    const [page, setPage] = useState(1)
    const [more, setMore] = useState(true)

    useEffect(() => {
        getPublications(1, false)
    }, [])

    const getPublications = async (nextPage = 1 , showNews = false) => {

        if(showNews){
            setPublications([])
            setPage(1)
            nextPage = 1
        }

        const request = await fetch(Global.url + "publication/feed/" + nextPage, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('token')
            }
        })
        const data = await request.json()

        // cuando todo esté correcto
        if (data.status == "success") {
            // actualizar estado following, agregando el nuevo follow
            let newPublications = data.publications

            if (!showNews && publications.length >= 1) {
                newPublications = [...publications, ...data.publications]
            }

            setPublications(newPublications)

            if ( !showNews && publications.length >= (data.total - data.publications.length)) {
                setMore(false)
            }
        }
    }


    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Timeline</h1>
                <button className="content__button" onClick={() => getPublications(1, true)} >Mostrar nuevas</button>
            </header>

            {console.log(publications)}
            <PublicationList 
                publications={publications}
                getPublications={getPublications}
                page={page}
                setPage={setPage}
                more={more}
                setMore={setMore}
            />            
        </>
    )
}
