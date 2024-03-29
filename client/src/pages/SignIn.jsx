import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess , signInFailure } from '../redux/user/userSlice.js'
import OAuth from '../components/OAuth.jsx'

export default function SignIn() {
  const [formData,setFormData]=useState({})
  const {loading, error} = useSelector((state)=>state.user)
  const navigate= useNavigate()
  const dispatch=useDispatch()

  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value,

    })
  }

  const handleSubmit=async (e)=>{
    e.preventDefault();
    try {
    dispatch(signInStart())
    const res=await fetch('/api/auth/signin',
    {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formData)
      })
      const data=await res.json();
      if(data.success === false){
        dispatch(signInFailure(data.message))
        return;
      }
      dispatch(signInSuccess(data))
      navigate('/')
     // console.log(data);
    } catch (error) {
      dispatch(signInFailure(data.message))
    }
    
  }
 // console.log(formData)
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-4xl text-center font-bold my-10  text-gray-700'>Giriş Yap</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="email" placeholder='Email' className='border p-4 rounded-lg' id='email' onChange={handleChange} />
        <input type="password" placeholder='Password' className='border p-4 rounded-lg' id='password' onChange={handleChange}/>
        <button disabled={loading} className='bg-blue-500 text-white p-4 rounded-lg uppercase hover:opacity-95 disabled:opancity-80'>{loading ? 'Yükleniyor...':'Giriş Yap'}</button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
          <p>Hesabınız yok mu?</p>
          <Link to={"/sign-up"}>
            <span className='text-blue-700'>Kayıt Ol</span>
          </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
