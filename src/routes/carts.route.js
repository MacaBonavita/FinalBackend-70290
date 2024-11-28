import express from "express"
import { body, validationResult } from "express-validator"
import cartsModel from "../models/cart.model.js"

const router = express.Router()

/** GET 
 * Deberá de traer solo el carrito con el ID de Usuario especificado
 * **/
router.get("/:uid", async(req,res)=>{
    try {
        const cart_uid = req.params.uid
        if (cart_uid){
            const cart = await cartsModel.findOne({ user: cart_uid })
            if (cart) {
                res.status(200).json({ result: "success", payload: cart })
            }
            else {
                res.status(400).json({ result: "error", errors: "There's no cart in the database" })
            }
        }
        else {
            res.status(400).json({ result: "error", errors: "There's no user ID especify" })
        }
    }
    catch (error){
        res.status(500).json({ result: "error", errors: error })
    }
})
/** POST 
 * Deberá de crear el Carrito único por ID de Usuario
 * **/
router.post("/",
    [
        body('user').notEmpty().withMessage('El campo usuario es requerido')
    ], 
    async(req,res)=>{
        try {
            const errores = validationResult(req);
            if (!errores.isEmpty()) {
                return res.status(400).json({ result: "error", errors: errores.array() });
            }
            const newCart = req.body
            // Insertando producto en BD
            let result = await cartsModel.create({ user: newCart.user, products: []})
            res.send({ result: "success", payload: result})
        }
        catch (error) {
            return res.status(500).json({ result: "error", errors: error });
        }
})
/** PUT 
 * Deberá de actualizar el Carrito único por ID de Usuario
 * **/
router.put("/:cid",
    [
        body('products').notEmpty().withMessage('The field products is required')
    ], 
    async(req,res)=>{
        try {
            const cart_cid = req.params.cid
            const errores = validationResult(req);
            if (!errores.isEmpty()) {
                return res.status(400).json({ result: "error", errors: errores.array() });
            }
            const productsCart = req.body.products
            // Actualizando carito en BD
            const cart = await cartsModel.findOne({ _id: cart_cid })
            if (cart){
                cart.products = productsCart
                await cart.save()
                res.send({ result: "success", payload: cart})
            }
            else {
                return res.status(400).json({ result: "error", errors: "Cannot get the cart" });
            }
        }
        catch (error) {
            return res.status(500).json({ result: "error", errors: error });
        }
})
/** PUT 
 * Deberá de crear el Carrito único por ID de Usuario
 * **/
router.put("/:cid/product/:pid",
    [
        body('quantity').notEmpty().withMessage('The field quantity is required')
    ], 
    async(req,res)=>{
        try {
            const cart_cid = req.params.cid
            const prod_pid = req.params.pid
            const errores = validationResult(req);
            if (!errores.isEmpty()) {
                return res.status(400).json({ result: "error", errors: errores.array() });
            }
            const quantity = req.body.quantity
            // Actualizando carito en BD
            const cart = await cartsModel.findOne({ _id: cart_cid })
            if (cart){
                const prod_idx = cart.products.findIndex(p=> p.product.toString() === prod_pid)
                if (prod_idx != -1){
                    cart.products[prod_idx].quantity = quantity
                    await cart.save()
                    res.send({ result: "success", payload: cart})
                }
                else if (prod_idx == -1) {
                    const newProd = {
                        product : prod_pid,
                        quantity : quantity
                    }
                    cart.products.push(newProd)
                    await cart.save()
                    res.send({ result: "success", payload: cart})
                }
                else {
                    return res.status(400).json({ result: "error", errors: "Cannot get the product index" });
                }
            }
            else {
                return res.status(400).json({ result: "error", errors: "Cannot get the cart" });
            }
        }
        catch (error) {
            console.log(error)
            return res.status(500).json({ result: "error", errors: error });
        }
})
/** DELETE 
 * Deberá de eliminar los productos del Carrito
 * **/
router.delete("/:cid", async(req,res)=>{
        try {
            const cart_cid = req.params.cid
            const errores = validationResult(req);
            if (!errores.isEmpty()) {
                return res.status(400).json({ result: "error", errors: errores.array() });
            }
            // Actualizando carito en BD
            const cart = await cartsModel.findOne({ _id: cart_cid })
            if (cart){
                cart.products = []
                await cart.save()
                res.send({ result: "success", payload: cart})
            }
            else {
                return res.status(400).json({ result: "error", errors: "Cannot get the cart" });
            }
        }
        catch (error) {
            return res.status(500).json({ result: "error", errors: error });
        }
})
/** DELETE 
 * Deberá de eliminar el producto del Carrito
 * **/
router.delete("/:cid/product/:pid", async(req,res)=>{
        try {
            const cart_cid = req.params.cid
            const prod_pid = req.params.pid
            const quantity = req.body.quantity
            // Actualizando carito en BD
            const cart = await cartsModel.findOne({ _id: cart_cid })
            if (cart){
                const prod_idx = cart.products.findIndex(p=> p.product.toString() === prod_pid)
                if (prod_idx != -1){
                    cart.products.splice(prod_idx, 1)
                    await cart.save()
                    res.send({ result: "success", payload: cart})
                }
                else {
                    return res.status(400).json({ result: "error", errors: "Cannot get the product index" });
                }
            }
            else {
                return res.status(400).json({ result: "error", errors: "Cannot get the cart" });
            }
        }
        catch (error) {
            return res.status(500).json({ result: "error", errors: error });
        }
})



// Exportando 
export default router