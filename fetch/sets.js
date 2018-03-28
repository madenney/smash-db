
import request from "request"

import { SMASHGG_API_URI } from "./constants"

export const getTournamentData = (tournament) => {
    console.log("Getting sets for ", tournament.title)
    return new Promise((resolve, reject) => {
        getBrackets(tournament).then((brackets) => {
            getBracketData(tournament, brackets).then((data) => {
                resolve(data)
            })
        })
    })

    
    
}

const getBrackets = (tournament) => {
    console.log("Getting Brackets...")
    return new Promise((resolve, reject) => {
        const url = SMASHGG_API_URI + "/" + tournament.slug + "/event/melee-singles?expand[]=groups"
        request.get(url, (error, response, body) => {
            if(error){
                reject(error)
            } else {
                const brackets = []
                JSON.parse(body).entities.groups.forEach((group) => {
                    brackets.push(group.id)
                })
                resolve(brackets)
            }
        })
    })
}

const getBracketData = (tournament, brackets) => {

    return new Promise((highResolve, highReject) => {
        console.log("Brackets Length ", brackets.length)
        const sets = []
        const setsPromise = new Promise((resolve, reject) => {
            getSets(0, brackets, sets, resolve)
        })

        const entrants = []
        const entrantsPromise = new Promise((resolve, reject) => {
            getEntrants(0, brackets, entrants, resolve)
        })

        Promise.all([setsPromise, entrantsPromise]).then(() => {
            const data = combineData(sets, entrants)
            highResolve(data)
        }) 
    })
}

const getSets = (num, brackets, sets, resolve) => {
    console.log("Getting sets - ", num)
    if(num >= brackets.length){
        resolve()
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
    console.log("Getting entrants - ", num)
    if(num >= brackets.length){
        resolve()
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

const combineData = (sets, entrants) => {
    console.log("Combining Data...")
    const data = {
        sets: [],
        players: []
    }
    var count = 0
    entrants.forEach((entrant) => {
        addWithoutRepeats(data.players, entrant)
        sets.forEach((set) => {
            if( set.entrant1Id === entrant.id){
                set.player1 = entrant.name
                set.player1ggId = entrant.id
                if(set.winnerId === entrant.id){
                    set.winner = entrant.name
                } 
            }
            if( set.entrant2Id === entrant.id){
                set.player2 = entrant.name
                set.player2ggId = entrant.id
                if(set.winnerId === entrant.id){
                    set.winner = entrant.name
                } 
            }
        })
    })

    sets.forEach((set) => {
        if( set.player1 && set.player2 && set.entrant1Score !== -1 && set.entrant2Score !== -1 ){
            data.sets.push({
                player1: set.player1,
                player2: set.player2,
                winner: set.winner,
                player1Score: set.entrant1Score,
                player2Score: set.entrant2Score,
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
                name = name.slice(entrant.prefixes[key].length + 3)
            }
        }
    }
    return name
}

const addWithoutRepeats = (arr, entrant) => {
    for( var i = 0; i < arr.length; i++){
        if( arr[i].name === entrant.name ){
            break
        }
    }
    if( i === arr.length){
        arr.push({ 
            name: entrant.name,
            ggId: entrant.id
        })
    }
}