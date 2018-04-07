
import request from "request"

//import { Database } from "./database"
//const db = new Database()
import { apiKey } from "./apiKey"
import { testSets } from "./constants"

const apiString = "https://www.googleapis.com/youtube/v3/search?part=snippet&key=" + apiKey


const main = () => {

    // db.getSetsByRank().then((sets) => {
    //     getSetUrl(0, sets)
    // })
    getSetUrl(0, testSets)
}


const getSetUrl = (num, sets) => {
    if(num >= sets.length ){
        return
    } 

    const query = apiString + "&q=" + sets[num].winner + "+" + sets[num].loser + "+" + sets[num].tournament
    request.get(query, (error, response, body) => {
        if(error){
            throw error
        }
        console.log(body)
        
    })
}

main()