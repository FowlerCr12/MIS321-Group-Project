document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("scheduleGridContainer");
    let errorModal;
    let successModal;

    // Get the current date and calculate the week's range (Sunday to Saturday)
    const today = new Date();
    const currentDay = today.getDay();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - currentDay);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const timeSlots = [
        "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM",
        "01:00 PM", "1:30 PM", "2:00 PM", "02:30 PM",
        "3:00 PM", "3:30 PM", "04:00 PM"
    ];

    let tableHTML = `
        <table class="table table-bordered text-center align-middle bg-white schedule-table">
            <thead class="table-dark">
                <tr>
                    <th class="time-column">Time</th>
    `;

    for (let index = 0; index < days.length; index++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + index);
        tableHTML += `<th>${days[index]}<br>${date.getMonth() + 1}/${date.getDate()}</th>`;
    }

    tableHTML += `
                </tr>
            </thead>
            <tbody>
    `;

    for (let i = 0; i < timeSlots.length; i++) {
        const time = timeSlots[i];
        tableHTML += `
            <tr>
                <td><strong>${time}</strong></td>
        `;

        for (let j = 0; j < days.length; j++) {
            const day = days[j];
            const cellId = `${day}_${time.replace(":", "").replace(" ", "")}`;
            tableHTML += `<td id="${cellId}"></td>`;
        }

        tableHTML += `</tr>`;
    }

    tableHTML += `
            </tbody>
        </table>
    `;

    container.innerHTML = tableHTML;

    function reformatTimeInformation(timeSpan) {
        const [hours, minutes] = timeSpan.split(':');
        let hour = parseInt(hours);
        let amOrPm = hour >= 12 ? 'PM' : 'AM';
        let hourFormatTwelve = hour % 12;
        if (hourFormatTwelve === 0) {
            hourFormatTwelve = 12;
        }
        return `${hourFormatTwelve}:${minutes} ${amOrPm}`;
    }

    // Initialize modals
    errorModal = new PopupModal({
        title: 'Error',
        type: 'error',
        modalId: 'enrollmentError'
    });
    
    successModal = new PopupModal({
        title: 'Success',
        type: 'success',
        modalId: 'enrollmentSuccess'
    });

    // Add event listener to the enroll button
    document.getElementById('enrollBtn').addEventListener('click', handleEnrollment);

    // Function to handle enrollment
    async function handleEnrollment() {
        // Get the current user from localStorage
        const userString = localStorage.getItem('user');
        if (!userString || userString === "undefined") {
            errorModal.show('Please log in to enroll in a class');
            return;
        }

        const user = JSON.parse(userString);
        const userId = user.id;
        
        // Get the current class from the modal
        const classId = document.getElementById('infoModalLabel').getAttribute('data-class-id');
        const currentlyEnrolled = parseInt(document.getElementById('modalCurrentlyEnrolled').textContent);
        const capacity = parseInt(document.getElementById('modalCapacity').textContent);
        
        // Check if the class is at capacity
        if (currentlyEnrolled >= capacity) {
            errorModal.show('This class is already at capacity');
            return;
        }
        
        // Create enrollment object
        const enrollment = {
            enrollmentID: 0, // The database will auto-increment this
            classID: parseInt(classId),
            userID: userId,
            enrollmentTimeStatus: "Enrolled" // This field is in the model but not used in the SQL
        };
        
        try {
            // Send POST request to enroll API
            const response = await fetch('http://localhost:5043/api/enroll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(enrollment)
            });
            
            if (response.ok) {
                // Close the modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('infoModal'));
                modal.hide();
                
                // Show success message
                successModal.show('Successfully enrolled in the class!');
                
                // Refresh the page to update enrollment counts
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                const errorData = await response.json().catch(() => null);
                console.error('Enrollment error:', errorData);
                errorModal.show('Failed to enroll in the class. Please try again.');
            }
        } catch (error) {
            console.error('Error enrolling in class:', error);
            errorModal.show('An error occurred while enrolling in the class');
        }
    }

    // Fetch both classes and enrollments
    Promise.all([ // .all just makes sure that both the classes and enrollements are fetched correctly.
        fetch("http://localhost:5043/api/Classes").then(res => res.json()), // gets the classes from the database and puts them into 
        fetch("http://localhost:5043/api/enroll").then(res => res.json())
    ])
        .then(([classes, enrollments]) => { // makes an array of the classes and enrollments in one go
            const enrollmentCounts = {}; // creates empty so that enrollment counts can be stored. 
            enrollments.forEach(enrollment => { // goes through each enrollment and adds it to the enrollment counts. 
                if (!enrollmentCounts[enrollment.classID]) { // if the enrollment is not already in the enrollment counts then it is added to the enrollment counts. 
                    enrollmentCounts[enrollment.classID] = 0;
                }
                enrollmentCounts[enrollment.classID]++; // adds one to the enrollment count for the class. 
            });

            classes.forEach((session, index) => { // goes through each class and adds it to the schedule. 
                const classDate = new Date(session.classDate); // gets the date of the class. 

                if (classDate >= startDate && classDate <= endDate) { // checks if the class is within the week's range. 
                    const weekday = classDate.toLocaleDateString("en-US", { weekday: "long" }); // gets the day of the week. 
                    const timeValue = reformatTimeInformation(session.classTime); // gets the time of the class but correctly formatted to show up
                    const cellId = `${weekday}_${timeValue.replace(":", "").replace(" ", "")}`; // creates the cell id for the class. 
                    const cell = document.getElementById(cellId); // gets the cell for the class. 
                    
                    // gets the enrollment count for the class. 
                    const currentlyEnrolled = enrollmentCounts[session.classID] || 0;

                    if (cell) { // if the cell exists then the class is added to the schedule. 
                        cell.innerHTML = `
                            <div class="p-2 rounded text-white bg-primary mb-1" style="font-size: 14px;">
                                ${session.className}
                                <br><small>${session.classType}</small>
                                <br><small>Enrolled: ${currentlyEnrolled}/${session.classCapacity}</small>
                            </div>
                            <button class="btn btn-sm btn-outline-dark view-info-btn" data-index="${index}">
                                View Info
                            </button>
                        `;
                    }
                }
            });

            // adds event listeners to the view info buttons after rendering. 
            document.querySelectorAll(".view-info-btn").forEach(button => {
                button.addEventListener("click", (e) => {
                    const index = e.target.getAttribute("data-index"); // gets the index of the class. 
                    const session = classes[index]; // gets the class. 
                    const currentlyEnrolled = enrollmentCounts[session.classID] || 0; // gets the enrollment count for the class. 

                    document.getElementById("infoModalLabel").textContent = session.className; // sets the text content of the modal to the class name. 
                    document.getElementById("infoModalLabel").setAttribute('data-class-id', session.classID); // sets the data class id to the class id. 
                    document.getElementById("modalClassType").textContent = session.classType; // sets the text content of the modal to the class type. 
                    document.getElementById("modalDate").textContent = new Date(session.classDate).toDateString(); // sets the text content of the modal to the class date. 
                    document.getElementById("modalTime").textContent = reformatTimeInformation(session.classTime); // sets the text content of the modal to the class time. 
                    document.getElementById("modalCurrentlyEnrolled").textContent = currentlyEnrolled; // sets the text content of the modal to the currently enrolled. 
                    document.getElementById("modalCapacity").textContent = session.classCapacity; // sets the text content of the modal to the capacity. 

                    const modal = new bootstrap.Modal(document.getElementById("infoModal"));
                    modal.show();
                });
            });
        })
        .catch(err => {
            console.error("Failed to load schedule", err); // if the schedule fails to load then the error modal is shown. 
            errorModal = new PopupModal({
                title: 'Error',
                type: 'error',
                modalId: 'scheduleLoadError'
            });
            errorModal.show('The schedule failed to load. Please try again later.');
        });
});


