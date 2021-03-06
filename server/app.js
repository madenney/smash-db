// var express = require('express');
// var cors = require('cors');
// var path = require('path');
// var Helper = require('./server/helper.js');
// var helper = new Helper.Helper();

import express from "express"
import cors from "cors"
import path from "path"
import bodyParser from "body-parser"

import { recursiveStringEscape, checkForHugeStrings } from "../helper/helper"
import { RequestHandler } from "../server/requestHandler"

const rh = new RequestHandler()

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// Catch errors thrown by bodyParser
app.use((error, req, res, next) => {
    if(error instanceof SyntaxError){
        res.end(JSON.stringify({
            status: 400,
            message: "Error: Invalid JSON in post body"
        }))
    } else {
        next()
    }
})

// Input Validation / String Sanitization
app.use((req, res, next) => {
    recursiveStringEscape(req.body)
    if( checkForHugeStrings(req.body) ){
        req.body = {
            error: true,
            errorMessage: "Massive String Detected."
        }
    }
    next()
})

app.post('/players', function(req, res) {
    console.log("Getting Players" )
    rh.getPlayers(req.body, res)
})

app.post('/tournaments', function(req, res) {
    console.log("Getting Tournaments" )
    rh.getTournaments(req.body, res)
})

app.post('/sets', function(req, res) {
    console.log("Getting Sets" )
    rh.getSets(req.body, res)
})

app.post('/playerProfile', function(req, res) {
    console.log("Getting Player Profile" )
    rh.getPlayerProfile(req.body, res)
})

app.post('/head2head', function(req, res) {
    console.log("Getting Head 2 Head" )
    rh.getHead2Head(req.body, res)
})

app.post('/search', function(req, res) {
    console.log("Search" )
    rh.search(req.body, res)
})

app.use((req, res, next) => {
    res.end(JSON.stringify({
        status: 404,
        message: "Invalid Route - " + req.originalUrl 
    }))
    next()
})

// app.post('/autocomplete', function(req, res) {
//     console.log("Autocompleting - " + req.body.input)
//     db.autocomplete(res, req.body.input, req.body.pageNum, req.body.resultsPerPage, req.body.getTotalPages)
// })

// app.post('/match_history', function(req, res) {
//     console.log("Getting match history - " + req.body.input, req.body.page)
//     db.getHistory(res, req.body.input,  req.body.page)
// })

// app.post('/player_profile', function(req, res) {
//     console.log("grabbing player profile - " + req.body.input)
//     db.getPlayerProfile(res, req.body.input)
// })

// app.post('/front_page', function(req, res) {
//     console.log("Getting frontpage info")
//     db.getFrontPageInfo(res, req.body.number)
// })

// app.post('/head2headprofile', function(req, res) {
//     console.log("Getting head2head profile")
//     db.getHead2HeadProfile(res, req.body.id1, req.body.id2)
// })

// app.post('/head2headsearch', function(req, res) {
//     console.log("Getting head2head search results")
//     db.getHead2HeadSearch(res, req.body.player1, req.body.input, req.body.pageNum, req.body.resultsPerPage, req.body.getTotalPages)
// })

// app.post('/searchbar', function(req, res) {
//     console.log("SearchBar Handler")
//     searchHandler(res, req.body)
// })

// For testing backend endpoints
//app.use(express.static('testing'))

// app.use(express.static(path.resolve(__dirname, 'client', 'dist')))
// app.use('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
// })

app.listen(3000, function(){
    console.log("Listening on port 3000")
})
