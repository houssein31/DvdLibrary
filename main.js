const apiUrl = "https://dvdlibrary-backend.onrender.com/api/dvd/all"; // Updated to production backend URL
const dvdUrl = "https://dvdlibrary-backend.onrender.com/api/dvd"; // Base URL for DVD operations

document.addEventListener("DOMContentLoaded", () => {
    loadDvds(); // Load DVDs when the document is ready

    document.getElementById("create-dvd-btn").addEventListener("click", showCreateDvdForm);
    document.getElementById("search-btn").addEventListener("click", searchDvds);
    document.getElementById("back-btn").addEventListener("click", showDvdList);
    document.getElementById("back-to-home-btn").addEventListener("click", showDvdList); // Add event for back button
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
    // Reset form fields
    document.getElementById("new-dvd-title").value = "";
    document.getElementById("new-release-year").value = "";
    document.getElementById("new-director").value = "";
    document.getElementById("new-rating").value = "G"; // Reset to default
    document.getElementById("new-notes").value = "";

    // Clear and hide any existing error messages
    createErrorMessageDiv.innerHTML = ""; // Clear existing messages
    createErrorMessageDiv.classList.add("hidden"); // Hide error div

    // Show the Create DVD form and hide the DVD list
    document.getElementById("dvd-table").classList.add("hidden");
    document.getElementById("create-dvd-form").classList.remove("hidden");

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
            document.getElementById("create-dvd-btn").classList.add("hidden"); // Hide Create DVD button
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
    document.getElementById("edit-dvd-form").classList.add("hidden");
    document.getElementById("dvd-table").classList.remove("hidden");
    document.getElementById("error-message").classList.add("hidden");
    document.getElementById("back-to-home-btn").classList.add("hidden"); // Hide back button
    document.getElementById("create-dvd-btn").classList.remove("hidden"); // Show Create DVD button


    loadDvds(); // Refresh the list
}

// Add these at the beginning of your script if not already present
const searchErrorMessageDiv = document.getElementById("search-error-message"); // Ensure this div is present in your HTML

function searchDvds() {
    const category = document.getElementById("search-category").value;
    const term = document.getElementById("search-term").value.trim();

    const errors = [];
    if (!category && !term) {
        errors.push("Both Search Category and Search Term are required.");
    }
    if (!category && term) {
        errors.push("Search Category is required.");
    }
    if (category && !term) {
        errors.push("Search Term is required.");
    }

    if (errors.length > 0) {
        displayErrorMessages(searchErrorMessageDiv, errors);
        return;
    }

    searchErrorMessageDiv.classList.add("hidden");

    let searchUrl = `${dvdUrl}/${category}/${term}`;

    fetch(searchUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching search results');
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                displayErrorMessages(searchErrorMessageDiv, ["No results found."]);
            } else {
                displayDvds(data);
                searchErrorMessageDiv.classList.add("hidden");
                document.getElementById("back-to-home-btn").classList.remove("hidden"); // Show back button
                document.getElementById("create-dvd-btn").classList.add("hidden"); // Hide Create DVD button
            }
        })
        .catch(error => {
            console.error('Error searching DVDs:', error);
            displayErrorMessages(searchErrorMessageDiv, ["Error fetching search results."]);
        });
}

function showError(message) {
    const errorDiv = document.getElementById("error-message");
    errorDiv.textContent = message;
    errorDiv.classList.remove("hidden");
}


const createErrorMessageDiv = document.getElementById("create-dvd-error-message");
const editErrorMessageDiv = document.getElementById("edit-dvd-error-message");

// Function to show error messages in a div
function displayErrorMessages(errorDiv, messages) {
    errorDiv.innerHTML = messages.join("<br>");
    errorDiv.classList.remove("hidden");
}

// Modified createDvd function with validation
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
        displayErrorMessages(createErrorMessageDiv, errors);
        return;
    }

    createErrorMessageDiv.classList.add("hidden"); // Hide error message on success

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
            displayErrorMessages(createErrorMessageDiv, ["There was an error creating the DVD."]);
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
            document.getElementById("create-dvd-btn").classList.add("hidden"); // Hide Create DVD button
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

// Modified updateDvd function with validation
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
        displayErrorMessages(editErrorMessageDiv, errors);
        return;
    }

    editErrorMessageDiv.classList.add("hidden"); // Hide error message on success

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
            showDvdList();
        })
        .catch(error => {
            console.error("Error updating DVD:", error);
            displayErrorMessages(editErrorMessageDiv, ["There was an error updating the DVD."]);
        });
}