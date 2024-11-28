import mongoose from "mongoose";

// Nombre de la collección
const userCollection = "users"

// Definir esquema
const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true, max: 100, index: true },
    lastName: {type: String, required: true, max: 150},
    email: {type: String, required: true, max: 50}
})

// Creando y Exportando configuración
const userModel = mongoose.model(userCollection, userSchema)
export default userModel