
import request from "request"
import { FIRST_CALL, SMASHGG_API } from "./constants"


export const beginTournamentGrab = (numPages, lastSlug) => {
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
        request.get(SMASHGG_API+currentPage, (error, response, body) =>{
            if(error){
                throw(error)
            } else {
                let doNext = true
                const newTournaments = JSON.parse(body).items.entities.tournament
                JSON.parse(body).items.entities.tournament.forEach((t) => {
                for(var i = 0; i < newTournaments.length; i++){
                    if(stopSlug === t.slug){
                        resolve(tournaments)
                        doNext = false
                        break
                    } else {
                        tournaments.push({
                            title: t.name,
                            slug: t.slug,
                            start: t.startAt,
                            end: t.endAt,
                            city: t.city,
                            state: t.addState,
                            zip: t.postalCode,
                            country: t.countryCode,
                            venueAddress: t.venueAddress
                        })
                    }
                })
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