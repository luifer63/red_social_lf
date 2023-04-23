import React, { useState } from 'react'
import { Global } from '../../helpers/Global'
import { useForm } from '../../hooks/useForm'
import useAuth from '../../hooks/useAuth'


export const Login = () => {

    const {form, changed} = useForm({})
    const [saved, setSaved] = useState('not_sent')
    const {setAuth} = useAuth()

    const loginUser = async(e) => {
        e.preventDefault()
        
        // datos del formulario
        let userToLogin = form

        //peticion al backend
        const request = await fetch(Global.url + "user/login", {
            method: "POST",
            body: JSON.stringify(userToLogin),
            headers: {
                "Content-Type": "application/json"
            }
        })

        // persisitir los datos en el navegador
        const data = await request.json()
        if(data.status == 'success'){
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
            setSaved('login')
            // set datos auth
            setAuth(data.user)
            //redireccion
            setTimeout(() =>{
                window.location.reload()
            },1000)
        }else {
            setSaved('error')
        }
    }
    return (
        <>
            <header className="content__header content__header--public">
                <h1 className="content__title">Login</h1>
            </header>
            <div className="content__posts">
            {saved == 'login' ?
            <strong className='alert alert-success'> Usuario logueado correctamente !!</strong>: ''}
            {saved == 'error' ?
                <strong className='alert alert-danger'> Usuario no se ha logueado !!</strong> : ''}
                <form className='form-login' onSubmit={loginUser}>
                    <div className='form-group'>
                        <label htmlFor='email'>Correo Electónico</label>
                        <input type='text' name='email' onChange={changed} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='password'>Contraseña</label>
                        <input type='password' name='password' onChange={changed} />
                    </div>
                    <input type='submit' value='Inicio Sesión' className='btn btn-success' />

                </form>

            </div>
        </>
    )
}
