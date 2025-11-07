import React, { useState } from "react";

function ScoreBoard1() {
  const [homeTeam, setHomeTeam] = useState({
    name: "Home",
    runs: 3,
    hits: 5,
    errors: 1,
    innings: [1, 0, 2, 0, 0, 0, 0, 0, 0],
  });

  const [awayTeam, setAwayTeam] = useState({
    name: "Away",
    runs: 4,
    hits: 6,
    errors: 0,
    innings: [0, 1, 0, 2, 0, 0, 1, 0, 0],
  });

  const [editing, setEditing] = useState({ team: null, field: null, index: null });

  const handleEdit = (team, field, index = null) => {
    setEditing({ team, field, index });
  };

  const handleChange = (value) => {
    const teamData = editing.team === "home" ? { ...homeTeam } : { ...awayTeam };
    if (editing.index !== null) {
      teamData.innings[editing.index] = Number(value);
    } else {
      teamData[editing.field] = isNaN(value) ? value : Number(value);
    }
    editing.team === "home" ? setHomeTeam(teamData) : setAwayTeam(teamData);
  };

  const handleBlur = () => {
    setEditing({ team: null, field: null, index: null });
  };

  const renderCell = (team, field, value, index = null) => {
    const isEditing =
      editing.team === team && editing.field === field && editing.index === index;
    return isEditing ? (
      <input
        type={typeof value === "number" ? "number" : "text"}
        className="w-12 text-center border border-gray-400 rounded text-black"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        autoFocus
      />
    ) : (
      <span
        className="cursor-pointer hover:text-blue-600"
        onClick={() => handleEdit(team, field, index)}
      >
        {value}
      </span>
    );
  };

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="bg-white text-black shadow-xl rounded-lg overflow-hidden p-6 w-[850px] border-2 border-orange-500">
        {/* Title */}
        <div className="mb-4 border-b border-gray-400 pb-2">
          <h2 className="text-2xl font-bold tracking-wide text-left">SCORE</h2>
        </div>

        {/* Table */}
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="border-b border-gray-400 text-gray-700">
              <th className="text-left pl-4">TEAM</th>
              {[...Array(9)].map((_, i) => (
                <th key={i}>{i + 1}</th>
              ))}
              <th>R</th>
              <th>H</th>
              <th>E</th>
            </tr>
          </thead>
          <tbody>
            {/* Away Team */}
            <tr className="border-b border-gray-300 hover:bg-gray-100">
              <td className="text-left pl-4 font-semibold">
                {renderCell("away", "name", awayTeam.name)}
              </td>
              {awayTeam.innings.map((val, i) => (
                <td key={i}>{renderCell("away", "innings", val, i)}</td>
              ))}
              <td>{renderCell("away", "runs", awayTeam.runs)}</td>
              <td>{renderCell("away", "hits", awayTeam.hits)}</td>
              <td>{renderCell("away", "errors", awayTeam.errors)}</td>
            </tr>

            {/* Spacer between teams */}
            <tr className="h-2 bg-transparent"></tr>

            {/* Home Team */}
            <tr className="hover:bg-gray-100">
              <td className="text-left pl-4 font-semibold">
                {renderCell("home", "name", homeTeam.name)}
              </td>
              {homeTeam.innings.map((val, i) => (
                <td key={i}>{renderCell("home", "innings", val, i)}</td>
              ))}
              <td>{renderCell("home", "runs", homeTeam.runs)}</td>
              <td>{renderCell("home", "hits", homeTeam.hits)}</td>
              <td>{renderCell("home", "errors", homeTeam.errors)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ScoreBoard1;
