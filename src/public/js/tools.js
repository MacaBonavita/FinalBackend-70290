// Recuperando usuario almacenado
async function getUser() {
    return JSON.parse(localStorage.getItem("userEF")) ?? []
}
// Recuperando usuario almacenado
async function getUserCart() {
    return JSON.parse(localStorage.getItem("cartUser")) ?? []
}
async function validateSesion() {
    const user = await getUser()
    if (!user || user.length == 0)
        location.href = "/"
}
validateSesion()