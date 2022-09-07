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

const getAllWorks = db.prepare(`
SELECT * FROM works;
`)

const getSingleWork = db.prepare(`
SELECT * FROM works WHERE id= @id;
`)

const getWorksForMuseum = db.prepare(`
SELECT * FROM works WHERE museumId= @museumId;
`)

const getMuseumForWorks = db.prepare(`
SELECT * FROM museums WHERE id= @id;
`)

const createAMuseum = db.prepare(`
INSERT INTO museums(name, city) VALUES(@name, @city);
`)

const createAWork =db.prepare(`
INSERT INTO works(name, picture, museumId) VALUES(@name, @picture, @museumId);
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
    const works = getAllWorks.all()
    for (let work of works) {
        const museum = getMuseumForWorks.get({ id: work.museumId })
        work.museum = museum
    }
    res.send(works)
})

app.get('/museums/:id', (req, res) => {
    const museum = getMuseumForWorks.get(req.params)

    if (museum) {
        const works = getWorksForMuseum.all({ museumId: museum.id })
        museum.works = works
        res.send(museum)
    }
    else {
        res.status(404).send({ error: 'Museum not found.' })
    }

})

app.get('/works/:id', (req, res) => {
    const work = getSingleWork.get(req.params)
    if (work) {
        let museum = getMuseumForWorks.get({ id: work.museumId })
        work.museum = museum
        res.send(work)
    }
    else {
        res.status(404).send({ error: "Work not found!" })
    }
})

app.post('/museums', (req, res) => {
    const errors: string[] = []
    const name = req.body.name
    const city = req.body.city

   if(typeof name !== "string"){
    errors.push("Please enter a valid name!")
   }
   if(typeof city !=="string"){
    errors.push("Please enter a valid city!")
   }

   if(errors.length===0){
    const newMuseum = createAMuseum.run(req.body)
    const museum = getMuseumForWorks.get({ id: newMuseum.lastInsertRowid })
    res.send(museum)
   }

 else{
    res.status(400).send({errors})
 }
  
})

app.post('/works', (req, res)=>{
    const errors: string[]=[]
    const name=req.body.name;
    const picture=req.body.picture;
    const museumId=Number(req.body.museumId)

    if(typeof name !== "string"){
        errors.push("Please enter a valid name!")
    }
    if(typeof picture!== "string"){
        errors.push("Please enter a picture address!")
    }

    if(typeof museumId !=="number"){
        errors.push("Please enter a valid museum ID!")
    }

    if(errors.length===0){
        const museum=getMuseumForWorks.get({id: museumId})
        if(museum){
            const newWork=createAWork.run(req.body)
            const work=getSingleWork.get({id:newWork.lastInsertRowid})
            res.send(work)
        }
       else{
        res.status(404).send({error: "No matching museums for this work"})
       }
    }

    else{
        res.status(400).send({errors})
    }

})

app.listen(port)
