
import mysql from "mysql"

import { connInfo } from "./connect"

export const Database = class {
    constructor(){
        this.conn = mysql.createConnection(connInfo)
    }

    insertNewData(data){
        return new Promise((resolve, reject) => {

            this.insertNewTournament(data.tournament).then((tournament) => {
                this.insertNewPlayers(data.players).then((players) => {
                    this.insertNewSets(data.sets, tournament, players).then(() => {
                        resolve()
                    })
                })
            })
        })
    }

    insertNewTournament(t){
        return new Promise((resolve, reject) => {

            var query = "INSERT INTO `tournaments` (`title`,`start_date`,`end_date`,`slug`,`city`,`state`,`zip`,`country`,`address`,`sets`) VALUES "
            query += "('"+t.title+"','"+t.start+"','"+t.end+"','"+t.slug+"','"+t.city+"','"+t.state+"','"+t.zip+"','"+t.country+"','"+t.address+"','"+t.sets+"')"
            this.conn.query(query, (err, result) => {
                if(err){
                    console.log("Error inserting new tournament table")
                    throw err
                }

                this.conn.query("SELECT * FROM `tournaments` WHERE title ='" + t.title + "'", (err, rows) => {
                    if(err){ 
                        console.log("Error retreiving data from tournaments table in 'insertNewTournament' function")
                        throw err 
                    }
                    resolve(rows[0])
                })
            })
        })
    }

    insertNewPlayers(players){
        return new Promise((resolve, reject) => {
            var query = "INSERT INTO `players` (`tag`) VALUES "
            for(var i = 0; i < players.length; i++) {
                query += "('"+players[i].tag +"'),"
            }
            query = query.slice(0, query.length - 1)

            this.conn.query(query, (err, result) => {
                if(err){
                    console.log("Error inserting into players table")
                    throw err
                }
                
                this.conn.query("SELECT * FROM `players`", (err, rows) => {
                    if(err){ 
                        console.log("Error retreiving data from players table in 'insertNewPlayers' function")
                        throw err 
                    }
                    resolve(rows)
                })
            })
        })
    }

    insertNewSets(sets, tournament, players){
        return new Promise((resolve, reject) => {

            var query = "INSERT INTO `sets` (`winner_id`,`loser_id`,`winner_tag`,`loser_tag`,`tournament_id`,`best_of`,`winner_score`,`loser_score`) VALUES "
            for(var i = 0; i < sets.length; i++) {
                query += "("
                for(var j = 0; j < players.length; j++){
                    if(set.winnerTag.toLowerCase() === players[j].tag.toLowerCase()){
                        query += "'" + players[j].id + "'"
                        break
                    }
                }
                query += ","
                for(var j = 0; j < players.length; j++){
                    if(set.loserTag.toLowerCase() === players[j].tag.toLowerCase()){
                        query += "'" + players[j].id + "'"
                        break
                    }
                }

                query += ",'"+set.winnerTag+"','"+set.loserTag+"','"+tournament.id+"','"+set.bestOf+"','"+set.winnerScore+"','"+set.loserScore+"'),"
            }
            query = query.slice(0, query.length - 1)
            console.log(query)

            this.conn.query(query, (err, result) => {
                if(err){
                    console.log("Error inserting data into sets table")
                    throw err
                }
                resolve()
            })
        })
    }

    getPlayers(){
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM players"
            this.conn.query(query, (err, rows) => {
                if(err){
                    console.log("Error with getPlayers query")
                    throw err
                }
                resolve(rows)
            })
        })
    }

    getLastTournament(){
        return new Promise((resolve, reject) => {

            const query = "SELECT * FROM tournaments ORDER BY id DESC LIMIT 1"
            this.conn.query(query, (err, rows) => {
                if(err){
                    console.log("Error with getLastTournament query")
                    throw err
                }
                if(rows.length > 0){
                    resolve(rows[0])
                } else {
                    resolve(null)
                }
            })
        })
    }

    logError(message){
        return new Promise((resolve, reject) => {
            const query = "INSERT into `error_log` (`message`) VALUES ('"+message+"')"
            this.conn.query(query, (err, rows) => {
                if(err){
                    console.log("Error occurred when inserting into error log. Wow.")
                    throw err
                }
                resolve()
            })
        })
    }
}