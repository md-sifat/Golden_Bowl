const roleBtns = document.querySelectorAll('.role-btn');
const signupForm = document.getElementById('signupForm');
const submitBtn = document.getElementById('submitBtn');
const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');
let selectedRole = '';

function setRole(role) {
    selectedRole = role;
    emailField.disabled = false;
    passwordField.disabled = false;
    submitBtn.disabled = false;
    roleBtns.forEach(btn => {
        btn.classList.remove('selected');
    });

    document.getElementById(role).classList.add('selected');
}

signupForm.onsubmit = async (event) => {
    event.preventDefault();

    if (!selectedRole) {
        alert('Please select a role first!');
        return;
    }

    const formData = new FormData(signupForm);
    const data = Object.fromEntries(formData);
    data.role = selectedRole;

    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            window.location.href = 'login.html';
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error during signup');
    }
};