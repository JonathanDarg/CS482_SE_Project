import React from "react";
import styles from "./ScoreBoard.module.css";
// import { addHomeRun } from "../../../../model/TeamScoreDao";
// const TeamScoreDao = require("../../model/TeamScoreDao");
// const dbcon = require("../../model/dbcon");
// const TeamDao = require("../../model/TeamDao");
// const EventDao = require("../../model/EventDao");

// dbcon.connect('test');

// let HomeTeamData = {
    // teamName: "Yankees",
    // wins: 20,
    // losses: 10
// };

// let AwayTeamData = {
    // teamName: "Guest",
    // wins: 15,
    // losses: 15
// };

// let homeTeam = await TeamDao.createTeam(HomeTeamData);
// let awayTeam = await TeamDao.createTeam(AwayTeamData);


// let EventData = {
    // location: "Stuart's House",
    // dateTime: new Date('2024-07-01T15:00:00Z'),
    // rating: 5,
    // typeOfMatch: "Friendly",
    // inning: 1
// };

// let game = await EventDao.createEvent(EventData);

// let homeTeamScoreData = {
    // teamId: homeTeam._id,
    // score: 0,
    // gameId: game._id,
    // visiting: false
// };

// let awayTeamScoreData = {
    // teamId: awayTeam._id,
    // score: 0,
    // gameId: game._id,
    // visiting: true
// };

// let homeTeamScore = await TeamScoreDao.createTeamScore(homeTeamScoreData);
// let awayTeamScore = await TeamScoreDao.createTeamScore(awayTeamScoreData);

// function addInning() {
    // game.inning += 1;
    // EventDao.updateEvent(game._id, game);
// }

// function resetAll() {
    // homeTeamScore.score = 0;
    // awayTeamScore.score = 0;
    // TeamScoreDao.updateTeamScore(homeTeamScore._id, homeTeamScore);
    // TeamScoreDao.updateTeamScore(awayTeamScore._id, awayTeamScore);
    // game.inning = 1;
    // EventDao.updateEvent(game._id, game);
// }

const ScoreBoard = () => {
return (
    <div>
      <section className={styles.scoreboard}>
        <div className={styles.topRow}>
          <div className={styles.home}>
            <h2 className={styles.home__name}>Home</h2>
            <div className={styles.home_score}>{1}</div>
          </div>
          <div className={styles.inn}>
            <h2 className={styles.inning}>Inng</h2>
            <div className={styles.current_inning}>{2}</div>
          </div>
          <div className={styles.away}>
            <h2 className={styles.away__name}>Gest</h2>
            <div className={styles.away_score}>{3}</div>
          </div>
        </div>
      </section>
      <section className={styles.buttons}>
        <div className={styles.homeButtons}>
          <button className={styles.homeButtons__run} onClick={() =>{}}>
            Yankees Score a Run
          </button>
          <button className={styles.innings_button} onClick={() =>{}}>
            Next Inning
          </button>
          <button className={styles.awayButtons__run} onClick={() =>{}}>
            Guest Score a Run
          </button>
        </div>
        <div className={styles.awayButtons}>
          <button className={styles.reset_button} onClick={() =>{}}>
            Reset All
          </button>
        </div>
      </section>
    </div>
  );
}
export default ScoreBoard;
