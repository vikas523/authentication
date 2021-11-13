const express               =  require('express'),
      app                   =  express(),
      mongoose              =  require("mongoose"),
      passport              =  require("passport"),
      bodyParser            =  require("body-parser"),
      LocalStrategy         =  require("passport-local"),
      passportLocalMongoose =  require("passport-local-mongoose"),
      User                  =  require("./models/user");


//Connecting database
mongoose.connect("mongodb://localhost:27017/tutorial");

app.use(require("express-session")({
    secret:"Any normal Word",       //decode or encode session
    resave: false,          
    saveUninitialized:false    
}));

passport.serializeUser(User.serializeUser());       //session encoding
passport.deserializeUser(User.deserializeUser());   //session decoding
passport.use(new LocalStrategy(User.authenticate()));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded(
      { extended:true }
))
app.use(passport.initialize());
app.use(passport.session());

//  routes

app.get("/", (req,res) =>{
    res.render("home");
})

app.get("/userprofile",isLoggedIn ,(req,res) =>{
    res.render("userprofile");
})


//Auth Routes
app.get("/login",(req,res)=>{
    res.render("login");
});

app.post("/login",passport.authenticate("local",{
    successRedirect:"/userprofile",
    failureRedirect:"/login"
}),function (req, res){

});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.post("/register",(req,res)=>{
    var rp = req.body.password;
    var cp = req.body.confirmpassword
    // if(rp===cp){
    //     const register=new Register({
    //         // username=req.body.username,
    //         password=rp,
    //         confirmpassword=cp
    //     })
    //     register.save();
    // }else{
    //     console.log("password is not matching");
    // }
    // if(password !== confirmPassword){
    //     throw new Error('Passwords must be same')
//    var validator=()=>{
    
// function valid(req,res,next)
// {
    if(rp!=cp)
    {
    return console.log("passport is not matching");;
}
else{
    return console.log(rp)
}
// next();
// }
   

//    }
   
    // console.log(req)
    // return false
    User.register(new User({username: req.body.username}),{password:req.body.confirmpassword},function(err,user){
        if(err){
            console.log(err);
            res.render("register");
        }
    passport.authenticate("local")(req,res,function(){
        res.redirect("/login");
    })    
    })
})

app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});



function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


//Listen On Server


app.listen(process.env.PORT ||3000,function (err) {
    if(err){
        console.log(err);
    }else {
        console.log("Server Started At Port 3000");
    }
      
});