if(process.env.NODE_ENV == 'production'){
    module.exports = {mongoURI: "mongodb+srv://gilbertom:1234@blogapp-proj.djgfc.mongodb.net/blogapp-proj?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: 'mongodb://localhost/blogapp'}
}