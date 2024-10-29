const apiUrl = "http://dvd-library.us-east-1.elasticbeanstalk.com/dvds";

document.addEventListener("DOMContentLoaded", () => {
    loadDvds();

    document.getElementById("create-dvd-btn").addEventListener("click", showCreateDvdForm);
    document.getElementById("search-btn").addEventListener("click", searchDvds);
});

function loadDvds() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => displayDvds(data))
        .catch(error => console.error('Error fetching DVDs:', error));
}

function displayDvds(dvds) {
    const tbody = document.querySelector("#dvd-table tbody");
    tbody.innerHTML = ""; // Clear existing rows

    dvds.forEach(dvd => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><a href="#" onclick="viewDvd(${dvd.dvdId})">${dvd.title}</a></td>
            <td>${dvd.releaseYear}</td>
            <td>${dvd.director}</td>
            <td>${dvd.rating}</td>
            <td>
                <button onclick="showEditDvdForm(${dvd.dvdId})">Edit</button>
                <button onclick="deleteDvd(${dvd.dvdId})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showCreateDvdForm() {
    // Implementation to show the Create DVD form
}

function searchDvds() {
    const category = document.getElementById("search-category").value;
    const term = document.getElementById("search-term").value;

    if (!category || !term) {
        showError("Both Search Category and Search Term are required.");
        return;
    }

    fetch(`${apiUrl}/${category}/${term}`)
        .then(response => response.json())
        .then(data => displayDvds(data))
        .catch(error => console.error('Error searching DVDs:', error));
}

function showError(message) {
    const errorDiv = document.getElementById("error-message");
    errorDiv.textContent = message;
    errorDiv.classList.remove("hidden");
}

// Additional functions like viewDvd, showEditDvdForm, and deleteDvd would go here
