import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'

const app = express()
app.use(express.json())
app.use(cors())
const port = 5000
const db = Database("./db/data.db", { verbose: console.log })


app.get('/', (req, res) => {
    res.send(`
    <ul>
    <li><a href="/museums">Museums</li>
    <li><a href="/works">Works</li>
    </ul>
    `)
})

const getAllMuseums = db.prepare(`
SELECT * FROM museums; 
`)

const getAllWorks=db.prepare(`
SELECT * FROM works;
`)

const getSingleWork = db.prepare(`
SELECT * FROM works WHERE id= @id;
`)

const getWorksForMuseum = db.prepare(`
SELECT * FROM works WHERE museumId= @museumId;
`)

const getMuseumForWorks= db.prepare(`
SELECT * FROM museums WHERE id= @id;
`)

app.get('/museums', (req, res) => {
    const museums = getAllMuseums.all()

    for (let museum of museums) {
        const works = getWorksForMuseum.all({ museumId: museum.id })
        museum.works = works
    }

    res.send(museums)
})

app.get('/works', (req, res) => {
    const works=getAllWorks.all()
    for(let work of works){
        const museum=getMuseumForWorks.get({id:work.museumId})
        work.museum=museum
    }
    res.send(works)
})

app.listen(port)