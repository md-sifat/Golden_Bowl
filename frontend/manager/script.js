const itemsContainer = document.getElementById('itemsContainer');
const addItemForm = document.getElementById('addItemForm');

function toggleAddItemForm() {
    addItemForm.classList.toggle('hidden');
    itemsContainer.classList.add('hidden');
}

async function fetchUserInfo() {
    const response = await fetch('/api/auth/manager', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    if (response.ok) {
        const user = await response.json();
        document.getElementById('username').textContent = `Welcome, ${user.firstname} ${user.lastname}`;
        localStorage.setItem('username', user.username);
    } else {
        alert('Failed to fetch user info. Redirecting to login.');
        window.location.href = './../login.html';
    }
}

async function fetchItems(itemType) {
    const response = await fetch(`/api/menu/${itemType}`);
    if (response.ok) {
        const items = await response.json();
        renderItems(items);
    } else {
        alert('Failed to fetch menu items.');
    }
}

function renderItems(items) {
    itemsContainer.innerHTML = ''; 
    let cntr = 1;
    items.forEach(item => {
        console.log(item)
        const itemCard = document.createElement('div');
        itemCard.className = 'bg-transparent shadow-lg p-4 rounded glass'; 
        let imageSrc;
        if(item.item_type === "Tea"){
            imageSrc = `assets/menu/tea/tea${cntr}.jpg`; 
        }else if(item.item_type === "Appetizers"){
            imageSrc = `assets/menu/Appetizer/appetizer${cntr}.jpg`; 
            
        }else if(item.item_type === "Main Course"){
            imageSrc = `assets/menu/Main/main${cntr}.jpg`; 
            
        }else if(item.item_type === "Desserts"){
            imageSrc = `assets/menu/Dessert/dessert${cntr}.jpg`; 
            
        }else if(item.item_type === "Beverages"){
            imageSrc = `assets/menu/Beverages/beverage${cntr}.jpg`; 
            
        }else if(item.item_type === "Snacks"){
            imageSrc = `assets/menu/Snacks/snacks${cntr}.jpg`; 
        }

        itemCard.innerHTML = `
                    <img src="${imageSrc}" alt="${item.name}" class="w-full h-32 object-cover rounded">
                    <h3 class="text-lg text-white font-bold mt-4">${item.name}</h3>
                    <p class="text text-white">Price: $${item.price}</p>
                    <button onclick="removeFromDatabase(${item.menu_item_id})" class="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">Remove</button>
                `;
        cntr++;
        itemsContainer.appendChild(itemCard);
    });
}

// Remove item from database
async function removeFromDatabase(itemId) {
    console.log(itemId);
    const confirmation = confirm('Are you sure you want to remove this item from the database?');
    if (confirmation) {
        try {
            const response = await fetch(`/api/menu/${itemId}`, {
                method: 'DELETE',
            });
            console.log(response);
            if (response.ok) {
                const responseData = await response.json();  
                alert(responseData.message);  
                fetchItems('Tea');
            } else {
                const errorData = await response.json();  
                // alert(`Failed to remove item: ${errorData.message || 'Unknown error'}`);
                fetchItems('Tea');
            }
        } catch (error) {
            alert('Failed to remove item: Network or server error.');
        }
    }
}

async function addItem(event) {
    console.log(event);
    event.preventDefault();
    const itemName = document.getElementById('itemName').value;
    const itemPrice = document.getElementById('itemPrice').value;
    const itemType = document.getElementById('itemType').value;
    const itemImage = document.getElementById('itemImage').value;
    // console.log(itemName , itemPrice , itemPrice , itemImage);

    try {
        const response = await fetch('/api/menu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: itemName,
                price: itemPrice,
                item_type: itemType,
                image: 'NULL',
            }),
        });
        if (response.ok) {
            const responseData = await response.json();
            alert('Item added successfully');
            toggleAddItemForm();
            window.location.href = './Mdashboard.html';
            // fetchItems(itemType);
        } else {
            const errorData = await response.json();
            alert(`Failed to add item: ${errorData.message || 'Unknown error'}`);
        }
    } catch (error) {
        alert('Failed to add item: Network or server error.');
    }
}


function logout() {
    localStorage.removeItem('authToken');
    window.location.href = '../login.html';
}

window.onload = () => {
    fetchUserInfo();
    fetchItems('Tea');
};