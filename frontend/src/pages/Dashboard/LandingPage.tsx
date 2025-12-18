import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HokagePathLanding = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
    
   const navigate = useNavigate();
   function login(){
     navigate('/login')
   }

  const features = [
    {
      icon: '💪',
      title: 'Personalized Workouts',
      description: 'AI-powered training plans that adapt to your progress and push you beyond your limits.',
      gradient: 'from-orange-400 to-red-500'
    },
    {
      icon: '🍜',
      title: 'Nutrition Mastery',
      description: 'Track macros, plan meals, and fuel your body like a true warrior with precision nutrition.',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      icon: '⚡',
      title: 'Community Power',
      description: 'Join a tribe of dedicated fitness enthusiasts. Train together, grow together, win together.',
      gradient: 'from-orange-500 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-red-600 to-yellow-500 opacity-80" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-6 md:px-12">
        <div 
          className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {/* Animated Badge */}
          <div className="inline-block mb-6 px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full border border-white border-opacity-30">
            <span className="text-white text-sm font-semibold tracking-wider">
              🔥 YOUR JOURNEY AWAITS
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
            <span className="inline-block hover:scale-110 transition-transform duration-300">
              HOKAGE
            </span>
            <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-white bg-clip-text text-transparent animate-pulse">
              PATH
            </span>
          </h1>
          
          <p className="text-xl md:text-3xl text-white mb-4 font-light max-w-3xl mx-auto leading-relaxed">
            Transform your body. Master your mind.
          </p>
          <p className="text-lg md:text-xl text-orange-100 mb-12 max-w-2xl mx-auto">
            The ultimate fitness and nutrition platform for warriors who refuse to settle.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group relative px-8 py-4 bg-white text-orange-600 rounded-full font-bold text-lg shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 overflow-hidden">
              <span className="relative z-10">Start Your Journey</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity">Start Your Journey</span>
            </button>
            
            
            <button className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-full font-bold text-lg hover:bg-white hover:text-orange-600 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            onClick={login}
            >
              Login
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: '10K+', label: 'Active Warriors' },
            { number: '50K+', label: 'Workouts Completed' },
            { number: '1M+', label: 'Meals Tracked' },
            { number: '98%', label: 'Success Rate' }
          ].map((stat, i) => (
            <div 
              key={i}
              className="text-center transform hover:scale-110 transition-transform duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="text-4xl md:text-5xl font-black text-white mb-2">
                {stat.number}
              </div>
              <div className="text-orange-200 font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Unleash Your Potential
            </h2>
            <p className="text-xl text-orange-200 max-w-2xl mx-auto">
              Everything you need to dominate your fitness journey
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group relative bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="text-6xl mb-6 transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-orange-100 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white to-transparent opacity-10 rounded-bl-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white border-opacity-20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-orange-200 mb-4">
            © 2024 HokagePath. Forge your destiny.
          </p>
          <div className="flex justify-center gap-6 text-white">
            <a href="#" className="hover:text-orange-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-orange-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-orange-300 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HokagePathLanding;