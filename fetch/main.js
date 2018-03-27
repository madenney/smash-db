

import { getNumberOfPages, beginTournamentGrab } from "./tournament"
import { getSets, getTournamentSets } from "./sets"
const lastSlug = "tournament/nimbus-10"

const main = () => {
    
    console.log("Fetching Data")

    getTournamentSets({
        name: "TEST TOURNAMENT",
        slug: 'tournament/s-ps-weekly-56'
    })

    // getNumberOfPages().then((numPages) => {
    //     beginTournamentGrab(numPages, lastSlug).then((tournaments) => {
    //         console.log("Tournaments Length ", tournaments.length )
    //         for(let i = 0; i < tournaments.length; i++){
    //             console.log(typeof tournaments[i])
    //             getTournamentSets(tournaments[i])
    //             break
                

    //         }
    //     })
    // }).catch((error) => {
    //     console.log("An error occured while fetching the first page")
    //     console.log(error)
    // })
    
}

main()