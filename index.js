

const express = require("express");
const app = express();

const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");



app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));




const mongoose = require("mongoose");


// const ExpressError=require("./utils/ExpressError.js");
// const wrapAsync=require("./utils/wrapAsync.js");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const Admin=require("./models/admin.js");
const Student=require("./models/student.js");


const session=require("express-session");


const sessionOption={
    secret:"mysupersecretecode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxaAge: 7*24*60*60*1000,
        httpOnly:true

    },
}
app.use(session(sessionOption));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

passport.use(new LocalStrategy(Student.authenticate()));
passport.serializeUser(Student.serializeUser());
passport.deserializeUser(Student.deserializeUser());


main().then(() => {
    console.log("connected");
})
    .catch((err) => {
        console.log(err);

    })
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/temp3');
}
app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});



app.use(async(req,res,next)=>{
 res.locals.currUser=req.user;
 console.log("current user",res.locals.currUser)
next();   
})
app.get('/',(req,res)=>{
    res.send("home");
})

/*********Admin ***********/

app.get("/admin/register", async(req,res)=>{
    let newUser= new Admin({
        email:"komalmahajan235@gmail.com",
        username:"komalmahajan235@gmail.com",
    });
    let usernew= await Admin.register(newUser,"komal");
    res.send(usernew);
})
// admin login form
app.get('/admin',async (req, res) => {    
    res.render("admin/login.ejs");

})
//login
app.post('/admin',passport.authenticate("local",{failureRedirect:"/"}),async(req,res)=>{   
    console.log(req.body); 
    res.redirect('/admin/dashboard');
    
})
app.get('/admin/dashboard',async (req, res) => {   
    res.send("welcome to admin dashboard");

})

app.get('/logout',(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        console.log("you are logged out")
        res.redirect("/");
})})


//student
app.get("/signup", async(req,res)=>{
    
    res.render("student/signup.ejs");
 })
 app.post("/signup",async(req,res)=>{
     try{
         let { email,department,classroomCode, password}=req.body;
         
         let username=email;
         const newUser = new Student({email,username,department,classroomCode});
         const registeredUser =await Student.register(newUser,password);
         console.log(registeredUser);
         req.login(registeredUser,(err)=>{
             if(err){
                 return next(err);
             }
             console.log("user registered successfully");
             res.redirect("/");
         })
         
         
     } catch(e){
         
         res.redirect("/signup");
 
     }
    
 })
 
 app.get('/login',async(req,res)=>{
     res.render("student/login.ejs");
 })
 app.post('/login',passport.authenticate("local",{failureRedirect:"/login"}),async(req,res)=>{
     
       
     res.redirect('/');
    
 })
 