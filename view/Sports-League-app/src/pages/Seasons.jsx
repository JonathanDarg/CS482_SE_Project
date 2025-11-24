import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/Scroll-area';
import { Calendar, Hourglass, Trophy } from 'lucide-react';

export function Seasons() {
  const seasons = [
    {
      year: '2026',
      status: 'current',
      games: [
        { id: 1, date: 'Nov 20, 2025', homeTeam: 'Tigers', awayTeam: 'Lions', homeScore: 5, awayScore: 3, division: 'Major League', field: 'Field A', status: 'upcoming' },
        { id: 2, date: 'Nov 18, 2025', homeTeam: 'Eagles', awayTeam: 'Hawks', homeScore: 7, awayScore: 4, division: 'Major League', field: 'Field B', status: 'completed' },
        { id: 3, date: 'Nov 16, 2025', homeTeam: 'Bears', awayTeam: 'Wolves', homeScore: 2, awayScore: 8, division: 'Minor League', field: 'Field A', status: 'completed' },
        { id: 4, date: 'Nov 15, 2025', homeTeam: 'Sharks', awayTeam: 'Panthers', homeScore: 6, awayScore: 6, division: 'Minor League', field: 'Field C', status: 'completed' },
        { id: 5, date: 'Nov 13, 2025', homeTeam: 'Knights', awayTeam: 'Dragons', homeScore: 9, awayScore: 5, division: 'Junior League', field: 'Field B', status: 'completed' },
        { id: 6, date: 'Nov 11, 2025', homeTeam: 'Rockets', awayTeam: 'Comets', homeScore: 3, awayScore: 7, division: 'Junior League', field: 'Field A', status: 'completed' },
        { id: 7, date: 'Nov 22, 2025', homeTeam: 'Lions', awayTeam: 'Bears', homeScore: 0, awayScore: 0, division: 'Major League', field: 'Field C', status: 'upcoming' },
        { id: 8, date: 'Nov 23, 2025', homeTeam: 'Hawks', awayTeam: 'Tigers', homeScore: 0, awayScore: 0, division: 'Major League', field: 'Field A', status: 'upcoming' },
      ]
    },
    {
      year: '2025',
      status: 'past',
      games: [
        { id: 9, date: 'Oct 28, 2025', homeTeam: 'Tigers', awayTeam: 'Eagles', homeScore: 8, awayScore: 6, division: 'Major League', field: 'Field A', status: 'completed' },
        { id: 10, date: 'Oct 25, 2025', homeTeam: 'Lions', awayTeam: 'Hawks', homeScore: 4, awayScore: 9, division: 'Major League', field: 'Field B', status: 'completed' },
        { id: 11, date: 'Oct 22, 2025', homeTeam: 'Bears', awayTeam: 'Sharks', homeScore: 5, awayScore: 3, division: 'Minor League', field: 'Field C', status: 'completed' },
        { id: 12, date: 'Oct 20, 2025', homeTeam: 'Wolves', awayTeam: 'Panthers', homeScore: 7, awayScore: 7, division: 'Minor League', field: 'Field A', status: 'completed' },
        { id: 13, date: 'Oct 18, 2025', homeTeam: 'Knights', awayTeam: 'Rockets', homeScore: 11, awayScore: 4, division: 'Junior League', field: 'Field B', status: 'completed' },
        { id: 14, date: 'Oct 15, 2025', homeTeam: 'Dragons', awayTeam: 'Comets', homeScore: 6, awayScore: 8, division: 'Junior League', field: 'Field C', status: 'completed' },
      ]
    }
  ];

  // Sort newest to oldest
  seasons.forEach(season => {
    season.games.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  const [selectedSeason, setSelectedSeason] = useState('2026');

  const currentSeasonData = seasons.find(s => s.year === selectedSeason);
  const games = currentSeasonData?.games || [];

  const getGameResult = (game) => {
    if (game.status === 'upcoming') return null;
    if (game.homeScore > game.awayScore) return 'home';
    if (game.awayScore > game.homeScore) return 'away';
    return 'tie';
  };

  const TEAM_LOGOS = {
    Lions: "/images/logos/lion.jpg",
    Tigers: "/images/logos/tiger.jpg",
    Cobras: "/images/logos/cobra.jpg",
    Eagles: "/images/logos/eagle.jpg",
    Wolves: "/images/logos/wolves.jpg",
    Sharks: "/images/logos/shark.jpg",
    Panthers: "/images/logos/panther.jpg",
    Dragons: "/images/logos/dragon.png",
    Rockets: "/images/logos/rockets.jpg",
    Comets: "/images/logos/comets.jpg",
    Knights: "/images/logos/knights.jpg",
    Bears: "/images/logos/bears.png",
    Hawks: "/images/logos/hawks.png"
  };

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4">Season History</h2>
          <p className="text-xl text-gray-600">Browse games from current and past seasons</p>
        </div>

        {/* Seasons Selector */}
        <div className="mb-8">
          <ScrollArea className="w-full whitespace-nowrap rounded-lg border-2 border-gray-200 bg-gray-50 p-2">
            <div className="flex gap-2 pb-2">
              {seasons.map((season) => (
                <button
                  key={season.year}
                  onClick={() => setSelectedSeason(season.year)}
                  className={`
                    inline-flex items-center gap-3 px-8 py-4 rounded-lg transition-all
                    ${selectedSeason === season.year
                      ? 'bg-linear-to-r from-orange-600 to-orange-400 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                    }
                  `}
                >
                  <Calendar size={20} />
                  <div className="text-left">
                    <div className="text-2xl">{season.year}</div>
                    <div className={`text-sm ${selectedSeason === season.year ? 'opacity-90' : 'text-gray-500'}`}>
                      {season.status === 'current' ? 'Current Season' : `${season.games.length} Games`}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Game List */}
        <div className="space-y-4">
          {games.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-xl text-gray-400">No games found for this season</p>
            </Card>
          ) : (
            games.map((game) => {
              const result = getGameResult(game);

              let middleDisplay;
              if (game.status === 'upcoming') {
                middleDisplay = <span className="text-gray-400 text-3xl">:</span>;
              } else if (result === 'tie') {
                middleDisplay = <span className="text-gray-400 text-2xl">-</span>;
              } else if (result === 'away') {
                middleDisplay = (
                  <span className="flex items-center space-x-1">
                    <span className="text-orange-600 text-3xl">⮜</span>
                    <span className="text-black font-semibold text-lg">FINAL</span>
                  </span>
                );
              } else if (result === 'home') {
                middleDisplay = (
                  <span className="flex items-center space-x-1">
                    <span className="text-black font-semibold text-lg">FINAL</span>
                    <span className="text-orange-600 text-3xl">⮞</span>
                  </span>
                );
              }

              return (
                <Card
                  key={game.id}
                  className={`overflow-hidden transition-all hover:shadow-lg ${
                    game.status === 'upcoming' ? 'border-2 border-orange-600' : ''
                  }`}
                >
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-[200px_1fr_200px] items-center">

                      {/* Left: Date + Field */}
                      <div className="bg-gray-50 p-6 text-center border-r">
                        <p className="text-sm text-gray-500 mb-1">{game.date}</p>
                        <p className="text-gray-700">{game.field}</p>
                      </div>

                      {/* Middle Score + Teams */}
                      <div className="p-6 flex flex-col items-center justify-center w-full">
                        <div className="flex items-center justify-between w-full">

                          {/* Away Team */}
                          <div className="flex items-center justify-end space-x-3 w-1/3">
                            <div className="flex flex-col items-end">
                              <span className={`text-2xl font-bold ${result === 'away' ? 'text-black' : 'text-gray-400'}`}>
                                {game.awayTeam}
                              </span>
                            </div>

                            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300">
                              <img src={TEAM_LOGOS[game.awayTeam]} className="w-full h-full object-cover" />
                            </div>
                          </div>

                          {/* Center Score Block */}
                          <div className="flex flex-col items-center w-1/3">
                            <div className="flex items-center space-x-4 justify-center">
                              <span className={`text-5xl font-bold ${result === 'away' ? 'text-black' : 'text-gray-400'}`}>
                                {game.status === 'upcoming' ? '-' : game.awayScore}
                              </span>

                              {middleDisplay}

                              <span className={`text-5xl font-bold ${result === 'home' ? 'text-black' : 'text-gray-400'}`}>
                                {game.status === 'upcoming' ? '-' : game.homeScore}
                              </span>
                            </div>
                          </div>

                          {/* Home Team */}
                          <div className="flex items-center space-x-3 w-1/3">
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300">
                              <img src={TEAM_LOGOS[game.homeTeam]} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col items-start">
                              <span className={`text-2xl font-bold ${result === 'home' ? 'text-black' : 'text-gray-400'}`}>
                                {game.homeTeam}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Status Bar */}
                      <div className={`p-6 text-center border-l ${game.status === 'upcoming' ? 'bg-gray-100' : 'bg-gray-50'}`}>
                        {game.status === 'upcoming' ? (
                          <>
                            <Hourglass size={32} className="mx-auto mb-2 text-gray-500" />
                            <p className="text-sm text-gray-600">Not Started</p>
                          </>
                        ) : result === 'tie' ? (
                          <Badge variant="outline" className="border-gray-400">Tie Game</Badge>
                        ) : (
                          <>
                            <Trophy size={32} className="mx-auto mb-2 text-orange-600" />
                            <p className="text-sm text-gray-600">Final</p>
                          </>
                        )}
                      </div>

                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

export default Seasons;
