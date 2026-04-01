document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const agreeTermsCheckbox = document.getElementById('agreeTerms');
    const toastContainer = document.getElementById('toast-container');

    const showError = (inputId, message) => {
        const input = document.getElementById(inputId);
        const errorSpan = document.getElementById(inputId + 'Error');
        const parent = input.closest('.field') || input.closest('.checkbox-wrapper');
        
        parent.classList.add('error');
        errorSpan.textContent = message;
    };

    const clearError = (inputId) => {
        const input = document.getElementById(inputId);
        const errorSpan = document.getElementById(inputId + 'Error');
        const parent = input.closest('.field') || input.closest('.checkbox-wrapper');
        
        parent.classList.remove('error');
        errorSpan.textContent = '';
    };

    const hideToast = (toast) => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    };

    const showToast = (title, message, duration = 3000) => {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <div class="toast-icon-success">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <div class="toast-close">&times;</div>
        `;
        toastContainer.appendChild(toast);

        const autoHide = setTimeout(() => hideToast(toast), duration);

        toast.querySelector('.toast-close').onclick = () => {
            clearTimeout(autoHide);
            hideToast(toast);
        };
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        if (fullnameInput.value.trim() === '') {
            showError('fullname', 'Họ và tên không được để trống');
            isValid = false;
        } else {
            clearError('fullname');
        }

        if (emailInput.value.trim() === '') {
            showError('email', 'Email không được để trống');
            isValid = false;
        } else if (!validateEmail(emailInput.value.trim())) {
            showError('email', 'Email phải đúng định dạng');
            isValid = false;
        } else {
            clearError('email');
        }

        if (passwordInput.value === '') {
            showError('password', 'Mật khẩu không được để trống');
            isValid = false;
        } else if (passwordInput.value.length < 8) {
            showError('password', 'Mật khẩu tối thiểu 8 ký tự');
            isValid = false;
        } else {
            clearError('password');
        }

        if (confirmPasswordInput.value === '') {
            showError('confirmPassword', 'Mật khẩu xác nhận không được để trống');
            isValid = false;
        } else if (confirmPasswordInput.value !== passwordInput.value) {
            showError('confirmPassword', 'Mật khẩu không trùng khớp');
            isValid = false;
        } else {
            clearError('confirmPassword');
        }

        if (!agreeTermsCheckbox.checked) {
            showError('agreeTerms', 'Bạn phải đồng ý với chính sách và điều khoản');
            isValid = false;
        } else {
            clearError('agreeTerms');
        }

        if (isValid) {
            const newUser = {
                fullname: fullnameInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value
            };

            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            const existingUser = users.find(user => user.email === newUser.email);
            if (existingUser) {
                showError('email', 'Email này đã được đăng ký');
                return;
            }

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            showToast('Thành công', 'Đăng ký tài khoản thành công! Đang chuyển hướng...');
            
            setTimeout(() => {
                window.location.href = './login.html';
            }, 2000);
        }
    });

    [fullnameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
        input.addEventListener('input', () => clearError(input.id));
    });
    agreeTermsCheckbox.addEventListener('change', () => clearError('agreeTerms'));
});
