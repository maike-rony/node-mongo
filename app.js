/* Módulos */
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const usuarios = require('./routes/usuario')
const path = require('path')
const mongoose = require('mongoose')
const session = require ('express-session')
const flash = require ('connect-flash')


/* Configurações /*

    /* Sessão */
    app.use(session({
        secret: 'node_mongo',
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash());

    /* Middleware */ 
    app.use(function(req, res, next){
        res.locals.sucess_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })   

    /* Handlebars */
    app.engine('handlebars',handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

    /* Body Parser */
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())

    /* Mongoose */
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/blogapp').then(function(){
        console.log('Conectado ao MongoDB!')
    }).catch(function(erro){
        console.log('Erro ao Conectar no MongoD: ' + erro)
    })

    /* Pasta Public */
    app.use(express.static(path.join(__dirname,'public')))

    
/* Rotas */
    app.get('/',function(req, res){
        res.render("index")
    })
    
/* Rotas Arquivos */    
app.use('/admin',admin)
app.use('/usuario',usuarios)

/* Servidor */ 
const port = 8080
app.listen(port, function() {
    console.log ('Servidor Rodando!')    
})

