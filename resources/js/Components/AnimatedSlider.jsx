import React from 'react';
import { Link } from '@inertiajs/react';

import Slider from 'react-animated-slider';
import 'react-animated-slider/build/vertical.css';

const AnimatedSlider = () => {
    const content = [
        { title: 'Ultricies Vulputate Mollis', description: 'Aenean eu leo quam. Pellentesque ornare sem lacinia nibh, ut fermentum massa justo sit amet risus. Cras justo odio, dapibus ac facilisis.', image: 'https://st5.depositphotos.com/2605379/70923/i/450/depositphotos_709231908-stock-photo-close-wooden-office-desktop-empty.jpg' },
        { title: 'Ultricies Vulputate Mollis', description: 'Aenean eu leo quam. Pellentesque ornare sem lacinia nibh, ut fermentum massa justo sit amet risus. Cras justo odio, dapibus ac facilisis.', image: 'https://static.vecteezy.com/system/resources/thumbnails/048/633/300/small/laptop-mockup-with-coding-books-ly-stacked-on-desk-background-free-photo.jpg' },
        { title: 'Second item', description: 'Lorem ipsum', image: 'https://static.vecteezy.com/system/resources/thumbnails/036/462/774/small/laptop-mockup-book-white-paper-texture-wallpaper-isolated-white-background-photo.jpg' },
        { title: 'Ultricies Vulputate Mollis', description: 'Aenean eu leo quam. Pellentesque ornare sem lacinia nibh, ut fermentum massa justo sit amet risus. Cras justo odio, dapibus ac facilisis.', image: 'https://www.shutterstock.com/image-photo/closeup-view-comfortable-workplace-open-260nw-1561148990.jpg' },
        { title: 'Fourth item', description: 'Lorem ipsum', image: 'https://www.inecta.com/hs-fs/hubfs/undefined-Jun-07-2023-03-43-22-2762-PM.png?width=1580&height=976&name=undefined-Jun-07-2023-03-43-22-2762-PM.png' },
    ];
    return (
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
                            <h1 className="text-black font-bold text-6xl">{item.title}</h1>
                            <p className="text-black text-xl py-2">{item.description}</p>
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


    )
}

export default AnimatedSlider