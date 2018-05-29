
import { Database } from "../database/database"
import { newRank } from "./rank"

const main = () => {
    
    const db = new Database()

    db.logActivity("analyze")

    newRank(db)
    
}

main()
