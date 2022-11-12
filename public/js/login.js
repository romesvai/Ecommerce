const loginForm = document.querySelector('#login-form')
const successMessage = document.querySelector('#success-login')

loginForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    if(email !== '' || password !== ''){
        const loginRequest = {email: email, password: password}
        const loginRequestJSON = JSON.stringify(loginRequest)
        fetch('/users/login',{
            method : 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body: loginRequestJSON

        }).then((response)=>{
            response.json().then((data)=>{
                if(!data.user){
                    successMessage.textContent = 'Invalid Login.'
                }
                successMessage.textContent = 'Hello ' + data.user.name + 'You are successfully logged in.'
            })
        })
    }})