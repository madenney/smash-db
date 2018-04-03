
import mysql from "mysql"

import { connInfo } from "./connect"

export const Database = class {
    constructor(){
        this.conn = mysql.createConnection(connInfo)
    }

    closeConnection(){
        this.conn.end()
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
            console.log(t.image)
            var query = "INSERT INTO `tournaments` (`title`,`start_date`,`end_date`,`slug`,`city`,`state`,`zip`,`country`,`address`,`sets`,`image_url`) VALUES "
            query += "('"+t.title+"','"+t.start+"','"+t.end+"','"+t.slug+"','"+t.city+"','"+t.state+"','"+t.zip+"','"+t.country+"','"+t.address+"','"+t.sets+"','"+t.image+"')"
            this.conn.query(query, (err, result) => {
                if(err){
                    console.log("Error inserting new tournament table")
                    console.log(query)
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
            if( players.length > 0){
                var query = "INSERT INTO `players` (`tag`) VALUES "
                for(var i = 0; i < players.length; i++) {
                    query += "('"+players[i].tag +"'),"
                }
                query = query.slice(0, query.length - 1)

                this.conn.query(query, (err, result) => {
                    if(err){
                        console.log("Error inserting into players table")
                        console.log(query)
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
            } else {
                this.conn.query("SELECT * FROM `players`", (err, rows) => {
                    if(err){ 
                        console.log("Error retreiving data from players table in 'insertNewPlayers' function")
                        throw err 
                    }
                    resolve(rows)
                })
            }
            
        })
    }

    insertNewSets(sets, tournament, players){
        return new Promise((resolve, reject) => {

            if(sets.length > 0){
                var query = "INSERT INTO `sets` (`winner_id`,`loser_id`,`winner_tag`,`loser_tag`,`tournament_id`,`best_of`,`winner_score`,`loser_score`,`round`) VALUES "
                sets.forEach((set) => {
                    query += "("
                    for(var j = 0; j < players.length; j++){
                        if(set.winnerTag.toLowerCase() === players[j].tag.toLowerCase()){
                            query += "'" + players[j].id + "'"
                            break
                        }
                    }
                    if(j === players.length){
                        console.log("HOW IS THIS POSSIBLE")
                        console.log(set)
                        throw error
                    }
                    query += ","
                    for(var j = 0; j < players.length; j++){
                        if(set.loserTag.toLowerCase() === players[j].tag.toLowerCase()){
                            query += "'" + players[j].id + "'"
                            break
                        }
                    }
                    if(j === players.length){
                        console.log("HOW IS THIS FREAKING POSSIBLE")
                        console.log(set)
                        throw error
                    }

                    if(!set.winnerScore){ set.winnerScore = 0}
                    if(!set.loserScore){ set.loserScore = 0}
                    if(!set.bestOf){ set.bestOf = 0}

                    query += ",'"+set.winnerTag+"','"+set.loserTag+"','"+tournament.id+"','"+set.bestOf+"','"+set.winnerScore+"','"+set.loserScore+"','"+set.round+"'),"
                })
                query = query.slice(0, query.length - 1)

                this.conn.query(query, (err, result) => {
                    if(err){
                        console.log("Error inserting data into sets table")
                        console.log(query)
                        throw err
                    }
                    resolve()
                })
            } else {
                resolve()
            }
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

    resetDatabase(){
        return new Promise((resolve, reject) => {
            const query = "TRUNCATE TABLE sets; TRUNCATE TABLE tournaments; TRUNCATE TABLE players; TRUNCATE TABLE error_log"
            this.conn.query(query, (err, rows) => {
                if(err){
                    console.log("Error with resetting database query")
                    throw err
                }
                resolve()
            })
        })
    }

    logError(error){
        return new Promise((resolve, reject) => {
            let query = "INSERT into `error_log` "
            let vars = "(`type`"
            let values = "('"+error.type+"'"

            if(error.message){
                vars += ",`message`"
                values += ",'"+error.message+"'"
            }
            if(error.slug){
                vars += ",`slug`"
                values += ",'"+error.slug+"'"
            }
            if(error.tournament){
                vars += ",`tournament`"
                values += ",'"+error.tournament+"'"
            }
            
            query += vars + ") VALUES " + values + ")"
            this.conn.query(query, (err, rows) => {
                if(err){
                    console.log("Error occurred when inserting into error log. Wow.")
                    console.log(query)
                    throw err
                }
                resolve()
            })
        })
    }
}