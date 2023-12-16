import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

const ImageSwiper = () => {
  const imageUrls = [
    'https://atriarealestate.com.au/wp-content/uploads/2023/09/Copy-of-10-Companies-That-Hire-for-Remote-Real-Estate-Jobs.jpeg',
    'https://assets.site-static.com/userFiles/2912/image/Blogs_/simultaneous_closings/shutterstock_1449758114-1024x530.jpg',
    "https://assets.agentfire3.com/uploads/sites/121/2023/07/Home-Selling-Costs.jpg"
  ];

  return (
    <Swiper navigation style={{ maxWidth: '1400px', margin: 'auto' }}>
      {imageUrls.map((url, index) => (
        <SwiperSlide key={index}>
          <div className='rounded-xl' style={{ backgroundImage: `url(${url})`, backgroundPosition: 'center', backgroundSize: 'cover', height: '500px' }}></div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageSwiper;
