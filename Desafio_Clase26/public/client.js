const socket = io();

const submitProduct = document.getElementById('submitProduct');
const productsTable = document.getElementById('productsTableBody');

const submitMessage = document.getElementById('submitMessage');
const messageTable = document.getElementById('messageTableBody');


submitProduct.addEventListener('click', (event) => {
    event.preventDefault();

    const newProduct = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value
    }
    if((newProduct.title == '') || (newProduct.price == '') || (newProduct.thumbnail == '')){
        console.log('faltan datos');
    } else {
        document.getElementById('title').value = '';
        document.getElementById('price').value = '';
        document.getElementById('thumbnail').value = '';
        socket.emit('addProduct', newProduct);
    }
});

socket.on('refreshList', mData => {
    const newItem = 
        `<tr>
            <th scope="row">
                ${mData.id}
            </th>
            <td>
                ${mData.title}
            </td>
            <td>
                ${mData.price}
            </td>
            <td><img src=${mData.thumbnail} alt="product image" width="50" height="50"></td>
        </tr>`
    productsTable.innerHTML += newItem
})

submitMessage.addEventListener('click', (event) => {
    event.preventDefault();

    const newMessage = {
        author: {
            id: document.getElementById('emailInput').value,
            nombre:document.getElementById('nameInput').value,
            apellido:document.getElementById('surnameInput').value,
            edad:document.getElementById('ageInput').value,
            alias:document.getElementById('aliasInput').value,
            avatar: "../static/icons/generic_avatar.png"
        },

        text: document.getElementById('messageInput').value
    }
    if((newMessage.mail == '') || (newMessage.message == '')){
        console.log('faltan datos');
    } else {
        document.getElementById('messageInput').value = '';
        socket.emit('addMessage', newMessage);
    }
})


socket.on('refreshMessages', messageCont => {
    const newItem = 
        `<tr>
            <th scope="row" style="color:blue">
                ${messageCont.mail}
            </th>
            <td>
                ${messageCont.timestamp}
            </td>
            <td>
                ${messageCont.message}
            </td>
        </tr>`
    messageTable.innerHTML += newItem
})