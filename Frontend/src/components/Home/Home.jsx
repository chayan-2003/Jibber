import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Zap, Smile, Wifi, Lock, Bell, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Animation variants for the initial logo display
  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: 'easeInOut' } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.6, ease: 'easeInOut' } },
  };

  useEffect(() => {
    // Simulate loading or initial animation time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the duration as needed

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  // Animation variants for the main content
  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeInOut' } },
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeInOut', delay: 0.3 } },
  };

  const featureVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300 } },
    whileHover: { scale: 1.04 },
  };

  const jibberTextVariants = {
    hidden: { opacity: 0, y: -30, rotate: 30 },
    visible: { opacity: 1, y: 0, rotate: 0, transition: { duration: 1.0, ease: 'easeInOut', delay: 0.6 } },
    exit: { opacity: 0, y: 30, rotate: -30, transition: { duration: 0.5, ease: 'easeInOut' } },
  };

  const taglineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeInOut', delay: 0.9 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: 'easeInOut' } },
  };

  // Custom Button Component
  const CustomButton = ({
    children,
    variant,
    size,
    className,
    onClick,
    ...props
  }) => {
    let baseClass =
      'inline-flex items-center justify-center whitespace-nowrap rounded-md font-semibold transition-colors focus:outline-none';
    let sizeClass = '';
    let variantClass = '';

    switch (size) {
      case 'lg':
        sizeClass = 'px-8 py-3 text-lg';
        break;
      case 'sm':
        sizeClass = 'px-4 py-2 text-sm';
        break;
      default:
        sizeClass = 'px-6 py-2.5';
    }

    switch (variant) {
      case 'outline':
        variantClass =
          'border border-purple-500 text-purple-500 hover:bg-purple-500/10 hover:border-purple-400';
        break;
      case 'link':
        variantClass = 'text-gray-400 hover:text-purple-400 pl-0';
        break;
      default:
        variantClass =
          'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md hover:from-blue-600 hover:to-purple-600';
    }

    const combinedClass = `${baseClass} ${sizeClass} ${variantClass} ${className}`;

    return (
      <button className={combinedClass} onClick={onClick} {...props}>
        {children}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loading"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-tr from-gray-900 via-black to-purple-900"
            variants={logoVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="relative"
              variants={{
                hidden: { rotate: 0 },
                visible: { rotate: 360, transition: { duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop' } },
                exit: { rotate: -360, transition: { duration: 3, ease: 'easeInOut' } },
              }}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Smile className="w-24 h-24 text-blue-400 mb-4" />
            </motion.div>
            <motion.h1
              className="text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
              variants={jibberTextVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              Jibber
            </motion.h1>
            <motion.p
              className="text-lg text-gray-400 mt-2"
              variants={taglineVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              Connecting You, Effortlessly
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
      {!loading && (
        <>
          {/* Hero Section with Modern Layout */}
          <header className="py-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-tr from-gray-900 via-black to-purple-900">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate('/')}
                className="text-2xl font-bold text-white focus:outline-none flex items-center gap-2"
              >
                <Smile className='w-6 h-6' />
                Jibber
              </button>
            </div>
          </header>
          <section className="py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-purple-900">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left space-y-6">
                <motion.h1
                  variants={fadeInVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
                >
                  Experience Next-Gen Communication
                </motion.h1>
                <motion.p
                  variants={fadeInUpVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-lg sm:text-xl text-gray-400"
                >
                  Connect, collaborate, and communicate seamlessly with Jibber's intuitive and secure platform.
                  Built for the modern world.
                </motion.p>
                <motion.div
                  variants={fadeInUpVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex justify-center lg:justify-start gap-4"
                >
                  <CustomButton
                    onClick={() => {
                      const userInfo = localStorage.getItem('userInfo');
                      if (userInfo) {
                        navigate('/chat');
                      } else {
                        navigate('/register');
                      }
                    }}
                    size="lg"
                  >
                    Get Started
                  </CustomButton>
                  {!localStorage.getItem('userInfo') && (
                    <CustomButton
                      onClick={() => navigate('/register')}
                      variant="outline"
                      size="lg"
                    >
                      Login
                    </CustomButton>
                  )}
                </motion.div>
              </div>
              <motion.div
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
              >
                <img
                  src="./Home.png"
                  alt="Modern Communication Interface"
                  className="rounded-lg shadow-2xl w-full max-w-5xl mx-auto lg:mx-0"
                />
              </motion.div>
            </div>
          </section>

          {/* Sleek Feature Grid */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
            <div className="max-w-6xl mx-auto text-center space-y-8">
              <h2 className="text-4xl pb-2 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Empowering Communication with Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <motion.div
                  variants={featureVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="bg-gray-900 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <Wifi className="w-10 h-10 text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Seamless Connectivity</h3>
                  <p className="text-gray-400">Stay connected effortlessly across all your devices with real-time synchronization.</p>
                </motion.div>
                <motion.div
                  variants={featureVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, delay: 0.1 }}
                  className="bg-gray-900 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <Lock className="w-10 h-10 text-green-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Enhanced Security</h3>
                  <p className="text-gray-400">Your privacy is our priority with end-to-end encryption and secure data handling.</p>
                </motion.div>
                <motion.div
                  variants={featureVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, delay: 0.2 }}
                  className="bg-gray-900 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <Bell className="w-10 h-10 text-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Smart Notifications</h3>
                  <p className="text-gray-400">Stay informed without being overwhelmed with customizable and intelligent alerts.</p>
                </motion.div>
                <motion.div
                  variants={featureVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, delay: 0.3 }}
                  className="bg-gray-900 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <Users className="w-10 h-10 text-yellow-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Collaborative Spaces</h3>
                  <p className="text-gray-400">Create and join groups for projects, communities, and shared interests.</p>
                </motion.div>
                <motion.div
                  variants={featureVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, delay: 0.4 }}
                  className="bg-gray-900 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <Camera className="w-10 h-10 text-pink-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Rich Media Sharing</h3>
                  <p className="text-gray-400">Share photos, videos, and documents seamlessly within your conversations.</p>
                </motion.div>
                <motion.div
                  variants={featureVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, delay: 0.5 }}
                  className="bg-gray-900 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <Zap className="w-10 h-10 text-cyan-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Blazing Fast Performance</h3>
                  <p className="text-gray-400">Experience smooth and responsive communication with our optimized infrastructure.</p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Modern Testimonials Section (Horizontal Scroll) */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black">
            <div className="max-w-6xl mx-auto space-y-8">
              <h2 className="text-3xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">
                What Our Users Are Saying
              </h2>
              <motion.div className="overflow-x-auto py-6">
                <div className="flex space-x-8 w-max">
                  <div className="bg-gray-900 rounded-lg p-8 w-80 flex-shrink-0 shadow-md">
                    <p className="text-gray-300 italic mb-4">"Jibber has completely transformed how my team collaborates. It's intuitive, fast, and secure!"</p>
                    <h4 className="font-semibold text-white">- Sarah M.</h4>
                    <p className="text-sm text-gray-400">Marketing Lead</p>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-8 w-80 flex-shrink-0 shadow-md">
                    <p className="text-gray-300 italic mb-4">"The group chat feature is fantastic for our community. It's easy to organize discussions and share updates."</p>
                    <h4 className="font-semibold text-white">- John B.</h4>
                    <p className="text-sm text-gray-400">Community Manager</p>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-8 w-80 flex-shrink-0 shadow-md">
                    <p className="text-gray-300 italic mb-4">"I love the sleek design and the peace of mind knowing my conversations are encrypted."</p>
                    <h4 className="font-semibold text-white">- Emily L.</h4>
                    <p className="text-sm text-gray-400">Freelance Designer</p>
                  </div>
                  {/* Add more testimonials here */}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Call to Action with a Different Layout */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
            <div className="max-w-6xl mx-auto rounded-lg bg-gradient-to-l  from-purple-900 via-black to-purple-900 py-12 px-8 md:px-16 shadow-lg flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left space-y-4 mb-6 md:mb-0">
                <h2 className="text-3xl font-semibold text-white">Ready to Experience Jibber?</h2>
                <p className="text-lg text-gray-300">Join thousands of users and discover a better way to connect.</p>
              </div>
              <CustomButton size="md" className="px-12 py-4" onClick={() => navigate('/register')}>
                Sign Up Now
              </CustomButton>
            </div>
          </section>

          {/* Footer (Slightly Modified) */}
          <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
              <div>
                <h4 className="font-semibold text-white mb-4">Jibber</h4>
                <p>A modern messaging platform focused on seamless, secure, and engaging communication.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Explore</h4>
                <ul className="space-y-2">
                  <li><CustomButton variant="link" onClick={() => console.log('Navigate to Features')}>Features</CustomButton></li>
                  <li><CustomButton variant="link" onClick={() => console.log('Navigate to Pricing')}>Pricing</CustomButton></li>
                  <li><CustomButton variant="link" onClick={() => console.log('Navigate to Blog')}>Blog</CustomButton></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Support</h4>
                <ul className="space-y-2">
                  <li><CustomButton variant="link" onClick={() => console.log('Navigate to FAQ')}>FAQ</CustomButton></li>
                  <li><CustomButton variant="link" onClick={() => console.log('Navigate to Contact')}>Contact Us</CustomButton></li>
                  <li><CustomButton variant="link" onClick={() => console.log('Navigate to Help Center')}>Help Center</CustomButton></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><CustomButton variant="link" onClick={() => console.log('Navigate to Terms')}>Terms of Service</CustomButton></li>
                  <li><CustomButton variant="link" onClick={() => console.log('Navigate to Privacy')}>Privacy Policy</CustomButton></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 text-center border-t border-gray-800 pt-6">
              <p className="text-xs">
                &copy; {new Date().getFullYear()} Jibber. All rights reserved.
              </p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default HeroSection;