let url = "/api/userList";
let createUser = "/api/createUser";

function showAllUsers() {
    fetch("/api/userList")
        .then((response) => {
            return response.json();
        })
        .then((allUsers) => {
            console.log(allUsers);
            let tbody = '';
            tbody = document.getElementById('tableusers');
            allUsers.forEach((user) => {
                let roles = "";
                user.userRoleList.forEach((role) => {
                    roles = roles + role.role.name.replace("ROLE_", "") + ' '
                })
                let tr = document.createElement('tr');
                tr.innerHTML = '<td>' + user.id + '</td>' +
                    '<td>' + user.name + '</td>' +
                    '<td>' + user.email + '</td>' +
                    '<td>' + roles + '</td>' +
                    '<td>' + '<button type="button" class="btn btn-info btn-sm" data-bs-toggle=modal" ' +
                    'data-whatever="' + user.id + '" data-bs-target="#editModal">Edit</button>' + '</td>' +
                    '<td>' + '<button type="button" class="btn btn-danger btn-sm" ' +
                    'data-bs-toggle="modal" data-whatever="' + user.id + '" data-bs-target="#deleteModal">Delete</button>' + '</td>';
                tbody.appendChild(tr);
            });
        });
}

// ************************ROLES FOR USERS*************************
async function showNewRoles() {
    $("#newRoles").empty();
    let selectNew = document.getElementById('newRoles');
    let allRoles = await getAllRoles();
    console.log(allRoles);
    allRoles.forEach((roles_id) => {
        let option = document.createElement('option');
        option.setAttribute('value', roles_id.name);
        option.setAttribute('id', roles_id.id);
        option.appendChild(document.createTextNode(roles_id.name));
        selectNew.appendChild(option);
    })
    let i = 0;
    let optionToSelect;
    for (let i = 0; i < selectNew.options.length; i++) {
        optionToSelect = selectNew.options[i];
        if (optionToSelect.text == "ROLE_USER") {
            optionToSelect.selected = true;
        }
    }
}

// ************************NEW USER*************************
function newUser() {
    let newUserForm = document.getElementById('newUserForm');
    let formData = new FormData(newUserForm);
    let user = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        roles_id: Array.from(document.getElementById('newRoles'))
            .filter(option => option.selected)
            .map(option => option.id)
    }

    fetch("/api/createUser", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(user)
    })
        .then((r) => {
            refreshTable();
            showAllUsers();
            $('#nav-usertable').tab('show')
            //

        })
}

function refreshTable() {
    let table = document.querySelector('#tableusers')
    for (let i = table.rows.length - 1; i >= 0; i--) {
        table.deleteRow(i)
    }
}

function getAllRoles() {
    return fetch("/api/listRoles")
        .then((response) => {
            let res = response.json();
            return res;
        })
        .then((roles) => {
            return roles;
        })
}

// async function showDeleteModal(id) {
//     let deleteUser = await getUser(id);
//     console.log(deleteUser);
//     document.getElementById("deleteId").value = deleteUser.id;
//     document.getElementById("deleteName").value = deleteUser.name;
//     document.getElementById("deleteEmail").value = deleteUser.email;
//     $("#deleteRoles").empty();
//     let selectDel = document.getElementById('deleteRoles');
//     let allRoles = await getAllRoles();
//
//     allRoles.forEach((roles_id) => {
//         let option = document.createElement('option');
//         option.setAttribute('value', roles_id.name);
//         option.setAttribute('id', roles_id.id);
//         option.appendChild(document.createTextNode(roles_id.name));
//         selectDel.appendChild(option);
//     })
//     let userRoles = [];
//     let i = 0;
//     deleteUser.userRoleList.forEach((role) => userRoles[i++] = role);
//     let optionToSelect;
//     for (let i = 0; i < selectDel.options.length; i++) {
//         optionToSelect = selectDel.options[i];
//         userRoles.forEach((ur) => {
//             if (optionToSelect.text == ur) {
//                 optionToSelect.selected = true;
//             }
//         });
//     }
// }
//
// async function deleteUser() {
//     let deleteUserID = document.getElementById('deleteId').value;
//     fetch('/api/deleteUser/' + deleteUserID, {
//         method: 'DELETE',
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         }
//     })
//         .then((response) => {
//
//         })
//         .then((r) => {
//             $('#UsersTable').tab('show');
//
//         })
// }


function wait(ms, value) {
    return new Promise(resolve => setTimeout(resolve, ms, value));
}


async function getUser(id) {
    let response = await fetch('/api/getUser/' + id);
    console.log(response);
    return await response.json();
}

async function getAllUsers() {
    let response = await fetch(url);
    console.log(response);
    return await response.json();
}

showAllUsers();