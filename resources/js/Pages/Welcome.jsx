import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

import { motion } from 'framer-motion';
import AnimatedSlider from '@/Components/AnimatedSlider';


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
          <a href="https://vertexinvo.com"><button className="mt-6 px-6 py-2 bg-black text-white rounded-lg  hover:animate-pulse">Learn More</button></a>
        </SlideInFromLeft>
        <SlideInFromRight className="lg:w-1/2">
          <img src='/images/services/8.jpg' alt="Inventory Management" />
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
      <div className=' py-12'>
        <AnimatedSlider />
      </div>

      <section className='py-12' >
        <div class="py-8 px-8 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div class="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
            <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Designed for business teams like yours</h2>
            <p class="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">Here at Flowbite we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.</p>
          </div>
          <div class="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0 ">
            <div class="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
              <h3 class="mb-4 text-2xl font-semibold">Starter</h3>
              <p class="font-light text-gray-500 sm:text-lg dark:text-gray-400">Best option for personal use & for your next project.</p>
              <div class="flex justify-center items-baseline my-8">
                <span class="mr-2 text-5xl font-extrabold">$29</span>
                <span class="text-gray-500 dark:text-gray-400">/month</span>
              </div>
              <ul role="list" class="mb-8 space-y-4 text-left">
                <li class="flex items-center space-x-3">
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                  <span>Individual configuration</span>
                </li>
                <li class="flex items-center space-x-3">
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                  <span>No setup, or hidden fees</span>
                </li>
                <li class="flex items-center space-x-3">
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                  <span>Team size: <span class="font-semibold">1 developer</span></span>
                </li>
                <li class="flex items-center space-x-3">
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                  <span>Premium support: <span class="font-semibold">6 months</span></span>
                </li>
                <li class="flex items-center space-x-3">
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                  <span>Free updates: <span class="font-semibold">6 months</span></span>
                </li>
              </ul>
              <Link href="https://api.whatsapp.com/send?phone=03353604836" class="mt-6 px-6 py-2 bg-black text-white rounded-lg  hover:animate-pulse">Get started</Link>
            </div>
            <div class="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
              <h3 class="mb-4 text-2xl font-semibold">Company</h3>
              <p class="font-light text-gray-500 sm:text-lg dark:text-gray-400">Relevant for multiple users, extended & premium support.</p>
              <div class="flex justify-center items-baseline my-8">
                <span class="mr-2 text-5xl font-extrabold">$99</span>
                <span class="text-gray-500 dark:text-gray-400">/month</span>
              </div>
              <ul role="list" class="mb-8 space-y-4 text-left">
                <li class="flex items-center space-x-3">
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                  <span>Individual configuration</span>
                </li>
                <li class="flex items-center space-x-3">
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                  <span>No setup, or hidden fees</span>
                </li>
                <li class="flex items-center space-x-3">
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                  <span>Team size: <span class="font-semibold">10 developers</span></span>
                </li>
                <li class="flex items-center space-x-3">
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                  <span>Premium support: <span class="font-semibold">24 months</span></span>
                </li>
                <li class="flex items-center space-x-3">
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                  <span>Free updates: <span class="font-semibold">24 months</span></span>
                </li>
              </ul>
              <Link href="https://wa.me/03353604836" class="mt-6 px-6 py-2 bg-black text-white rounded-lg  hover:animate-pulse">Get started</Link>
            </div>
            <div class="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
              <h3 class="mb-4 text-2xl font-semibold">Enterprise</h3>
              <p class="font-light text-gray-500 sm:text-lg dark:text-gray-400">Best for large scale uses and extended redistribution rights.</p>
              <div class="flex justify-center items-baseline my-8">
                <span class="mr-2 text-5xl font-extrabold">$499</span>
                <span class="text-gray-500 dark:text-gray-400">/month</span>
              </div>
              <ul role="list" class="mb-8 space-y-4 text-left">
                <li class="flex items-center space-x-3">
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                  <span>Individual configuration</span>
                </li>
                <li class="flex items-center space-x-3">
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                  <span>No setup, or hidden fees</span>
                </li>
                <li class="flex items-center space-x-3">
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                  <span>Team size: <span class="font-semibold">100+ developers</span></span>
                </li>
                <li class="flex items-center space-x-3">
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                  <span>Premium support: <span class="font-semibold">36 months</span></span>
                </li>
                <li class="flex items-center space-x-3">
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                  <span>Free updates: <span class="font-semibold">36 months</span></span>
                </li>
              </ul>
              <Link href="https://wa.me/03353604836" class="mt-6 px-6 py-2 bg-black text-white rounded-lg  hover:animate-pulse">Get started</Link>
            </div>
          </div>
        </div>
      </section>
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
