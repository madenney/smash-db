
import request from "request"
import { FIRST_CALL, SMASHGG_TOURNAMENT_LIST_API, STOP_PAGE, VERBOSE } from "./constants"
import { removeExtraSymbols } from "./helper"

export const getNewTournaments = (numPages, lastSlug) => {
    return new Promise((resolve, reject) => {
        let tournaments = []
        getTournaments(1, numPages, lastSlug, tournaments, resolve)
    })
}

const getTournaments = (currentPage, numPages, stopSlug, tournaments, resolve) => {

    if(currentPage > numPages || currentPage > STOP_PAGE){
        resolve(tournaments)
    } else {
        console.log("Getting Page " + currentPage + "...")
        const url = SMASHGG_TOURNAMENT_LIST_API + currentPage
        console.log(url)
        request.get(url, (error, response, body) =>{
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
                            title: removeExtraSymbols(newTournaments[i].name),
                            slug: newTournaments[i].slug,
                            start: newTournaments[i].startAt,
                            end: newTournaments[i].endAt,
                            city: newTournaments[i].city,
                            state: newTournaments[i].addrState,
                            zip: newTournaments[i].postalCode,
                            country: newTournaments[i].countryCode,
                            address: removeExtraSymbols(newTournaments[i].venueAddress)
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