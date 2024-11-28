// Recuperando Carrito de Usuario desde BD
async function getUserCartBD() {
    let msj = '', retorno = false, value = {}
    try {
        let user = await getUser()
        // Configurando Petición
        const cart = await fetch(`/api/carts/${user._id}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log(cart)
        const jsonRes = await cart.json()
        if (cart.ok){
            value = jsonRes.payload
            retorno = true
        }
        else {
            msj = `Create Cart: ${jsonRes.errors}`
            throw new Error(`HTTP error! status: ${cart.status}`)
        }
    }
    catch (error){
        console.error(`Create User-Cart Errors: ${error}`)
        msj = `Create User-Cart Errors: ${error}`
        retorno = false
    }
    finally {
        if (retorno)
            return { result: "success", payload: value }
        else
            return { result: "error", errors: msj }
    }
}
// Creando Carrito de Usuario desde BD
async function createUserCartBD(){
    let msj = '', retorno = false, value = {}
    let user = await getUser()
    try {
        const createCart = await fetch(`/api/carts`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: user._id })
        })
        //Validando Respuesta
        const jsonCreate = await createCart.json()
        if (createCart.ok){
            if (jsonCreate.result === "success"){
                retorno = true
                value = jsonCreate.payload
            }
            else {
                msj = `Create User-Cart Errors: ${jsonCreate.errors}`
                throw new Error(`HTTP error! status: ${createCart.status}`)
            }
        }
        else {
            msj = `Create User-Cart Errors: ${jsonCreate.errors}`
            throw new Error(`HTTP error! status: ${createCart.status}`)
        }
    }
    catch (error){
        console.error(`Create User-Cart Errors: ${error}`)
    }
    finally {
        if (retorno)
            return { result: "success", payload: value }
        else
            return { result: "error", errors: msj }
    }
}

// Gestionando Carrito por Usuario
async function manageCart() {
    try {
        const cart = await getUserCartBD()
        if (cart.result === "success"){
            localStorage.removeItem("cartUser")
            localStorage.setItem("cartUser", JSON.stringify(cart.payload))
        }
        else {
            const newCart = await createUserCartBD()
            if (newCart.result === "success") {
                console.log(`New Cart: `, newCart.payload)
                localStorage.removeItem("cartUser")
                localStorage.setItem("cartUser", JSON.stringify(newCart.payload))
            }
            else
                console.warn(newCart.errors)
        }
    }
    catch (error) {
        console.error(`Manage User-Cart Errors: ${error}`)
    }
}
manageCart()


const botonesAgregar = document.querySelectorAll("button.btn-add-confirm")
if (botonesAgregar) {
    for (let btn of botonesAgregar){
        //Añadiendo evento de eliminación
        btn.addEventListener("click", async(event)=>{
            event.preventDefault()
            const cart = await getUserCart()
            if (!cart) {
                alert(`There's no User-Cart`)
            }
            else {
                
                try {
                    const idProd = btn.id
                    if (idProd != null){
                        let quantity = 0
                        await
                        Swal.fire({
                            title : "Add Product",
                            input : "number",
                            text : "Quantity",
                            inputValidator : (value)=>{
                                return !value && "You need specify a quantity for your product"
                            },
                            allowOutsideClick : false
                        }).then(result =>{
                            quantity = result.value
                        })

                        if (quantity > 0){
                            //Definiendo opciones
                            const options = {
                                method: "PUT",
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ quantity: quantity })
                            };
                            //Consumiendo EndPoint
                            const response = await fetch(`/api/carts/${cart._id}/product/${idProd}`, options)
                            const jsonRes = await response.json()
                            console.log(jsonRes)
                            if (response.ok){
                                if (jsonRes.result === "success"){
                                    await manageCart()
                                    await Swal.fire({
                                        title: "Good job!",
                                        text: "You have added a product to your cart",
                                        icon: "success"
                                    });
                                }
                                else {
                                    await Swal.fire({
                                        title: "This isn't ok",
                                        text: jsonRes.errors,
                                        icon: "error"
                                    });
                                }
                            }
                            else
                                throw new Error(`HTTP error! status: ${response.status}`)
                        }
                        else
                            alert(`The Quantity ${quantity} is invalid`)
                    }
                }
                catch (error) {
                    console.error(`Add Product to Cart error: ${error}`)
                }
            }
        })
    }
}

// Creando evento de Inicio de Sesión
document.getElementById("btnLogOut").addEventListener("click", (event)=>{
    localStorage.clear()
    location.href = '/'
})

// Creando evento de Visualización del Cart
document.getElementById("btnSeeCart").addEventListener("click", async(event)=>{
    const cart = await getUserCart()
    if (cart){
        location.href = `/carts/${cart._id}`
    }
    else
        alert(`The User doesn't have a cart`)
})