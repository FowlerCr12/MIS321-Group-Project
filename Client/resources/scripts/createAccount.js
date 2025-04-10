let app = document.getElementById('app')
let errorModal

function handleOnLoad() {
    createAccountForm()
    // Initialize error modal
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

    //create the login card in the center of the page.
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

    // create the First Name input field
    let firstNameInput = document.createElement('input')
    firstNameInput.type = 'text'
    firstNameInput.id = 'firstNameInput'
    firstNameInput.classList.add('form-control', 'mb-3', 'required')
    firstNameInput.required = true
    firstNameInput.placeholder = 'First Name'
    createAccountFormGroup.appendChild(firstNameInput)

    //create the last name input field
    let lastNameInput = document.createElement('input')
    lastNameInput.type = 'text'
    lastNameInput.id = 'lastNameInput'
    lastNameInput.classList.add('form-control', 'mb-3', 'required')
    lastNameInput.placeholder = 'Last Name'
    lastNameInput.required = true
    createAccountFormGroup.appendChild(lastNameInput)

    // create the pet name input field
    let petNameInput = document.createElement('input')
    petNameInput.type = 'text'
    petNameInput.id = 'petNameInput'
    petNameInput.classList.add('form-control', 'mb-3', 'required')
    petNameInput.placeholder = 'Pet Name'
    petNameInput.required = true
    createAccountFormGroup.appendChild(petNameInput)

    // create the pet type input dropdown
    let petTypeSelect = document.createElement('select')
    petTypeSelect.id = 'petTypeSelect'
    petTypeSelect.classList.add('form-control', 'mb-3', 'required')
    petTypeSelect.required = true
    createAccountFormGroup.appendChild(petTypeSelect)

    let defaultPetOption = document.createElement('option')
    defaultPetOption.value = ''
    defaultPetOption.textContent = 'Select Pet Type'
    defaultPetOption.selected = true
    defaultPetOption.disabled = true
    petTypeSelect.appendChild(defaultPetOption)
    const availablePetTypes = 
    [
        "Dog",
        "Cat"
    ]

    for (let i = 0; i < availablePetTypes.length; i++) {
        let petTypeChoice = document.createElement('option')
        petTypeChoice.value = i
        petTypeChoice.textContent = availablePetTypes[i]
        petTypeSelect.appendChild(petTypeChoice)
    }
    // create the pet age drop down
    let petAgeSelect = document.createElement('select')
    petAgeSelect.id = 'petAgeSelect'
    petAgeSelect.classList.add('form-control', 'mb-3', 'required')
    petAgeSelect.required = true
    createAccountFormGroup.appendChild(petAgeSelect)
    
    let defaultOption = document.createElement('option')
    defaultOption.value = ''
    defaultOption.textContent = 'Select Pet Age'
    defaultOption.selected = true
    defaultOption.disabled = true
    petAgeSelect.appendChild(defaultOption)

    // create all of the options for selecting the pet age
    for (let i = 0; i <= 16; i++) {
        let ageChoice = document.createElement('option')
        ageChoice.value = i
        ageChoice.textContent = i + ' years'
        petAgeSelect.appendChild(ageChoice)
    }
    

    // create the Enter email input field
    let emailInput = document.createElement('input')
    emailInput.type = 'email'
    emailInput.id = 'emailInput'
    emailInput.classList.add('form-control', 'mb-3', 'required')
    emailInput.placeholder = 'Email'
    emailInput.required = true
    createAccountFormGroup.appendChild(emailInput)

    // create the Enter password input field
    let passwordInput = document.createElement('input')
    passwordInput.type = 'password'
    passwordInput.id = 'passwordInput'
    passwordInput.classList.add('form-control', 'required')
    passwordInput.placeholder = 'Password'
    passwordInput.required = true
    createAccountFormGroup.appendChild(passwordInput)

    // create the Login button
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
    
    // Get form values
    const firstName = document.getElementById('firstNameInput').value
    const lastName = document.getElementById('lastNameInput').value
    const email = document.getElementById('emailInput').value
    const password = document.getElementById('passwordInput').value
    
    // Combine first and last name for userName
    const userName = `${firstName} ${lastName}`
    
    // Create user object
    const userData = {
        userEmail: email,
        userName: userName,
        userPassword: password,
        userPayment: null // This can be updated later if needed
    }

    try {
        // Send POST request to API
        const response = await fetch('http://localhost:5043/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        })

        if (response.ok) {
            console.log('Account created successfully')
            window.location.href = './home.html'
        } else {
            console.error('Failed to create account')
            errorModal.show('Failed to create account. Please try again.')
        }
    } catch (error) {
        console.error('Error:', error)
        errorModal.show('An error occurred while creating your account. Please try again.')
    }
}