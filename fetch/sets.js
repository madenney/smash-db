
import request from "request"


import { SMASHGG_API_URI } from "./constants"

export const getTournamentData = (tournament, existingPlayers) => {
    return new Promise((resolve, reject) => {
        getBrackets(tournament).then((brackets) => {
            getBracketData(tournament, brackets, existingPlayers).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        }).catch((error) => {
            reject(error)
        })
    })

    
    
}

const getBrackets = (tournament) => {
    return new Promise((resolve, reject) => {
        const url = SMASHGG_API_URI + "/" + tournament.slug + "/event/melee-singles?expand[]=groups"
        request.get(url, (error, response, body) => {
            if(error){
                reject(error)
            } else {
                const parsedBody = JSON.parse(body)
                if(parsedBody.success === false){
                    reject({
                        type: "smashgg",
                        payload: "Error getting brackets for " + tournament.title
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
            getSets(0, brackets, sets, resolve)
        })

        const entrants = []
        const entrantsPromise = new Promise((resolve, reject) => {
            getEntrants(0, brackets, entrants, resolve)
        })

        Promise.all([setsPromise, entrantsPromise]).then(() => {
            const data = combineData(sets, entrants, existingPlayers)
            console.log(data)
            highResolve(data)
        }) 
    })
}

const getSets = (num, brackets, sets, resolve) => {
    if(num >= brackets.length){
        resolve()
    } else {
        const s = SMASHGG_API_URI + "/phase_group/" + brackets[num] + "?expand[]=sets"
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
        resolve()
    } else {
        const s = SMASHGG_API_URI + "/phase_group/" + brackets[num] + "?expand[]=entrants"
        request.get(s, (error, response, body) => {
            if(error){
                throw(error)
            } else {
                JSON.parse(body).entities.entrants.forEach((entrant) => {
                    entrants.push({
                        id: entrant.id,
                        tag: removeExtraSymbols(removeSponsor(entrant))
                    })
                })
                getEntrants(num+1, brackets, entrants, resolve)
            }
        })
    }
}

const combineData = (sets, entrants, existingPlayers) => {
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
        if( set.winner && set.loser && set.winnerScore !== -1 && set.loserScore !== -1 ){
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

const removeExtraSymbols = (tag) => {

    while(tag.indexOf("'") > -1){
        tag = tag.slice(0, tag.indexOf("'")) + tag.slice(tag.indexOf("'") + 1)
    }
    return tag
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