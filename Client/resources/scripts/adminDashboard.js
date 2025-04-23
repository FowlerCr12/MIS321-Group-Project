document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container")
    let errorModal;
    let response;
    addUserSuccess = new PopupModal({ // instantiates the popupmodal for when the login is not correct. 
        title: 'Success',
        type: 'success',
        modalId: 'addUserSuccess'
    })
    addUserError = new PopupModal({ // instantiates the popupmodal for when the login is not correct. 
        title: 'Error',
        type: 'error',
        modalId: 'addUserError'
    })

    container.className = "container"
    container.style.marginTop = "120px"  // Has to be 120px because of the header that is built with html and css has 120px 

    const buttonRow = document.createElement("div"); // create row of buttons 
    buttonRow.className = "row mb-4"
    
    const buttonCol = document.createElement("div") // creates the column for the buttons 
    buttonCol.className = "col-12 text-end" // text-end makes button show up on the right hand side of the screen instead of left. 

    // Create Add Class button
    const addClassBtn = document.createElement("button")
    addClassBtn.className = "btn btn-primary me-2"
    addClassBtn.setAttribute("data-bs-toggle", "modal")
    addClassBtn.setAttribute("data-bs-target", "#addClassModal")
    addClassBtn.innerHTML = '<i class="bi bi-plus-circle me-2"></i>Add Class' // text and the icon for button

    // Create Add User button
    const addUserBtn = document.createElement("button")
    addUserBtn.className = "btn btn-success"
    addUserBtn.setAttribute("data-bs-toggle", "modal")
    addUserBtn.setAttribute("data-bs-target", "#addUserModal") // makes sure the button opens the addUserModal with that id.
    addUserBtn.innerHTML = '<i class="bi bi-person-plus me-2"></i>Add User' // text and the icon for the button

    // Create Add User Modal
    const addUserModal = document.createElement("div")
    addUserModal.className = "modal fade" // fade makes it so it appears slower and not so jumpy
    addUserModal.id = "addUserModal"
    
    addUserModal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addUserModalLabel">Add New User</h5>
                </div>
                <div class="modal-body">
                    <form id="addUserForm">
                        <div class="mb-3">
                            <label for="userName" class="form-label">Username</label>
                            <input type="text" class="form-control" id="userName" required>
                        </div>
                        <div class="mb-3">
                            <label for="userEmail" class="form-label">Email</label>
                            <input type="email" class="form-control" id="userEmail" required>
                        </div>
                        <div class="mb-3">
                            <label for="userPassword" class="form-label">Password</label>
                            <input type="password" class="form-control" id="userPassword" required>
                        </div>
                        <div class="mb-3">
                            <label for="userAccountType" class="form-label">Role</label>
                            <select class="form-select" id="userAccountType" required>
                                <option value="">Select a role</option>
                                <option value="admin">Admin</option>
                                <option value="trainer">Trainer</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-success" id="saveUserBtn">Save User</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(addUserModal)
    
    
    document.getElementById('saveUserBtn').addEventListener('click', handleAddUser); // event listener to make the function run when the button is clicked

    async function handleAddClass()
    {
        modal = bootstrap.Modal.getInstance(document.getElementById('addClassModal'))
        
        const dateValue = document.getElementById('classDate').value; // changes date to match the databases format
        
        const timeValue = document.getElementById('classTime').value; // changes time to match the databases format
        const formattedTime = timeValue + ":00"; // Add seconds to match HH:MM:SS format 
        
        const classInfo = 
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

        if(response.ok)
        {
            modal.hide()
            addUserSuccess.show('Class added successfully')
        }
        else
        {
            modal.hide()
            addUserError.show(response.statusText)
        } 
    }

    async function handleAddUser() {
        let userType = document.getElementById('userAccountType').value
        modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'))

        if(userType === 'admin')
        {
            const adminUser = {
                adminName: document.getElementById('userName').value,
                adminEmail: document.getElementById('userEmail').value,
                adminPassword: document.getElementById('userPassword').value
            };
            
            response = await fetch('http://localhost:5043/api/admins', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(adminUser)
            });
        }

        if(userType === 'trainer')
        {
            const trainerUser = {
                trainerName: document.getElementById('userName').value,
                trainerEmail: document.getElementById('userEmail').value,
                trainerPassword: document.getElementById('userPassword').value
            };
            
            response = await fetch('http://localhost:5043/api/trainers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(trainerUser)
            });
        }

        if(userType === 'user')
        {
            const regularUser = {
                userName: document.getElementById('userName').value,
                userEmail: document.getElementById('userEmail').value,
                userPassword: document.getElementById('userPassword').value
            };
            
            response = await fetch('http://localhost:5043/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(regularUser)
            });
        }
        if(response.ok)
        {
            modal.hide()
            addUserSuccess.show('User added successfully')

        }
        else
        {
            modal.hide()
            addUserError.show(response.statusText)
        }
    }
    // Create Add Class Modal
    const addClassModal = document.createElement("div")
    addClassModal.className = "modal fade" // fade makes it so it appears slower and not so jumpy
    addClassModal.id = "addClassModal"

    addClassModal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addClassModalLabel">Add New Class to Schedule</h5>
                </div>
                <div class="modal-body">
                    <form id="addClassForm">
                        <div class="mb-3">
                            <label for="className" class="form-label">Class Name</label>
                            <input type="text" class="form-control" id="className" required>
                        </div>
                        <div class="mb-3">
                            <label for="classType" class="form-label">Class Type</label>
                            <input type="text" class="form-control" id="classType" required>
                        </div>
                        <div class="mb-3">
                            <label for="classDate" class="form-label">Class Date</label>
                            <input type="date" class="form-control" id="classDate" required>
                        </div>
                        <div class="mb-3">
                            <label for="classTime" class="form-label">Time</label>
                            <input type="time" class="form-control" id="classTime" 
                                   step="1800" // 1800 is 30 minutes but in seconds 
                                   min="09:30" 
                                   max="16:00" 
                                   required>
                            <small class="form-text">Available times: 9:30 AM to 4:00 PM, in 30 minute intervals</small>
                        </div>
                        <div class="mb-3">
                            <label for="classCapacity" class="form-label">Class Capacity</label>
                            <input type="number" class="form-control" id="classCapacity" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-success" id="saveClassBtn">Save Class</button>
                </div>
            </div>
        </div>
    `

    document.body.appendChild(addClassModal)

    buttonCol.appendChild(addClassBtn)
    buttonCol.appendChild(addUserBtn)
    buttonRow.appendChild(buttonCol)

    // Create schedule container
    const scheduleRow = document.createElement("div")
    scheduleRow.className = "row"
    
    const scheduleCol = document.createElement("div")
    scheduleCol.className = "col-12"
    
    const scheduleGridContainer = document.createElement("div")
    scheduleGridContainer.id = "scheduleGridContainer"
    
    scheduleCol.appendChild(scheduleGridContainer)
    scheduleRow.appendChild(scheduleCol)

    // add all the elements to the page container
    container.appendChild(buttonRow)
    container.appendChild(scheduleRow)

    document.getElementById('saveClassBtn').addEventListener('click', handleAddClass);


    // Create info modal
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
                        <button class="btn btn-primary" id="editClassBtn">Edit</button>
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
    const timeSlots = ["09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "01:00 PM", "1:30 PM", "2:00 PM", "02:30 PM", "3:00 PM", "3:30 PM", "04:00 PM"]

    async function fetchTrainerRequests() {
      const response = await fetch('http://localhost:5043/api/TrainerRequests/pending');
      
      if (response.ok === false) {
        modal = new PopupModal(
          {
            title: 'Error',
            type: 'error',
            modalId: 'trainerRequestsLoadError'
          }
        )
        modal.show('Failed to fetch trainer requests. Please try again later.');
        return []; // returns an empty array if the request fails so everything doesnt blow up
      }
      const data = await response.json();
      return data;
    }

    function buildTrainerRequestTable(requests) {
        let requestTableHTML = `
        <div class="mt-4">
          <h3 class="mb-3">Trainer Class Requests</h3>
          <table class="table table-bordered text-center align-middle bg-white schedule-table">
            <thead class="table-dark">
              <tr>
                <th>Request ID</th>
                <th>Trainer ID</th>
                <th>Class ID</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
        `;
        
        if (!requests || requests.length === 0) {
          requestTableHTML += `
            <tr>
              <td colspan="5">No pending trainer requests</td>
            </tr>
          `;
        } else {
          requests.forEach(request => {
            requestTableHTML += `
              <tr>
                <td>${request.requestID}</td>
                <td>${request.trainerID}</td>
                <td>${request.classID}</td>
                <td>${request.requestStatus}</td>
                <td>
                  <div class="d-flex justify-content-center gap-2">
                    <button class="btn btn-success" onclick="approveRequest(${request.requestID})">Approve</button>
                    <button class="btn btn-danger" onclick="denyRequest(${request.requestID})">Deny</button>
                  </div>
                </td>
              </tr>
            `;
          });
        }
        
        requestTableHTML += `
              </tbody>
            </table>
          </div>
        `;
        
        return requestTableHTML;
      }

    async function loadTrainerRequests() {
      try {
        const trainerRequests = await fetchTrainerRequests();
        const requestTableHTML = buildTrainerRequestTable(trainerRequests);
        
        const scheduleGridContainer = document.getElementById('scheduleGridContainer');
        
        let requestTableContainer = document.getElementById('trainer-request-container');
        if (!requestTableContainer) {
          requestTableContainer = document.createElement('div');
          requestTableContainer.id = 'trainer-request-container';
          scheduleGridContainer.insertAdjacentElement('afterend', requestTableContainer);
        }
        
        requestTableContainer.innerHTML = requestTableHTML;
      } catch (error) {
        console.error('Error loading trainer requests:', error);
        errorModal = new PopupModal({
          title: 'Error',
          type: 'error',
          modalId: 'trainerRequestsLoadError'
        });
        errorModal.show('Failed to load trainer requests. Please try again later.');
      }
    }
    
    let tableHTML = `
        <table class="table table-bordered text-center align-middle bg-white schedule-table">
        <thead class="table-dark">
            <tr>
                <th class="time-column">Time</th>
    `

    for (let index = 0; index < days.length; index++) { // builds the days of the week and the date for the headers
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + index)
        tableHTML += `<th>${days[index]}<br>${date.getMonth() + 1}/${date.getDate()}</th>`
    }

    tableHTML += `
            </tr>
        </thead>
        <tbody>
    `;

    for (let i = 0; i < timeSlots.length; i++) { // builds the rows for each time slot
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

    loadTrainerRequests();

    function reformatTimeInformation(timeSpan) { //reformats the time to be displayed in the schedule
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

    fetch("http://localhost:5043/api/Classes") // fetches the classes from the database
        .then(res => res.json()) // converts the api response to json
        .then(data => { // goes through each class that is parsed from the api
            data.forEach((session, index) => { // goes through each class in the data
                const classDate = new Date(session.classDate);

                if (classDate >= startDate && classDate <= endDate) {
                    const weekday = classDate.toLocaleDateString("en-US", { weekday: "long" }) // gets the current day of the week
                    const timeValue = reformatTimeInformation(session.classTime) // reformats the time to be displayed in the schedule by calling the function that does so
                    const cellId = `${weekday}_${timeValue.replace(":", "").replace(" ", "")}` // creates the id for the cell
                    const cell = document.getElementById(cellId) // gets the actuall cell

                    if (cell) { // if the cell exists
                        cell.innerHTML = `
                            <div class="p-2 rounded text-white bg-primary mb-1" style="font-size: 14px;">
                                ${session.className}
                                <br><small>${session.classType}</small>
                            </div>
                            <button class="btn btn-sm btn-outline-dark view-info-btn" data-index="${index}" classId="${session.classId}">
                                View Info
                            </button>
                        `
                    }
                }
            });

            document.querySelectorAll(".view-info-btn").forEach(button => { // goes through each button in the schedule
                button.addEventListener("click", (e) => { // when the button is clicked
                    const session = data[e.target.getAttribute("data-index")] // gets the class data from the button
                    document.getElementById("infoModalLabel").innerText = session.className // sets the modal title to the class name
                    document.getElementById("infoModal").setAttribute("classId", session.classID) // sets the class id for the modal
                    document.getElementById("modalTrainer").innerText = session.classType // sets the trainer name for the modal
                    document.getElementById("modalDate").innerText = new Date(session.classDate).toDateString() // sets the date for the modal
                    document.getElementById("modalTime").innerText = reformatTimeInformation(session.classTime) // sets the time for the modal
                    document.getElementById("modalCapacity").innerText = session.classCapacity // sets the capacity for the modal
                    const modal = new bootstrap.Modal(document.getElementById("infoModal")) // shows the modal
                    modal.show()
                })
            })
        })
        .catch(err => { // similar to try catch, if the fetch fails then the error is caught and displayed in a popup modal. Had to google this one so don't ask me how it works....
            console.error("Failed to load schedule", err)
            errorModal = new PopupModal({
                title: 'Error',
                type: 'error',
                modalId: 'scheduleLoadError'
            })
            errorModal.show('The schedule failed to load. Please try again later.');
        })
    document.getElementById('editClassBtn').addEventListener('click', handleEditClass); // when the edit button is clicked, the handleEditClass function is called
    document.getElementById('deleteClassBtn').addEventListener('click', handleDeleteClass); // when the delete button is clicked, the handleDeleteClass function is called

    // Create edit class modal
    const editClassModal = document.createElement("div")
    editClassModal.className = "modal fade"
    editClassModal.id = "editClassModal"
    
    editClassModal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editClassModalLabel">Edit Class</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="editClassForm">
                        <div class="mb-3">
                            <label for="editClassName" class="form-label">Class Name</label>
                            <input type="text" class="form-control" id="editClassName" required>
                        </div>
                        <div class="mb-3">
                            <label for="editClassType" class="form-label">Class Type</label>
                            <input type="text" class="form-control" id="editClassType" required>
                        </div>
                        <div class="mb-3">
                            <label for="editClassDate" class="form-label">Class Date</label>
                            <input type="date" class="form-control" id="editClassDate" required>
                        </div>
                        <div class="mb-3">
                            <label for="editClassTime" class="form-label">Time</label>
                            <input type="time" class="form-control" id="editClassTime" 
                                   step="1800"
                                   min="09:30" 
                                   max="16:00" 
                                   required>
                            <small class="form-text">Available times: 9:30 AM to 4:00 PM, in 30-minute intervals</small>
                        </div>
                        <div class="mb-3">
                            <label for="editClassCapacity" class="form-label">Class Capacity</label>
                            <input type="number" class="form-control" id="editClassCapacity" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-success" id="saveEditClassBtn">Save Changes</button>
                </div>
            </div>
        </div>
    `

    document.body.appendChild(editClassModal)

    async function handleEditClass() {
        const classId = document.getElementById("infoModal").getAttribute("class-id"); // gets the class id from the info modal
        const infoModal = bootstrap.Modal.getInstance(document.getElementById("infoModal")); // hides the info modal
        infoModal.hide();


        const response = await fetch(`http://localhost:5043/api/classes/${classId}`); // get's current class data into the edit modal
        if (!response.ok) { // if the response is not ok then the error is displayed in a popup modal
            addUserError.show('Failed to fetch class data');
            return;
        }

        const classData = await response.json();
        
        const classDate = new Date(classData.classDate); // format the date to be displayed cause it needs yyyy-mm-dd
        const formattedDate = classDate.toISOString().split('T')[0];
        

        const formattedTime = classData.classTime.substring(0, 5); // removes seconds from the time so time window can be displayed correctly. 
        
        // gets the edit form to show current data
        document.getElementById("editClassName").value = classData.className; // sets the class name for the edit modal
        document.getElementById("editClassType").value = classData.classType; // sets the class type for the edit modal
        document.getElementById("editClassDate").value = formattedDate; // sets the date for the edit modal
        document.getElementById("editClassTime").value = formattedTime; // sets the time for the edit modal
        document.getElementById("editClassCapacity").value = classData.classCapacity; // sets the capacity for the edit modal
        
        document.getElementById("editClassModal").setAttribute("classId", classId); // sets the class id for the edit modal
        
        const editModal = new bootstrap.Modal(document.getElementById("editClassModal")); // shows the edit modal
        editModal.show();
    }

    document.getElementById('saveEditClassBtn').addEventListener('click', async () => { // when the save button is clicked
        const classId = document.getElementById("editClassModal").getAttribute("classId");
        const editModal = bootstrap.Modal.getInstance(document.getElementById("editClassModal"));
        
        const timeValue = document.getElementById('editClassTime').value; // gets the time value from the edit modal
        const formattedTime = timeValue + ":00"; // formats the time to match the database format (HH:MM:SS)
        
        const dateValue = document.getElementById('editClassDate').value; // gets the date value from the edit modal
        
        const updatedClass = { // creates the updated class object which can be sent to the database,
            classID: parseInt(classId),
            className: document.getElementById('editClassName').value,
            classType: document.getElementById('editClassType').value,
            classDate: dateValue,
            classTime: formattedTime,
            classCapacity: parseInt(document.getElementById('editClassCapacity').value)
        };

        const response = await fetch(`http://localhost:5043/api/classes/${classId}`, { // sends the updated class object to the database
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(updatedClass)
        });

        if (response.ok) { // if the response is ok then the class is updated successfully
            editModal.hide();
            addUserSuccess.show('Class updated successfully');
            window.location.reload(); // refreshes page to show updated data
        } else {
            editModal.hide();
            addUserError.show('Failed to update class');
        }
    });
});

async function approveRequest(requestID) { //handling approve request 
  try {
    console.log(`Approving request with ID: ${requestID}`);
    
    const response = await fetch(`http://localhost:5043/api/TrainerRequests/approve/${requestID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) { // if the response is not ok then the error is displayed in a popup modal
      errorModal = new PopupModal(
        {
          title: 'Error',
          type: 'Error',
          modalId: 'approveRequestError'
        }
      )
      errorModal.show('Failed to approve request. Please try again later.');
    }
    
    const successModal = new PopupModal({
      title: 'Success',
      type: 'success',
      modalId: 'approveRequestSuccess'
    });
    successModal.show(`Request ${requestID} has been approved!`); // shows the success modal
    
    // Refresh the trainer requests list
    loadTrainerRequests();
  } catch (error) {
    console.error('Error approving request:', error);
    const errorModal = new PopupModal({
      title: 'Error',
      type: 'error',
      modalId: 'approveRequestError'
    });
    errorModal.show(`Failed to approve request: ${error.message}`); // error.message is just the error message that comes from the error object
  }
}

async function denyRequest(requestID) { //handling deny request 
    try {
      const response = await fetch(`http://localhost:5043/api/TrainerRequests/deny/${requestID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) { // if the response is not ok then the error is displayed in a popup modal
        errorModal = new PopupModal(
          {
            title: 'Error',
            type: 'Error',
            modalId: 'denyRequestError'
          }
        )
        errorModal.show('Failed to deny request. Please try again later.');
      }
      
      const successModal = new PopupModal({
        title: 'Success',
        type: 'success',
        modalId: 'approveRequestSuccess'
      });
      successModal.show(`Request ${requestID} has been denied!`); // shows the success modal
      
      loadTrainerRequests();
    } catch (error) {
      console.error('Error denying request:', error);
      const errorModal = new PopupModal({
        title: 'Error',
        type: 'error',
        modalId: 'denyRequestError'
      });
      errorModal.show('Failed to deny request. Please try again later.'); // error.message is just the error message that comes from the error object
    }
  }

async function handleDeleteClass(classId) {
    console.log("Delete class button clicked")
}

function loadTrainerRequests() {  // load pending trainer requests
  const requestTableContainer = document.getElementById('trainer-request-container');
  if (requestTableContainer) {
    fetch('http://localhost:5043/api/TrainerRequests/pending')
      .then(response => {
        if (!response.ok) { // if the response is not ok then the error is displayed in a popup modal
          errorModal = new PopupModal(
            {
              title: 'Error',
              type: 'Error',
              modalId: 'loadTrainerRequestsError'
            }
          )
          errorModal.show('Failed to load trainer requests. Please try again later.');
        }
        return response.json();
      })
      .then(data => {
        let requestTableHTML = `
        <div class="mt-4">
          <h3 class="mb-3">Trainer Class Requests</h3>
          <table class="table table-bordered text-center align-middle bg-white schedule-table">
            <thead class="table-dark">
              <tr>
                <th>Request ID</th>
                <th>Trainer Name</th>
                <th>Class Type</th>
                <th>Preferred Schedule</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
        `;
        
        if (!data || data.length === 0) { // if the data is not ok then the error is displayed in a popup modal
          requestTableHTML += `
            <tr>
              <td colspan="5">No pending trainer requests</td>
            </tr>
          `;
        } else {
          data.forEach(request => { //updating trainer requests dynamically
            requestTableHTML += `
              <tr>
                <td>${request.requestID}</td>
                <td>${request.trainerName}</td>
                <td>${request.classType}</td>
                <td>${request.preferredSchedule}</td>
                <td>
                  <div class="d-flex justify-content-center gap-2">
                    <button class="btn btn-success" onclick="approveRequest(${request.requestID})">Approve</button>
                    <button class="btn btn-danger" onclick="denyRequest(${request.requestID})">Deny</button>
                  </div>
                </td>
              </tr>
            `;
          });
        }
        
        requestTableHTML += `
            </tbody>
          </table>
        </div>
        `;
        
        requestTableContainer.innerHTML = requestTableHTML;
      })
      .catch(error => {
        console.error('Error refreshing trainer requests:', error);
      });
  }
}
