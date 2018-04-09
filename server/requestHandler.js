
import { Database } from "../database/database"
import * as contracts from "./apiContracts"

export const RequestHandler = class {

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

    sendData(res, data){
        res.end(JSON.stringify({
            status: 200,
            data : data
        }))
    }

    checkOptions(options, contract){
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
                    if( contract[option].options.indexOf(options[option]) < 0){
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