// Set the correct backend API URL here
const apiUrl = "http://localhost:8080/api/dvd/all"; // Updated to match backend endpoint
const dvdUrl = "http://localhost:8080/api/dvd"; // Base URL for DVD operations

document.addEventListener("DOMContentLoaded", () => {
    loadDvds(); // Load DVDs when the document is ready

    document.getElementById("create-dvd-btn").addEventListener("click", showCreateDvdForm);
    document.getElementById("search-btn").addEventListener("click", searchDvds);
    document.getElementById("back-btn").addEventListener("click", showDvdList);
    document.getElementById("save-dvd-btn").addEventListener("click", createDvd);
    document.getElementById("cancel-dvd-btn").addEventListener("click", showDvdList);
});

function loadDvds() {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => displayDvds(data))
        .catch(error => console.error('Error fetching DVDs:', error));
}

function displayDvds(dvds) {
    const tbody = document.querySelector("#dvd-table tbody");
    tbody.innerHTML = ""; // Clear existing rows

    dvds.forEach(dvd => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><a href="#" onclick="viewDvd(${dvd.dvdId})">${dvd.dvdTitle || 'Unknown title'}</a></td>
            <td>${dvd.releaseYear}</td>
            <td>${dvd.director}</td>
            <td>${dvd.dvdRating || 'Unknown rating'}</td>
            <td>
                <button onclick="showEditDvdForm(${dvd.dvdId})">Edit</button>
                <button onclick="deleteDvd(${dvd.dvdId})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showCreateDvdForm() {
    document.getElementById("new-dvd-title").value = "";
    document.getElementById("new-release-year").value = "";
    document.getElementById("new-director").value = "";
    document.getElementById("new-rating").value = "G"; // Reset to default
    document.getElementById("new-notes").value = "";

    document.getElementById("dvd-table").classList.add("hidden");
    document.getElementById("create-dvd-form").classList.remove("hidden");
    document.getElementById("error-message").classList.add("hidden");
}

function viewDvd(dvdId) {
    fetch(`${dvdUrl}/${dvdId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(dvd => {
            displayDvdDetails(dvd);
        })
        .catch(error => console.error('Error fetching DVD details:', error));
}

function displayDvdDetails(dvd) {
    document.getElementById("dvd-title-header").textContent = dvd.dvdTitle;
    document.getElementById("dvd-title").value = dvd.dvdTitle;
    document.getElementById("release-year").value = dvd.releaseYear;
    document.getElementById("director").value = dvd.director;
    document.getElementById("rating").value = dvd.dvdRating;
    document.getElementById("notes").value = dvd.note;

    document.getElementById("dvd-table").classList.add("hidden");
    document.getElementById("dvd-details").classList.remove("hidden");
}

function showDvdList() {
    document.getElementById("dvd-details").classList.add("hidden");
    document.getElementById("create-dvd-form").classList.add("hidden");
    document.getElementById("edit-dvd-form").classList.add("hidden"); // Hide edit form
    document.getElementById("dvd-table").classList.remove("hidden");
    document.getElementById("error-message").classList.add("hidden"); // Hide any remaining error messages
    loadDvds(); // Refresh the list
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

function createDvd() {
    const title = document.getElementById("new-dvd-title").value.trim();
    const releaseYear = document.getElementById("new-release-year").value.trim();
    const director = document.getElementById("new-director").value.trim();
    const rating = document.getElementById("new-rating").value;
    const notes = document.getElementById("new-notes").value.trim();

    const errors = [];
    if (!title) errors.push("Please enter a title for the DVD.");
    if (!/^\d{4}$/.test(releaseYear)) errors.push("Please enter a 4-digit year.");

    if (errors.length > 0) {
        showError(errors.join(" "));
        return;
    }

    const newDvd = {
        dvdTitle: title,
        releaseYear: releaseYear,
        director: director,
        dvdRating: rating,
        note: notes
    };

    fetch(dvdUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newDvd),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(() => {
            loadDvds();
            showDvdList();
        })
        .catch(error => {
            console.error("Error creating DVD:", error);
            showError("There was an error creating the DVD.");
        });
}

let dvdIdToDelete = null;

function deleteDvd(dvdId) {
    dvdIdToDelete = dvdId; // Store the DVD ID to delete
    document.getElementById("delete-confirm-modal").classList.remove("hidden");
}

document.getElementById("confirm-delete-btn").addEventListener("click", () => {
    if (dvdIdToDelete !== null) {
        fetch(`${dvdUrl}/${dvdIdToDelete}`, {
            method: "DELETE",
        })
            .then(response => {
                if (response.ok) {
                    loadDvds(); // Refresh the DVD list after deletion
                } else if (response.status === 404) {
                    showError("The DVD could not be found.");
                } else {
                    showError("An error occurred while deleting the DVD.");
                }
            })
            .catch(error => {
                console.error("Error deleting DVD:", error);
                showError("An error occurred while deleting the DVD.");
            })
            .finally(() => {
                document.getElementById("delete-confirm-modal").classList.add("hidden");
                dvdIdToDelete = null; // Reset the DVD ID
            });
    }
});

document.getElementById("cancel-delete-btn").addEventListener("click", () => {
    document.getElementById("delete-confirm-modal").classList.add("hidden");
    dvdIdToDelete = null; // Reset the DVD ID
});

let currentDvdId = null; // To keep track of the currently edited DVD

document.getElementById("save-edited-dvd-btn").addEventListener("click", updateDvd);
document.getElementById("cancel-edit-dvd-btn").addEventListener("click", showDvdList);

function showEditDvdForm(dvdId) {
    currentDvdId = dvdId; // Store the current DVD ID for updating
    fetch(`${dvdUrl}/${dvdId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(dvd => {
            populateEditDvdForm(dvd);
            document.getElementById("dvd-table").classList.add("hidden");
            document.getElementById("edit-dvd-form").classList.remove("hidden");
        })
        .catch(error => console.error('Error fetching DVD details for edit:', error));
}

function populateEditDvdForm(dvd) {
    document.getElementById("edit-dvd-title").value = dvd.dvdTitle;
    document.getElementById("edit-release-year").value = dvd.releaseYear;
    document.getElementById("edit-director").value = dvd.director;
    document.getElementById("edit-rating").value = dvd.dvdRating;
    document.getElementById("edit-notes").value = dvd.note;
}

function updateDvd() {
    const title = document.getElementById("edit-dvd-title").value.trim();
    const releaseYear = document.getElementById("edit-release-year").value.trim();
    const director = document.getElementById("edit-director").value.trim();
    const rating = document.getElementById("edit-rating").value;
    const notes = document.getElementById("edit-notes").value.trim();

    const errors = [];
    if (!title) errors.push("Please enter a title for the DVD.");
    if (!/^\d{4}$/.test(releaseYear)) errors.push("Please enter a 4-digit year.");

    if (errors.length > 0) {
        showEditError(errors.join(" "));
        return;
    }

    const updatedDvd = {
        dvdTitle: title,
        releaseYear: releaseYear,
        director: director,
        dvdRating: rating,
        note: notes
    };

    fetch(`${dvdUrl}/${currentDvdId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDvd),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(() => {
            loadDvds();
            showDvdList(); // Ensure that the DVD list is shown after saving changes
        })
        .catch(error => {
            console.error("Error updating DVD:", error);
            showEditError("There was an error updating the DVD.");
        });
}

function showEditError(message) {
    const errorDiv = document.getElementById("edit-dvd-error-message");
    errorDiv.textContent = message;
    errorDiv.classList.remove("hidden");
}
