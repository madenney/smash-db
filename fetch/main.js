
import { getNumberOfPages, getNewTournaments } from "./tournament"
import { getTournamentData, getMeleeEventSlug } from "./sets"
import { Database } from "../database/database"

const main = () => {
    
    const db = new Database()

    db.logActivity("fetch_data")

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
                    db.closeConnection()
                    console.log("Closed database connection.")
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
        db.closeConnection()
        console.log("Closed database connection.")
        return
    }
    console.log(num + ": Getting Data for " + tournaments[num].title + "...")
    db.getPlayers().then((players) => {
        getTournamentData(tournaments[num], players).then((data) => {
            data.tournament = tournaments[num]
            if(data.sets.length > 0){
                data.tournament.sets = data.sets.length
                console.log("Inserting new data into smash db...")
                db.insertNewData(data).then(() => {
                    getTournamentLoop(num - 1, tournaments, db)
                }) 
            } else {
                db.logError({
                    type: "no_sets",
                    message: "No sets found",
                    slug: data.tournament.slug,
                    tournament: data.tournament.title
                }).then(() => {
                    getTournamentLoop(num - 1, tournaments, db)
                })
            }
        }).catch((error) => {
            if(error.type){
                console.log("A smashgg error occurred. Logging and continuing...")
                db.logError(error).then(() => {
                    getTournamentLoop(num - 1, tournaments, db)
                })
            } else {
                throw error
            }
        })
    })
}

main()
