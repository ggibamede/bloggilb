//Carregando as constantes necessarias
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    //const mongosse = require('mongoose');
    const app = express();
//Configurações 
    //Body Parser 
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json())
    //Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine','handlebars')

//Rotas 


//Notas




//Outros
const PORT = 8081
app.listen(PORT,()=>{
    console.log('Servidor rodando na porta '+PORT);
})