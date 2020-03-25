//Configurando o servidor
const express = require("express")
const server = express()

//Configurando o servidor para apresentar arquivos extras estáticos
server.use(express.static('public'))

//Habilitando o BODY do formulário no EXPRESS
server.use(express.urlencoded({ extended: true }))

//Configurando a conexão com o BD POSTGRES
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '2046',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

//Configurando o template engine
const nunjucks = require('nunjucks')
nunjucks.configure("./", {
    express: server,
    noCache: true
})

// Lista de doadores, vetor -> Array
// const donors = [
//     {
//         name: "Izael silva",
//         blood: "A+"
//     },
//     {
//         name: "Oséias silva",
//         blood: "A-"
//     },
//     {
//         name: "Lurdes silva",
//         blood: "B+"
//     },
//     {
//         name: "Socorro lima",
//         blood: "B-"
//     },
//     {
//         name: "Bonária silva",
//         blood: "AB+"
//     },
//     {
//         name: "Rúbia silva",
//         blood: "AB-"
//     },
//     {
//         name: "Jardson silva",
//         blood: "O+"
//     },
//     {
//         name: "Adelmo silva",
//         blood: "O-"
//     }
// ]

//Configurando a apresentação da página
server.get("/", function(req, res){

    const query = "SELECT * FROM donors ORDER BY name"

    db.query(query, function(err, result){
        if (err) return res.send("Erro ao fazer consulta no BD.")

        const donors = result.rows
        return res.render("index.html", { donors })
    })

})

server.post("/", function(req, res){
    //Pegando os dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    // Colocando os valors dentro do array
    // donors.push({
    //     name,
    //     blood
    // })

    if(name === "" || email === "" || blood === ""){
        return res.send("Todas os campos são obrigatórios!!")
    }

    //Colocando os dados dentro do DB
    const query = `
        INSERT INTO donors ("name", "email", "blood")
        VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err){

        //Fluxo de erro
        if (err) return res.send("Erro no BD.")

        //Fluxo normal
        return res.redirect("/")
    })
 
})

//ligando o servidor e permitindo o acesso à porta 3000
server.listen(3000, function(){
    console.log("Servidor rodando... na porta 3000 : http://127.0.0.1:3000")
})