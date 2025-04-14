document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("scheduleGridContainer");
    let errorModal;

    // Gets the current date and calculate the dates for the headers for the current week.
    const today = new Date();
    const currentDay = today.getDay(); // Sunday = 0
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - currentDay); // Sets it back to sunday
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // End of week (Saturday)

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const timeSlots = ["09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "01:00 PM", "1:30 PM", "2:00 PM", "02:30 PM", "3:00 PM", "3:30 PM", "04:00 PM"];

    let tableHTML = `
        <table class="table table-bordered text-center align-middle bg-white schedule-table">
        <thead class="table-dark">
            <tr>
                <th class="time-column">Time</th>
    `;

    
    for (let index = 0; index < days.length; index++) { // for loop to build the headers based off of the dates
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + index);
        tableHTML += `<th>${days[index]}<br>${date.getMonth() + 1}/${date.getDate()}</th>`;
    }

    tableHTML += `
            </tr>
        </thead>
        <tbody>
    `;

    // Builds the rows for each time slot
    for (let i = 0; i < timeSlots.length; i++) {
        const time = timeSlots[i];
        tableHTML += `
            <tr>
                <td><strong>${time}</strong></td>
        `;
        
        // Builds each day cell in the row
        for (let j = 0; j < days.length; j++) {
            const day = days[j];
            const cellId = `${day}_${time.replace(":", "").replace(" ", "")}`; // gives an id for the cells to mess with them
            tableHTML += `<td id="${cellId}"></td>`;
        }

        tableHTML += `</tr>`;
    }

    tableHTML += `
        </tbody>
        </table>
    `;
    
    container.innerHTML = tableHTML;

    function reformatTimeInformation(timeSpan)
    {
        [hours, minutes] = timeSpan.split(':')
        hour = parseInt(hours)
        if(hour >= 12)
        {
            amOrPm = 'PM'
        }
        else
        {
            amOrPm = 'AM'
        }

        let hourFormatTwelve = hour % 12
        if(hourFormatTwelve === 0)
        {
            hourFormatTwelve = 12
        }
        return `${hourFormatTwelve.toString()}:${minutes} ${amOrPm}`
    }

    fetch("http://localhost:5043/api/Classes")
        .then(res => res.json())
        .then(data => {
            data.forEach((session, index) => {
                const classDate = new Date(session.classDate);
                
                if (classDate >= startDate && classDate <= endDate) { // ensures classes that are only in this week are shown.
                    const weekday = classDate.toLocaleDateString("en-US", { weekday: "long" });
                    const timeValue = reformatTimeInformation(session.classTime);
                    const cellId = `${weekday}_${timeValue.replace(":", "").replace(" ", "")}`;
                    const cell = document.getElementById(cellId);

                    if (cell) {
                        cell.innerHTML = `
                            <div class="p-2 rounded text-white bg-primary mb-1" style="font-size: 14px;">
                                ${session.className}
                                <br><small>${session.classType}</small>
                            </div>
                            <button class="btn btn-sm btn-outline-dark view-info-btn" data-index="${index}">
                                View Info
                            </button>
                        `;
                    }
                }
            });

            // View Info modal for when you click on each one
            document.querySelectorAll(".view-info-btn").forEach(button => {
                button.addEventListener("click", (e) => {
                    const session = data[e.target.getAttribute("data-index")];
                    document.getElementById("infoModalLabel").innerText = session.className;
                    document.getElementById("modalTrainer").innerText = session.classType;
                    document.getElementById("modalDate").innerText = new Date(session.classDate).toDateString();
                    document.getElementById("modalTime").innerText = reformatTimeInformation(session.classTime);
                    document.getElementById("modalCapacity").innerText = session.classCapacity;
                    const modal = new bootstrap.Modal(document.getElementById("infoModal"));
                    modal.show();
                });
            });
        })
        .catch(err => {
            console.error("Failed to load schedule", err);
            errorModal = new PopupModal({
                title: 'Error',
                type: 'error',
                modalId: 'scheduleLoadError'
            });
            errorModal.show('The schedule failed to load. Please try again later.');
        });
});

