const categoryButtons = document.querySelectorAll('.category-btn');

const itemsContainer = document.getElementById('itemsContainer');

// Global cart state
let cartItems = [];
let cartTotal = 0;

async function fetchUserInfo() {

    const response = await fetch('/api/auth/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    if (response.ok) {
        const user = await response.json();
        document.getElementById('username').textContent = `Welcome, ${user.firstname} ${user.lastname}`;
        localStorage.setItem('username', user.username);
    } else {
        alert('Failed to fetch user info. Redirecting to login.');
        window.location.href = 'login.html';
    }
}

// Fetch menu items based on item type
async function fetchItems(itemType) {
    ck=false;
    const response = await fetch(`/api/menu/${itemType}`);
    if (response.ok) {
        const items = await response.json();
        renderItems(items);
    } else {
        alert('Failed to fetch menu items.');
    }
}

let ck=true;
if(ck){
    fetchItems("Tea");
}


function renderItems(items) {
    itemsContainer.innerHTML = ''; // Clear previous items
    let cntr = 1;
    items.forEach(item => {
        console.log(item);
        const itemCard = document.createElement('div');
        itemCard.className = 'bg-transparent shadow-lg p-4 rounded glass'; // Added glass effect
        const imageSrc = `assets/menu/tea/tea${cntr}.jpg`; // Default image if no image in DB
        itemCard.innerHTML = `
            <img src="${imageSrc}" alt="${item.name}" class="w-full h-32 object-cover rounded">
            <h3 class="text-lg text-white  font-bold mt-4">${item.name}</h3>
            <p class="text text-white">Price: ${item.price} BDT</p>
            <button onclick="addToCart(${item.menu_item_id}, '${item.name}', ${item.price})" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Add to Cart</button>
        `;
        itemsContainer.appendChild(itemCard);
        cntr++;
    });
}

// Add item to the cart
function addToCart(id, name, price) {
    cartItems.push({ id, name, price });
    cartTotal += price;
    updateCart();
}

// Update cart display
function updateCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = '';
    cartItems.forEach(item => {
        const cartItem = document.createElement('li');
        cartItem.textContent = `${item.name} - ${item.price} BDT`;
        cartItemsContainer.appendChild(cartItem);
    });
    document.getElementById('cartTotal').textContent = `Total: ${cartTotal.toFixed(2)} BDT`;
    cartCount.textContent = cartItems.length;
}

// Handle checkout
async function checkout() {
    const username = localStorage.getItem('username');
    if (!username) {
        alert('User not logged in!');
        return;
    }

    try {
        const response = await fetch('/api/order/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                menu_item_ids: cartItems.map(item => item.id),
                total_price: cartTotal,
                status: 'pending',
            }),
        });

        if (response.ok) {
            alert('Order placed successfully!');
            cartItems = [];
            cartTotal = 0;
            updateCart();
        } else {
            const errorData = await response.json();
            alert(`Failed to place order: ${errorData.message || 'Unknown error'}`);
        }
    } catch (error) {
        alert('Failed to place order: Network or server error.');
    }
}

// Handle logout
function logout() {
    localStorage.removeItem('authToken');
    window.location.href = '../login.html';

}

// Show/hide the cart
cartToggle.addEventListener('click', () => {
    cart.classList.toggle('translate-x-full');
});

closeCart.addEventListener('click', () => {
    cart.classList.add('translate-x-full');
});

// Clear all items in the cart

// On page load, fetch user info and initial items
// window.onload = () => {
//     // fetchUserInfo();
//     fetchItems('Tea');
// };