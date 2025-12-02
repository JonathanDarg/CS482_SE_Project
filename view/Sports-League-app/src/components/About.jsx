import React from 'react';
import { Users, Trophy, Heart } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export function About() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  const values = [
    {
      icon: Users,
      title: 'Community',
      description: 'Building strong bonds between families and fostering teamwork'
    },
    {
      icon: Trophy,
      title: 'Excellence',
      description: 'Teaching kids to strive for their best on and off the field'
    },
    {
      icon: Heart,
      title: 'Sportsmanship',
      description: 'Instilling respect, integrity, and fair play in every game'
    }
  ];

  const targetMap = {
    Community: 'community-title',
    Excellence: 'excellence-title',
    Sportsmanship: 'sportsmanship-title',
  };

  function scrollToId(id) {
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    const nav = document.querySelector('nav');
    const navHeight = nav ? nav.offsetHeight : 0;
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  function handleCardClick(title) {
    const target = targetMap[title];
    if (!target) return;

    if (location.pathname === '/' || location.pathname === '') {
      scrollToId(target);
    } else {
      window.location.href = `/#${target}`;
    }
  }

  // Determine which image to show based on login state
  const imageUrl = isLoggedIn
    ? '/images/about.png'
    : 'https://images.unsplash.com/photo-1705847470742-80f5140c53a2?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  return (
    <section id="about" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">About Our League</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Orange County Little League has been serving our community for over 30 years, 
            providing a safe and fun environment for children to learn baseball and develop life skills.
          </p>
        </div>

        {/* About + Image */}
        <div className="grid md:grid-cols-2 items-center mb-16 gap-8">
          <div className="flex justify-center">
            <img
              src={imageUrl}
              alt="About"
              className="w-[80%] h-[400px] md:h-[500px] object-cover rounded-lg shadow-lg transition-all duration-700 ease-out"
            />
          </div>
          <div className="text-left">
            <h3 className="text-3xl font-semibold mb-6">Our Mission</h3>
            <p className="text-lg text-gray-700 mb-4">
              We're dedicated to providing quality baseball instruction and competitive play for boys 
              and girls ages 4–12. Our experienced coaches and volunteers work together to create an 
              environment where every child can learn, grow, and have fun.
            </p>
            <p className="text-lg text-gray-700">
              Through organized baseball and softball programs, we promote character development, 
              sportsmanship, and a love for the game that will last a lifetime.
            </p>
          </div>
        </div>

        {/* Values cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick(value.title)}
              onKeyDown={(e) => e.key === 'Enter' && handleCardClick(value.title)}
              className="cursor-pointer text-center p-6 rounded-lg border-2 border-gray-200 hover:border-orange-500 transition-colors flex flex-col items-center justify-start h-[280px]"
            >
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <value.icon className="text-white" size={32} />
              </div>
              <h4 className="text-xl font-medium mb-3">{value.title}</h4>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
