
import request from "request"
import { FIRST_CALL, SMASHGG_TOURNAMENT_LIST_API } from "./constants"


export const getNewTournaments = (numPages, lastSlug) => {
    return new Promise((resolve, reject) => {
        let tournaments = []
        getTournaments(1, numPages, lastSlug, tournaments, resolve)
    })
}

const getTournaments = (currentPage, numPages, stopSlug, tournaments, resolve) => {

    if(currentPage > numPages || currentPage > 4){
        resolve(tournaments)
    } else {
        console.log("Getting Page " + currentPage + "...")
        request.get(SMASHGG_TOURNAMENT_LIST_API+currentPage, (error, response, body) =>{
            if(error){
                throw(error)
            } else {
                let doNext = true
                const newTournaments = JSON.parse(body).items.entities.tournament

                for(var i = 0; i < newTournaments.length; i++){
                    if(stopSlug === newTournaments[i].slug){
                        resolve(tournaments)
                        doNext = false
                        break
                    } else {        
                        tournaments.push({
                            title: newTournaments[i].name,
                            slug: newTournaments[i].slug,
                            start: newTournaments[i].startAt,
                            end: newTournaments[i].endAt,
                            city: newTournaments[i].city,
                            state: newTournaments[i].addrState,
                            zip: newTournaments[i].postalCode,
                            country: newTournaments[i].countryCode,
                            venueAddress: newTournaments[i].venueAddress
                        })
                    }
                }
                if(doNext){
                    getTournaments(currentPage+1, numPages, stopSlug, tournaments, resolve)
                }
            }
        })
    }

    
}

export const getNumberOfPages = () => {
    return new Promise((resolve, reject) => {
        request.get(FIRST_CALL, (error, response, body) => {
            if(error){
                reject(error)
                return
            } else {
                resolve(Math.ceil(JSON.parse(body).total_count / 100))
            }
        })
    })
}