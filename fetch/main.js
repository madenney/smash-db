

import { getNumberOfPages, beginTournamentGrab } from "./tournament"
import { getSets } from "./sets"
const lastSlug = "tournament/nimbus-10"

const main = () => {
    
    console.log("Fetching Data")


    getNumberOfPages().then((numPages) => {
        beginTournamentGrab(numPages, lastSlug).then((tournaments) => {
            console.log("Tournaments Length ", tournaments.length )
            for(let i = 0; i < tournaments.length; i++){
                console.log(typeof tournaments[i])
                getSets(tournaments[i])
                break
                

            }
        })
    }).catch((error) => {
        console.log("An error occured while fetching the first page")
        console.log(error)
    })
    
}

main()