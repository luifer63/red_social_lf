import React, { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { Global } from '../../helpers/Global'
import { SerializeForm } from '../../helpers/SerializeForm'

export const Config = () => {

  const [saved, setSaved] = useState('not_saved')
  const { auth, setAuth } = useAuth()

  const updateUser = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token')

    // recoger datos del formulario
    let newDataUser = SerializeForm(e.target)

    // borrar propiedad innecesaria
    delete newDataUser.file0

    // actualizar usuario en bd
    const request = await fetch(Global.url + "user/update", {
      method: "PUT",
      body: JSON.stringify(newDataUser),
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    })
    const data = await request.json()

    if (data.status == 'success' && data.user) {
      delete data.user.password
      setAuth(data.user)
      setSaved('saved')
    } else {
      setSaved('error')
    }
    // subida de imagenes
    const fileInput = document.querySelector('#file')

    if (data.status == "success" && fileInput.files[0]) {
      //Recoger la imagen a subir 
      const formData = new FormData()
      formData.append('file0', fileInput.files[0])

      // peticion ajax para enviar el archivo
      const uploadRequest = await fetch(Global.url + 'user/upload', {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      })

      const uploadData = uploadRequest.json()
      if (uploadData.status == 'success' && uploadData.user) {
        delete uploadData.password
        setAuth(uploadData.user)
        setSaved('saved')
      } else {
        setSaved('error')
      }
    }
  }
  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Ajustes</h1>
      </header>

      {saved == 'saved' ?
        <strong className='alert alert-success'> Usuario Actualizado correctamente !!</strong> : ''}
      {saved == 'error' ?
        <strong className='alert alert-danger'> Usuario no se ha Actualizado !!</strong> : ''}

      <div className="content__posts">
        <form className='register-form' onSubmit={updateUser}>
          <div className='form-group'>
            <label htmlFor='name'>Nombre</label>
            <input type='text' name='name' defaultValue={auth.name} />
          </div>
          <div className='form-group'>
            <label htmlFor='surename'>Apellidos</label>
            <input type='text' name='surename' defaultValue={auth.surename} />
          </div>
          <div className='form-group'>
            <label htmlFor='nick'>Nick</label>
            <input type='text' name='nick' defaultValue={auth.nick} />
          </div>
          <div className='form-group'>
            <label htmlFor='bio'>Biografía</label>
            <textarea name='bio' defaultValue={auth.bio} />
          </div>
          <div className='form-group'>
            <label htmlFor='email'>Correo Electónico</label>
            <input type='text' name='email' defaultValue={auth.email} />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Contraseña</label>
            <input type='password' name='password' />
          </div>
          <div className='form-group'>
            <label htmlFor='file0'>Avatar</label>
            <div className='avatar'>
              <div className="general-info__container-avatar">
                {auth.image != "default.png" && <img src={Global.url + "user/avatar/" + auth.image} className="container-avatar__img" alt="Foto de perfil" />}
                {auth.image == "default.png" && <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />}
              </div>
            </div>
            <br />
            <input type='file' name='file0' id='file' />
          </div>
          <br />
          <input type='submit' value='Actualizar' className='btn btn-success' />

        </form>
        <br />

      </div>
    </>
  )
}
