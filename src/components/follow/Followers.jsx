import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global'
import { UserList } from '../user/UserList'
import { useParams} from 'react-router-dom'
import { GetProfile } from '../../helpers/GetProfile'


export const Followers = () => {


  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [more, setMore] = useState(true)
  const [following, setFollowing] = useState([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState({})

  const params = useParams()

  useEffect(() => {
    getUsers(1)
    GetProfile(params.userId, setProfile)
  }, [])


  const getUsers = async (nextPage = 1) => {
    setLoading(true)
    // peticion para sacar usuarios

    const userId = params.userId

    const request = await fetch(Global.url + 'follow/followers/' + userId+ "/" + nextPage, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem('token')
      }
    })

    const data = await request.json()
    
    let cleanUsers = []
    let cleanUsersIds = []

    data.users_Follow_me.forEach(follow => {    
        cleanUsers = [...cleanUsers, follow.user]
        cleanUsersIds = [...cleanUsersIds, follow.user._id]
    })
    data.users = cleanUsers
    

    // crear estado para listarlos
    if (data.users && data.status == "success") {

      let newUsers = data.users

      if (users.length >= 1) {
        newUsers = [...users, ...data.users]
      }
      setUsers(newUsers)
      setFollowing(cleanUsersIds)
      setLoading(false)

      // paginacion

      if (users.length >= (data.total - data.users.length)) {
        setMore(false)
      }

    }
  }
  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Seguidores de {profile.name} {profile.surename}</h1>
      </header>

      <UserList users={users}
        getUsers={getUsers}
        following={following}
        setFollowing={setFollowing}
        page={page}
        setPage={setPage}
        more={more}
        loading={loading}
      />
      <br />

    </>
  )
}
