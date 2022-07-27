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

async function createNewUser() {
    let newUserForm = document.getElementById("newUserForm");
    let formData = new FormData(newUserForm);
    let user = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        //     roles: Array.from(document.getElementById("newRoles"))
        //         .filter(option => option.selected)
        //         .map(option => ({name: option.value, id: option.id}))
    }
    await fetch('/api/createUser', {
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
            $('#nav-usertable').tab('show');
            //

        })
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

showAllUsers();