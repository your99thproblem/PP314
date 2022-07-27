function getAllRoles() {
    return fetch("/api/listRoles")
        .then((response) => {
            let rs = response.json();
            return rs;
        })
        .then((roles) => {
            console.log('all roles:')
            console.log(roles);
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

function refreshTable() {
    let table = document.querySelector('#tableUsers')
    for (let i = table.rows.length - 1; i >= 0; i--) {
        table.deleteRow(i)
    }
}

function showAllUsers() {
    fetch('/api/userList')
        .then((response) => {
            return response.json();
        })
        .then((listUsers) => {
            let tbody = '';
            console.log(listUsers);
            tbody = document.getElementById('tableUsers');
            listUsers.forEach((user) => {
                let roles = "";
                user.userRoleList.forEach((role) => {
                    roles = roles + role.role.name.replace("ROLE_", "") + ' '
                })
                let tr = document.createElement('tr');
                tr.innerHTML = '<td>' + user.id + '</td>' +
                    '<td>' + user.name + '</td>' +
                    '<td>' + user.email + '</td>' +
                    '<td>' + roles + '</td>' +
                    '<td>' + '<button type="button" class="btn btn-info btn-sm" data-bs-toggle="modal" ' +
                    'data-whatever="' + user.id + '" data-bs-target="#editModal">Edit</button>' + '</td>' +
                    '<td>' + '<button type="button" class="btn btn-danger btn-sm" ' +
                    'data-bs-toggle="modal" data-whatever="' + user.id + '" data-bs-target="#deleteModal">Delete</button>' + '</td>';
                tbody.appendChild(tr);
            });
        });
}

async function showEditModal(id) {
    let editUser = await getUser(id);
    console.log(editUser);
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
    let userRoles = [];
    let i = 0;
    editUser.userRoleList.forEach((role) => userRoles[i++] = role);
    let optionToSelect;
    for (let i = 0; i < selectEdit.options.length; i++) {
        optionToSelect = selectEdit.options[i];
        userRoles.forEach((ur) => {
            if (optionToSelect.text == ur) {
                optionToSelect.selected = true;
            }
        });
    }
}


function editUser() {
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
    }
    fetch('/api/editUser', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify(user)
    })
        .then((r) => {
            document.getElementById('editForm').onsubmit;
        })

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

    allRoles.forEach((roles_id) => {
        let option = document.createElement('option');
        option.setAttribute('value', roles_id.name);
        option.setAttribute('id', roles_id.id);
        option.appendChild(document.createTextNode(roles_id.name));
        selectDel.appendChild(option);
    })
    let userRoles = [];
    let i = 0;
    deleteUser.userRoleList.forEach((role) => userRoles[i++] = role);
    let optionToSelect;
    for (let i = 0; i < selectDel.options.length; i++) {
        optionToSelect = selectDel.options[i];
        userRoles.forEach((ur) => {
            if (optionToSelect.text == ur) {
                optionToSelect.selected = true;
            }
        });
    }
}

async function deleteUser() {
    let deleteUserID = document.getElementById('deleteId').value;
    fetch('/api/deleteUser/' + deleteUserID, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then((response) => {

        })
        .then((r) => {
            $('#UsersTable').tab('show');

        })
}

async function getUser(id) {
    let response = await fetch('/api/getUser/' + id);
    console.log(response);
    return await response.json();
}

function showAllUsersWithDelay() {
    setTimeout(showAllUsers, 250);
}

showAllUsersWithDelay();