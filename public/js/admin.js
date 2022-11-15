const productForm = document.querySelector('#product-form')
const fileInput = document.querySelector('#file')
const saveSuccess = document.querySelector('#success-save')
console.log(getAuthToken())

productForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const name = document.getElementById('name').value
    const price = document.getElementById('price').value
    if(name !== '' || price !== ''){
        const productRequest = {name: name, price: price}
        const productRequestJSON = JSON.stringify(productRequest)
        const imageData = new FormData()
        imageData.append('image',fileInput.files[0],fileInput.files[0].name)
        fetch('/products',{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + getAuthToken()
            },
            body: productRequestJSON
        }).then((response)=>{
            response.json().then((data)=>{
                if(!data.name){
                   return  saveSuccess.textContent = 'Invalid.'
                }
                fetch(`/products/${data._id}/image`,{
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + getAuthToken()
                    },
                    body: imageData
                }).then((response)=>{
                    response.json().then((imageResponse)=>{
                        if(imageResponse.message){
                            return saveSuccess.textContent = imageResponse.message
                        }
                        saveSuccess.textContent = 'Failed'
    
                    })
                })
            })
        })
    }
    
})

function getAuthToken() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; authToken=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
