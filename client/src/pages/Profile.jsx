import React, { useState ,  useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase';
import { updateUserStart,updateUserSuccess,updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutStart, signInFailure, signOutFailure, signOutSuccess } from '../redux/user/userSlice.js';
import {Link} from "react-router-dom"

export default function Profile() {
  const fileRef=useRef(null)
  const {currentUser, loading,error}= useSelector((state)=>state.user)
  const [file,setFile]=useState(undefined)
  const [filePerc,setFilePerc]=useState(0)
  const [fileUploadError,setFileUploadError]=useState(false)
  const [formData,setFormData]=useState({})
  const [showListingsError,setShowListingsError]=useState(false)
  const [userListings,setUserListings]=useState([])
  const [updateSuccess,setUpdateSuccess]=useState(false)
  const dispatch=useDispatch()
  //console.log(formData)

  //console.log(file)
  //   firebase storage
  //   allow read;
  //   allow write: if
  //   request.resource.size < 2 * 1024 * 1024 &&
  //   request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if(file){
      handleFileUpload(file)
    }
  }, [file])
  
  const handleFileUpload = (file)=>{
    const storage=getStorage(app)
    const fileName=new Date().getTime()+ file.name
    const storageRef=ref(storage,fileName)
    const uploadTask=uploadBytesResumable(storageRef,file)

    uploadTask.on('state_changed',(snapshot)=>{
      const progress=(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePerc(Math.round(progress))
    },

    (error) => {
      setFileUploadError(true)
    },

    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
          setFormData({...formData, avatar: downloadURL})
      })
    }
    );
  }

  const handleChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value})
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      const res=await fetch(`/api/user/update/${currentUser._id}`,
      {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data=await res.json()
      if(data.success===false){
        dispatch(updateUserFailure(data.message))
        return;
      }

      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
      return;
    }
  }

  const handleDeleteUser=async()=>{
    try {
      dispatch(deleteUserStart())
      const res=await fetch(`/api/user/delete/${currentUser._id}`,
      {
        method:'DELETE',
      });
      const data=await res.json()
      if(data.success ===false){
        dispatch(deleteUserFailure(error.message))
        return;
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut=async()=>{
    try {
      dispatch(signOutStart())
      const res= await fetch('api/auth/signout')
      const data= await res.json()
      if(data.success===false){
        dispatch(signOutFailure(data.message))
        return;
      }
      dispatch(signOutSuccess(data))
    } catch (error) {
      dispatch(signOutFailure(data.message))
    }
  }
  const handleShowListings=async()=>{
    try {
      setShowListingsError(false)
      const res= await fetch(`/api/user/listings/${currentUser._id}`)
      const data=await res.json()
      if(data.success === false){
        setShowListingsError(true)
        return;
      }
      setUserListings(data)
    } catch (error) {
      setShowListingsError(true)
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e)=> setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*'/>
        <img onClick={()=>fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
        <p className='text-sm self-center'>
          {fileUploadError ? (<span className='text-red-700'>Error image upload (image must be less than 2 mb)</span>)  
            : filePerc > 0 && filePerc<100 ?(
              <span className='text-slate-600'>{`Uploading ${filePerc}`}</span>              
            )  
            : filePerc === 100 ? (
              <span className='text-green-600'>Succesfully uploaded!</span> 
            )
            :
            ('')
          }
        </p>
        
        <input type="text" defaultValue={currentUser.username} placeholder='username' id='username' className='border p-3 rounded-lg' onChange={handleChange}/>
        <input type="email" defaultValue={currentUser.email} placeholder='email' id='email' className='border p-3 rounded-lg' onChange={handleChange}/>
        <input type="password" placeholder='Password' id='password' className='border p-3 rounded-lg' onChange={handleChange}/>
        <button disabled={loading} className='bg-blue-900 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80' >{loading? 'Loading...': 'Update'}</button>
        <Link className='bg-green-700 text-white rounded-lg p-3 uppercase text-center hover:opacity-95' to={"/create-listing"}>Create Listing</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-gray-700 cursor-pointer'>Delete account</span>
        <span onClick={handleSignOut} className='text-gray-700 cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? 'User is updated succesfully!' : ''}</p>
      <button onClick={handleShowListings} className='text-green-600 w-full'>Show Listings</button>
      <p className='text-red-700 mt-5'>{showListingsError ? 'Error showing listings':''}</p>
        
        {userListings && userListings.length>0 && 
        <div className='flex flex-col gap-3'>
          <h1 className='text-center mt-7 text-3xl font-semibold'>Your Listings</h1>
            {userListings.map((listing)=>(
                <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
                    <Link to={`/listing/${listing._id}`}>
                        <img src={listing.imageUrls[0]} alt="listing cover" className='w-20 h-20 object-contain'/>
                    </Link>
                    <Link className='flex-1 text-gray-700 font-semibold hover:underline truncate' to={`/listing/${listing._id}`}>
                        <p>{listing.name}</p>
                    </Link>
                    <div className='flex flex-col items-center'>
                      <button className='text-red-600 uppercase'>Delete</button>
                      <button className='text-blue-600 uppercase'>Edit</button>

                    </div>
                </div>

            ))}
          </div>

        }

    </div>
  )
}
