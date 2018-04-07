
import request from "request"
import { FIRST_CALL, SMASHGG_TOURNAMENT_LIST_API, STOP_PAGE, VERBOSE } from "./constants"
import { removeExtraSymbols, removeNonUnicode } from "../helper/helper"

export const getNewTournaments = (numPages, lastSlug) => {
    return new Promise((resolve, reject) => {
        let tournaments = []
        getTournaments(1, numPages, lastSlug, tournaments, resolve) /// <<<<<<<<<<<< Here is where the page is started
    })
}

const getTournaments = (currentPage, numPages, stopSlug, tournaments, resolve) => {

    if(currentPage > numPages || currentPage > STOP_PAGE){
        resolve(tournaments)
    } else {
        console.log("Getting Page " + currentPage + "...")
        const url = SMASHGG_TOURNAMENT_LIST_API + currentPage
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
                            title: removeExtraSymbols(removeNonUnicode(newTournaments[i].name)),
                            slug: newTournaments[i].slug,
                            start: newTournaments[i].startAt,
                            end: newTournaments[i].endAt,
                            city: removeExtraSymbols(removeNonUnicode(newTournaments[i].city)),
                            state: removeExtraSymbols(removeNonUnicode(newTournaments[i].addrState)),
                            zip: removeExtraSymbols(removeNonUnicode(newTournaments[i].postalCode)),
                            country: removeExtraSymbols(removeNonUnicode(newTournaments[i].countryCode)),
                            address: removeExtraSymbols(removeNonUnicode(newTournaments[i].venueAddress)),
                            image: getBestImage(newTournaments[i].images)
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

const getBestImage = (images) => {
    let best = null
    if(images.length > 0){
        best = images[0]
        if(images.length > 1){
            for( var i = 1; i < images.length; i++){
                if(images[i].type === "profile"){
                    if(best.type !== "profile"){
                        best = images[i]
                    } else if( best.width < images[i].width || best.height < images[i].height ){
                        best = images[i]
                    }
                }
            }
        }
    }
    return best ? best.url : null
}