const productContainer = document.querySelector(".product-container")
let productList
let productDiv
let modal
let userDetails
const modalBody = document.querySelector('body')
function getUser(){
    if(document.cookie){
        fetch('users/me',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + getAuthToken()
            }
        }).then((response)=>{
            response.json().then((data)=>{
                if(data.error){
                    return emptyMessage.textContent = 'Something went wrong. Please login.'
                }
                userDetails = document.querySelector('#user-details')
                const user = document.createElement('p')
                user.id = 'user'
                user.className = 'nav-item'
                const balance = document.createElement('p')
                balance.id = 'balance'
                balance.className = 'nav-item'
                user.textContent = 'Hello, ' + data.name
                balance.textContent = 'Balance: ' + data.balance
                const logOutButton = document.createElement('button')
                logOutButton.className = "btn btn-primary"
                logOutButton.textContent = 'Log Out'
                logOutButton.addEventListener('click',()=>{
                    fetch('users/logout',{
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                            'Authorization': 'Bearer ' + getAuthToken()
                        }
                    }).then((response)=>{
                        response.json().then((data)=>{
                            if(data.error){
                                return emptyMessage.textContent = 'Failed to log out.'
                            }
                            document.cookie ='authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT"; path=/'
                            userDetails.remove()
                        })
                    })
                })
                
                userDetails.appendChild(user)
                userDetails.appendChild(balance)
                if(data.cart.length > 0){
                    const cart = document.createElement('button')
                    cart.textContent = 'Checkout Cart'
                    cart.addEventListener('click',(e)=>{
                        window.location='/checkout'
                    })
                    const noOfItems = document.createElement('h5')
                    noOfItems.textContent = data.cart.length
                    userDetails.append(cart)
                    userDetails.append(noOfItems)
                }
                userDetails.appendChild(logOutButton)
                
            })
        })
    }
}
getUser()



function closeModalHandler() {
  modal.remove()
  modal = null

  backdrop.remove()
  backdrop = null
}
const emptyMessage = document.querySelector('#empty-message')
const body = document.querySelector('.main-content')
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

  const productBuy = document.createElement('button')
  productBuy.id = 'product-buy'
  productBuy.className = 'btn btn-primary'
  productBuy.textContent = 'Buy'
  
  
  productBuy.addEventListener('click',()=>{
    showModalHandler(product,false)
  })
    

  const productAddToCart = document.createElement('button')
  productAddToCart.id = 'product-add-to-cart'
  productAddToCart.className = 'btn btn-success'
  productAddToCart.textContent = 'Add to cart'
  productAddToCart.addEventListener('click',()=>{
    showModalHandler(product,true)
  })

  
  productDiv.append(productImage)
  productDiv.append(productName)
  productDiv.append(productPrice)
  productDiv.append(productBuy)
  productDiv.append(productAddToCart)

  productContainer.appendChild(productDiv)

}


function removeProduct(){
productDiv.remove()
productDiv = null
}

function getAuthToken() {
    const value = `; ${document.cookie}`
    const parts = value.split(`; authToken=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
  }

  function showModalHandler(product,addingCart) {
    if (modal) {
        return
      }
    
      modal = document.createElement('div')
      modal.id = 'modal'
      modal.className = 'modalUC'
    
      const modalText = document.createElement('p')
      if(addingCart){
        modalText.textContent = 'Are you sure you want to add this item to cart?'
      }
      else{
        modalText.textContent = 'Are you sure you want to buy?'
      }
  
      const modalImage = document.createElement('img')
      modalImage.src = "products/"+product._id+"/image"
      modalImage.width = 100
      modalImage.height = 100
  
      const modalPrice = document.createElement('p')
      modalPrice.textContent = product.price
    
      const modalCancelAction = document.createElement('button')
      modalCancelAction.textContent = 'Cancel'
      modalCancelAction.className = 'btn btn-danger btn--alt'
      modalCancelAction.addEventListener('click', closeModalHandler)
    
      const modalConfirmAction = document.createElement('button')
      modalConfirmAction.textContent = 'Confirm'
      modalConfirmAction.className = 'btn btn-success'
      modalConfirmAction.addEventListener('click', ()=>{
          if(addingCart){
              addToCart(product)
          }
          else{
            
            token = getAuthToken()
            if(!token){
                while (modal.firstChild) {
                    modal.removeChild(modal.lastChild)
                  }
                const loginFirst = document.createElement('p')
                loginFirst.textContent = "Please login first"
                modal.append(loginFirst)
                const modalConfirmAction = document.createElement('button')
                    modalConfirmAction.textContent = 'Ok'
                    modalConfirmAction.className = 'btn btn-success'
                    modalConfirmAction.addEventListener('click',closeModalHandler)
                    modal.append(modalConfirmAction)
                    return 
            }
            else{
                var productData = product.price
            sessionStorage.productPrice = productData
            window.location.href = "/payment"
            }
         // buyProduct(product)
          }
        
      })
    
      modal.append(modalText)
      modal.append(modalImage)
      modal.append(modalPrice)
      modal.append(modalCancelAction)
      modal.append(modalConfirmAction)
    
      modalBody.append(modal)
    
      backdrop = document.createElement('div')
      backdrop.className = 'backdrop'
    
      backdrop.addEventListener('click', closeModalHandler)
    
      document.body.append(backdrop)
    function buyProduct(product){
        fetch(`/users/buy/${product._id}`, 
        {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
               'Authorization' : 'Bearer ' + getAuthToken()
            }
        }).then((response)=>{
            response.json().then((data)=>{
                fetch(`/users/me/payment/checkout`,{
                    method: 'POST',
                headers: {
                'Content-Type' : 'application/json',
               'Authorization' : 'Bearer ' + getAuthToken()
                }
                })
                userDetails = document.querySelector('#user-details')
                while (userDetails.firstChild) {
                    userDetails.removeChild(userDetails.lastChild)
                  }
                  getUser()
                while (modal.firstChild) {
                    modal.removeChild(modal.lastChild)
                  }
                if(data.error){
                    const modalFailure = document.createElement('p')
                    modalFailure.id = 'transaction-success'
                    modalFailure.textContent = data.message

                    const modalConfirmAction = document.createElement('button')
                    modalConfirmAction.textContent = 'Ok'
                    modalConfirmAction.className = 'btn btn-success'
                    modalConfirmAction.addEventListener('click',closeModalHandler)
                    modal.append(modalFailure)
                    modal.append(modalConfirmAction)
                    return 
                }
                
                const modalSuccess = document.createElement('p')
                modalSuccess.id = 'transaction-success'
                modalSuccess.textContent = data.message

                const modalConfirmAction = document.createElement('button')
                modalConfirmAction.textContent = 'Ok'
                modalConfirmAction.className = 'btn btn-success'
                modalConfirmAction.addEventListener('click',closeModalHandler)
                
                modal.append(modalSuccess)
                modal.append(modalConfirmAction)
            }).catch((e)=>{
                console.log(e)
            })
      })
      }
      async function addToCart(product){
         const response = await fetch('/users/me/addToCart/'+ product._id,{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
               'Authorization' : 'Bearer ' + getAuthToken()
            }
        })
                 const data = await  response.json()
                userDetails = document.querySelector('#user-details')
                while (userDetails.firstChild) {
                    userDetails.removeChild(userDetails.lastChild)
                  }
                  getUser()
                while (modal.firstChild) {
                    modal.removeChild(modal.lastChild)
                  }
                if(data.error){
                    const modalFailure = document.createElement('p')
                    modalFailure.id = 'transaction-success'
                    modalFailure.textContent = data.message

                    const modalConfirmAction = document.createElement('button')
                    modalConfirmAction.textContent = 'Ok'
                    modalConfirmAction.className = 'btn btn-success'
                    modalConfirmAction.addEventListener('click',closeModalHandler)
                    modal.append(modalFailure)
                    modal.append(modalConfirmAction)
                    return 
                }
                
                const modalSuccess = document.createElement('p')
                modalSuccess.id = 'transaction-success'
                modalSuccess.textContent = data.message

                const modalConfirmAction = document.createElement('button')
                modalConfirmAction.textContent = 'Ok'
                modalConfirmAction.className = 'btn'
                modalConfirmAction.addEventListener('click',closeModalHandler)
                
                modal.append(modalSuccess)
                modal.append(modalConfirmAction)
            }
    
  }