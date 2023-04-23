import React, { useState, useEffect, createContext } from 'react'
import { Global } from '../helpers/Global'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({})
    const [counters, setCounters] = useState({})
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        authUser()
    }, [])

    const authUser = async () => {
        // sacar datos de localstorage
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')

        // comprobar token y user

        if (!token || !user) {
            setLoading(false)
            return false
        }
        // transformar los datos a un obj javascript

        const userObj = JSON.parse(user)
        const userId = userObj.id

        // petición backend que compruebe el token
        // y me devuelva los datos del usuario

        const request = await fetch(Global.url + "user/profile/" + userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token

            }
        })

        // setear estado auth
        const data = await request.json()
        // petición contadores

        const requestCounters = await fetch(Global.url + "user/counters/" + userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token

            }
        })

        // setear estado auth
        const dataCounters = await requestCounters.json()

        setAuth(data.user)
        setCounters(dataCounters)
        setLoading(false)

    }
    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                counters,
                setCounters,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
