document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("scheduleGridContainer");

    // Days and times
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

    // Create the table structure
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

    // Fetch class data from API
    fetch("http://localhost:5043") // API path
        .then(res => res.json())
        .then(data => {
            data.forEach(session => {
                const date = new Date(session.date);
                const weekday = date.toLocaleDateString("en-US", { weekday: "long" }); 
                const timeKey = session.time.replace(":", "").replace(" ", "");

                const cellId = `${weekday}_${timeKey}`;
                const cell = document.getElementById(cellId);
                if (cell) {
                    cell.innerHTML = `
                        <div class="p-2 rounded text-white bg-primary" style="font-size: 14px;">
                            ${session.className}
                            <br><small>${session.trainer}</small>
                        </div>
                    `;
                }
            });
        })
        .catch(err => {
            console.error("Failed to load schedule", err);
            container.innerHTML = "<p class='text-danger fw-bold'>Error loading class schedule.</p>";
        });
});