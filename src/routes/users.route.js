import express from "express"
import { body, validationResult } from "express-validator"
import usersModel from "../models/user.model.js"

const router = express.Router()

/** GET 
 * Deberá de traer solo el usuario
 * **/
router.get('/', async(req, res)=>{
    try {
        let query = req.query
        if (query.email){
            const user = await usersModel.findOne({ email: query.email })
            if (user){
                res.status(201).json({ result: "success", payload: user})
            }
            else {
                res.status(400).json({ result: "error", errors: "The user doesn't have a account" })
                console.error(user)
            }
        }
        else {
            res.status(400).json({ result: "error", errors: "You must specify the email" })
        }
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ result: "error", errors: error })
    }
    
})
/** POST 
 * Deberá agregar un nuevo usuario para acceder
 * **/
router.post('/', 
    [
        body('firstName').notEmpty().withMessage('FisrtName is required'),
        body('lastName').notEmpty().withMessage('El campo description es requerido'),
        body('email').notEmpty().withMessage('El campo code es requerido')
    ], async(req, res)=>{
        try {
            const errores = validationResult(req);
            if (!errores.isEmpty()) {
                return res.status(401).json({ errores: errores.array() });
            }
            const newUser = req.body

            // Validando registro previo
            const userExits = await usersModel.findOne({ email: newUser.email })
            if (!userExits) {
                // Insertando producto en BD
                let result = await usersModel.create(newUser)
                res.status(200).json({ result: "success", payload: result})
            }
            else {
                res.status(402).json({ result: "error", errors: `The email ${newUser.email} is already in use`})
            }
            
        }
        catch (error) {
            console.error(error)
            return res.status(500).json({ result: "error", errors: error });
        }
    }
)
// Exportando 
export default router