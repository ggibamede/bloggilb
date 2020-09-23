//Carregando as constantes necessarias
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const mongose = require('mongoose');
    const app = express();
    const admin = require('./routes/admin');
    const path = require('path');
    const session = require('express-session')
    const flash = require('connect-flash')
    require('./models/Postagem');
    const Postagem = mongose.model('postagens')
//Configurações 
    //Sessão
        app.use(session({
            secret: "cursonode",
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())
    
    //MidleWare
        app.use((req , res , next)=>{
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            next()
        })

    //Body Parser 
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json())
    //Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine','handlebars')
    
    //Mongoose
    mongose.Promise = global.Promise;
    mongose.connect('mongodb://localhost/blogapp').then(()=>{
        console.log('Conexão realizada')
    }).catch((erro)=>{
        console.log('Ocorreu um erro')
    })
    

    //Public
        app.use(express.static(path.join(__dirname,"public")))
        
        
//Rotas 
    app.get('/', function(req, res){
        Postagem.find().populate('categoria').sort({data: 'desc'}).then(function(postagens){
            res.render('index', {postagens: postagens.map((postagem) => postagem.toJSON())});
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao listar postagens');
            res.redirect('/404');
        });
    });

    app.get('/404',(req, res)=>{
        res.send('Erro 404!')
    })

    app.use('/admin', admin)

//Notas




//Outros
const PORT = 8081
app.listen(PORT,()=>{
    console.log('Servidor rodando na porta '+PORT);
})