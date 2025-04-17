let app = document.getElementById('app')
let errorModal

function handleOnLoad() {
    createLoginForm()
    errorModal = new PopupModal({ // instantiates the popupmodal for when the login is not correct. 
        title: 'Error',
        type: 'error',
        modalId: 'loginError'
    })
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
    cardTitle.textContent = 'Admin Login'
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

    // Add event listener to the form instead of just the button
    loginForm.addEventListener('submit', handleLogin)
}

// handle the login here
async function handleLogin(e) {
    e.preventDefault()

    const email = document.getElementById('emailInput').value
    const password = document.getElementById('passwordInput').value

    if(email === null || password === null)
    {
        errorModal.show('Please enter both email and password')
        return
    }

    try {
        const response = await fetch('http://localhost:5043/api/admins/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        })


        const data = await response.json()
        console.log('Login response:', data)

        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.user))
            window.location.href = './adminDashboard.html'
        } else {
            errorModal.show('Invalid email or password')
        }
    } catch (error) {
        console.error('Error:', error)
        errorModal.show(`An error occurred while logging in: ${error.message}`)
    }
}