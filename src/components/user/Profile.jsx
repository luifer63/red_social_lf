import React, { useEffect, useState } from 'react'
import avatar from '../../assets/img/user.png'
import { GetProfile } from '../../helpers/GetProfile'
import { Global } from '../../helpers/Global'
import { useParams, Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { PublicationList } from '../publication/PublicationList'


export const Profile = () => {

    const { auth } = useAuth()
    const [user, setUser] = useState({})
    const [counters, setCounters] = useState({})
    const [iFollow, setIFollow] = useState(false)
    const params = useParams()
    const [publications, setPublications] = useState([])
    const [page, setPage] = useState(1)
    const [more, setMore] = useState(true)

    useEffect(() => {
        getCounters()
        getDataUser()
        getPublications(1, true)

    }, [])

    useEffect(() => {
        getCounters()
        getDataUser()
        getPublications(1, true)
    }, [params])

    const getCounters = async () => {

        const request = await fetch(Global.url + "user/counters/" + params.userId, {
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
            setCounters(data)
        }

    }

    const getDataUser = async () => {
        let dataUser = await GetProfile(params.userId, setUser)

        if (dataUser.following && dataUser.following.followed) {
            setIFollow(true)
        }
    }

    const follow = async (userId) => {
        // peticion al back para guardar el following
        const request = await fetch(Global.url + "follow/save", {
            method: "POST",
            body: JSON.stringify({ followed: userId }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('token')
            }
        })
        const data = await request.json()
        // cuando todo esté correcto
        if (data.status == "success") {
            // actualizar estado following, agregando el nuevo follow
            setIFollow(true)
        }

    }
    const unFollow = async (userId) => {
        // peticion al back para borrar el following
        const request = await fetch(Global.url + "follow/unfollow/" + userId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('token')
            }
        })
        const data = await request.json()

        // cuando todo esté correcto
        if (data.status == "success") {
            // actualizar estado following, agregando el nuevo follow
            setIFollow(false)
        }
    }

    const getPublications = async (nextPage = 1, newProfile = false) => {

        const request = await fetch(Global.url + "publication/user/" + params.userId + "/" + nextPage, {
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
            let newPublications = data.userPublication
            if (!newProfile && publications.length >= 1) {
                newPublications = [...publications, ...data.userPublication]
            }

            if(newProfile){
                newPublications = data.userPublication
                setMore(true)
                setPage(1)
            }

            setPublications(newPublications)

            if ( publications.length >= (data.total - data.userPublication.length)) {
                setMore(false)
            }
        }
    }

    return (
        <>

            <header className="aside__profile-info">

                <div className="profile-info__general-info">
                    <div className="general-info__container-avatar">
                        {user.image != "default.png" && <img src={Global.url + "user/avatar/" + user.image} className="post__user-image" alt="Foto de perfil" />}
                        {user.image == "default.png" && <img src={avatar} className="post__user-image" alt="Foto de perfil" />}
                    </div>

                    <div className="general-info__container-names">
                        <div href="#" className="container-names__name">
                            <h1>{user.name} {user.surename}
                            </h1>
                            {user._id != auth._id && (
                                iFollow ?
                                    <button onClick={() => unFollow(user._id)} className="content__button content__button--red">Dejar de seguir</button>
                                    :
                                    <button onClick={() => follow(user._id)} className="content__button content__button--rigth">Seguir</button>
                            )
                            }
                        </div>

                        <h2 className="container-names__nickname">{user.nick}</h2>
                        <p>{user.bio}</p>

                    </div>
                </div>

                <div className="profile-info__stats">

                    <div className="stats__following">
                        <Link to={'/social/siguiendo/' + user._id} className="following__link">
                            <span className="following__title">Siguiendo</span>
                            <span className="following__number">{counters.following >= 1 ? counters.following : 0}</span>
                        </Link>
                    </div>
                    <div className="stats__following">
                        <Link to={'/social/seguidores/' + user._id} className="following__link">
                            <span className="following__title">Seguidores</span>
                            <span className="following__number">{counters.followed >= 1 ? counters.followed : 0}</span>
                        </Link>
                    </div>


                    <div className="stats__following">
                        <Link to={'/social/perfil/' + user._id} className="following__link">
                            <span className="following__title">Publicaciones</span>
                            <span className="following__number">{counters.publications >= 1 ? counters.publications : 0}</span>
                        </Link>
                    </div>


                </div>
            </header>


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
