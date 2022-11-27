const productForm = document.querySelector('#product-form')
const fileInput = document.querySelector('#file')
const saveSuccess = document.querySelector('#success-save')
const body = document.querySelector('.main-content')
console.log(getAuthToken())
getProducts()
function getProducts(){
fetch('/products',{
    method : 'GET',
    headers: {
        'Content-Type': 'application/json',
      }
}).then((response)=>{
    response.json().then((data)=>{
        if(data.length === 0){
            return emptyMessage.textContent = 'No Products available'
        }
        for(i=0;i<data.length;i++){
            showProduct(data[i])
        }
    })
})
}

function showProduct(product){
  productDiv = document.createElement('div')
  productDiv.className = 'product'
  
  const productName = document.createElement('h3')
  productName.className = 'productName'
  productName.textContent = product.name

  const productPrice = document.createElement('p')
  productPrice.className = 'product-price'
  productPrice.textContent = product.price

  const productImage = document.createElement('img')
  productImage.src = `products/${product._id}/image`

  const productDelete = document.createElement('button')
  productDelete.id = 'product-buy'
  productDelete.textContent = 'Delete'
  
  
  productDelete.addEventListener('click',()=>{
    console.log('Delete clicked')
     fetch(`/products/remove/${product._id}`,{
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer ' + getAuthToken()
        },
     }).then((response)=>{
        response.json().then((data)=>{
            if(data.error){
                return saveSuccess.textContent = data.error
            }
            saveSuccess.textContent = data.message

        })
    })
  })
    

  
  productDiv.append(productImage)
  productDiv.append(productName)
  productDiv.append(productPrice)
  productDiv.append(productDelete)

  body.appendChild(productDiv)

}


function removeProduct(){
productDiv.remove()
productDiv = null
}
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
                if(data.error){
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
                }).catch((e)=>{
                    console.log('Error')
                    saveSuccess.textContent = "Invalid product"
                })
            })
        })
    }
    else{
        saveSuccess.textContent = 'Invalid product.'
    }
    
})

function getAuthToken() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; authToken=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
