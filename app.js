//Carregando as constantes necessarias
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const mongose = require('mongoose');
    const app = express();
    const admin = require('./routes/admin');
    const path = require('path');
    const session = require('express-session')
    const flash = require('connect-flash');
const { Console } = require('console');
    require('./models/Postagem');
    const Postagem = mongose.model('postagens')
    require('./models/Categoria');
    const Categoria = mongose.model('categorias');
    const usuarios = require('./routes/usuario');

//Autenticação
    const passport = require('passport')
    require('./config/auth')(passport)
//Configurações 
    //Sessão
        app.use(session({
            secret: "cursonode",
            resave: true,
            saveUninitialized: true
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())
    
    //MidleWares
        app.use((req , res , next)=>{
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            next()
        })

    //Body Parser 
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json())
    //Handlebars
        app.engine('handlebars', handlebars({
            defaultLayout: 'main', 
        }))
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

    app.get('/postagem/:slug',(req , res)=>{
        Postagem.findOne({slug: req.params.slug}).lean().then((postagem)=>{
            if(postagem){
                res.render('postagem/index',{postagem: postagem})
            }else{
                req.flash('erro_msg','Esta postagem não existe')
                res.redirect('/')
            }
        }).catch((err)=>{
            console.log(err)
            req.flash('error_msg','Houve um erro interno')
            res.redirect('/')
        })
    })

    app.get('/404',(req, res)=>{
        res.send('Erro 404!')
    })

    app.get('/categorias',(req, res)=>{
        Categoria.find().lean().then((categorias)=>{
            res.render('categorias/index',{categorias: categorias})
        }).catch((err)=>{
            req.flash('error_msg','Houve um erro interno ao listar as categorias')
        })
    })

    app.get('/categorias/:slug',(req, res)=>{
        Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
            if(categoria){
                
                Postagem.find({categoria: categoria._id}).lean().then((postagens)=>{

                    res.render('categorias/postagens',{postagens: postagens, categoria: categoria})
                    

                }).catch((err)=>{
                    console.log(err)
                    req.flash('error_msg','Houve um erro ao listar os posts')
                    res.redirect('/')
                })

            }else{
                req.flash('error_msg','Esta categoria não existe')
                res.redirect('/')
            }
        }).catch((err)=>{

            req.flash('error_msg','Houve um erro interno ao carregar a pagina desta categoria')
            res.redirect('/')
        })
    })

    app.use('/admin', admin)
    app.use('/usuarios', usuarios)

//Notas




//Outros
const PORT = 8081
app.listen(PORT,()=>{
    console.log('Servidor rodando na porta '+PORT);
})