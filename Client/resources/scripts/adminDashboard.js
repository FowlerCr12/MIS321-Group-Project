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
        
        // Format the date to match the database format (YYYY-MM-DD)
        const dateValue = document.getElementById('classDate').value;
        
        // Format the time to match the database format (HH:MM:SS)
        const timeValue = document.getElementById('classTime').value;
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
                            <small class="form-text">Available times: 9:30 AM to 4:00 PM, in 30-minute intervals</small>
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
      try {
        const response = await fetch('http://localhost:5043/api/TrainerRequests/pending');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching trainer requests:', error);
        return [];
      }
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
                <th>Class Type</th>
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
                <td>${request.requestClassType}</td>
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

    loadTrainerRequests();

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
        .then(res => res.json())
        .then(data => {
            data.forEach((session, index) => {
                const classDate = new Date(session.classDate);

                if (classDate >= startDate && classDate <= endDate) {
                    const weekday = classDate.toLocaleDateString("en-US", { weekday: "long" })
                    const timeValue = reformatTimeInformation(session.classTime)
                    const cellId = `${weekday}_${timeValue.replace(":", "").replace(" ", "")}`
                    const cell = document.getElementById(cellId)

                    if (cell) {
                        cell.innerHTML = `
                            <div class="p-2 rounded text-white bg-primary mb-1" style="font-size: 14px;">
                                ${session.className}
                                <br><small>${session.classType}</small>
                            </div>
                            <button class="btn btn-sm btn-outline-dark view-info-btn" data-index="${index}" data-class-id="${session.classId}">
                                View Info
                            </button>
                        `
                    }
                }
            });

            document.querySelectorAll(".view-info-btn").forEach(button => {
                button.addEventListener("click", (e) => {
                    const session = data[e.target.getAttribute("data-index")]
                    document.getElementById("infoModalLabel").innerText = session.className
                    document.getElementById("modalTrainer").innerText = session.classType
                    document.getElementById("modalDate").innerText = new Date(session.classDate).toDateString()
                    document.getElementById("modalTime").innerText = reformatTimeInformation(session.classTime)
                    document.getElementById("modalCapacity").innerText = session.classCapacity
                    const modal = new bootstrap.Modal(document.getElementById("infoModal"))
                    modal.show()
                })
            })
        })
        .catch(err => {
            console.error("Failed to load schedule", err)
            errorModal = new PopupModal({
                title: 'Error',
                type: 'error',
                modalId: 'scheduleLoadError'
            })
            errorModal.show('The schedule failed to load. Please try again later.');
        })
    document.getElementById('editClassBtn').addEventListener('click', handleEditClass);
    document.getElementById('deleteClassBtn').addEventListener('click', handleDeleteClass);
});

async function approveRequest(requestID) { //handling approve request 
  try {
    const response = await fetch(`http://localhost:5043/api/TrainerRequests/approve/${requestID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const successModal = new PopupModal({
      title: 'Success',
      type: 'success',
      modalId: 'approveRequestSuccess'
    });
    successModal.show(`Request ${requestID} has been approved!`);
    
    loadTrainerRequests();
  } catch (error) {
    console.error('Error approving request:', error);
    const errorModal = new PopupModal({
      title: 'Error',
      type: 'error',
      modalId: 'approveRequestError'
    });
    errorModal.show('Failed to approve request. Please try again later.');
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
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const successModal = new PopupModal({
        title: 'Success',
        type: 'success',
        modalId: 'approveRequestSuccess'
      });
      successModal.show(`Request ${requestID} has been denied!`);
      
      loadTrainerRequests();
    } catch (error) {
      console.error('Error denying request:', error);
      const errorModal = new PopupModal({
        title: 'Error',
        type: 'error',
        modalId: 'denyRequestError'
      });
      errorModal.show('Failed to deny request. Please try again later.');
    }
  }

async function handleEditClass(classId) {
    console.log("Edit class button clicked")
}

async function handleDeleteClass(classId) {
    console.log("Delete class button clicked")
}

function loadTrainerRequests() {  // load pending trainer requests
  const requestTableContainer = document.getElementById('trainer-request-container');
  if (requestTableContainer) {
    fetch('http://localhost:5043/api/TrainerRequests/pending')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
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
        
        if (!data || data.length === 0) {
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