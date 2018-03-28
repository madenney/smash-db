

import { getNumberOfPages, getNewTournaments } from "./tournament"
import { getTournamentData } from "./sets"
const lastSlug = "tournament/nimbus-10"

const main = () => {
    
    console.log("Fetching Data")

    getTournamentData({
        title: "TEST TOURNAMENT",
        slug: 'tournament/full-bloom-4'
    })

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