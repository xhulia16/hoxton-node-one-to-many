import Database from "better-sqlite3";

const db = Database("./db/data.db", { verbose: console.log })

const museums=[
    {
        name: "Louvre Museum",
        city: "Paris"
    },
    {
        name: "Museo Nacional del Prado",
        city: "Madrid"
    },
    {
        name: "The British Museum",
        city: "London"
    },
    {
        name:"The Egiptian Museum",
        city: "Cairo"
    }
]

const works=[
    {
        name:"Venus de Milo",
        picture: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Venus_de_Milo_Louvre_Ma399_n4.jpg/560px-Venus_de_Milo_Louvre_Ma399_n4.jpg",
        museumId:1
    },
    {
        name:"Psyche Revived by Cupid's Kiss",
        picture: "https://i.pinimg.com/originals/67/4e/24/674e247cf4b8a9d6cd661d4b147cc572.jpg",
        museumId:1
    },
    {
        name:"Landscape with a Woodland Pool",
        picture: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Albrecht_D%C3%BCrer_-_Der_Weiher_im_Walde_%28ca._1497%29.jpg/250px-Albrecht_D%C3%BCrer_-_Der_Weiher_im_Walde_%28ca._1497%29.jpg",
        museumId: 3
    },
    {
        name:"Statue of the Dwarf Seneb and his Family",
        picture: "https://egymonuments.gov.eg/media/1280/emjg4vlxgaev7f.jpg?crop=0.09932055634612269,0.0900426258368229,0.1012294652390273,0.21295948053342015&cropmode=percentage&width=645&height=423&rnd=133062522480000000",
        museumId: 4
    },
    {
        name:"Menkaura triads",
        picture: "https://egymonuments.gov.eg/media/4111/untitled-9.jpg?center=0.1875,0.43859649122807015&mode=crop&width=645&height=423&rnd=132581519600000000",
        museumId: 4
    },
    {
        name:"Las Meninas",
        picture: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Las_Meninas%2C_by_Diego_Vel%C3%A1zquez%2C_from_Prado_in_Google_Earth.jpg/1200px-Las_Meninas%2C_by_Diego_Vel%C3%A1zquez%2C_from_Prado_in_Google_Earth.jpg",
        museumId: 2
    },
    {
        name:"The Garden of Earthly Delights",
        picture: "https://content3.cdnprado.net/imagenes/Documentos/imgsem/02/0238/02388242-6d6a-4e9e-a992-e1311eab3609/595dc946-f69f-4b8d-9a44-bad39d88b3e9.jpg",
        museumId: 2
    }
]

const createMuseumTable = db.prepare(`
CREATE TABLE IF NOT EXISTS museums(
    id INTEGER, 
    name TEXT NOT NULL, 
    city TEXT NOT NULL, 
    PRIMARY KEY(id)
) 
`)
createMuseumTable.run()

const createWorksTable=db.prepare(`
CREATE TABLE IF NOT EXISTS works(
    id INTEGER,
    name TEXT NOT NULL, 
    picture TEXT NOT NULL,
    museumId INTEGER,
    PRIMARY KEY (id)
)
`)
createWorksTable.run()

const deleteMuseums=db.prepare(`
DELETE FROM museums
`)

deleteMuseums.run()

const deleteWorks=db.prepare(`
DELETE FROM works
`)

deleteWorks.run()

const createMuseums=db.prepare(`
INSERT INTO museums(name, city) VALUES(@name, @city)
`)

for(let museum of museums){
    createMuseums.run(museum)
}

const createWorks=db.prepare(`
INSERT INTO works(name, picture, museumId) Values(@name, @picture, @museumId)
`)

for(let work of works){
    createWorks.run(work)
}