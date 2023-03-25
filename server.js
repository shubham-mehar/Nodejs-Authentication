// import express from "express";
// import path from "path";
// import mongoose from "mongoose";
// import cookieParser from "cookie-parser";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";

// mongoose.connect("mongodb://127.0.0.1:27017",{
//     dbName:"backendtuts"
// }).then(()=>{
//     console.log("Database Connected!!!");
// }).catch((err)=>{
//     console.log(err);
// })

// // const messageSchema = new mongoose.Schema({
// //     name: String, email: String
// // }) 
// const userSchema = new mongoose.Schema({
//     name: String, email: String, password: String
// }) 

// // const Message = mongoose.model("Messages",messageSchema) 
// const User = mongoose.model("User",userSchema)

// const app = express();

// //middlewares
// app.use(express.static(path.join(path.resolve(),"public")))
// app.use(express.urlencoded({extended:true}))
// app.use(cookieParser())

// //setting up view engine
// app.set("view engine","ejs")

// const isAuthenticated = async(req,res,next)=>{
//     const {token} = req.cookies;
//     if(token){       
//         const decoded = jwt.verify(token, "8ewv8t95t98c2m4");
//         req.user = await User.findById(decoded._id);
//         next();
//     }
//     else{res.redirect("/login")}
// }
// app.get("/",isAuthenticated,(req,res)=>{
//     res.render("logout",{name:req.user.name})
// })
// app.get("/register",(req,res)=>{
//     res.render("register")
// })
// app.get("/login",(req,res)=>{
//     res.render("login")
// })
// app.get('/logout',(req,res)=>{
//     res.cookie("token",null,{ httpOnly:true, expires:new Date(Date.now()) })
//     res.redirect('/')
// })
// app.post("/login",async (req,res)=>{
//     const {email, password} = req.body;
//     const user = await User.findOne({email});
//     if(!user) return res.redirect("/register");
//     const isMatch = await bcrypt.compare(password, user.password)
//     if(!isMatch) return res.render("login", {email ,message:"Incorrect Password"});
//     const token = jwt.sign({_id:user._id}, "8ewv8@t95t&^98}&]c2m4")
//     res.cookie("token",token,{ httpOnly:true, expires: new Date(Date.now()+60*1000) });
//     res.redirect("/")
// })
// app.post("/register", async(req,res)=>{
//     const {name, email, password} = req.body;
//     const finduser = await User.findOne({email})
//     if(finduser) return res.render('login') 
//     const hashedPassword = await bcrypt.hash(password,10);
//     const user = await User.create({ name:name, email:email, password:hashedPassword});
//     const token = jwt.sign({_id:user._id}, "8ewv8@t95t&^98}&]c2m4")
//     res.cookie("token",token,{ httpOnly:true, expires: new Date(Date.now()+60*1000) })
//     res.redirect("/")
// } )

// const port = 5001;

// app.listen(port,()=>[
//     console.log(`Server running on ${port} `)
// ])




// // app.get("/success",(req,res)=>{
// //     res.render("success");
// // })
// // app.get("/users",(req,res)=>{
// //     res.json({users});
// // })

// // app.post("/contact", async(req,res)=>{

// //     const {name, email} = req.body;
// //     // await Message.create({name:req.body.name, email:req.body.email})
// //     await Message.create({name:name, email:email})
// //     res.redirect("/success")
// // })

// // app.get("/add", async (req,res)=>{
// //     await Message.create(
// //         {
// //             name:"test-user1",
// //             email:"test-User@example.com"
// //         }
// //     )
// //     res.send("OKIE")
// // })











import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbName: "backend",
  })
  .then(() => console.log("Database Connected"))
  .catch((e) => console.log(e));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

const app = express();

// Using Middlewares
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Setting up View Engine
app.set("view engine", "ejs");

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const decoded = jwt.verify(token, "sdjasdbajsdbjasd");

    req.user = await User.findById(decoded._id);

    next();
  } else {
    res.redirect("/login");
  }
};

app.get("/", isAuthenticated, (req, res) => {
  res.render("logout", { name: req.user.name });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user) return res.redirect("/register");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    return res.render("login", { email, message: "Incorrect Password" });

  const token = jwt.sign({ _id: user._id }, "sdjasdbajsdbjasd");

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.redirect("/login");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ _id: user._id }, "sdjasdbajsdbjasd");

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});

app.listen(5001, () => {
  console.log("Server is working");
});

