import { useState, useEffect } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { route } from '../../../vendor/tightenco/ziggy';
import Footer from '../Components/Footer.jsx';

// Import your images from the assets folder
import loginImg1 from '../Assets/loginimg1.jpg';
import loginImg2 from '../Assets/loginimg2.jpg';
import loginImg3 from '../Assets/loginimg3.jpg';

const slides = [
  {
    image: loginImg1,
    title: "Build Your Vision,\nDefine Your Space.",
    description: "Secure, high-performance access to your custom hardware components inventory and resource tracking dashboard."
  },
  {
    image: loginImg2,
    title: "Next-Gen Hardware\nat Your Fingertips.",
    description: "Manage high-end GPUs, processors, and custom cooling loops with ultimate precision and real-time stock updates."
  },
  {
    image: loginImg3,
    title: "Streamlined Inventory\n& Component Management.",
    description: "Keep track of all your custom PC builds, stock levels, and supply chains seamlessly in one centralized platform."
  }
];

export default function Login({ status, canResetPassword }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatically cycle through the slider images every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Use Laravel Inertia's useForm hook to manage inputs, processing state, and backend errors
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Submits data using Ziggy's named route helper
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0f] p-4 md:p-8 text-white relative overflow-hidden selection:bg-purple-600 selection:text-white">
      
      {/* Immersive Ambient Background Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Container Card */}
      <div className="w-full max-w-5xl bg-[#161619] rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col md:flex-row overflow-hidden border border-neutral-800/80 relative z-10 backdrop-blur-xl">
        
        {/* Left Visual Panel with Slider Images */}
        <div className="hidden md:flex md:w-1/2 relative p-12 flex-col justify-between overflow-hidden border-r border-neutral-800/60">
          
          {/* Background Image Carousel Layer */}
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              } transition-transform duration-[8000ms]`}
            >
              <img
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Dynamic Deep Dark Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e11] via-[#121216]/80 to-[#121216]/60 backdrop-blur-[1px]"></div>
            </div>
          ))}

          {/* Top Branding Logo */}
          <div className="relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-3.5 h-3.5 bg-gradient-to-tr from-purple-600 to-indigo-500 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.6)]"></div>
              <span className="text-xl font-black tracking-widest text-neutral-100">APEX</span>
            </div>
          </div>

          {/* Bottom Dynamic Slider Text Content & Indicators */}
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-purple-500/10 text-purple-300 text-xs font-semibold rounded-full border border-purple-500/20 backdrop-blur-md shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
              <span>Enterprise Component Hub</span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white whitespace-pre-line drop-shadow-md">
              {slides[currentSlide].title}
            </h2>
            
            <p className="text-neutral-300 text-sm leading-relaxed max-w-md">
              {slides[currentSlide].description}
            </p>

            {/* Interactive Slider Indicator Bars */}
            <div className="flex items-center space-x-2 pt-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === currentSlide ? 'w-10 bg-gradient-to-r from-purple-500 to-indigo-500 shadow-md shadow-purple-500/30' : 'w-3 bg-neutral-700 hover:bg-neutral-600'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 md:p-14 flex flex-col justify-center bg-[#161619]">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h1>
            <p className="text-sm text-neutral-400">
              New to Apex?{' '}
              <Link href={route('register')} className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                Create an account
              </Link>
            </p>
          </div>

          {/* Status Message (e.g. Password reset notification) */}
          {status && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl font-medium">
              {status}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1.5" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="name@apex.com"
                required
                autoComplete="username"
                className="w-full px-4 py-3 bg-[#0f0f12] border border-neutral-800 rounded-xl text-white text-sm focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition-all placeholder:text-neutral-600 shadow-inner"
              />
              {errors.email && (
                <div className="mt-1.5 text-rose-400 text-xs font-medium">{errors.email}</div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400" htmlFor="password">
                  Password
                </label>
                {canResetPassword && (
                  <Link href={route('password.request')} className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors">
                    Forgot password?
                  </Link>
                )}
              </div>
              <input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-[#0f0f12] border border-neutral-800 rounded-xl text-white text-sm focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition-all placeholder:text-neutral-600 shadow-inner"
              />
              {errors.password && (
                <div className="mt-1.5 text-rose-400 text-xs font-medium">{errors.password}</div>
              )}
            </div>

            <div className="flex items-center pt-1">
              <input 
                id="remember" 
                type="checkbox" 
                checked={data.remember}
                onChange={(e) => setData('remember', e.target.checked)}
                className="h-4 w-4 rounded border-neutral-700 bg-[#0f0f12] text-purple-600 focus:ring-purple-600 focus:ring-offset-[#161619] cursor-pointer" 
              />
              <label htmlFor="remember" className="ml-2.5 text-xs text-neutral-400 cursor-pointer select-none">
                Remember me on this device
              </label>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full mt-2 flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-purple-600 via-purple-600 to-indigo-600 text-white font-semibold text-sm rounded-xl hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#161619] transition-all duration-200 shadow-xl shadow-purple-900/30 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {processing ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                'Log In'
              )}
            </button>
          </form>
        </div>

      </div>
      </div>
      <Footer />
    </>
  );
}