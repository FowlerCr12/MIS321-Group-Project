document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("scheduleGridContainer");

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

    let tableHTML = `
        <table class="table table-bordered text-center align-middle bg-white">
        <thead class="table-dark">
            <tr>
                <th>Time</th>
                ${days.map(day => `<th>${day}</th>`).join("")}
            </tr>
        </thead>
        <tbody>
            ${timeSlots.map(time => `
                <tr>
                    <td><strong>${time}</strong></td>
                    ${days.map(day => {
                        const cellId = `${day}_${time.replace(":", "").replace(" ", "")}`;
                        return `<td id="${cellId}"></td>`;
                    }).join("")}
                </tr>`).join("")}
        </tbody>
        </table>
    `;
    container.innerHTML = tableHTML;

    fetch("http://localhost:5000/api/schedule")
        .then(res => res.json())
        .then(data => {
            data.forEach((session, index) => {
                const date = new Date(session.date);
                const weekday = date.toLocaleDateString("en-US", { weekday: "long" }); // Includes Sunday
                const timeKey = session.time.replace(":", "").replace(" ", "");
                const cellId = `${weekday}_${timeKey}`;
                const cell = document.getElementById(cellId);

                if (cell) {
                    cell.innerHTML = `
                        <div class="p-2 rounded text-white bg-primary mb-1" style="font-size: 14px;">
                            ${session.className}
                            <br><small>${session.trainer}</small>
                        </div>
                        <button class="btn btn-sm btn-outline-dark view-info-btn" data-index="${index}">
                            View Info
                        </button>
                    `;
                }
            });

            // View Info modal logic
            document.querySelectorAll(".view-info-btn").forEach(button => {
                button.addEventListener("click", (e) => {
                    const session = data[e.target.getAttribute("data-index")];
                    document.getElementById("infoModalLabel").innerText = session.className;
                    document.getElementById("modalTrainer").innerText = session.trainer;
                    document.getElementById("modalDate").innerText = new Date(session.date).toDateString();
                    document.getElementById("modalTime").innerText = session.time;
                    document.getElementById("modalLocation").innerText = session.location;
                    const modal = new bootstrap.Modal(document.getElementById("infoModal"));
                    modal.show();
                });
            });
        })
        .catch(err => {
            console.error("Failed to load schedule", err);
            container.innerHTML = "<p class='text-danger fw-bold'>Error loading class schedule.</p>";
        });
});

