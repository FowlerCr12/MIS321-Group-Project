document.addEventListener("DOMContentLoaded", () => {
    fetch("") // Add API path
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#scheduleTable tbody");
            data.forEach(session => {
                const row = `<tr>
                    <td>${session.className}</td>
                    <td>${session.trainer}</td>
                    <td>${session.date}</td>
                    <td>${session.time}</td>
                    <td>${session.location}</td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => console.error("Failed to load schedule:", error));
});