const loginForm = document.querySelector('#login-form')
const loginSuccess = document.querySelector('#success-login')

loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    if (email !== '' || password !== '') {
        const loginRequest = { email: email, password: password }
        const loginRequestJSON = JSON.stringify(loginRequest)
        fetch('/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: loginRequestJSON

        }).then((response) => {
            response.json().then((data) => {
                if (!data.user) {
                    loginSuccess.textContent = 'Invalid Login.'
                    loginSuccess.className = "alert alert-danger"
                }
                else {
                    loginSuccess.textContent = 'Log In Successful'
                    loginSuccess.className = "alert alert-success"
                    var now = new Date();
                    var time = now.getTime();
                    var expireTime = time + 1000 * 36000;
                    now.setTime(expireTime);
                    document.cookie = `authToken=${data.token};expires=` + now.toUTCString() + ';path=/';
                    console.log(document.cookie)
                    window.location = "/";
                }
            })
        })
    }
})