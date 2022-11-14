let productList
let productDiv
let modal
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
                const userDetails = document.querySelector('#user-details')
                const user = document.querySelector('#user')
                const balance = document.querySelector('#balance')
                user.textContent = 'User: ' + data.name
                balance.textContent = 'Balance: ' + data.balance
                const logOutButton = document.createElement('button')
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
                userDetails.appendChild(logOutButton)
            })
        })
    }
}
getUser()



function closeModalHandler() {
  modal.remove();
  modal = null;

  backdrop.remove();
  backdrop = null;
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
  productName.textContent = product.name

  const productPrice = document.createElement('p')
  productPrice.textContent = product.price

  const productImage = document.createElement('img')
  productImage.src = `http://localhost:3000/products/${product._id}/image`

  const productBuy = document.createElement('button')
  productBuy.id = 'product-buy'
  productBuy.textContent = 'Buy'
  
  
  productBuy.addEventListener('click',()=>{
    showModalHandler(product)
  })
    

  const productAddToCart = document.createElement('button')
  productAddToCart.id = 'product-add-to-cart'
  productAddToCart.textContent = 'Add to cart'

  
  productDiv.append(productImage)
  productDiv.append(productName)
  productDiv.append(productPrice)
  productDiv.append(productBuy)
  productDiv.append(productAddToCart)

  body.appendChild(productDiv)

}


function removeProduct(){
productDiv.remove()
productDiv = null
}

function getAuthToken() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; authToken=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  function showModalHandler(product) {
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
                while (modal.firstChild) {
                    modal.removeChild(modal.lastChild);
                  }
                if(data.message){
                    const modalFailure = document.createElement('p')
                    modalFailure.id = 'transaction-success'
                    modalFailure.textContent = data.message

                    const modalConfirmAction = document.createElement('button');
                    modalConfirmAction.textContent = 'Ok';
                    modalConfirmAction.className = 'btn';
                    modalConfirmAction.addEventListener('click',closeModalHandler)
                    modal.append(modalFailure)
                    modal.append(modalConfirmAction)
                    return 
                }
                
                const modalSuccess = document.createElement('p')
                modalSuccess.id = 'transaction-success'
                modalSuccess.textContent = data.message

                const modalConfirmAction = document.createElement('button');
                modalConfirmAction.textContent = 'Ok';
                modalConfirmAction.className = 'btn';
                modalConfirmAction.addEventListener('click',closeModalHandler)
                
                modal.append(modalSuccess)
                modal.append(modalConfirmAction)
                

            }).catch((e)=>{
                console.log(e)
            })
      })
      }
    if (modal) {
      return;
    }
  
    modal = document.createElement('div');
    modal.className = 'modal';
  
    const modalText = document.createElement('p');
    modalText.textContent = 'Are you sure?';

    const modalImage = document.createElement('img');
    modalImage.src = "products/"+product._id+"/image"
    modalImage.width = 100
    modalImage.height = 100

    const modalPrice = document.createElement('p');
    modalPrice.textContent = product.price;
  
    const modalCancelAction = document.createElement('button');
    modalCancelAction.textContent = 'Cancel';
    modalCancelAction.className = 'btn btn--alt';
    modalCancelAction.addEventListener('click', closeModalHandler);
  
    const modalConfirmAction = document.createElement('button');
    modalConfirmAction.textContent = 'Confirm';
    modalConfirmAction.className = 'btn';
    modalConfirmAction.addEventListener('click', ()=>{
      buyProduct(product)
    });
  
    modal.append(modalText);
    modal.append(modalImage)
    modal.append(modalPrice)
    modal.append(modalCancelAction);
    modal.append(modalConfirmAction);
  
    document.body.append(modal);
  
    backdrop = document.createElement('div');
    backdrop.className = 'backdrop';
  
    backdrop.addEventListener('click', closeModalHandler);
  
    document.body.append(backdrop);
  }