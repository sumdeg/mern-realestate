import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {Swiper,SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
import ListingItem from '../components/ListingItem'
import ImageSwiper from '../components/ImageSwiper'


export default function Home() {
  const [offerListings,setOfferListings]=useState([])
  const [saleListings, setSaleListings] = useState([])
  const [rentListings, setRentListings] = useState([])
  SwiperCore.use([Navigation])
  useEffect(()=>{
    const fetchOfferListings=async()=>{
      try {
        const res= await fetch('/api/listing/get?offer=true&limit=4')
        const data=await res.json()
        setOfferListings(data)
        fetchRentListings()
      } catch (error) {
        console.log(error)
      }
    }
    const fetchRentListings=async()=>{
      try {
        const res= await fetch('/api/listing/get?type=rent&limit=4')
        const data=await res.json()
        setRentListings(data)
        fetchSaleListings()
      } catch (error) {
        console.log(error)
      }
    }
    const fetchSaleListings=async()=>{
      try {
        const res= await fetch('/api/listing/get?type=sale&limit=4')
        const data=await res.json()
        setSaleListings(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchOfferListings();
  },[])
  
  return (
    <div className=''>
        <div className='flex flex-col gap-6 pt-28 px-3 max-w-6xl mx-auto'>
          <h1 className='text-blue-600 font-bold text-3xl lg:text-6xl'><span className='text-slate-700'>SunEstate</span><br/>Emlakta güvenilir tercih...</h1>
          <div className='text-gray-500 text-md sm:text-md'>
            SunEstate, mükemmel mülklerinizi bulmak için doğru adres. 
            <br />
            Profesyonel yaklaşımımız ve geniş portföyümüzle size en uygun olanı sunuyoruz.
          </div>        
        </div>
        <div className='max-w-6xl px-3 mx-auto mb-28 mt-6'>
          <Link to={"/search"} className='text-xl font-bold inline-block px-4 py-2 bg-red-700 text-white rounded-md hover:bg-gray-600'>Daha Fazla Bilgi</Link>         
        </div>

          <ImageSwiper/>
        <div className='max-w-8xl mx-auto p-3 flex flex-col gap-8 my-8 items-center'>
            

              {rentListings && rentListings.length >0 && (
                <div className=''>
                    <div className='my-3'>
                      <h2 className='text-3xl font-bold text-red-700 hover:text-blue-800  '>Kiralık Yerler</h2>
                      <Link className='text-md text-gray-600 hover:text-blue-800' to={'/search?type=rent'}>Daha fazla kiralık yer göster</Link>
                    </div>
                    <div className='flex flex-wrap gap-4'>
                      {rentListings.map((listing)=>(
                        <ListingItem listing={listing} key={listing._id}/>
                      ))}
                    </div>
                </div>
              )}

              {saleListings && saleListings.length >0 && (
                <div className=''>
                    <div className='my-3'>
                      <h2 className='text-3xl font-bold text-red-700 hover:text-blue-800 '>Satılık Yerler</h2>
                      <Link className='text-sm text-gray-600 hover:text-blue-800' to={'/search?type=sale'}>Daha fazla satılık yer göster</Link>
                    </div>
                    <div className='flex flex-wrap gap-4'>
                      {saleListings.map((listing)=>(
                        <ListingItem listing={listing} key={listing._id}/>
                      ))}
                    </div>
                </div>
              )}

              {offerListings && offerListings.length >0 && (
                <div className=''>
                    <div className='my-3'>
                      <h2 className='text-3xl font-bold text-slate-600'>Son Verilen Teklifler</h2>
                      <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Daha fazla teklif göster</Link>
                    </div>
                    <div className='flex flex-wrap gap-4'>
                      {offerListings.map((listing)=>(
                        <ListingItem listing={listing} key={listing._id}/>
                      ))}
                    </div>
                </div>
              )}
        </div>
    </div>
  )
}
