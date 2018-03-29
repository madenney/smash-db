

import { getNumberOfPages, getNewTournaments } from "./tournament"
import { getTournamentData } from "./sets"
import { Database } from "./database"
const lastSlug = "tournament/nimbus-10"

const main = () => {
    
    console.log("Fetching Data")

    const testTournament = {
        title: "Smash Summit",
        slug: "tournament/smash-summit-5"
    }

    const db = new Database()

    console.log("Getting Last Tournament in DB...")
    db.getLastTournament().then((lastTournament) => {
        if(!lastTournament){ lastTournament = {slug: 'Nothing here'} }
        console.log("Getting number of pages in smashgg tournament list...")
        getNumberOfPages().then((numPages) => {
            console.log("Number of Pages: ", numPages)
            console.log("Getting New Tournaments...")
            getNewTournaments(numPages, lastTournament.slug).then((tournaments) => {
                if(tournaments.length > 0){
                    getTournamentLoop(tournaments.length - 1, tournaments, db)
                } else {
                    console.log("No new tournaments")
                }
            })
        }).catch((error) => {
            console.log("An error occured while fetching the first page")
            console.log(error)
        })
    })
    
}

const getTournamentLoop = (num, tournaments, db) => {
    if(num < 0){
        console.log("Finished")
        db.conn.end()
        return
    }
    console.log(num + ": Getting Data for " + tournaments[num].title + "...")
    db.getPlayers().then((players) => {
        getTournamentData(tournaments[num], players).then((data) => {
            data.tournament = tournaments[num]
            data.tournament.sets = data.sets.length
            console.log("Inserting new data into smash db...")
            db.insertNewData(data).then(() => {
                getTournamentLoop(num - 1, tournaments, db)
            })
        }).catch((error) => {
            if(error.type === "smashgg"){
                console.log("A smashgg error occurred. Logging and continuing...")
                console.log(num)
                db.logError(error.payload).then(() => {
                    getTournamentLoop(num - 1, tournaments, db)
                })
            }
        })
    })
}

main()
