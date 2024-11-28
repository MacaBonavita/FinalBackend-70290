import express from "express"
import mongoose, { mongo } from "mongoose"
import { create } from 'express-handlebars';
import viewsRouter from "./routes/views.route.js"
import productsRouter from "./routes/products.route.js"
import cartsRouter from "./routes/carts.route.js"
import usersRouter from "./routes/users.route.js"
// Importar __DIRNAME
//import __dirname from "./utils.js" 
import __dirname, {insertBaseProducts, ifEquals, inc} from "./utils.js"//Configuración Inicial

// Configuración Inicial
const app = express()
const PORT = 8080

// Configurando Middlewares para endpoints
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Configurar Handlebars para lectura de contenido de los endpoints
const hbs = create({
    runtimeOptions: {
        allowedProtoProperties: true,
        allowProtoMethodsByDefault: true
    },
    helpers: {
        ifEquals,
        inc
    }
});
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')
// Utilizar recursos estaticos
app.use(express.static(__dirname + '/public'))

// Configurando Conexión con mongo db utilizando mongoose
const enviroment = async()=>{
    await mongoose.connect("mongodb+srv://alastairblackwell:3lLd35UcActsfMLZ@cluster0.hprwu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    await insertBaseProducts()
}
// Ejecutando Conexión a Mongo DB
enviroment()
.then(()=>{
    console.log("Database connection succesful")
})
.catch(error=>{
    console.error("Error connecting to database", error)
})

// Enlazando rutas para endpoints
app.use("/", viewsRouter)
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/api/users", usersRouter)

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})