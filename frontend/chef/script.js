const ordersContainer = document.getElementById('ordersContainer');
const pendingOrdersCount = document.getElementById('pendingOrders');
const completedOrdersCount = document.getElementById('completedOrders');

async function fetchUserInfo() {
    const response = await fetch('/api/auth/chef', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    if (response.ok) {
        const user = await response.json();
        document.getElementById('username').textContent = `Welcome, ${user.firstname} ${user.lastname}`;
        localStorage.setItem('username', user.username);
    } else {
        alert('Failed to fetch user info. Redirecting to login.');
        window.location.href = '../login.html';
    }
}

async function fetchOrderCounts() {
    const response = await fetch('/api/order/counts', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    if (response.ok) {
        const { pendingCount, completedCount } = await response.json();
        pendingOrdersCount.textContent = pendingCount;
        completedOrdersCount.textContent = completedCount;
    } else {
        alert('Failed to fetch order counts');
    }
}

async function fetchOrders() {
    const response = await fetch('/api/order/pending', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    if (response.ok) {
        const orders = await response.json();
        renderOrders(orders);
    } else {
        alert('Failed to fetch orders');
    }
    fetchOrderCounts(); 
}

function renderOrders(orders) {
    console.log(orders);
    ordersContainer.innerHTML = '';
    let pendingCount = 0;
    let completedCount = 0;

    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.classList.add('glass', 'p-4', 'rounded-lg', 'shadow-lg', 'w-full', 'flex', 'flex-col', 'items-center');

        const orderDetails = document.createElement('p');
        orderDetails.textContent = `Order ID: ${order.order_id} | Total Price: $${order.total_price}`;
        orderCard.appendChild(orderDetails);

        // Extract ids  from the dbs oder table and print them
        const itemIdsArray = order.item_ids ? order.item_ids.split(',') : [];
        const itemList = document.createElement('p');
        itemList.textContent = `Items: ${itemIdsArray.join(', ')}`;
        orderCard.appendChild(itemList);

        if (order.status === 'pending') {
            pendingCount++;
            const completeButton = document.createElement('button');
            completeButton.textContent = 'Complete';
            completeButton.classList.add('bg-green-500', 'text-white', 'px-4', 'py-2', 'rounded', 'hover:bg-green-700');
            completeButton.onclick = () => updateOrderStatus(order.order_id);
            orderCard.appendChild(completeButton);
        }

        ordersContainer.appendChild(orderCard);

        // Cunting pending and piad orders
        if (order.status === 'pending') pendingCount++;
        if (order.status === 'paid') completedCount++;
    });

    pendingOrdersCount.textContent = pendingCount;
    completedOrdersCount.textContent = completedCount;
}


async function updateOrderStatus(orderId) {
    const response = await fetch(`/api/order/complete/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    if (response.ok) {
        alert('Order marked as complete');
        fetchOrders(); 
        fetchOrderCounts(); 
    } else {
        alert('Failed to update order status');
    }
}

function logout() {
    localStorage.removeItem('authToken');
    window.location.href = '../login.html';
}

window.onload = () => {
    fetchUserInfo();
    fetchOrders();
};