// Request to upload users and create table
async function getUsers() {
    const response = await fetch("/api/userList", {
        method: "GET",
        headers: {"Accept": "application/json"}
    });
    if (response.ok === true) {
        const users = await response.json();
        let rows = document.getElementById("tableUsers");
        users.forEach(user => {
            rows.append(row(user));
        });
    }
}

// Creating rows with buttons in table
function row(user) {

    const tr = document.createElement("tr");
    tr.setAttribute("data-rowid", user.id);

    const idTd = document.createElement("td");
    idTd.append(user.id);
    tr.append(idTd);

    const nameTd = document.createElement("td");
    nameTd.append(user.name);
    tr.append(nameTd);

    const emailTd = document.createElement("td");
    emailTd.append(user.email);
    tr.append(emailTd);

    const rolesTd = document.createElement("td");
    let roles = "";
    user.userRoleList.forEach(
        (role) => {
            roles = roles + role.role.name.replace("ROLE_", "") + ' '
        }
    );
    rolesTd.append(roles);
    tr.append(rolesTd);

    const editTd = document.createElement("td");

    const editButton = document.createElement("button");
    editButton.setAttribute("type", "button");
    editButton.setAttribute("class", "btn btn-info btn-sm");
    editButton.setAttribute("data-bs-toggle", "modal");
    editButton.setAttribute("data-whatever", user.id);
    editButton.setAttribute("data-bs-target", "#editModal");

    editButton.append("Edit");
    editButton.addEventListener("click", e => {

        e.preventDefault();
        getUser(user.id);
    });
    editTd.append(editButton);
    tr.append(editTd);

    const deleteTd = document.createElement("td");

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("type", "button");
    deleteButton.setAttribute("class", "btn btn-danger btn-sm");
    deleteButton.setAttribute("data-bs-toggle", "modal");
    deleteButton.setAttribute("data-whatever", user.id);
    deleteButton.setAttribute("data-bs-target", "#deleteModal");

    deleteButton.append("Delete");
    deleteButton.addEventListener("click", e => {

        e.preventDefault();
        getUser(user.id);
    });
    deleteTd.append(deleteButton);
    tr.append(deleteTd);

    return tr;
}

async function getUser(id) {
    const response = await fetch("/api/getUser/" + id, {
        method: "GET",
        headers: {"Accept": "application/json"}
    });
    if (response.ok === true) {
        return await response.json();
    }
}

function getAllRoles() {
    return fetch("/api/listRoles")
        .then((response) => {
            let rs = response.json();
            return rs;
        })
        .then((roles) => {
            return roles;
        })
}

async function showNewRoles() {
    $("#newRoles").empty();
    let selectNewRole = document.getElementById('newRoles');
    let allRoles = await getAllRoles();
    allRoles.forEach((role) => {
        let option = document.createElement('option');
        option.setAttribute('value', role.name);
        option.setAttribute('id', role.id);
        option.setAttribute('name', role.name);
        option.appendChild(document.createTextNode(role.name));
        selectNewRole.appendChild(option);
    })
    let i = 0;
    let optionToSelect;
    for (let i = 0; i < selectNewRole.options.length; i++) {
        optionToSelect = selectNewRole.options[i];
        if (optionToSelect.text == "ROLE_USER") {
            optionToSelect.selected = true;
        }
    }
}

//Modal Form for User's Edit
async function showEditModal(id) {
    let editUser = await getUser(id);
    document.getElementById("editId").value = editUser.id;
    document.getElementById("editName").value = editUser.name;
    document.getElementById("editEmail").value = editUser.email;
    $("#editRoles").empty();
    let selectEdit = document.getElementById('editRoles');
    let allRoles = await getAllRoles();
    allRoles.forEach((roles_id) => {
        let option = document.createElement('option');
        option.setAttribute('value', roles_id.name);
        option.setAttribute('id', roles_id.id);
        option.appendChild(document.createTextNode(roles_id.name));
        selectEdit.appendChild(option);
    })
}

//Waiting for submit to edit user
document.forms["editForm"].addEventListener("submit", e => {
    e.preventDefault();
    let editForm = document.getElementById("editForm");
    let formData = new FormData(editForm);
    let user = {
        id: formData.get('id'),
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        roles_id: Array.from(document.getElementById("editRoles"))
            .filter(option => option.selected)
            .map(option => option.id)
    };
    editUser(user);
})


//Request to edit user and update row in table
async function editUser(user) {
    const response = await fetch('/api/editUser', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify(user)
    });

    console.log("Stroka 153 ");
    if (response.ok === true) {
        const user = await response.json();
        const form = document.forms["editForm"];
        form.reset();
        document.querySelector("tr[data-rowid='" + user.id + "']").replaceWith(row(user));
        let editModal = document.getElementById("editModal");
        let modal = bootstrap.Modal.getInstance(editModal);
        modal.hide();
    }
}

async function showDeleteModal(id) {
    let deleteUser = await getUser(id);
    console.log(deleteUser);
    document.getElementById("deleteId").value = deleteUser.id;
    document.getElementById("deleteName").value = deleteUser.name;
    document.getElementById("deleteEmail").value = deleteUser.email;
    $("#deleteRoles").empty();
    let selectDel = document.getElementById('deleteRoles');
    let allRoles = await getAllRoles();

    deleteUser.userRoleList.forEach((role) => {
        let option = document.createElement('option');
        option.setAttribute('value', role.role.name);
        option.setAttribute('id', role.role.id);
        option.appendChild(document.createTextNode(role.role.name));
        selectDel.appendChild(option);
    })
}

document.forms["deleteForm"].addEventListener("submit", e => {
    e.preventDefault();

    let deleteID = document.getElementById("deleteId").value;
    console.log(deleteID);
    deleteUser(deleteID);
})


async function deleteUser(id) {
    const response = await fetch('/api/deleteUser/' + id, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'DELETE',
        body: JSON.stringify(id)
    });
    if (response.ok === true) {
        const form = document.forms["deleteForm"];
        form.reset();
        document.querySelector("tr[data-rowid='" + id + "']").remove();
        let deleteModal = document.getElementById("deleteModal");
        let modal = bootstrap.Modal.getInstance(deleteModal);
        modal.hide();
    }
}


// Creating new user
document.forms["newUserForm"].addEventListener("submit", e => {
    e.preventDefault();
    let formData = new FormData(newUserForm);
    let user = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        roles_id: Array.from(document.getElementById("newRoles"))
            .filter(option => option.selected)
            .map(option => option.id)
    };
    createUser(user);
})


// Request to create user
async function createUser(user) {

    const response = await fetch('/api/createUser', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(user)
    });
    if (response.ok === true) {
        const user = await response.json();
        console.log(user);
        const form = document.forms["newUserForm"];
        form.reset();
        // reset();
        document.getElementById("tableUsers").append(row(user));
        document.getElementById("UsersTable").setAttribute("class", "nav-link active");
        document.getElementById("nav-profile-tab").setAttribute("class", "nav-link");
        document.getElementById("nav-usertable").setAttribute("class", "tab-pane fade show active");
        document.getElementById("nav-profile").setAttribute("class", "tab-pane fade");

    }
}


// Download users
getUsers();
