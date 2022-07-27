let newUserForm = document.getElementById("newUserForm");
newUserForm.addEventListener('submit', async (a) => {
    let formData = new FormData(newUserForm);
    let user = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        roles_id: Array.from(document.getElementById("newRoles"))
            .filter(option => option.selected)
            .map(option => option.id)
    }
    try {
        const response = await fetch('/api/createUser', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(user)
        });
        const json = await response.json()
        $('#nav-usertable').tab('show');
        console.log("user created");
    } catch (e) {
        console.error(e)
    }
})

