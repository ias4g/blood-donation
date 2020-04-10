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


//Configurando a apresentação da página
server.get("/", function(req, res){

    const query = "SELECT * FROM donors"


    db.query(query, function(err, result){
        if (err) return res.send("Erro ao fazer consulta no BD")

        const reverse = result.rows
        
        const reverseDonors = [...reverse].reverse()

        let lastDonors = []
        for(let donors of reverseDonors){
            if(lastDonors.length < 4){
                lastDonors.push(donors)
            }
        }

        return res.render("index.html", { donors: lastDonors })
    })

})

server.post("/", function(req, res){

    //Pegando a hora atual do sistema
    const dt = new Date()

    const d = dt.getDate()
    const m = dt.getMonth()
    const yyyy = dt.getFullYear()

    const days = d < 10 ? `0${d}`:d
    const moths = m < 10 ? `0${m}`:m
    const fullDate = `${days}/${moths}/${yyyy}`

    //--------------------------------------------------------

    const hs = dt.getHours()
    const mm = dt.getMinutes()
    const ss = dt.getSeconds()

    const hours = hs < 10 ? `0${hs}`:hs
    const minutes = mm < 10 ? `0${mm}`:mm
    const seconds = ss < 10 ? `0${ss}`:ss
    const fullHours = `${hours}:${minutes}:${seconds}`

    

    //Pegando os dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood
    const created = `${fullDate} às ${fullHours}`

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
        INSERT INTO donors ("name", "email", "blood", "createdAt")
        VALUES ($1, $2, $3, $4)`

    const values = [name, email, blood, created]

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