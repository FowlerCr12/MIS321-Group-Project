let app = document.getElementById('app')
let errorModal

function handleOnLoad() {
    createAccountForm()
    errorModal = new PopupModal({
        title: 'Error',
        type: 'error',
        modalId: 'createAccountError'
    })
}

function createAccountForm() {
    let container = document.createElement('div')
    container.id = 'loginContainer'
    container.classList.add('container', 'd-flex', 'justify-content-center', 'align-items-center', 'vh-100')
    app.appendChild(container)

    let card = document.createElement('div')
    card.classList.add('card', 'p-3')
    container.appendChild(card)

    //makes  the login card in the center of the page.
    let cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    card.appendChild(cardBody)

    let cardTitle = document.createElement('h5')
    cardTitle.classList.add('card-title')
    cardTitle.textContent = 'Create your account to access Legendary Training Services'
    cardBody.appendChild(cardTitle)

    let createAccountForm = document.createElement('form')
    createAccountForm.id = 'createAccount'
    createAccountForm.classList.add('row')
    cardBody.appendChild(createAccountForm)

    let createAccountFormGroup = document.createElement('div')
    createAccountFormGroup.classList.add('form-group')
    createAccountForm.appendChild(createAccountFormGroup)

    // makes the first name input field
    let firstNameInput = document.createElement('input')
    firstNameInput.type = 'text'
    firstNameInput.id = 'firstNameInput'
    firstNameInput.classList.add('form-control', 'mb-3', 'required')
    firstNameInput.required = true
    firstNameInput.placeholder = 'First Name'
    createAccountFormGroup.appendChild(firstNameInput)

    //makes the last name input field
    let lastNameInput = document.createElement('input')
    lastNameInput.type = 'text'
    lastNameInput.id = 'lastNameInput'
    lastNameInput.classList.add('form-control', 'mb-3', 'required')
    lastNameInput.placeholder = 'Last Name'
    lastNameInput.required = true
    createAccountFormGroup.appendChild(lastNameInput)

    // makes the pet name input field
    let petNameInput = document.createElement('input')
    petNameInput.type = 'text'
    petNameInput.id = 'petNameInput'
    petNameInput.classList.add('form-control', 'mb-3', 'required')
    petNameInput.placeholder = 'Pet Name'
    petNameInput.required = true
    createAccountFormGroup.appendChild(petNameInput)

    // makes the pet type input dropdown
    let petTypeSelect = document.createElement('select')
    petTypeSelect.id = 'petTypeSelect'
    petTypeSelect.classList.add('form-control', 'mb-3', 'required')
    petTypeSelect.required = true
    createAccountFormGroup.appendChild(petTypeSelect)

    let defaultPetOption = document.createElement('option') // makes the default option for the pet type dropdown
    defaultPetOption.value = '' // sets the value of the default option to an empty string
    defaultPetOption.textContent = 'Select Pet Type' // sets the text content of the default option to "Select Pet Type"
    defaultPetOption.selected = true // sets the selected attribute of the default option to true
    defaultPetOption.disabled = true // sets the disabled attribute of the default option to true
    petTypeSelect.appendChild(defaultPetOption)
    const availablePetTypes = // can be changed to add more pet types if needed
    [
        "Dog",
        "Cat"
    ]

    for (let i = 0; i < availablePetTypes.length; i++) { // goes through each pet type in the availablePetTypes array and creates the option for each pet type in the dropdown
        let petTypeChoice = document.createElement('option')
        petTypeChoice.value = i
        petTypeChoice.textContent = availablePetTypes[i]
        petTypeSelect.appendChild(petTypeChoice)
    }
    // makes the pet age drop down
    let petAgeSelect = document.createElement('select')
    petAgeSelect.id = 'petAgeSelect'
    petAgeSelect.classList.add('form-control', 'mb-3', 'required')
    petAgeSelect.required = true
    createAccountFormGroup.appendChild(petAgeSelect)
    
    let defaultOption = document.createElement('option') // makes the default option for the pet age dropdown
    defaultOption.value = '' // sets the value of the default option to an empty string
    defaultOption.textContent = 'Select Pet Age' // sets the text content of the default option to "Select Pet Age"
    defaultOption.selected = true // sets the selected attribute of the default option to true
    defaultOption.disabled = true // sets the disabled attribute of the default option to true
    petAgeSelect.appendChild(defaultOption)

    // makes all of the options for selecting the pet age
    for (let i = 0; i <= 16; i++) {
        let ageChoice = document.createElement('option')
        ageChoice.value = i
        ageChoice.textContent = i + ' years'
        petAgeSelect.appendChild(ageChoice)
    }
    

    // makes the email input field
    let emailInput = document.createElement('input')
    emailInput.type = 'email'
    emailInput.id = 'emailInput'
    emailInput.classList.add('form-control', 'mb-3', 'required')
    emailInput.placeholder = 'Email'
    emailInput.required = true
    createAccountFormGroup.appendChild(emailInput)

    // makes the password input field
    let passwordInput = document.createElement('input')
    passwordInput.type = 'password'
    passwordInput.id = 'passwordInput'
    passwordInput.classList.add('form-control', 'required')
    passwordInput.placeholder = 'Password'
    passwordInput.required = true
    createAccountFormGroup.appendChild(passwordInput)

    // makes the create account button
    let createAccountButton = document.createElement('button')
    createAccountButton.type = 'submit'
    createAccountButton.id = 'loginButton'
    createAccountButton.classList.add('btn', 'btn-primary', 'mt-3')
    createAccountButton.textContent = 'Create Account'
    createAccountFormGroup.appendChild(createAccountButton)

    createAccountButton.addEventListener('click', handleCreateAccount)
}

// handle the create account here
async function handleCreateAccount(e) {
    e.preventDefault()
    
    // gets the form values from the input fields so they can be used to create the user object
    const firstName = document.getElementById('firstNameInput').value
    const lastName = document.getElementById('lastNameInput').value
    const email = document.getElementById('emailInput').value
    const password = document.getElementById('passwordInput').value
    
    // combines the first and last name to create the userName
    const userName = `${firstName} ${lastName}`
    
    // creates the user object
    const userData = {
        userEmail: email,
        userName: userName,
        userPassword: password,
        userPayment: null // This can be updated later if needed, but just is null for now cause payment system is not implemented yet. 
    }

    try {
        // sends the user object to the API
        const response = await fetch('http://localhost:5043/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData) 
        })

        if (response.ok) { // if the response is ok then the account is created successfully so user can be redirected to the home page. 
            window.location.href = './home.html'
        } else {
            errorModal.show('Failed to create account. Please try again.') // if the response is not ok then the error modal is shown. 
        }
    } catch (error) {
        errorModal.show('An error occurred while creating your account. Please try again.')
    }
}