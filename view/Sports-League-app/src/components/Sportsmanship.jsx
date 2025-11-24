import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Heart, HandshakeIcon, Award, Users, Shield, Smile, Sparkles } from 'lucide-react';

export function Sportsmanship() {
  const coreValues = [
    {
      title: 'Respect',
      description: 'Treating teammates, opponents, coaches, and umpires with dignity and courtesy at all times',
      icon: HandshakeIcon,
      color: 'from-blue-500 to-blue-600',
      examples: [
        'Shaking hands before and after every game',
        'Listening to coaches and officials',
        'Supporting all players on the field'
      ]
    },
    {
      title: 'Integrity',
      description: 'Playing fair and honest, following the rules even when no one is watching',
      icon: Shield,
      color: 'from-green-500 to-emerald-600',
      examples: [
        'Being honest about calls and plays',
        'Following game rules and league policies',
        'Taking responsibility for mistakes'
      ]
    },
    {
      title: 'Team Spirit',
      description: 'Supporting each other, celebrating together, and learning from every experience',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      examples: [
        'Encouraging teammates during tough moments',
        'Celebrating others\' successes',
        'Working together toward common goals'
      ]
    },
    {
      title: 'Positive Attitude',
      description: 'Maintaining enthusiasm and optimism whether winning or losing',
      icon: Smile,
      color: 'from-yellow-500 to-amber-600',
      examples: [
        'Staying positive during challenges',
        'Learning from losses and setbacks',
        'Being a good sport in victory and defeat'
      ]
    }
  ];

  return (
    <section className="py-20 px-6 bg-linear-to-b from-white via-gray-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 id="sportsmanship-title" className="text-5xl mb-3 inline-block relative">
            Sportsmanship
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-orange-500 to-orange-600"></div>
          </h2>
          <p className="text-xl text-gray-600 mt-6 max-w-3xl mx-auto">
            Building character, integrity, and lifelong values through the great game of baseball
          </p>
        </div>

        {/* Hero Image Section */}
        <div className="grid lg:grid-cols-5 gap-8 mb-16">
          <div className="lg:col-span-3">
            <Card className="overflow-hidden border-4 border-orange-100/30 hover:border-orange-400 shadow-2xl h-full group transition-all">
              <CardContent className="p-0 h-full">
                <div className="relative h-full min-h-[500px]">
                  <img
                    src="/images/community/respect.jpeg"
                    alt="Good Sportsmanship"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent transition-all duration-300 group-hover:from-black/95"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <HandshakeIcon size={24} />
                      </div>
                      <Badge className="bg-white/20 backdrop-blur-sm text-white border-0">
                        Good Sportsmanship
                      </Badge>
                    </div>
                    <h3 className="text-4xl mb-3">Respect for the Game</h3>
                    <p className="text-xl opacity-90 leading-relaxed">
                      True champions understand that how we play is just as important as the outcome. 
                      We honor the game, our opponents, and ourselves through respect and fair play.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Images */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border-2 border-gray-200 hover:border-orange-400 shadow-xl hover:shadow-2xl transition-all group">
              <CardContent className="p-0">
                <div className="relative h-[156px]">
                  <img
                    src="/images/community/unity.webp"
                    alt="Team Unity"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent transition-all duration-300 group-hover:from-black/90"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h4 className="text-xl mb-1">Unity & Support</h4>
                    <p className="text-sm opacity-90">We win together, we lose together</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-2 border-gray-200 hover:border-orange-400 shadow-xl hover:shadow-2xl transition-all group">
              <CardContent className="p-0">
                <div className="relative h-[156px]">
                  <img
                    src="/images/community/coach.jpg"
                    alt="Learning & Growth"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent transition-all duration-300 group-hover:from-black/90"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h4 className="text-xl mb-1">Mentorship</h4>
                    <p className="text-sm opacity-90">Coaches guiding the next generation</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-2 border-gray-200 hover:border-orange-400 shadow-xl hover:shadow-2xl transition-all group">
              <CardContent className="p-0">
                <div className="relative h-[156px]">
                  <img
                    src="/images/community/happy2.jpeg"
                    alt="Positive Energy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent transition-all duration-300 group-hover:from-black/90"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h4 className="text-xl mb-1">Positive Energy</h4>
                    <p className="text-sm opacity-90">Enthusiasm that inspires everyone</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {coreValues.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card 
                key={index}
                className="border-2 border-gray-200 hover:border-orange-400 shadow-lg group overflow-hidden"
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${value.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="text-white" size={32} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl mb-2">{value.title}</h3>
                      <p className="text-gray-600 text-lg leading-relaxed">{value.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm uppercase tracking-wide text-gray-500">In Practice:</p>
                    {value.examples.map((example, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        </div>
                        <p className="text-gray-700">{example}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Sportsmanship Award */}
        <Card className="bg-linear-to-br from-orange-500 via-orange-600 to-orange-500 text-white shadow-2xl border-0 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `repeating-linear-linear(45deg, transparent, transparent 20px, rgba(255,255,255,.1) 20px, rgba(255,255,255,.1) 40px)`
            }}></div>
          </div>
          
          <CardContent className="p-16 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Award size={48} className="text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="text-yellow-300" size={28} />
                  </div>
                </div>
              </div>

              <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 mb-4 px-6 py-2">
                Our Most Prestigious Honor
              </Badge>
              <h3 className="text-5xl mb-6">Sportsmanship Award</h3>
              <p className="text-2xl opacity-95 leading-relaxed mb-8">
                This special recognition is presented to the player who best embodies the spirit of fair play, 
                respect, and positive attitude throughout the season.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <Heart className="mx-auto mb-3" size={32} />
                  <h4 className="text-xl mb-2">Uplifts Teammates</h4>
                  <p className="text-sm opacity-90">Encourages and supports others</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <HandshakeIcon className="mx-auto mb-3" size={32} />
                  <h4 className="text-xl mb-2">Respects Opponents</h4>
                  <p className="text-sm opacity-90">Shows grace in victory and defeat</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <Sparkles className="mx-auto mb-3" size={32} />
                  <h4 className="text-xl mb-2">Leads by Example</h4>
                  <p className="text-sm opacity-90">Inspires others through actions</p>
                </div>
              </div>

              <Badge className="bg-white text-orange-500 mt-8 px-8 py-3 text-lg">
                Chosen by Coaches & Peers
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
export default Sportsmanship;