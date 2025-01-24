import React from 'react';
import { Link } from '@inertiajs/react';

import Slider from 'react-animated-slider';
import 'react-animated-slider/build/vertical.css';

const AnimatedSlider = () => {
    const content = [
        { title: 'Real-Time Inventory Tracking', description: 'Stay updated with real-time visibility into your inventory levels across multiple locations. Track stock movements, minimize discrepancies, and ensure you never run out of critical items.', image: 'https://st5.depositphotos.com/2605379/70923/i/450/depositphotos_709231908-stock-photo-close-wooden-office-desktop-empty.jpg' },
        { title: 'Automated Stock Replenishment', description: 'Streamline your operations with automated stock replenishment. Set reorder points and receive alerts when inventory levels fall below thresholds, reducing the risk of overstocking or stockouts.', image: 'https://static.vecteezy.com/system/resources/thumbnails/048/633/300/small/laptop-mockup-with-coding-books-ly-stacked-on-desk-background-free-photo.jpg' },
        { title: 'Comprehensive Reporting & Insights', description: 'Make data-driven decisions with detailed reports on inventory usage, turnover rates, and demand patterns. Gain valuable insights to optimize your inventory and improve overall efficiency.', image: 'https://static.vecteezy.com/system/resources/thumbnails/036/462/774/small/laptop-mockup-book-white-paper-texture-wallpaper-isolated-white-background-photo.jpg' },
        { title: 'Seamless Integration & Scalability', description: 'Easily integrate with your existing systems like ERP, POS, and e-commerce platforms. Our inventory management system grows with your business, adapting to changing needs and expanding seamlessly.', image: 'https://www.shutterstock.com/image-photo/closeup-view-comfortable-workplace-open-260nw-1561148990.jpg' },
        
    ];
    return (
       
        <div class="bg-gradient-to-t rounded-xl from-gray-900">

        <div className="flex justify-center items-center h-full rounded-xl overflow-hidden">
            <Slider direction="vertical" autoplay={true}>
                {content.map((item, index) => (
                    <div
                        key={index}
                        className="flex justify-center items-center h-full relative"
                    >
                        <div
                            className="absolute inset-0 "
                            style={{
                                background: `url('${item.image}') no-repeat center center`,
                                backgroundSize: 'cover',
                                opacity: 0.7, 
                            }}
                        ></div>

                        <div className="text-center relative z-10">
                            <h1 className="text-white font-bold text-7xl">{item.title}</h1>
                            <p className="text-white text-xl py-2">{item.description}</p>
                            <Link
                                href="#"
                                className="mt-6 px-6 py-2 bg-black text-white rounded-lg hover:animate-pulse"
                            >
                                learn more
                            </Link>
                        </div>
                    </div>
            

                ))}
                 
            </Slider>
            </div>

        </div>


    )
}

export default AnimatedSlider