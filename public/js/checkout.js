let productList = []
let productDiv
let modal
const emptyMessage = document.querySelector('#empty-message')
function getProducts(){
    console.log('Getting Products.')
    fetch('/users/me/products',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + getAuthToken()
        }
    }).then((response)=>{
        response.json().then((data)=>{
            if(data.length === 0){
                return emptyMessage.textContent = 'No Products available'
            }
            for(i=0;i<data.length;i++){
                showProduct(data[i])
                
            }
            const body = document.querySelector('.main-content')
                const checkOutButton = document.createElement('button')
                checkOutButton.className = "btn btn-success"
                checkOutButton.textContent = 'Checkout items'
                checkOutButton.addEventListener('click',()=>{
                    showModalHandler(data)
                })
                const clearButton = document.createElement('button')
                clearButton.className = "btn btn-danger"
                clearButton.id = 'clear'
                clearButton.textContent = 'Clear items'
                clearButton.addEventListener('click',()=>{
                    fetch('/users/me/clearCart',{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization' : 'Bearer ' + getAuthToken()
                        }
                    }).then((response)=>{
                        response.json().then((data)=>{
                            if(data.error){
                                return emptyMessage.textContent = data.error
                            }
                            emptyMessage.textContent = data.message
                            removeProducts()
                        })
                    }).catch((e)=>{
                        console.log(e)
                    })
                })
                body.appendChild(clearButton)
                body.appendChild(checkOutButton)
               
        })
    })
}
function showModalHandler(products) {
    async function buyProducts(products){
        while (modal.firstChild) {
            modal.removeChild(modal.lastChild)
          }
        for(i=0;i<products.length;i++){
            console.log(products[i]._id)
        const response = await fetch(`/users/buy/${products[i]._id}`, 
        {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
               'Authorization' : 'Bearer ' + getAuthToken()
            }
        })
           const data = await  response.json()
                if(data.error){
                    const modalFailure = document.createElement('p')
                    modalFailure.id = 'transaction-success'
                    modalFailure.textContent = data.error + ` ${products[i].name}`

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
                modalSuccess.textContent = data.message + ` ${products[i].name}`
                
                
                modal.append(modalSuccess)
                if(i == products.length -1){
                    const modalConfirmAction = document.createElement('button');
                    modalConfirmAction.textContent = 'Ok';
                    modalConfirmAction.className = 'btn';
                    modalConfirmAction.addEventListener('click',closeModalHandler)
                    modal.append(modalConfirmAction)
                    const clearButton = document.querySelector('#clear')
                    clearButton.click()
                    }
                
            }
            
      }
    if (modal) {
      return;
    }
  
    modal = document.createElement('div');
    modal.className = 'modal';
  
    const modalText = document.createElement('p');
    modalText.textContent = 'Are you sure you want to checkout these items?';

    const modalPrice = document.createElement('p');
    let price = 0
    products.forEach((product)=>{
        price += product.price
    })
    modalPrice.textContent = 'Total ' + price;
  
    const modalCancelAction = document.createElement('button');
    modalCancelAction.textContent = 'Cancel';
    modalCancelAction.className = 'btn btn--alt';
    modalCancelAction.addEventListener('click', closeModalHandler);
  
    const modalConfirmAction = document.createElement('button');
    modalConfirmAction.textContent = 'Confirm';
    modalConfirmAction.className = 'btn';
    modalConfirmAction.addEventListener('click', ()=>{
            buyProducts(products)
    });
  
    modal.append(modalText);
    modal.append(modalPrice)
    modal.append(modalCancelAction);
    modal.append(modalConfirmAction);
  
    document.body.append(modal);
  
    backdrop = document.createElement('div');
    backdrop.className = 'backdrop';
  
    backdrop.addEventListener('click', closeModalHandler);
  
    document.body.append(backdrop);
  }
function showProduct(product){
    const body = document.querySelector('.main-content')
    productDiv = document.createElement('div')
    productDiv.className = 'product'
    
    const productName = document.createElement('h3')
    productName.textContent = product.name
  
    const productPrice = document.createElement('p')
    productPrice.textContent = product.price
  
    const productImage = document.createElement('img')
    productImage.src = `products/${product._id}/image`
    productImage.width = 200
    productImage.height = 200

    productDiv.append(productImage)
    productDiv.append(productName)
    productDiv.append(productPrice)

    body.appendChild(productDiv)
}

function getAuthToken() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; authToken=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  function closeModalHandler() {
    modal.remove();
    modal = null;
  
    backdrop.remove();
    backdrop = null;
  }

getProducts()

function removeProducts(){
    const elements = document.getElementsByClassName('product');
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

