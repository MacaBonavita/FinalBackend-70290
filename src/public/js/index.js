// Configura Variables del Cliente
function homePage(){
    localStorage.clear()
}
homePage()

// Creando evento de Inicio de Sesión
document.getElementById("btnSignIn").addEventListener("click", async (event)=>{
    await
    Swal.fire({
        title : "Sign In",
        input : "text",
        text : "Email",
        inputValidator : (value)=>{
            return !value && "You need sign in to continue"
        },
        allowOutsideClick : false
    }).then(result =>{
        user = result.value
        authUser(user)
    })
})
// Creando evento de Inicio de Sesión
document.getElementById("btnSignUp").addEventListener("click", async (event)=>{
    const { value: formValues } = await
    Swal.fire({
        title : "Sign Up",
        html: `
            <input id="txtFirstName" class="swal2-input" placeholder="First name">
            <input id="txtLastName" class="swal2-input" placeholder="Last name">
            <input id="txtEmail" class="swal2-input" placeholder="Email">
        `,
        showCancelButton: true,
        focusConfirm: false,
        preConfirm: () => {
            return [
              document.getElementById("txtFirstName").value,
              document.getElementById("txtLastName").value,
              document.getElementById("txtEmail").value
            ];
        },
        allowOutsideClick : false
    })
    if (formValues){
        console.log(formValues)
        await registerUser(formValues)
    }
})

async function authUser(email) {
    try {
        console.log(`/api/users?email=${email}`)
        const response = await fetch(`/api/users?email=${email}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        //Validando Respuesta
        const jsonRes = await response.json()
        console.warn(jsonRes)
        if (response.ok){
            if (jsonRes.result === "success"){
                localStorage.removeItem("userEF")
                localStorage.setItem("userEF", JSON.stringify(jsonRes.payload))
                location.href = "/products"
            }
            else {
                alert(`Sign In Errors: ${jsonRes.errors}`)
            }
        }
        else {
            console.error(`Auth Method error:`, jsonRes)
            alert(`The user ${email} was not found`)
        }
    }
    catch (error) {
        console.error(`There are problems with the registration method: `, error)
        alert(`The user ${email} wasn't registered, see the console for more details`)
    }
}

async function registerUser(userArray) {
    try {
        const response = await fetch(`/api/users`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName: userArray[0], lastName: userArray[1], email: userArray[2] })
        })
        //Validando Respuesta
        if (response.ok){
            const jsonRes = await response.json()
            if (jsonRes.result === "success"){
                console.log(jsonRes)
                alert(`The user ${userArray[2]} was registered`)
            }
            else {
                alert(`Register Errors: ${jsonRes.errors}`)
            }
        }
        else {
            console.error(`There are problems with the registration method: `, response.statusText)
            alert(`The user ${userArray[2]} wasn't registered: ${response.statusText}`)
        }
    }
    catch (error) {
        console.error(`There are problems with the registration method: `, error)
        alert(`The user ${userArray[2]} wasn't registered, see the console for more details`)
    }
}