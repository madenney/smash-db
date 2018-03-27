

import { getNumberOfPages, beginTournamentGrab } from "./tournament"

const lastSlug = "tournament/nimbus-10"

const main = () => {
    
    console.log("Fetching Data")


    getNumberOfPages().then((numPages) => {
        beginTournamentGrab(numPages, lastSlug).then((tournaments) => {
            console.log("Tournaments Length ", tournaments.length )
            tournaments.forEach((tournament) => {
                console.log(tournament.slug)
            })
        })
    }).catch((error) => {
        console.log("An error occured while fetching the first page")
        console.log(error)
    })
    
}

main()