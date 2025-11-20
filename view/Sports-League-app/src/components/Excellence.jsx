import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Trophy, Star, Target } from "lucide-react";

export function Excellence() {
  const awards = [
    {
      id: 1,
      title: "Player of the Year",
      description:
        "Awarded annually to the player who demonstrates exceptional skill, dedication, and improvement throughout the season...",
      icon: Trophy,
      color: "from-yellow-400 to-amber-600",
      stats: "1 Winner Per Season",
    },
    {
      id: 2,
      title: "Most Valuable Player",
      description:
        "Presented to the player whose contributions have the greatest impact on their team's success...",
      icon: Star,
      color: "from-orange-600 to-orange-400",
      stats: "3 Winners Per Season",
    },
    {
      id: 3,
      title: "Outstanding Achievement",
      description:
        "Recognizes players who achieve significant milestones or show remarkable growth...",
      icon: Target,
      color: "from-blue-500 to-cyan-600",
      stats: "Multiple Recipients",
    },
  ];

  return (
    <section className="py-20 px-6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
          <div className="text-center mb-16">
          <h2 id="excellence-title" className="text-5xl mb-3 inline-block relative">
            Excellence
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-orange-600 to-orange-400" />
          </h2>
          <p className="text-xl text-gray-600 mt-6 max-w-3xl mx-auto">
            Celebrating outstanding achievement and dedication to the great game of baseball
          </p>
        </div>

        {/* Image Cards */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <Card className="overflow-hidden border-2 border-gray-200 hover:border-orange-400 transition-all group">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1759446334429-bb1f2d1d9f13?auto=format&fit=crop&w=1080&q=80"
                  alt="Championship Trophy"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent transition-all duration-300 group-hover:from-black/90" />
                <div className="absolute bottom-0 p-8 text-white">
                  <Badge className="bg-yellow-500 text-black mb-3">
                    Championship Trophy
                  </Badge>
                  <h4 className="text-3xl mb-2">Season Champions</h4>
                  <p className="text-lg opacity-90">
                    Presented to the division winners who demonstrate consistent excellence, teamwork,
                    and determination throughout the season.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-2 border-gray-200 hover:border-orange-400 transition-all group">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1759688983881-0742f416a4b4?auto=format&fit=crop&w=1080&q=80"
                  alt="Achievement Medals"
                  className="w-full h-[500px] object-cover object-bottom"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent transition-all duration-300 group-hover:from-black/90" />
                <div className="absolute bottom-0 p-8 text-white">
                  <Badge className="bg-orange-500 text-white mb-3">
                    Individual Achievement
                  </Badge>
                  <h4 className="text-3xl mb-2">Personal Excellence</h4>
                  <p className="text-lg opacity-90">
                    Recognition for improvement, dedication, and personal growth throughout the year.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Award Categories */}
        <div className="grid md:grid-cols-3 gap-8">
          {awards.map((award) => {
            const Icon = award.icon;
            return (
              <Card
                key={award.id}
                className="relative overflow-hidden border-2 border-gray-200 hover:border-orange-600/50 shadow-lg hover:shadow-2xl transition-all"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-2 bg-linear-to-r ${award.color}`}
                />
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-linear-to-br ${award.color} flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110`}
                  >
                    <Icon className="text-white" size={32} />
                  </div>
                  <h4 className="text-2xl mb-3">{award.title}</h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">{award.description}</p>
                  <Badge className="border-orange-600 text-orange-600" variant="outline">
                    {award.stats}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Excellence;