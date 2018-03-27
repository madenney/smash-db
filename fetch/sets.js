
import request from "request"

import { SMASHGG_API_URI } from "./constants"

export const getTournamentSets = (tournament) => {
    console.log("Getting sets for ", tournament.title)
    console.log("SLUG", tournament.slug)
    let s = SMASHGG_API_URI + "/" + tournament.slug + "/event/melee-singles?expand[]=groups"
    console.log(s)
    request.get(s, (error, response, body) => {
        if(error){
            throw(error)
        } else {
            const brackets = []
            const sets = []
            JSON.parse(body).entities.groups.forEach((group) => {
                brackets.push(group.id)
            })

            const setsPromise = new Promise((resolve, reject) => {
                getSets(0, brackets, sets, resolve)
            })
            
            setsPromise.then((sets) => {
                const entrants = []
                const entrantsPromise = new Promise((resolve, reject) => {
                    getEntrants(0, brackets, entrants, resolve)
                })

                entrantsPromise.then((entrants) => {
                    getPlayers(sets, entrants)
                })
            })
        }
    })
    

}

const getSets = (num, brackets, sets, resolve) => {
    if(num >= brackets.length){
        resolve(sets)
    } else {
        const s = SMASHGG_API_URI + "/phase_group/" + brackets[num] + "?expand[]=sets"
        console.log(s)
        request.get(s, (error, response, body) => {
            if(error){
                throw(error)
            } else {
                JSON.parse(body).entities.sets.forEach((set) => {
                    sets.push({
                        entrant1Id: set.entrant1Id,
                        entrant2Id: set.entrant2Id,
                        winnerId: set.winnerId,
                        loserId: set.loserId,
                        entrant1Score: set.entrant1Score,
                        entrant2Score: set.entrant2Score,
                        bestOf: set.bestOf
                    })
                })
                getSets(num+1, brackets, sets, resolve)
            }
        })
    }
}

const getEntrants = (num, brackets, entrants, resolve) => {
    if(num >= brackets.length){
        resolve(entrants)
    } else {
        const s = SMASHGG_API_URI + "/phase_group/" + brackets[num] + "?expand[]=entrants"
        console.log(s)
        request.get(s, (error, response, body) => {
            if(error){
                throw(error)
            } else {
                JSON.parse(body).entities.entrants.forEach((entrant) => {
                    entrants.push({
                        id: entrant.id,
                        name: removeSponsor(entrant)
                    })
                })
                getEntrants(num+1, brackets, entrants, resolve)
            }
        })
    }
}

const getPlayers = (sets, entrants) => {
    console.log("GET PLAYERS")
    console.log(sets.length)
    console.log(entrants.length)
    entrants.forEach((entrant) => {
        console.log(entrant.name)
    })
}

const removeSponsor = (entrant) => {
    let name = entrant.name
    for (var key in entrant.prefixes) {
        if (entrant.prefixes.hasOwnProperty(key)) {
            if(entrant.prefixes[key]){
                name = name.slice(entrant.prefixes[key].length + 3)
            }
        }
    }
    return name
}