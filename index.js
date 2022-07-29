// les librairies
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
// const session = require("express-session");
// const path = require("path");

// CONNEXION A LA BASE DE DONNEES
const con = mysql.createConnection({
    host : "localhost",
    user: "root",
    password: "",
    database: "jarvis"
});

// teste de la connectivité
con.connect((err)=>{
    if(err) throw err;
    console.log("database connected...");
});


// utilisation des librairies
// app.use(session({
//     secret: 'secret',
//     resave: true,
//     saveUninitialized: true
// }));
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// ajout des fichiers statiques
app.use(express.static("public"));

// point de terminaison:port 3000
app.listen(3000, console.log("le serveur démarre"));

app.get("/", (req, res)=>{
    res.sendFile(__dirname+"/index.html");
}); 

// register
app.get("/register", (req, res)=>{
    res.sendFile(__dirname+"/views/register.html");
}); 


// login
app.get("/login",(req,res)=>{
    res.sendFile(__dirname+"/views/login.html");
})


// ajout d' un utilisateur dans une base de données
app.post("/registerUserDatabase", (req, res)=>{
    let state = {
        message : ""
    };
    let userRegister = req.body;
    con.query(
        `INSERT INTO utilisateur 
        (id_U,nom_U,date_naissance_U,sexe_U,mot_de_passe_U,email_U) 
        VALUES (?,?,?,?,?,?)`,
        [
            userRegister.nom_U,
            userRegister.date_naissance_U,
            userRegister.sexe_U,
            userRegister.mot_de_passe_U,
            userRegister.email_U,
        ],
        (err, res)=>{
            if (err) throw err;
            state.message += "User ajouté avec succès";
        }
    );
    res.redirect("/register");
});

// LOGIN
app.post('/login', (req, res)=>{
    let email = req.body.email;
    let password = req.body.password;

    if(email && password){
        con.query('SELECT * FROM connecter WHERE email = ? AND password = ?', 
        [email, password], (err, res, fields)=>{
            if(err) throw err;
            if(res.lenght > 0){
                req.loggedin = true;
                req.email = email;
                res.redirect('/login');
            }else {
                res.send('Incorrect email and/or pasword!');
            }
            res.end();
        });
    }else {
        res.send('Please enter email and password!');
        res.end();
    }
});
app.get('/login', (req, res)=>{
    if(req.loggedin){
        res.send('Welcome back,' + req.email + '!');
    }else {
        res.send('Please login to views this page');
    }
    res.end();
});
