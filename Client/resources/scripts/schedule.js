document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#scheduleTable tbody");

    const apiUrl = "http://localhost:5043";

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch schedule.");
            }
            return response.json();
        })
        .then(data => {
            data.forEach((session, index) => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${session.className}</td>
                    <td>${session.trainer}</td>
                    <td>${session.date}</td>
                    <td>${session.time}</td>
                    <td>${session.location}</td>
                    <td>
                        <button class="btn btn-info btn-sm view-info-btn" data-index="${index}">
                            View Info
                        </button>
                    </td>
                `;

                tableBody.appendChild(row);
            });

            // Add event listeners to all buttons
            document.querySelectorAll(".view-info-btn").forEach(button => {
                button.addEventListener("click", (e) => {
                    const index = e.target.getAttribute("data-index");
                    const session = data[index];
                    
                    
                    alert(`Class Info:\n\nClass Name: ${session.className}\nTrainer: ${session.trainer}\nDate: ${session.date}\nTime: ${session.time}\nLocation: ${session.location}`);
                });
            });
        })
        .catch(error => {
            console.error("Error loading schedule:", error);
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-danger fw-bold">Could not load schedule data.</td>
                </tr>
            `;
        });
});