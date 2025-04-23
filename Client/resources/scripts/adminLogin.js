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

    let accountTypeSelect = document.createElement('select')
    accountTypeSelect.id = 'accountTypeSelect'
    accountTypeSelect.classList.add('form-control', 'mb-3')
    loginFormGroup.appendChild(accountTypeSelect)

    let adminChoice = document.createElement('option')
    adminChoice.value = 'admin'
    adminChoice.textContent = 'Admin'
    accountTypeSelect.appendChild(adminChoice)

    let trainerChoice = document.createElement('option')
    trainerChoice.value = 'trainer'
    trainerChoice.textContent = 'Trainer'
    accountTypeSelect.appendChild(trainerChoice)

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

    // event listener for the login form to handle the login
    loginForm.addEventListener('submit', handleLogin)
}

// handle the login here
async function handleLogin(e) {
    e.preventDefault()

    const email = document.getElementById('emailInput').value // gets the email from the input field
    const password = document.getElementById('passwordInput').value // gets the password from the input field
    const accountType = document.getElementById('accountTypeSelect').value // gets the account type from the dropdown menu which correctly routes the login to the correct api
    // url statements handle login to the correct api
    if(accountType === 'admin')
    {
        url = 'http://localhost:5043/api/admins/login' // sets url to the correct endpoint
        hrefLink = './adminDashboard.html' // sets the redirect link to the admin dashboard
    }
    else
    {
        url = 'http://localhost:5043/api/trainers/login' // sets url to the correct endpoint
        hrefLink = './trainerDashboard.html' // sets the redirect link to the trainer dashboard
    }

    if(email === null || password === null) // if the email or password is not entered then the error modal is shown
    {
        errorModal.show('Please enter both email and password')
        return
    }

    try {
        const response = await fetch(url, { // gets correct url from if statements then sends to the correct api.
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        })
        
        const data = await response.json()

        if (data.success) {
            // Check if data.user exists and is not undefined
            if (data.user) 
            {
                localStorage.setItem('user', JSON.stringify(data.user)) // sets the user to the local storage
            }
            window.location.href = hrefLink // redirects to the correct dashboard based on account type from if statements above
        } else {
            errorModal.show(data.message || 'Login failed. Please check your credentials.') // shows the error modal
        }
    } catch (error) {
        errorModal.show(`An error occurred while logging in: ${error.message}`) // shows the error modal with the actual error message. 
    }
}