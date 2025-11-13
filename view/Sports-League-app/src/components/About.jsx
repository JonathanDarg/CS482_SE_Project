import { Users, Trophy, Heart } from 'lucide-react';

export function About() {
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

  return (
    <section id="about" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4">About Our League</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Orange County Little League has been serving our community for over 30 years, 
            providing a safe and fun environment for children to learn baseball and develop life skills.
          </p>
        </div>

        {/* About + Image */}
        <div className="grid md:grid-cols-2 items-center mb-16">
          <div className="flex justify-center">
            <img
              src="/images/about.png"
              alt="Youth baseball team"
              className="w-[80%] h-[400px] object-cover rounded-lg"
            />
          </div>
          <div className="text-left">
            <h3 className="text-3xl mb-6">Our Mission</h3>
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
              className="text-center p-6 rounded-lg border-2 border-gray-200 hover:border-orange-500 transition-colors flex flex-col items-center justify-start h-[280px]"
            >
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <value.icon className="text-white" size={32} />
              </div>
              <h4 className="text-xl mb-3">{value.title}</h4>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
