import express from 'express';
import sqlite3 from 'sqlite3';

const app = express();

app.use(express.json());

app.put("/film", (req, res) => {
    const db = new sqlite3.Database("Film.db", (err) => {
        if (err) {
            console.error("Errore apertura DB:", err.message);
            return res.status(500).send(err.message);
        }
    });


    const stmt = db.prepare("INSERT INTO Film (titolo, genere, durata, prezzo, punteggio) VALUES (?,?,?,?,?);");

    // Gestiamo l'evento error dello statement
    stmt.on("error", (error) => {
        console.error("Errore Statement:", error.message);
        res.status(500).send(error.message);
        stmt.finalize((errFinalize) => {
            if (errFinalize) console.error("Errore Finalize:", errFinalize.message);
        });
        db.close((errClose) => {
            if (errClose) console.error("Errore Close:", errClose.message);
        }
    )});

    // Eseguiamo la query con stmt.run
    const film = req.body;

    stmt.run(film.titolo.toLowerCase(), film.genere.toLowerCase(), film.durata, film.prezzo, film.punteggio, (err) => {

        if (err) {
            console.error("Errore Run:", err.message);
            res.status(500).send(err.message);
        }
        else {
            res.send("film inserito correttamente");
        }
    });
});


app.get("/film/:titolo", (req, res) => {

    const db = new sqlite3.Database("Film.db", (err) => {
        if (err) {
            console.error("Errore apertura DB:", err.message);
            return res.status(500).send(err.message);
        }
    });

    const stmt = db.prepare("SELECT * FROM Film WHERE titolo = ?;");

    // Gestiamo l'evento error dello statement
    stmt.on("error", (error) => {
        console.error("Errore Statement:", error.message);
        res.status(500).send(error.message);
        stmt.finalize((errFinalize) => {
            if (errFinalize) console.error("Errore Finalize:", errFinalize.message);
        });
        db.close((errClose) => {
            if (errClose) console.error("Errore Close:", errClose.message);
        });
    });

    // Eseguiamo la query con stmt.all
    stmt.all(req.params.titolo, (err, rows) => {
        if (err) {
            console.error("Errore Query:", err.message);
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }

        // Chiudiamo statement e database dopo aver inviato la risposta
        stmt.finalize((errFinalize) => {
            if (errFinalize) console.error("Errore Finalize:", errFinalize.message);
        });
        db.close((errClose) => {
            if (errClose) console.error("Errore Close:", errClose.message);
        });
    });

});


app.get("/genre/:genere", (req, res) => {
    const db = new sqlite3.Database("Film.db", (err) => {
        if (err) {
            console.error("Errore apertura DB:", err.message);
            return res.status(500).send(err.message);
        }
    });

    const stmt = db.prepare("SELECT * FROM Film WHERE genere = ?;");

    // Gestiamo l'evento error dello statement
    stmt.on("error", (error) => {
        console.error("Errore Statement:", error.message);
        res.status(500).send(error.message);
        stmt.finalize((errFinalize) => {
            if (errFinalize) console.error("Errore Finalize:", errFinalize.message);
        });
        db.close((errClose) => {
            if (errClose) console.error("Errore Close:", errClose.message);
        });
    });

    // Eseguiamo la query con stmt.all
    stmt.all(req.params.genere, (err, rows) => {
        if (err) {
            console.error("Errore Query:", err.message);
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }

        // Chiudiamo statement e database dopo aver inviato la risposta
        stmt.finalize((errFinalize) => {
            if (errFinalize) console.error("Errore Finalize:", errFinalize.message);
        });
        db.close((errClose) => {
            if (errClose) console.error("Errore Close:", errClose.message);
        });
    });
});



    app.get("/dur/:durata", (req, res) => {

        const db = new sqlite3.Database("Film.db", (err) => {
            if (err) {
                console.error("Errore apertura DB:", err.message);
                return res.status(500).send(err.message);
            }
        });

        let stmt = db.prepare("SELECT * FROM Film WHERE durata <= ?;");

        // Gestiamo l'evento error dello statement

        stmt.on("error", (error) => {
            console.error("Errore Statement:", error.message);
            res.status(500).send(error.message);
            stmt.finalize((errFinalize) => {
                if (errFinalize) console.error("Errore Finalize:", errFinalize.message);
            });
            db.close((errClose) => {
                if (errClose) console.error("Errore Close:", errClose.message);
            });
        })
        stmt.all(req.params.durata, (err, rows) => {
            // Chiudiamo il database prima di inviare la risposta
            db.close((errClose) => {
                if (errClose) console.error("Errore chiusura DB:", errClose.message);
            });
    
            if (err) {
                console.error("Errore Query:", err.message);
                return res.status(500).send(err.message);
            }
    
            // Invia i risultati
            res.json(rows);
        })
});

const db = new sqlite3.Database("Film.db", (err) => {
    if (err) {
        console.error("Errore apertura DB:", err.message);
        return;
    }
    db.run('CREATE TABLE IF NOT EXISTS "Film" (    \
            "titolo" TEXT NOT NULL,                   \
            "genere" TEXT NOT NULL,                    \
            "durata" INTEGER NOT NULL CHECK(durata > 0), \
            "prezzo" DOUBLE NOT NULL CHECK(prezzo >= 0), \
            "punteggio" INTEGER NOT NULL CHECK(punteggio > 0),\
            PRIMARY KEY("titolo"))');
        db.run( '   INSERT OR IGNORE INTO "Film" ("titolo", "genere", "durata", "prezzo","punteggio")'   +
            '   VALUES                                                                  '   +
            '   ("inception", "azione", 148, 2.99, 9),                       '   +
            '   ("interstellar", "fantascienza", 169, 3.49, 9),                          '   +
            '   ("il Re Leone", "animazione", 88, 2.99, 8),                        '   +
            '    ("titanic","romantico", 195, 3.99, 7),                             '+ 
            '    ("pulp fiction", "crime", 154, 2.49, 9);                          '    );
});



app.listen(3000, () => {
    console.log("Server in ascolto sulla porta 3000");
});


