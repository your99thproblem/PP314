    const userFetchService = {
    head: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Referer': 'null'
},
    getUserAuth: async () => (await fetch(`http://127.0.0.1:8080/api/userAuth`)).json(),
}

    loadUserWithRoles();

    // Getting information about authorized user
    async function loadUserWithRoles() {
    try {
    const response = await userFetchService.getUserAuth();
    let temp_header = "<span class=\"text-white\">" + response.username + " " + "</span>"

    + "<span class=\"text-white\"> with Roles: </span>"
    + "<span class=\"text-white\">" + getRolesWithoutPrefix(response) + "</span>";
    document.getElementById("AuthUserEmail").innerHTML = temp_header;
    let infUser = '<tr id=' + response.user.id + '>';
    infUser += '<td>' + response.user.id + '</td>';
    infUser += '<td>' + response.user.name + '</td>';
    infUser += '<td>' + response.user.email + '</td>';
    infUser += '<td>' + getRolesWithoutPrefix(response) + '</td>';
    document.getElementById("userInformation").innerHTML = infUser;

} catch (e) {
    console.log(e);
}
}

    // Getting string of user's roles
    function getRolesWithoutPrefix(user) {
    let strRoles = "";
    user.user.userRoleList.forEach(role => {
    strRoles += role.role.name.replace("ROLE_", "") + " ";
});
    return strRoles;
}

