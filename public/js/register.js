const registerForm = document.querySelector('#register-form')
const successMessage = document.querySelector('#success')



registerForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const age = Number(document.getElementById('age').value)
    if(name !== '' || email !== '' || password !== '' || age !== ''){
        const loginRequest = {name: name, email: email, password: password, age: age}
        const loginRequestJSON = JSON.stringify(loginRequest)
        fetch('/users',{
            method : 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body: loginRequestJSON

        }).then((response)=>{
            response.json().then((data)=>{
                if(!data.user){
                    successMessage.textContent = 'Invalid Registration.'
                }
                successMessage.textContent = 'Hello ' + data.user.name + 'You are successfully registered.'
            })
        })
    }})