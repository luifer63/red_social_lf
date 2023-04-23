import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'


export const Logout = () => {

    const {setAuth, setCounters} = useAuth()
    const navigate = useNavigate()


    useEffect(() => {
        // vaciar localstorage
        localStorage.clear()
        // setear estados globales a vacio
        setAuth({})
        setCounters({})

        //Navigate redireccion login       
        
        navigate('/login')
    })
  return (
    <div>Cerrando sesión</div>
  )
}
