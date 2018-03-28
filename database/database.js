
import mysql from "mysql"

import { connInfo } from "./connect"

export const Database = class {
    constructor(){
        this.conn = mysql.createConnection(connInfo)
    }

    getPlayers(){
        return new Promise((resolve, reject) => {
            this.conn.connect((err) => {
                if(err){
                    console.log("Error connecting to database")
                    throw err
                }

                const query = "SELECT * FROM players"
                this.conn.query(query, (err, rows) => {
                    if(err){
                        console.log("Error with getPlayers query")
                        throw err
                    }
                    resolve(rows)
                    this.conn.end()
                })
            })  
        })
        
    }
}