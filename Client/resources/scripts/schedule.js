document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("scheduleGridContainer");
    let errorModal;

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

    fetch("http://localhost:5043/api/Classes")
        .then(res => res.json())
        .then(data => {
            data.forEach((session, index) => {
                const date = new Date(session.date);
                const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
                const timeKey = session.time.replace(":", "").replace(" ", "");
                const cellId = `${weekday}_${timeKey}`;
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
            });

            // Add event listeners to View Info buttons after rendering
            document.querySelectorAll(".view-info-btn").forEach(button => {
                button.addEventListener("click", (e) => {
                    const index = e.target.getAttribute("data-index");
                    const session = data[index];

                    document.getElementById("infoModalLabel").textContent = session.className;
                    document.getElementById("modalTrainer").textContent = session.classType;
                    document.getElementById("modalDate").textContent = new Date(session.date).toDateString();
                    document.getElementById("modalTime").textContent = reformatTimeInformation(session.time);
                    document.getElementById("modalCapacity").textContent = session.capacity;

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


