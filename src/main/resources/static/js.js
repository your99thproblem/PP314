$(document).ready(function () {
    getAllUsers();
    getAuthUser();
});

let roleList = [];


// Getting string of user's roles
function getRolesWithoutPrefix(user) {
    let strRoles = "";
    user.userRoleList.forEach(role => {
        strRoles += role.role.name.replace("ROLE_", "") + " ";
    });
    return strRoles;
}

function getAuthUser() {
    $.getJSON("http://localhost:8080/api/userAuth", function (data) {
        console.log('0) данные с бэка об аторизованном пользователе: ', JSON.stringify(data))
        let temp_header = "<span class=\"text-white\">" + data.username + " " + "</span>"
            + "<span class=\"text-white\"> with Roles: </span>"
            + "<span class=\"text-white\">" + getRolesWithoutPrefix(data) + "</span>";
        $('#AuthUserEmail').append(temp_header);
        })
}


function getAllUsers() {
    $.getJSON("http://localhost:8080/api/userList", function (data) {
        console.log('1) данные с бэка /allUsers: ', JSON.stringify(data))
        let rows = '';
        for (let i = 0; i < data.length; i++) {
            rows += createRows(data[i]);
        }
        $('#tableAllUsers').append(rows);


        $.ajax({
            url: '/api/authorities',
            method: 'GET',
            dataType: 'json',
            success: function (roles) {
                roleList = roles;
            }
        });
    });
}


function createRows(user) {

    let json = JSON.stringify(user);
    let str;
    if (json.includes("ADMIN") & json.includes("USER")) {
        str = "ADMIN, USER";
    }
    if (json.includes("USER") & !json.includes("ADMIN")) {
        str = "USER";
    }
    if (!json.includes("USER") & json.includes("ADMIN")) {
        str = "ADMIN";
    }

    let user_data = '<tr id=' + user.id + '>';
    user_data += '<td>' + user.id + '</td>';
    user_data += '<td>' + user.name + '</td>';
    user_data += '<td>' + user.email + '</td>';
    user_data += '<td>' + str + '</td>';
    user_data += '<td>' + '<input id="btnEdit" value="Edit" type="button"' +
        'class="btn-info btn edit-btn" data-toggle="modal" data-target="#editModal" ' +
        'data-id="' + user.id + '">' + '</td>' +

        '<td>' + '<input id="btnDelete" value="Delete" type="button" class="btn btn-danger del-btn" ' +
        'data-toggle="modal" data-target="#deleteModal" data-id=" ' + user.id + ' ">' + '</td>';
    user_data += '</tr>';

    return user_data;
}

//форма добавления нового юзера
$("#new-tab").click(function () {
    $('#name').val('');
    $('#age').val('');
    $('#email').val('');
    $('#password').val('');
});

$("#admin-tab").click(function () {
    $('#tableAllUsers').empty();
    getAllUsers()
});


$("#addNewUserButton").click(function (event) {

    let roles2;
    if (document.getElementById("optionAddUser").selected & !document.getElementById("optionAddAdmin").selected) {
        roles2 = [{"id": 2, "role": "USER", "authority": "ROLE_USER"}]
    }
    if (document.getElementById("optionAddAdmin").selected & !document.getElementById("optionAddUser").selected) {
        roles2 = [{"id": 1, "role": "ADMIN", "authority": "ROLE_ADMIN"}]
    }
    if (document.getElementById("optionAddAdmin").selected & document.getElementById("optionAddUser").selected) {
        roles2 = [{"id": 1, "role": "ADMIN", "authority": "ROLE_ADMIN"}, {
            "id": 2,
            "role": "USER",
            "authority": "ROLE_USER"
        }]
    }

    let user1 = {
        'name': $("#name").val(),
        'age': $("#age").val(),
        'email': $(" #email").val(),
        'password': $("#password").val(),
        'roles': roles2,
        //  'authorities':[{"authority":"ROLE_ADMIN"},{"authority":"ROLE_USER"}],
        'accountNonExpired': true,
        'credentialsNonExpired': true,
        'accountNonLocked': true,
        //    'shortRoles':["ADMIN","USER"],
        'enabled': true
    };

    $.ajax({

        type: 'POST',
        url: "http://localhost:8080/api/createUser",
        contentType: 'application/json;',
        data: JSON.stringify(user1),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        async: true,
        dataType: 'JSON',
        success: function () {

        }
    });
    event.preventDefault()
});

//форма редактрирования юзера
$(document).on('click', '.edit-btn', function () {
    const user_id = $(this).attr('data-id');
    console.log("editUserId: " + JSON.stringify(user_id));
    $.ajax({
        url: '/api/users/' + user_id,
        method: 'GET',
        dataType: 'json',
        success: function (user) {
            $('#id').val(user.id);
            $('#editName').val(user.username);
            $('#editEmail').val(user.email);
            $('#editPassword').val(user.password);
        }
    });
});

//Отправка изменений модального окна
$(document).on('click', '#editButton', function (event) {
    event.preventDefault();

    let roles;
    if (document.getElementById("optionEditUser").selected & !document.getElementById("optionEditAdmin").selected) {
        roles = [{"id": 2, "role": "USER", "authority": "ROLE_USER"}]
    }
    if (document.getElementById("optionEditAdmin").selected & !document.getElementById("optionEditUser").selected) {
        roles = [{"id": 1, "role": "ADMIN", "authority": "ROLE_ADMIN"}]
    }
    if (document.getElementById("optionEditAdmin").selected & document.getElementById("optionEditUser").selected) {
        roles = [{"id": 1, "role": "ADMIN", "authority": "ROLE_ADMIN"}, {
            "id": 2,
            "role": "USER",
            "authority": "ROLE_USER"
        }]
    }
    console.log(roles)

    let editUser = {
        'id': $("input[name='id']").val(),
        'name': $("input[name='name']").val(),
        'email': $("input[name='email']").val(),
        'roles': roles,
        'password': $("input[name='password']").val(),
        'accountNonExpired': true,
        'credentialsNonExpired': true,
        'accountNonLocked': true,
        'enabled': true
    }
    console.log("editUser:" + JSON.stringify(editUser));

    $.ajax({
        url: '/api/users',
        method: 'PUT',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        async: true,
        data: JSON.stringify(editUser),
        success: () => {
            console.log("success editUser")
        },
        error: () => {
            console.log("error editUser")
        }
    });
});

//форма удаления юзера
$(document).on('click', '.del-btn', function () {
    const user_id = $(this).attr('data-id');
    console.log("deleteUserId: " + JSON.stringify(user_id));
    $.ajax({
        url: '/api/users/' + user_id,
        method: 'GET',
        dataType: 'json',
        success: function (user) {
            $('#delId').val(user.id);
            $('#delName').val(user.username);
            $('#delEmail').val(user.email);
            $('#delPassword').val(user.password);
        }
    });
});


$(document).on('click', '#deleteButton', function (event) {
    event.preventDefault();

    let deleteUserId = $('#delId').val();


    console.log("deleteUserId:" + deleteUserId);

    $.ajax({
        url: '/api/user/' + deleteUserId,
        method: 'DELETE',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: true,
        data: JSON.stringify(deleteUserId),
        success: () => {
            console.log("success editUser")
        },
        error: () => {
            console.log("error editUser")
        }
    });
});