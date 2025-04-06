let app = document.getElementById('app')

function handleOnLoad() {
    createLoginForm()
}


function createLoginForm() {
    let container = document.createElement('div')
    container.id = 'loginContainer'
    container.classList.add('container', 'd-flex', 'justify-content-center', 'align-items-center', 'vh-100')
    app.appendChild(container)

    let card = document.createElement('div')
    card.classList.add('card', 'p-3') 
    container.appendChild(card)

    //create the login card in the center of the page.
    let cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    card.appendChild(cardBody)

    let cardTitle = document.createElement('h5')
    cardTitle.classList.add('card-title')
    cardTitle.textContent = 'Login to continue to Legendary Training Services'
    cardBody.appendChild(cardTitle)

    let loginForm = document.createElement('form')
    loginForm.id = 'loginForm'
    loginForm.classList.add('row')
    cardBody.appendChild(loginForm)

    let loginFormGroup = document.createElement('div')
    loginFormGroup.classList.add('form-group')
    loginForm.appendChild(loginFormGroup)

    // create the Enter email input field
    let emailInput = document.createElement('input')
    emailInput.type = 'email'
    emailInput.id = 'emailInput'
    emailInput.classList.add('form-control', 'mb-3')
    emailInput.placeholder = 'Email'
    loginFormGroup.appendChild(emailInput)

    // create the Enter password input field
    let passwordInput = document.createElement('input')
    passwordInput.type = 'password'
    passwordInput.id = 'passwordInput'
    passwordInput.classList.add('form-control')
    passwordInput.placeholder = 'Password'
    loginFormGroup.appendChild(passwordInput)

    // create the Login button
    let loginButton = document.createElement('button')
    loginButton.type = 'submit'
    loginButton.id = 'loginButton'
    loginButton.classList.add('btn', 'btn-primary', 'mt-3')
    loginButton.textContent = 'Login'
    loginFormGroup.appendChild(loginButton)

    loginButton.addEventListener('click', handleLogin)
}

// handle the login here, need to check if email and password are correct from the database first though
function handleLogin(e) {
    e.preventDefault()
    console.log('Login button clicked')
    window.location.href = '/home.html'
}