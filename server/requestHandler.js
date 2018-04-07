
import { Database } from "../database/database"

export const RequestHandler = class {

    getPlayers(options, res){

        const db = new Database()
        const query = "SELECT * FROM `players` LIMIT 10"
        db.query(query).then((data) => {
            res.end(JSON.stringify(data))
            db.closeConnection()
        }).catch((error) => {
            throw error
        })

    }

}