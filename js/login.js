document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('currentUser')) {
        window.location.replace('./dashboard.html');
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const showError = (inputId, message) => {
        const input = document.getElementById(inputId);
        const errorSpan = document.getElementById(inputId + 'Error');
        const parent = input.closest('.field');
        parent.classList.add('error');
        errorSpan.textContent = message;
    };

    const clearError = (inputId) => {
        const input = document.getElementById(inputId);
        const errorSpan = document.getElementById(inputId + 'Error');
        const parent = input.closest('.field');
        parent.classList.remove('error');
        errorSpan.textContent = '';
    };

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        if (emailInput.value.trim() === '') {
            showError('email', 'Email không được để trống');
            isValid = false;
        } else {
            clearError('email');
        }

        if (passwordInput.value === '') {
            showError('password', 'Mật khẩu không được để trống');
            isValid = false;
        } else {
            clearError('password');
        }

        if (isValid) {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === emailInput.value.trim() && u.password === passwordInput.value);

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.replace('./dashboard.html');
            } else {
                showError('email', 'Email hoặc mật khẩu không chính xác');
                showError('password', '');
            }
        }
    });

    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('input', () => clearError(input.id));
    });
});