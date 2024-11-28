import express from "express"
import { body, validationResult } from "express-validator"
import productsModel from "../models/product.model.js"

const router = express.Router()

/** GET 
 * Deberá de traer todos los productos de la base (Incluyendo la limitación ?limit del desafio)
 * **/
router.get("/", async(req,res)=>{
    try
    {
        let limit = parseInt(req.query.limit)
        let allProducts = await productsModel.find()
        if (allProducts){
            let limitedProds = [...allProducts]
            if (!isNaN(limit) && limit > 0){
                limitedProds = limitedProds.splice(0,limit) //limitar cantidad del parametro
            }
            res.status(200).json({ result: "success", payload: limitedProds})
        }
        else
            res.status(400).json({ result: "error", errors: "No products here" })
    }
    catch (ex){
        res.status(500).json({ result: "error", errors: ex })
    }
})
/** GET 
 * Deberá de traer solo el producto con el ID especificado
 * **/
router.get('/:pid', async(req, res)=>{
    try {
        let { pid } = req.params
        const prod = await productsModel.findOne({ _id: pid })
        if (prod){
            res.send({ result: "success", payload: prod})
        }
        else {
            res.status(400).json({ result: "error", errors: "No product here" })
        }
    }
    catch (error) {
        res.status(500).json({ result: "error", errors: error })
    }
    
})
/** POST 
 * Deberá agregar un nuevo producto con los campos
 * **/
router.post('/', 
    [
        body('title').notEmpty().withMessage('El campo title es requerido'),
        body('description').notEmpty().withMessage('El campo description es requerido'),
        body('code').notEmpty().withMessage('El campo code es requerido'),
        body('status').notEmpty().withMessage('El campo status es requerido'),
        body('price').notEmpty().withMessage('El campo price es requerido'),
        body('stock').notEmpty().withMessage('El campo stock es requerido'),
        body('category').notEmpty().withMessage('El campo category es requerido')
    ], async(req, res)=>{
        try {
            const errores = validationResult(req);
            if (!errores.isEmpty()) {
                return res.status(401).json({ result: "error", errors: errores.array() });
            }
            const newProduct = req.body
            // Insertando producto en BD
            let result = await productsModel.create(newProduct)
            res.send({ result: "success", payload: result})
        }
        catch (error) {
            console.error(error)
            return res.status(400).json({ result: "error", errors: error });
        }
    }
)
/** PUT 
 * Deberá agregar un nuevo producto con los campos
 * **/
router.put('/:pid', 
    [
        body('title').notEmpty().withMessage('El campo title es requerido'),
        body('description').notEmpty().withMessage('El campo description es requerido'),
        body('code').notEmpty().withMessage('El campo code es requerido'),
        body('status').notEmpty().withMessage('El campo status es requerido'),
        body('price').notEmpty().withMessage('El campo price es requerido'),
        body('stock').notEmpty().withMessage('El campo stock es requerido'),
        body('category').notEmpty().withMessage('El campo category es requerido')
    ], async(req, res)=>{
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ result: "error", errors: errores.array() });
        }
        // Obteniendo ID del producto y parametros para actualizar
        let { pid } = req.params
        let productToReplace = req.body
        const prod = await productsModel.findOne({ _id: pid})
        if (prod){
            let product = await productsModel.updateOne({ _id: pid}, productToReplace)
            res.send({ result: "success", payload: product})
        }
        else {
            res.status(404).json({ result: "error", errors: "The Product isn't find" })
        }
})
/** DELETE 
 * Deberá de traer solo el producto con el ID especificado
 * **/
router.delete('/:pid', async(req, res)=>{
    try {
        let { pid } = req.params
        const prod = await productsModel.findOne({ _id: pid })
        if (prod){
            let result = await productsModel.deleteOne({ _id: prod._id })
            res.send({ result: "success", payload: result})
        }
        else {
            res.status(400).json({ result: "error", errors: "No product here" })
        }
    }
    catch (error) {
        res.status(500).json({ result: "error", errors: error })
    }
    
})

// Exportando 
export default router