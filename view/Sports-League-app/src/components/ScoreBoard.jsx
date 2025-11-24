import React, { useState } from "react";
import { Play, Pause, RotateCcw, Edit2, Plus, Minus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export default function LiveScoreboard() {
  const [games, setGames] = useState([
    {
      id: 1,
      homeTeam: "Tigers",
      awayTeam: "Lions",
      innings: [
        { away: 0, home: 1 },
        { away: 2, home: 0 },
        { away: 0, home: 0 },
        { away: 1, home: 2 },
        { away: 0, home: 0 },
        { away: 0, home: 0 },
        { away: 0, home: 0 },
        { away: 0, home: 0 },
        { away: 0, home: 0 },
      ],
      homeHits: 5,
      awayHits: 4,
      homeErrors: 1,
      awayErrors: 0,
      division: "Major League",
      field: "Field A",
      isLive: true,
      currentInning: 4,
    },
    {
      id: 2,
      homeTeam: "Eagles",
      awayTeam: "Hawks",
      innings: [
        { away: 3, home: 1 },
        { away: 1, home: 2 },
        { away: 1, home: 2 },
        { away: 0, home: 0 },
        { away: 0, home: 0 },
        { away: 0, home: 0 },
        { away: 0, home: 0 },
        { away: 0, home: 0 },
        { away: 0, home: 0 },
      ],
      homeHits: 7,
      awayHits: 6,
      homeErrors: 2,
      awayErrors: 1,
      division: "Minor League",
      field: "Field B",
      isLive: true,
      currentInning: 3,
    },
    {
      id: 3,
      homeTeam: "Bears",
      awayTeam: "Wolves",
      innings: Array(9).fill({ away: 0, home: 0 }),
      homeHits: 0,
      awayHits: 0,
      homeErrors: 0,
      awayErrors: 0,
      division: "Junior League",
      field: "Field C",
      isLive: false,
      currentInning: 1,
    },
  ]);

  const [editingInning, setEditingInning] = useState(null);

  const updateInningScore = (gameId, inningIndex, team, value) => {
    setGames(
      games.map((game) => {
        if (game.id === gameId) {
          const newInnings = [...game.innings];
          newInnings[inningIndex] = {
            ...newInnings[inningIndex],
            [team]: Math.max(0, value),
          };
          return { ...game, innings: newInnings };
        }
        return game;
      })
    );
  };

  const updateStat = (gameId, stat, increment) => {
    setGames(
      games.map((game) => {
        if (game.id === gameId) {
          return {
            ...game,
            [stat]: Math.max(0, game[stat] + (increment ? 1 : -1)),
          };
        }
        return game;
      })
    );
  };

  const toggleLive = (gameId) => {
    setGames(
      games.map((game) =>
        game.id === gameId ? { ...game, isLive: !game.isLive } : game
      )
    );
  };

  const resetGame = (gameId) => {
    setGames(
      games.map((game) =>
        game.id === gameId
          ? {
              ...game,
              innings: Array(9).fill({ away: 0, home: 0 }),
              homeHits: 0,
              awayHits: 0,
              homeErrors: 0,
              awayErrors: 0,
              currentInning: 1,
              isLive: false,
            }
          : game
      )
    );
  };

  const getTotalRuns = (innings, team) => {
    return innings.reduce((sum, inning) => sum + inning[team], 0);
  };

  const liveGames = games.filter((g) => g.isLive);
  const upcomingGames = games.filter((g) => !g.isLive);

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4">Live Scoreboard</h2>
          <p className="text-xl text-gray-600">
            Track scores for games in progress
          </p>
        </div>

        {/* Live Games */}
        {liveGames.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-600 rounded-full animate-pulse"></div>
                <h3 className="text-2xl">Live Games</h3>
              </div>
              <Badge className="bg-orange-600">
                {liveGames.length} {liveGames.length === 1 ? "Game" : "Games"} In
                Progress
              </Badge>
            </div>

            <div className="space-y-8">
              {liveGames.map((game) => {
                const awayTotal = getTotalRuns(game.innings, "away");
                const homeTotal = getTotalRuns(game.innings, "home");

                return (
                  <Card
                    key={game.id}
                    className="shadow-xl border-2 border-orange-600 overflow-hidden"
                  >
                    <CardHeader className="bg-linear-to-r from-orange-600 to-orange-700 text-white">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {game.field} - Inning {game.currentInning}
                        </CardTitle>
                        <Badge variant="secondary" className="bg-white text-orange-700">
                          {game.division}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      {/* Scoreboard */}
                      <div className="bg-black p-6 overflow-x-auto">
                        <table
                          className="w-full text-white"
                          style={{ fontFamily: "monospace" }}
                        >
                          <thead>
                            <tr className="border-b-2 border-gray-700">
                              <th className="text-left py-3 px-4 min-w-[120px]">TEAM</th>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((inning) => (
                                <th
                                  key={inning}
                                  className={`text-center py-3 px-3 min-w-[50px] ${
                                    inning === game.currentInning
                                      ? "bg-orange-700"
                                      : ""
                                  }`}
                                >
                                  {inning}
                                </th>
                              ))}
                              <th className="text-center py-3 px-4 min-w-[60px] bg-orange-700/20">
                                R
                              </th>
                              <th className="text-center py-3 px-4 min-w-[60px] bg-orange-700/20">
                                H
                              </th>
                              <th className="text-center py-3 px-4 min-w-[60px] bg-orange-700/20">
                                E
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Away */}
                            <tr className="border-b border-gray-700">
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400">Away</span>
                                  <span>{game.awayTeam}</span>
                                </div>
                              </td>
                              {game.innings.map((inning, idx) => (
                                <td
                                  key={idx}
                                  className={`text-center py-4 px-3 text-2xl cursor-pointer hover:bg-gray-800 transition-colors ${
                                    idx + 1 === game.currentInning
                                      ? "bg-orange-700/20"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    setEditingInning({
                                      gameId: game.id,
                                      inning: idx,
                                      team: "away",
                                    })
                                  }
                                >
                                  {editingInning?.gameId === game.id &&
                                  editingInning?.inning === idx &&
                                  editingInning?.team === "away" ? (
                                    <input
                                      type="number"
                                      min="0"
                                      max="99"
                                      value={inning.away}
                                      onChange={(e) =>
                                        updateInningScore(
                                          game.id,
                                          idx,
                                          "away",
                                          parseInt(e.target.value) || 0
                                        )
                                      }
                                      onBlur={() => setEditingInning(null)}
                                      className="w-12 bg-gray-700 text-white text-center rounded px-1"
                                      autoFocus
                                    />
                                  ) : (
                                    <span className="text-orange-400">
                                      {inning.away || "-"}
                                    </span>
                                  )}
                                </td>
                              ))}
                              <td className="text-center py-4 px-4 text-3xl bg-orange-700/20">
                                {awayTotal}
                              </td>
                              <td className="text-center py-4 px-4 text-xl bg-orange-700/20">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => updateStat(game.id, "awayHits", false)}
                                    className="hover:text-orange-500 transition-colors"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="min-w-[30px]">{game.awayHits}</span>
                                  <button
                                    onClick={() => updateStat(game.id, "awayHits", true)}
                                    className="hover:text-orange-500 transition-colors"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                              </td>
                              <td className="text-center py-4 px-4 text-xl bg-orange-700/20">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() =>
                                      updateStat(game.id, "awayErrors", false)
                                    }
                                    className="hover:text-orange-500 transition-colors"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="min-w-[30px]">{game.awayErrors}</span>
                                  <button
                                    onClick={() =>
                                      updateStat(game.id, "awayErrors", true)
                                    }
                                    className="hover:text-orange-500 transition-colors"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {/* Home */}
                            <tr>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400">Home</span>
                                  <span>{game.homeTeam}</span>
                                </div>
                              </td>
                              {game.innings.map((inning, idx) => (
                                <td
                                  key={idx}
                                  className={`text-center py-4 px-3 text-2xl cursor-pointer hover:bg-gray-800 transition-colors ${
                                    idx + 1 === game.currentInning
                                      ? "bg-orange-700/20"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    setEditingInning({
                                      gameId: game.id,
                                      inning: idx,
                                      team: "home",
                                    })
                                  }
                                >
                                  {editingInning?.gameId === game.id &&
                                  editingInning?.inning === idx &&
                                  editingInning?.team === "home" ? (
                                    <input
                                      type="number"
                                      min="0"
                                      max="99"
                                      value={inning.home}
                                      onChange={(e) =>
                                        updateInningScore(
                                          game.id,
                                          idx,
                                          "home",
                                          parseInt(e.target.value) || 0
                                        )
                                      }
                                      onBlur={() => setEditingInning(null)}
                                      className="w-12 bg-gray-700 text-white text-center rounded px-1"
                                      autoFocus
                                    />
                                  ) : (
                                    <span className="text-orange-400">
                                      {inning.home || "-"}
                                    </span>
                                  )}
                                </td>
                              ))}
                              <td className="text-center py-4 px-4 text-3xl bg-orange-700/20">
                                {homeTotal}
                              </td>
                              <td className="text-center py-4 px-4 text-xl bg-orange-700/20">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => updateStat(game.id, "homeHits", false)}
                                    className="hover:text-orange-500 transition-colors"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="min-w-[30px]">{game.homeHits}</span>
                                  <button
                                    onClick={() => updateStat(game.id, "homeHits", true)}
                                    className="hover:text-orange-500 transition-colors"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                              </td>
                              <td className="text-center py-4 px-4 text-xl bg-orange-700/20">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => updateStat(game.id, "homeErrors", false)}
                                    className="hover:text-orange-500 transition-colors"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="min-w-[30px]">{game.homeErrors}</span>
                                  <button
                                    onClick={() => updateStat(game.id, "homeErrors", true)}
                                    className="hover:text-orange-500 transition-colors"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <div className="mt-4 text-center text-sm text-gray-400">
                          <Edit2 size={12} className="inline mr-1" />
                          Click any inning score to edit
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="p-4 bg-gray-100 flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Current Inning:</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setGames(
                                games.map((g) =>
                                  g.id === game.id
                                    ? { ...g, currentInning: Math.max(1, g.currentInning - 1) }
                                    : g
                                )
                              )
                            }
                            className="h-7 w-7 p-0"
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="text-lg min-w-[30px] text-center">
                            {game.currentInning}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setGames(
                                games.map((g) =>
                                  g.id === game.id
                                    ? { ...g, currentInning: Math.min(9, g.currentInning + 1) }
                                    : g
                                )
                              )
                            }
                            className="h-7 w-7 p-0"
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => resetGame(game.id)}
                            className="gap-1"
                          >
                            <RotateCcw size={14} />
                            Reset
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleLive(game.id)}
                            className="gap-1"
                          >
                            <Pause size={14} />
                            End Game
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Upcoming Games */}
        {upcomingGames.length > 0 && (
          <div>
            <h3 className="text-2xl mb-6">Upcoming Games</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingGames.map((game) => (
                <Card key={game.id} className="shadow-lg">
                  <CardHeader className="bg-linear-to-r from-orange-600 to-orange-700 text-white">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{game.field}</CardTitle>
                      <Badge variant="secondary" className="bg-white text-orange-700">
                        {game.division}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-lg mb-2">{game.awayTeam}</p>
                        <p className="text-sm text-gray-500 mb-2">vs</p>
                        <p className="text-lg">{game.homeTeam}</p>
                      </div>
                      <Button
                        className="w-full bg-orange-600 hover:bg-orange-700 gap-2"
                        onClick={() => toggleLive(game.id)}
                      >
                        <Play size={16} />
                        Start Game
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
