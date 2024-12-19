import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

import { motion } from 'framer-motion';


const GrowIn = ({ children, className }) => {
  const variants = {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.7 } }
  };

  return (
      <motion.div
          className={className}
          initial="hidden"
          whileInView="visible"
          variants={variants}
          viewport={{ once: true }}
      >
          {children}
      </motion.div>
  );
};

const SlideInFromLeft = ({ children, className }) => {
    const variants = {
        hidden: { opacity: 0, x: -100 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            variants={variants}
            viewport={{ once: true }}
        >
            {children}
        </motion.div>
    );
};

const SlideInFromRight = ({ children, className }) => {
    const variants = {
        hidden: { opacity: 0, x: 100 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            variants={variants}
            viewport={{ once: true }}
        >
            {children}
        </motion.div>
    );
};


const App = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const services = [
    {
      id: 1,
      heading: "Real-Time Stock Updates",
      description: "Monitor your inventory levels in real-time to ensure optimal stock levels and prevent overstocking or shortages.",
      icon: '/images/services/2.png',
    },
    {
      id: 2,
      heading: "Product Analytics",
      description: "Gain insights into your product performance, sales trends, and customer preferences.",
      icon: '/images/services/6.png',
    },
    {
      id: 3,
      heading: "Inventory Management",
      description: "Efficiently manage your inventory, track inventory levels, and optimize your inventory management process.",
      icon: '/images/services/8.jpg',
    },
    {
      id: 4,
      heading: "Invoice Management",
      description: "Create and manage invoices, track payments, and streamline your billing process.",
      icon: '/images/services/5.png',
    },
  ];

  return (
    <div className="font-sans max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center gap-2">
          <img src='/images/logo2.png' alt="Inventory" className="h-8" />
          {/* <h1 className="font-bold text-xl">VertexInvo</h1> */}
        </div>
        <div className="hidden lg:flex items-center gap-6 ">
          <a href="#about" className="text-lg hover:text-gray-500">About</a>
          <a href="#services" className="text-lg hover:text-gray-500">Services</a>
          <Link href={route('login')}><button className="px-4 py-2 border rounded-lg border-black hover:bg-black hover:text-white">Login </button></Link>
                </div>
        <div className="lg:hidden" onClick={toggleMobileMenu}>
          <img src={isMobileMenuOpen ? '/images/close.svg' : '/images/menu.svg'} alt="Menu" />
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-white z-50 flex flex-col items-center justify-center">
          <button onClick={toggleMobileMenu} className="absolute top-4 right-4"><img src='/images/close.svg' alt="Close" /></button>
          <ul className="flex flex-col items-center gap-4 text-lg">
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>      
          </ul>
         <Link href={route('login')}><button className="mt-6 px-4 py-2 border rounded-lg border-black" >Login</button></Link> 
        </div>
      )}
      <div className="flex flex-col lg:flex-row items-center gap-8 py-12">
        <SlideInFromLeft className="lg:w-1/2">
          <h2 className="text-4xl font-bold mb-4">Streamline Your Inventory Management</h2>
          <p className="text-lg">Optimize operations, reduce costs, and improve efficiency with Inventory Pro.</p>
          <a href="#services"><button  className="mt-6 px-6 py-2 bg-black text-white rounded-lg  hover:animate-pulse">Learn More</button></a>
        </SlideInFromLeft>
        <SlideInFromRight className="lg:w-1/2">
          <img  src='/images/services/8.jpg' alt="Inventory Management" />
        </SlideInFromRight>
      </div>
      <div id="services" className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <GrowIn key={service.id}>
              <div className="p-6 border rounded-lg flex gap-4">
                <img src={service.icon} alt={service.heading} className="h-16" />
                <div>
                  <h3 className="font-bold text-xl mb-2">{service.heading}</h3>
                  <p>{service.description}</p>
                </div>
              </div>
            </GrowIn>
          ))}
        </div>
      </div>
      
       <div className='rounded-[40px] md:h-[350px] bg-[#f3f3f3] px-[30px] md:px-[60px] grid grid-cols-1 md:grid-cols-2 mt-[100px]'>
              <div className='py-[60px] w-full'>
                  <h3 className='font-bold text-[30px]'>Let’s make things happen</h3>
                  <p className='text-[18px] mt-4'>Contact us today to learn more about how our digital marketing services can help your business grow and succeed online.</p>
                  <button className='text-[18px] text-white mt-4 rounded-lg bg-black-light px-4 py-2'>Get your free proposal</button>
              </div>
              <div className='mt-[-20px] md:flex hidden ml-6  justify-end'>
                  <img src='/images/bomb.svg' alt="bomb" />
              </div>
          </div>
      <footer className="py-8 text-center border-t">
        <p>&copy; 2024 VetexInvo. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
