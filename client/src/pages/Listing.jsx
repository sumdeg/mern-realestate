import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle'
import {FaBath, FaBed, FaBroom, FaChair, FaHome, FaLandmark, FaMapMarkedAlt, FaParking, FaRestroom, FaShare} from 'react-icons/fa'
import { current } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import Contact from '../components/Contact'

export default function Listing() {
    SwiperCore.use([Navigation])
    const params=useParams()
    const [listing,setListing]=useState(null)
    const [loading,setLoading]=useState(false)
    const [error, setError] = useState(false)
    const [copied, setCopied] = useState(false)
    const {currentUser}=useSelector(state=>state.user)
    const [contact, setContact] = useState(false)
    useEffect(() => {
      const fetchListing=async()=>{

        try {
            setLoading(true)
            const res=await fetch(`/api/listing/get/${params.listingId}`)
            const data=await res.json()
            if(data.success===false){
                setError(true)
                setLoading(false)

                return;
            }
            setListing(data)
            setLoading(false)
            setError(false)
        } catch (error) {
            setError(true)
            setLoading(false)
        }      
      }
      fetchListing()
    }, [params.listingId])
    
  return (
    <main className=''>
        {loading && <p className='text-center my-8 text-2xl'>Loading...</p>}
        {error && <p className='text-center my-8 text-2xl'>Something went wrong!</p>}
        {listing && !loading && !error &&
           <div>
                <Swiper  navigation style={{ maxWidth: '1000px', margin: 'auto' }}>
                    {listing.imageUrls.map((url)=>(
                        <SwiperSlide key={url}>
                            <div className='h-[650px] rounded-2xl mt-8' style={{background:`url(${url}) center no-repeat`, backgroundSize:'cover'}}></div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                      <FaShare className='text-slate-500' onClick={()=>{navigator.clipboard.writeText(window.location.href)
                        setCopied(true)
                        setTimeout(()=>{
                          setCopied(false)
                        },2000)
                      }}/>

                </div>
                {copied && (<p className='fixed top-[13%] right-[3%] z-10 rounded-md bg-slate-100 p-2'>Link copied!</p>)}
                <div className='flex flex-col max-w-[1000px] mx-auto p-3 my-7 gap-4  rounded-2xl'  style={{ backgroundColor: '#d2ddfe' }}>
                      <p className='text-3xl font-bold'>
                        {listing.name} - {' '}
                        {listing.offer
                            ? listing.discountPrice.toLocaleString('tr-TR', { maximumFractionDigits: 0 }) + ' ₺'
                            : listing.regularPrice.toLocaleString('tr-TR', {  maximumFractionDigits: 0 }) + ' ₺'}
                        {listing.type === 'rent' && ' / aylık'}
                      </p>
                      <p className='flex items-center mt-2 gap-2 text-slate-800 my-2 text-lg'>
                        <FaMapMarkedAlt className='text-green-900 text-3xl'/> {listing.address}
                      </p>
                      <div className='flex gap-4'>
                        <p className='bg-red-900 w-full max-w-[300px] text-white text-center p-2 rounded-md font-medium text-lg'>
                          {listing.type === 'rent' ? 'Kiralık' : 'Satılık'}
                        </p>
                        {
                          listing.offer && (
                            <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>{+listing.regularPrice - +listing.discountPrice} OFF</p>
                          )
                        }
                      </div>
                   <p className='text-slate-800 text-lg font-semibold'> <span className=' text-black uppercase'>Açıklama - {' '}</span> {listing.description}</p>
                   <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                      <li className='flex items-center gap-2 whitespace-nowrap '>
                        <FaBed className='text-3xl'/>  {listing.bedrooms} oda
                      </li>
                      <li className='flex items-center gap-2 whitespace-nowrap '>
                        <FaHome className='text-3xl'/>  {listing.livingRooms} salon
                      </li>
                      <li className='flex items-center gap-1 whitespace-nowrap '>
                        <FaParking className='text-3xl'/> {listing.parking ? 'Park yeri var' : 'Park yeri yok'}
                      </li>
                      <li className='flex items-center gap-1 whitespace-nowrap '>
                        <FaChair className='text-3xl'/> {listing.furnished ? 'Mobilyalı' : 'Mobilyasız'}
                      </li>
                   </ul>
                   {currentUser && listing.userRef !== currentUser._id && !contact && (
                     <button onClick={()=>setContact(true)} className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'>Ev Sahibiyle İletişime Geçin</button>
                   )}
                   {contact && <Contact listing={listing}/> }
                </div>
           </div>
        }
    </main>
  )
}
