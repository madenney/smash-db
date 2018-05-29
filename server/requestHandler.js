
import { Database } from "../database/database"
import * as contracts from "./apiContracts"

export const RequestHandler = class {

    search(options, res){

        const optionsError = this.checkOptions( options, contracts.SEARCH_CONTRACT)

        if(optionsError){
            res.end(JSON.stringify({
                status: 400,
                message: optionsError
            }))
        } else {
            const q = {
                ...contracts.DEFAULT_SEARCH_OPTIONS,
                ...options
            }

            const db = new Database()
            const query = "SELECT * FROM `" + q.category + "` WHERE " 
                + ( q.category === "players" ? "`tag`" : "`title`" ) + " LIKE '" 
                + options.input + "%' LIMIT " + q.limit

            db.query(query).then((data) => {
                this.sendData(res, {data})
                db.closeConnection()
            })
        }
    }

    getPlayerProfile(options, res){

        const optionsError = this.checkOptions(options, contracts.PLAYER_PROFILE_CONTRACT)

        if(optionsError){
            res.end(JSON.stringify({
                status: 400,
                message: optionsError
            }))

        } else {

            const q = {
                ...contracts.DEFAULT_PLAYER_PROFILE_OPTIONS,
                ...options
            }

            const db = new Database()
            const query = "SELECT * FROM `players` WHERE `id` = " + options.id + " LIMIT 1"
            db.query(query).then((player) => {
                if( player.length === 0){
                    res.end(JSON.stringify({
                        status: 204,
                        message: "No player found with id - " + options.id
                    }))
                    db.closeConnection()
                } else {
                    if( q.getHistory ){
                        const setsQuery = "SELECT * FROM `sets` WHERE `winner_id` = " + q.id + " OR `loser_id` = " + q.id
                        db.query(setsQuery).then((sets) => {
                            this.sendData( res, { player, sets })
                            db.closeConnection()
                        })
                    } else {
                        this.sendData( res, { player } )
                        db.closeConnection()
                    }
                }

            }).catch((error) => {
                throw error
            })
        }
    }

    getHead2Head( options, res ){

        const optionsError = this.checkOptions(options, contracts.HEAD2HEAD_CONTRACT)

        if(optionsError){
            res.end(JSON.stringify({
                status: 400,
                message: optionsError
            }))

        } else {

            const db = new Database()
            const data = {}
            const promises = []
            const nums = ['1','2']
            nums.forEach((num) => {
                promises.push( new Promise((resolve, reject) => {
                    const query = "SELECT * FROM `players` WHERE `id` = " + options["id" + num] + " LIMIT 1"
                    db.query(query).then((player) => {
                        data["player" + num] = player
                        resolve()
                    })
                }))
            })

            Promise.all(promises).then(() => {

                if( data.player1.length === 0 ){
                    res.end(JSON.stringify({
                        status: 204,
                        message: "No player found with id - " + options.id1
                    }))
                    db.closeConnection()
                    return
                } else {
                    data.player1 = data.player1[0]
                }

                if( data.player2.length === 0 ){
                    res.end(JSON.stringify({
                        status: 204,
                        message: "No player found with id - " + options.id2
                    }))
                    db.closeConnection()
                    return
                } else {
                    data.player2 = data.player2[0]
                }

                const h2hQuery = "SELECT * FROM `sets` WHERE ( `winner_id` = '" + data.player1.id + 
                    "' AND `loser_id` = '" + data.player2.id + "' ) OR ( `winner_id` = '" + data.player2.id +
                    "' AND `loser_id` = '" + data.player1.id + "' )"
                db.query(h2hQuery).then((sets) => {
                  this.sendData(res, {
                      player1: data.player1,
                      player2: data.player2,
                      sets
                  })
                  db.closeConnection()
                })
            })
        }
    }

    getPlayers(options, res){

        const optionsError = this.checkOptions(options, contracts.PLAYERS_CONTRACT)

        if(optionsError){
            res.end(JSON.stringify({
                status: 400,
                message: optionsError
            }))
        } else {

            const q = {
                ...contracts.DEFAULT_PLAYERS_OPTIONS,
                ...options
            }

            const db = new Database()
            const query = "SELECT * FROM `players` " + "ORDER BY " + q.order + " " + q.sort + " LIMIT " + q.from + ", " + q.limit  
            db.query(query).then((data) => {
                if( q.getTotal && q.getTotal.toLowerCase() === "true" ){
                    const query2 = "SELECT COUNT(*) AS 'count' FROM `players`"
                    db.query(query2).then((data2) => {
                        this.sendData(res, {
                            players: data,
                            total: data2[0].count
                        })
                        db.closeConnection()
                    })
                } else {
                    this.sendData(res, { players: data } )
                    db.closeConnection()
                }
                
            }).catch((error) => {
                throw error
            })
        }
        
    }

    getTournaments(options, res){

        const optionsError = this.checkOptions(options, contracts.TOURNAMENTS_CONTRACT)

        if(optionsError){
            res.end(JSON.stringify({
                status: 400,
                message: optionsError
            }))
        } else {

            const q = {
                ...contracts.DEFAULT_TOURNAMENTS_OPTIONS,
                ...options
            }

            if(q.order === "date"){ q.order = "start_date"}

            const db = new Database()
            const query = "SELECT * FROM `tournaments` " + "ORDER BY " + q.order + " " + q.sort + " LIMIT " + q.from + ", " + q.limit  
            db.query(query).then((data) => {
                if( q.getTotal && q.getTotal.toLowerCase() === "true" ){
                    const query2 = "SELECT COUNT(*) AS 'count' FROM `tournaments`"
                    db.query(query2).then((data2) => {
                        this.sendData(res, {
                            tournaments: data,
                            total: data2[0].count
                        })
                        db.closeConnection()
                    })
                } else {
                    this.sendData(res, { tournaments: data } )
                    db.closeConnection()
                }
                
            }).catch((error) => {
                throw error
            })
        }
        
    }

    getSets(options, res){

        const optionsError = this.checkOptions(options, contracts.SETS_CONTRACT)

        if(optionsError){
            res.end(JSON.stringify({
                status: 400,
                message: optionsError
            }))
        } else {

            const q = {
                ...contracts.DEFAULT_SETS_OPTIONS,
                ...options
            }

            if(q.order === "date"){ q.order = "start_date"}

            const db = new Database()
            const query = "SELECT * FROM `sets` " + "ORDER BY " + q.order + " " + q.sort + " LIMIT " + q.from + ", " + q.limit  
            db.query(query).then((data) => {
                if( q.getTotal && q.getTotal.toLowerCase() === "true" ){
                    const query2 = "SELECT COUNT(*) AS 'count' FROM `sets`"
                    db.query(query2).then((data2) => {
                        this.sendData(res, {
                            sets: data,
                            total: data2[0].count
                        })
                    })
                } else {
                    this.sendData(res, { sets: data } )
                    db.closeConnection()
                }
                
            }).catch((error) => {
                throw error
            })
        }
        
    }


    sendData(res, data){
        res.end(JSON.stringify({
            status: 200,
            data : data
        }))
    }

    checkOptions(options, contract){
        // Check for required options
        for( const option in contract){
            if(contract[option].isRequired && !options[option]){
                return "Error: Missing required option - '" + option + "'"
            }
        }
        
        for( const option in options){

            if(!contract[option]){
                return "Error: Unrecognized option - '" + option + "'"
            }

            switch(contract[option].type){

                case "number":
                    const num = parseInt(options[option])
                    if( typeof num !== "number" || isNaN(num)){
                        return "Error: Invalid data type given for option - '" + option + "'  Expected a number."
                    }
                    if(num < contract[option].minimum){
                        return "Error: Invalid value for option - '" + option + "'  Must be greater than " + contract[option].minimum
                    }
                    if(num > contract[option].maximum){
                        return "Error: Invalid value for option - '" + option + "'  Must be less than " + contract[option].maximum
                    }
                    break

                case "string":
                    if( typeof options[option] !== "string"){
                        return "Error: Invalid data type given for option - '" + option + " '  Expected a string."
                    }
                    if( contract[option].options && contract[option].options.indexOf(options[option]) < 0){
                        return "Error: Invalid value for option - '" + option + "'  Expected one of the following: " + contract[option].options
                    }
                    break

                case "bool":
                    if( options[option].toLowerCase() !== "true" && options[option].toLowerCase() !== "false" ){
                        return "Error: Invalid value for option - '" + option + "'  Expected a boolean value."
                    }
                    break

                default:
                    break
            }
        }
        return false
    }

}