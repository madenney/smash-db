
import request from "request"


import { SMASHGG_API_URI, VERBOSE } from "./constants"
import { removeExtraSymbols, containsNonUnicodeCharacters } from "./helper"

import { Database } from "./database"
const db = new Database()

export const getTournamentData = (tournament, existingPlayers) => {
    return new Promise((resolve, reject) => {
        getMeleeEventSlug(tournament).then((eventSlug) => {
            getBrackets(tournament, eventSlug).then((brackets) => {
                if(VERBOSE){ console.log("Number of brackets " + brackets.length)}
                getBracketData(tournament, brackets, existingPlayers).then((data) => {
                    resolve(data)
                }).catch((error) => {
                    reject(error)
                })
            }).catch((error) => {
                reject(error)
            })
        }).catch((error) => {
            reject(error)
        })
    })
}

export const getMeleeEventSlug = (tournament) => {
    return new Promise((resolve, reject) => {
        const url = SMASHGG_API_URI + "/" + tournament.slug + "?expand[]=event"
        request.get(url, (error, response, body) => {
            if(error){
                reject(error)
            } else {
                const parsedBody = JSON.parse(body)
                if(parsedBody.entities.event){
                    parsedBody.entities.event.forEach((event) => {
                        if(event.typeDisplayStr === "Melee Singles"){
                            resolve(event.slug)
                        }
                    })
                } else {
                    reject({
                        type: "smashgg_api",
                        message: "Unable to find melee event",
                        slug: tournament.slug,
                        tournament: tournament.title
                    })
                }
            }
        })
    })
}

const getBrackets = (tournament, eventSlug) => {
    return new Promise((resolve, reject) => {
        const url = SMASHGG_API_URI + "/" + eventSlug + "?expand[]=groups"
        request.get(url, (error, response, body) => {
            if(error){
                reject(error)
            } else {
                const parsedBody = JSON.parse(body)
                if(parsedBody.success === false){
                    reject({
                        type: "smashgg_api",
                        message: "Error getting brackets",
                        slug: tournament.slug,
                        tournament: tournament.title
                    })
                } else {
                    const brackets = []
                    parsedBody.entities.groups.forEach((group) => {
                        brackets.push(group.id)
                    })
                    resolve(brackets)  
                }    
            }
        })
    })
}

const getBracketData = (tournament, brackets, existingPlayers) => {
    return new Promise((highResolve, highReject) => {
        const sets = []
        const setsPromise = new Promise((resolve, reject) => {
            getSets(0, brackets, sets, resolve, tournament)
        })

        const entrants = []
        const entrantsPromise = new Promise((resolve, reject) => {
            getEntrants(0, brackets, entrants, resolve, tournament)
        })

        Promise.all([setsPromise, entrantsPromise]).then(() => {
            const data = combineData(sets, entrants, existingPlayers)
            highResolve(data)
        }) 
    })
}

const getSets = (num, brackets, sets, resolve, tournament) => {
    if(num >= brackets.length){
        resolve()
    } else {
        const s = SMASHGG_API_URI + "/phase_group/" + brackets[num] + "?expand[]=sets"
        if(VERBOSE){console.log(s)}
        request.get(s, (error, response, body) => {
            if(error){
                throw(error)
            } else {

                const parsedBody = JSON.parse(body)
                if(parsedBody.entities.sets){
                    parsedBody.entities.sets.forEach((set) => {
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
                }
                getSets(num+1, brackets, sets, resolve, tournament)
            }
        })
    }
}

const getEntrants = (num, brackets, entrants, resolve, tournament) => {
    if(num >= brackets.length){
        resolve()
    } else {
        const s = SMASHGG_API_URI + "/phase_group/" + brackets[num] + "?expand[]=entrants"
        if(VERBOSE){console.log(s)}
        request.get(s, (error, response, body) => {
            if(error){
                throw(error)
            } else {
                let foundNonUnicodeTag = false
                const parsedBody = JSON.parse(body)
                if(parsedBody.entities.entrants){
                    parsedBody.entities.entrants.forEach((entrant) => {
                        if(!containsNonUnicodeCharacters(entrant.name)){
                            entrants.push({
                                id: entrant.id,
                                tag: removeExtraSymbols(removeSponsor(entrant))
                            })
                        } else {
                            if(!foundNonUnicodeTag){
                                foundNonUnicodeTag = true
                                entrants.push({
                                    id: entrant.id,
                                    tag: "NON_UNICODE_TAG"
                                })
                                db.logError({
                                    type: "non_unicode",
                                    message: "Found non-unicode tag in /phase_group/" + brackets[num],
                                    slug: tournament.slug,
                                    tournament: tournament.title
                                })
                            }
                            
                        }
                    })
                }
                getEntrants(num+1, brackets, entrants, resolve, tournament)
            }
        })
    }
}

const combineData = (sets, entrants, existingPlayers) => {

    if(VERBOSE){
        console.log("Combining data...")
        console.log("Number of raw sets: " + sets.length)
        console.log("Number of raw entrants " + entrants.length)
    }

    const data = {
        sets: [],
        players: []
    }
    var count = 0
    entrants.forEach((entrant) => {
        for(var i = 0; i < existingPlayers.length; i++){
            if(entrant.tag.toLowerCase() === existingPlayers[i].tag.toLowerCase() ){
                break
            }
        }
        if(i === existingPlayers.length){
            addWithoutRepeats(data.players, entrant)
        }
        
        sets.forEach((set) => {
            if( set.entrant1Id === entrant.id){
                if(set.winnerId === entrant.id){
                    set.winnerTag = entrant.tag
                    set.winnerScore = set.entrant1Score
                } else {
                    set.loserTag = entrant.tag
                    set.loserScore = set.entrant1Score
                }
            }
            if( set.entrant2Id === entrant.id){
                if(set.winnerId === entrant.id){
                    set.winnerTag = entrant.tag
                    set.winnerScore = set.entrant2Score
                } else {
                    set.loserTag = entrant.tag
                    set.loserScore = set.entrant2Score
                }
            }
        })
    })

    sets.forEach((set) => {
        if( set.winnerTag && set.loserTag && set.winnerScore !== -1 && set.loserScore !== -1 ){
            data.sets.push({
                winnerTag: set.winnerTag,
                loserTag: set.loserTag,
                winnerScore: set.winnerScore,
                loserScore: set.loserScore,
                bestOf: set.bestOf
            })
        }

    })
    return data
}

const removeSponsor = (entrant) => {
    let name = entrant.name
    for (var key in entrant.prefixes) {
        if (entrant.prefixes.hasOwnProperty(key)) {
            if(entrant.prefixes[key]){
                if(name.indexOf(entrant.prefixes[key]) > -1 ){
                    name = name.slice(entrant.prefixes[key].length + 3)
                }
            }
        }
    }
    return name
}

const addWithoutRepeats = (arr, entrant) => {
    for( var i = 0; i < arr.length; i++){
        if( arr[i].tag.toLowerCase() === entrant.tag.toLowerCase() ){
            break
        }
    }
    if( i === arr.length){
        arr.push({ 
            tag: entrant.tag
        })
    }
}