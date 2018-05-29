

export const newRank = (db) => {
    console.log("Ranking players...")

    db.getPlayers().then((players) => {

        players.forEach((player) => {
            player.rank = 2000
        })

        db.getSets().then((sets) => {
            console.log("Going through " + sets.length + " sets...")
            let count = 0
            sets.forEach((set) => {
                if( ++count % 50000 === 0){ console.log("Processed " + count + " out of " + sets.length + "...")}
                const winner = players.find((p) => {
                    return p.id === set.winner_id
                })
                const loser = players.find((p) => {
                    return p.id === set.loser_id
                })

                const RW = Math.pow(10, winner.rank / 400 )
                const RL = Math.pow(10, loser.rank / 400 )

                const EW = RW / ( RW + RL )
                const EL = RL / ( RW + RL )

                winner.rank = winner.rank + 32 * ( 1 - EW )
                loser.rank = loser.rank + 32 * ( 0 - EL )
            })

            console.log("Finished Ranking")
            console.log("Updating DB...")

            db.multipleUpdate("players", players, "rank").then(() => {
                console.log("DB updated successfully.")
                db.closeConnection()
            })

        })
    })
}
