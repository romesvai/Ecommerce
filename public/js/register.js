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
                    let nameError = document.querySelector('#nameError')
                    let emailError = document.querySelector('#emailError')
                    let passwordError = document.querySelector('#passwordError')
                    if(data.errors.hasOwnProperty('name')){
                        nameError.textContent = data.errors.name.message;
                    }
                    if(data.errors.hasOwnProperty('email')){
                        emailError.textContent = data.errors.email.message;
                    }
                    if(data.errors.hasOwnProperty('password')){
                        passwordError.textContent = data.errors.password.message;
                    }
                    successMessage.textContent = 'Invalid Registration.'
                    successMessage.className = "alert alert-danger"
                }
                else{
                    successMessage.textContent = 'Registration successful'
                    successMessage.className = "alert alert-success"
                }
            })
        })
    }})