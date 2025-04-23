document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container")
    let errorModal;
    let response;


    container.className = "container"
    container.style.marginTop = "120px"  // Has to be 120px because of the header that is built with html and css has 120px 

    const buttonRow = document.createElement("div"); // create row of buttons 
    buttonRow.className = "row mb-4"

    const buttonCol = document.createElement("div") // creates the column for the buttons 
    buttonCol.className = "col-12 text-end" // text-end makes button show up on the right hand side of the screen instead of left. 

    const viewClassesButton = document.createElement("button")
    viewClassesButton.className = "btn btn-primary me-2"
    viewClassesButton.setAttribute("data-bs-toggle", "modal")
    viewClassesButton.setAttribute("data-bs-target", "#viewClassesToTeachModal")
    viewClassesButton.innerHTML = '<i class="bi bi-search me-2"></i>View Classes to Teach' // text and the icon for button
    viewClassesButton.addEventListener('click', runViewClasses)

    async function runViewClasses() // helper function to run the other functiosn below
    {
        teachesArray = await getTeaches(); // array of all of the teaches from the database. 
        classesArray = await getClasses(teachesArray); // array of all of the classes from the database. 
        createViewClassesToTeachTable(classesArray); // creates the table for the classes to teach. 
    }

    async function getTeaches() // gets all of the teaches from the database. 
    {
        const userString = localStorage.getItem('user')  // gets the user from the local storage. 
        let user = null; 
        if (userString && userString !== "undefined")
        {
            user = JSON.parse(userString); // parses the user from the local storage to actually be used 
        }
        else {
            console.log("No valid user data found in local storage");
        }
        const userId = user.id;
        
        if (!userId) { // redirects to the login if no user id is found. 
            console.log("No valid user ID found. Redirecting to login page...");
            window.location.href = './adminLogin.html';
            return;
        }
        
        let response = await fetch('http://localhost:5043/api/teaches') // gets the teaches from the database. 
        if(response.status == 200)
        {
            teachesArray = await response.json() // converts the response from the database to JSON so that it can be used in the rest of the code. 
        }
        let newTeachesArray = []
        let newTeachesCount = 0
        for(let i = 0; i < teachesArray.length; i++)
        {
            if(teachesArray[i].trainerID === userId) // checks if the trainer id is the same as the user id so the correct ones are being displayed
            {
                newTeachesArray[newTeachesCount] = teachesArray[i] // adds the teaches to the new array. 
                newTeachesCount++ // increments the count. 
            }
        }
        return newTeachesArray
    }


    // Create View Classes To Teach Modal
    const viewClassesModal = document.createElement("div")
    viewClassesModal.className = "modal fade" // fade makes it so it appears slower and not so jumpy
    viewClassesModal.id = "viewClassesToTeachModal"

    viewClassesModal.innerHTML = `
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addUserModalLabel">View Upcoming Classes You Are Teaching</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <table class="table table-striped table-dark">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Capacity</th>
                                <th>Date</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody id="classesTableBody">
                            <!-- Table rows will be added here -->
                        </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(viewClassesModal)

    document.getElementById('viewClassesToTeachModal').addEventListener('hidden.bs.modal', function () { // Had to use chat to help figure out how to do this. There is an issue with Bootstrap modals that make them not close and forces you to refresh the page and I could not figure out what the issue was. 
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
        document.body.classList.remove('modal-open');
        document.body.style.paddingRight = '';
    });

    function createViewClassesToTeachTable(sortedClasses) // creates the table for the classes to teach. 
    {
        const tableBody = document.getElementById('classesTableBody');
        
        tableBody.innerHTML = '';
        
        sortedClasses.forEach((eachClass) => { // adds the rows for each
            const row = document.createElement('tr')
            row.innerHTML = `
                <td>${eachClass.classID}</td>
                <td>${eachClass.className}</td>
                <td>${eachClass.classType}</td>
                <td>${eachClass.classCapacity}</td>
                <td>${eachClass.classDate}</td>
                <td>${eachClass.classTime}</td>
            `;
            tableBody.appendChild(row);
        });
        
        const modal = new bootstrap.Modal(document.getElementById('viewClassesToTeachModal')); // shows the modal. 
        modal.show();
    }

    async function getClasses(trainerIdClasses) // gets the shops from the database
    {
        let response = await fetch('http://localhost:5043/api/classes')
        if (response.status == 200) // makes sure the response from the database is successful.
        {
            classes = await response.json() // converts the response from the database to JSON so that it can be used in the rest of the code.
        }
        let newClassesArray = []
        let classesCount = 0;
        for(let i = 0; i < trainerIdClasses.length; i++) // goes through each of the classes that the trainer is teaching. 
        {
            for(let j = 0; j < classes.length; j++) // goes through each of the classes in the database. 
            {
                if(trainerIdClasses[i].classID === classes[j].classID) // checks if the class id is the same as the class id in the database. 
                {
                    newClassesArray[classesCount] = classes[j]; // adds the class to the new array. 
                    classesCount++ // increments the count. 
                }
            }
        }
        return newClassesArray
    }


    async function handleAddClass() {
        modal = bootstrap.Modal.getInstance(document.getElementById('addClassModal')) 

        const dateValue = document.getElementById('classDate').value;

        const timeValue = document.getElementById('classTime').value;
        const formattedTime = timeValue + ":00"; // Add seconds to match HH:MM:SS format that is expected 

        const classInfo = // creates the class info object to be sent to the database. 
        {
            className: document.getElementById('className').value,
            classType: document.getElementById('classType').value,
            classDate: dateValue,
            classTime: formattedTime,
            classCapacity: parseInt(document.getElementById('classCapacity').value)
        }

        response = await fetch('http://localhost:5043/api/classes',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(classInfo)
            });

        if (response.ok) {
            modal.hide()
            addUserSuccess.show('Class added successfully')
        }
        else {
            modal.hide()
            addUserError.show(response.statusText)
        }


    }

    buttonCol.appendChild(viewClassesButton)
    buttonRow.appendChild(buttonCol)

    // makes the schedule container
    const scheduleRow = document.createElement("div")
    scheduleRow.className = "row"

    const scheduleCol = document.createElement("div")
    scheduleCol.className = "col-12"

    const scheduleGridContainer = document.createElement("div")
    scheduleGridContainer.id = "scheduleGridContainer"

    scheduleCol.appendChild(scheduleGridContainer)
    scheduleRow.appendChild(scheduleCol)

    // adds all the elements to the page container
    container.appendChild(buttonRow)
    container.appendChild(scheduleRow)

    document.getElementById('saveClassBtn').addEventListener('click', handleAddClass);


    // makes the info modal
    const infoModal = document.createElement("div")
    infoModal.className = "modal fade"
    infoModal.id = "infoModal"

    infoModal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="infoModalLabel">Class Info</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p><strong>Trainer:</strong> <span id="modalTrainer"></span></p>
                    <p><strong>Date:</strong> <span id="modalDate"></span></p>
                    <p><strong>Time:</strong> <span id="modalTime"></span></p>
                    <p><strong>Capacity:</strong> <span id="modalCapacity"></span></p>
                    <div>
                        <button class="btn btn-primary" id="requestClassButton">Request to Teach</button>
                        <button class="btn btn-danger" id="deleteClassBtn">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    `

    document.body.appendChild(infoModal)

    // Gets the current date and calculate the dates for the headers for the current week.
    const today = new Date()
    const currentDay = today.getDay() // Sunday = 0
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - currentDay); // Sets it back to sunday
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6) // End of week (Saturday)

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const timeSlots = ["09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "01:00 PM", "1:30 PM", "2:00 PM", "02:30 PM", "3:00 PM", "3:30 PM", "04:00 PM"] // the time slots for the schedule. 

    let tableHTML = `
        <table class="table table-bordered text-center align-middle bg-white schedule-table">
        <thead class="table-dark">
            <tr>
                <th class="time-column">Time</th>
    `

    for (let index = 0; index < days.length; index++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + index)
        tableHTML += `<th>${days[index]}<br>${date.getMonth() + 1}/${date.getDate()}</th>`
    }

    tableHTML += `
            </tr>
        </thead>
        <tbody>
    `;

    // Builds the rows for each time slot
    for (let i = 0; i < timeSlots.length; i++) {
        const time = timeSlots[i]
        tableHTML += `
            <tr>
                <td><strong>${time}</strong></td>
        `

        // Builds each day cell in the row
        for (let j = 0; j < days.length; j++) {
            const day = days[j]
            const cellId = `${day}_${time.replace(":", "").replace(" ", "")}`
            tableHTML += `<td id="${cellId}"></td>`
        }

        tableHTML += `</tr>`
    }

    tableHTML += `
        </tbody>
        </table>
    `;

    scheduleGridContainer.innerHTML = tableHTML;

    function reformatTimeInformation(timeSpan) {
        [hours, minutes] = timeSpan.split(':')
        hour = parseInt(hours)
        if (hour >= 12) {
            amOrPm = 'PM'
        }
        else {
            amOrPm = 'AM'
        }

        let hourFormatTwelve = hour % 12
        if (hourFormatTwelve === 0) {
            hourFormatTwelve = 12
        }
        return `${hourFormatTwelve.toString()}:${minutes} ${amOrPm}`
    }

    fetch("http://localhost:5043/api/Classes")
        .then(res => res.json()) // converts the response from the database to JSON so that it can be used in the rest of the code. 
        .then(data => { 
            data.forEach((session, index) => { // goes through each of the classes in the database. 
                const classDate = new Date(session.classDate); // gets the date of the class. 

                if (classDate >= startDate && classDate <= endDate) { // checks if the class is within the week's range so that only correct classes are displayed for that week 
                    const weekday = classDate.toLocaleDateString("en-US", { weekday: "long" }) // converts the date to the day of the week. 
                    const timeValue = reformatTimeInformation(session.classTime) // formats the time of the class. 
                    const cellId = `${weekday}_${timeValue.replace(":", "").replace(" ", "")}` // creates the cell id for the class. 
                    const cell = document.getElementById(cellId) // gets the cell for the class. 

                    if (cell) { // if the cell exists then the class is added to the schedule. 
                        cell.innerHTML = `
                            <div class="p-2 rounded text-white bg-primary mb-1" style="font-size: 14px;">
                                ${session.className}
                                <br><small>${session.classType}</small>
                            </div>
                            <button class="btn btn-sm btn-outline-dark view-info-btn" data-index="${index}" data-class-id="${session.classID}">
                                View Info
                            </button>
                        `
                    }
                }
            });

            // View Info modal for when you click on each one
            document.querySelectorAll(".view-info-btn").forEach(button => {
                button.addEventListener("click", (e) => {
                    const session = data[e.target.getAttribute("data-index")] // gets the session object which allows the class info to be correctly displayed. 
                    const classId = e.target.getAttribute("data-class-id") // gets the class id for the class. 
                    document.getElementById("infoModalLabel").innerText = session.className
                    document.getElementById("modalTrainer").innerText = session.classType
                    document.getElementById("modalDate").innerText = new Date(session.classDate).toDateString()
                    document.getElementById("modalTime").innerText = reformatTimeInformation(session.classTime)
                    document.getElementById("modalCapacity").innerText = session.classCapacity
                    document.getElementById("infoModal").setAttribute("data-class-id", classId)
                    
                    const modal = new bootstrap.Modal(document.getElementById("infoModal"))
                    modal.show()
                })
            })
        })
        .catch(err => {
            errorModal = new PopupModal({
                title: 'Error',
                type: 'error',
                modalId: 'scheduleLoadError'
            })
            errorModal.show('The schedule failed to load. Please try again later.');
        })
    document.getElementById('requestClassButton').addEventListener('click', handleRequestClass);
    document.getElementById('deleteClassBtn').addEventListener('click', handleDeleteClass);
});

async function handleRequestClass() {
    const classId = document.getElementById("infoModal").getAttribute("data-class-id"); // gets the class id for the class. 
    console.log("Requesting class with ID:", classId);
    
    // Get the trainer ID from local storage
    const userString = localStorage.getItem('user'); // gets the user from the local storage. 
    if (!userString || userString === "undefined") { // if the user is not found then the error modal is shown. 
        console.error("No user data found");
        // Show error modal
        const errorModal = new PopupModal({
            title: 'Error',
            type: 'error',
            modalId: 'requestClassError'
        });
        errorModal.show('Please log in to request classes.');
        return;
    }

    const user = JSON.parse(userString); // parses the user from the local storage to actually be used 

    const requestData = { // creates the request data object to be sent to the database. 
        requestID: 0, // This will be set by the database
        trainerID: parseInt(user.id), // Convert to integer instead of string
        classID: parseInt(classId),
        requestStatus: "Pending"
    };
        
    try {
        const response = await fetch('http://localhost:5043/api/TrainerRequests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (response.ok) { // if the response is ok then the class is requested successfully so the success modal is shown. 
            console.log("Class requested successfully");
            const infoModal = bootstrap.Modal.getInstance(document.getElementById('infoModal'));
            infoModal.hide();
            
            const successModal = new PopupModal({
                title: 'Success',
                type: 'success',
                modalId: 'requestClassSuccess'
            });
            successModal.show('Class requested successfully! Awaiting approval.');
        } else {
            const errorText = await response.text(); // gets the error text from the response. 
            throw new Error(`Failed to request class: ${errorText}`); // throws an error if the class is not requested successfully. 
        }
    } catch (error) {
        const errorModal = new PopupModal({
            title: 'Error',
            type: 'error',
            modalId: 'requestClassError'
        });
        errorModal.show('Failed to request class. Please try again later.');
    }
}

async function handleDeleteClass(classId) {
    console.log("Delete class button clicked")
}

