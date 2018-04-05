
import request from "request"

import { apiKey } from "./apiKey"
import { testSets } from "./constants"

const apiString = "https://www.googleapis.com/youtube/v3/search?part=snippet&key=" + apiKey


// for(var i = 0; i < testSets.length; i++){
//     const query = apiString + "&q=" + testSets[i].winner + "+" + testSets[i].loser + "+" + testSets[i].tournament
// }
const query = apiString + "&q=" + testSets[0].winner + "+" + testSets[0].loser + "+" + testSets[0].tournament


request.get(query, (error, response, body) => {
    if(error){
        throw error
    }
    console.log(body)

})