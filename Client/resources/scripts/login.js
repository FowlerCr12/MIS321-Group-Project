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

    //makes the login card in the center of the page.
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

    // makes the email input field
    let emailInput = document.createElement('input')
    emailInput.type = 'email'
    emailInput.id = 'emailInput'
    emailInput.classList.add('form-control', 'mb-3')
    emailInput.placeholder = 'Email'
    loginFormGroup.appendChild(emailInput)

    // makes the password input field
    let passwordInput = document.createElement('input')
    passwordInput.type = 'password'
    passwordInput.id = 'passwordInput'
    passwordInput.classList.add('form-control')
    passwordInput.placeholder = 'Password'
    loginFormGroup.appendChild(passwordInput)

    // makes the login button 
    let loginButton = document.createElement('button')
    loginButton.type = 'submit'
    loginButton.id = 'loginButton'
    loginButton.classList.add('btn', 'btn-primary', 'mt-3')
    loginButton.textContent = 'Login'
    loginFormGroup.appendChild(loginButton)

    loginButton.addEventListener('click', handleLogin)
}

// handle the login here
async function handleLogin(e) {
    e.preventDefault()
    
    const email = document.getElementById('emailInput').value
    const password = document.getElementById('passwordInput').value


    try {
        const response = await fetch('http://localhost:5043/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        })

        const data = await response.json()

        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.user)) // stores the user data in the local storage to be accessed later
            window.location.href = './schedule.html' // redirects to the schedule page 
        } else {
            errorModal.show('Invalid email or password')
        }
    } catch (error) {
        errorModal.show('An error occurred while logging in')
    }
}