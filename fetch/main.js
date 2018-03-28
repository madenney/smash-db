

import { getNumberOfPages, getNewTournaments } from "./tournament"
import { getTournamentData } from "./sets"
import { Database } from "./database"
const lastSlug = "tournament/nimbus-10"

const main = () => {
    
    console.log("Fetching Data")


    const db = new Database()
    db.getPlayers().then((players) => {
       



        
    })

    // getTournamentData({
    //     title: "Full Bloom",
    //     slug: 'tournament/full-bloom-4'
    // }).then((data) => {
    //     data.players.forEach((player) => {
    //         console.log(player)
    //     })
    // })

    // getTournamentData({
    //     title: "TEST TOURNAMENT",
    //     slug: 'tournament/genesis-5'
    // }).then((data) => {
    //     data.players.forEach((player) => {
    //         console.log(player)
    //     })
    // })



    // getNumberOfPages().then((numPages) => {
    //     getNewTournaments(numPages, lastSlug).then((tournaments) => {
    //         console.log("Tournaments Length ", tournaments.length )
    //         for(let i = 0; i < tournaments.length; i++){
    //             console.log(typeof tournaments[i])
    //             getTournamentData(tournaments[i])
    //             break
                

    //         }
    //     })
    // }).catch((error) => {
    //     console.log("An error occured while fetching the first page")
    //     console.log(error)
    // })
    
}

main()
