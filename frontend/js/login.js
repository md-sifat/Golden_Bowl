const roleButtons = document.querySelectorAll('button');
const loginForm = document.getElementById('loginForm');
const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');
const submitBtn = document.getElementById('submitBtn');
let selectedRole = '';

function setRole(role) {
    selectedRole = role;
    // Enable the input fields and the login button
    emailField.disabled = false;
    passwordField.disabled = false;
    submitBtn.disabled = false;

    // Remove background color from all buttons
    roleButtons.forEach(btn => {
        btn.classList.remove('bg-blue-500', 'bg-green-500', 'bg-yellow-500');
        btn.classList.add('text-white');
    });

    // Add background color to the selected button
    if (role === 'customer') {
        document.getElementById('customer').classList.add('bg-green-500');
    } else if (role === 'manager') {
        document.getElementById('manager').classList.add('bg-green-500');
    } else if (role === 'chef') {
        document.getElementById('chef').classList.add('bg-green-500');
    }
}

// Handle form submission
loginForm.onsubmit = async (event) => {
    event.preventDefault();

    if (!selectedRole) {
        alert('Please select a role first!');
        return;
    }

    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData);
    data.role = selectedRole; // Add selected role to form data

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.message === 'Login successful!') {
        localStorage.setItem('authToken', result.token);
        if (selectedRole === 'customer') {
            window.location.href = '/customer/Cdashboad.html';
        } else if (selectedRole === 'manager') {
            window.location.href = '/manager/Mdashboard.html';
        } else if (selectedRole === 'chef') {
            window.location.href = '/chef/CHdashboad.html';
            // alert(result.message);
        }
    } else {
        alert(result.message);
    }
};