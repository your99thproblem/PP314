const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': 'null'
    },
    getUserAuth: async () => (await fetch(`http://127.0.0.1:8080/api/userAuth`)).json(),
    getAllUsers: async () => (await fetch(`http://127.0.0.1:8080/api/userList`)).json()
}

// Getting information about authorized user
async function loadUserWithRoles() {
    try {
        const response = await userFetchService.getUserAuth();
        let temp_header = "<span class=\"text-white\">" + response.username + " " + "</span>"

            + "<span class=\"text-white\"> with Roles: </span>"
            + "<span class=\"text-white\">" + getRolesWithoutPrefix(response) + "</span>";
        document.getElementById("AuthUserEmail").innerHTML = temp_header;
        console.log(response);
        let infUser = '<tr id=' + response.user.id + '>';
        infUser += '<td>' + response.user.id + '</td>';
        infUser += '<td>' + response.user.name + '</td>';
        infUser += '<td>' + response.user.email + '</td>';
        infUser += '<td>' + getRolesWithoutPrefix(response.user) + '</td>';
        console.log(infUser);
        document.getElementById("userInformation").innerHTML = infUser;

    } catch (e) {
        console.log(e);
    }
}

// Getting string of user's roles
function getRolesWithoutPrefix(user) {
    let strRoles = "";
    user.userRoleList.forEach(role => {
        strRoles += role.role.name.replace("ROLE_", "") + " ";
    });
    return strRoles;
}

async function getAllUsers() {
    const response = await userFetchService.getAllUsers();
    console.log(response)
    let rows = '';
    for (let i = 0; i < response.length; i++) {
        console.log(response[i]);
        rows += createRows(response[i]);
    }
    console.log(rows);
    document.getElementById("tableAllUsers").innerHTML = rows;

}

//Creating rows in table with buttons
function createRows(user) {
    let user_data = '<tr id=' + user.id + '>';
    user_data += '<td>' + user.id + '</td>';
    user_data += '<td>' + user.name + '</td>';
    user_data += '<td>' + user.email + '</td>';
    user_data += '<td>' + getRolesWithoutPrefix(user) + '</td>';
    user_data += '<td>' + '<input id="btnEdit" value="Edit" type="button"' +
        'class="btn-info btn edit-btn" data-toggle="modal" data-target="#editModal" ' +
        'data-id="' + user.id + '">' + '</td>' +

        '<td>' + '<input id="btnDelete" value="Delete" type="button" class="btn btn-danger del-btn" ' +
        'data-toggle="modal" data-target="#deleteModal" data-id=" ' + user.id + ' ">' + '</td>';
    user_data += '</tr>';
    user_data += '</tr>';
    console.log(user_data);
    return user_data;
}


$("#addNewUserButton").click(function (event) {

    let roles2;
    if (document.getElementById("optionAddUser").selected & !document.getElementById("optionAddAdmin").selected) {
        roles2 = [{"id": 2, "role": "ROLE_USER"}]
    }
    if (document.getElementById("optionAddAdmin").selected & !document.getElementById("optionAddUser").selected) {
        roles2 = [{"id": 1, "role": "ROLE_ADMIN"}]
    }
    if (document.getElementById("optionAddAdmin").selected & document.getElementById("optionAddUser").selected) {
        roles2 = [{"id": 1, "role": "ROLE_ADMIN"}, {
            "id": 2,
            "role": "USER"
        }]
    }

    let newUser = {
        'name': $("#name").val(),
        'email': $(" #email").val(),
        'password': $("#password").val(),
        'userRoleList': roles2,
        //  'authorities':[{"authority":"ROLE_ADMIN"},{"authority":"ROLE_USER"}],
        'accountNonExpired': true,
        'credentialsNonExpired': true,
        'accountNonLocked': true,
        //    'shortRoles':["ADMIN","USER"],
        'enabled': true
    };

    $.ajax({

        type: 'POST',
        url: "http://localhost:8080/api/createuser",
        contentType: 'application/json;',
        data: JSON.stringify(newUser),
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

$(".nav li").on("click", function () {
    $(".nav li").remove("active");
    $(this).addClass("active");
});

$(".nav-link li").on("click", function () {
    $(".nav-link li").remove("active");
    $(this).addClass("active");
});

$("#new-user-tab").click(function () {
    $('#name').val('');
    $('#age').val('');
    $('#email').val('');
    $('#password').val('');
});