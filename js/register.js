document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const lastNameInput = document.getElementById('lastName');
    const firstNameInput = document.getElementById('firstName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const agreeTermsCheckbox = document.getElementById('agreeTerms');
    const toastContainer = document.getElementById('toast-container');

    const showError = (inputId, message) => {
        const input = document.getElementById(inputId);
        let errorSpan = document.getElementById(inputId + 'Error');
        if (inputId === 'agreeTerms') errorSpan = document.getElementById('termsError');
        const parent = input.closest('.field') || input.closest('.checkbox-wrapper');
        
        parent.classList.add('error');
        if (errorSpan) errorSpan.textContent = message;
    };

    const clearError = (inputId) => {
        const input = document.getElementById(inputId);
        let errorSpan = document.getElementById(inputId + 'Error');
        if (inputId === 'agreeTerms') errorSpan = document.getElementById('termsError');
        const parent = input.closest('.field') || input.closest('.checkbox-wrapper');
        
        parent.classList.remove('error');
        if (errorSpan) errorSpan.textContent = '';
    };

    const showToast = (title, message) => {
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
        `;
        toastContainer.appendChild(toast);
    };

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        if (lastNameInput.value.trim() === '') {
            showError('lastName', 'Bạn vui lòng nhập họ và tên đệm');
            isValid = false;
        } else {
            clearError('lastName');
        }

        if (firstNameInput.value.trim() === '') {
            showError('firstName', 'Bạn vui lòng nhập tên');
            isValid = false;
        } else {
            clearError('firstName');
        }

        if (emailInput.value.trim() === '') {
            showError('email', 'Email không được để trống');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
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



        if (!agreeTermsCheckbox.checked) {
            showError('agreeTerms', 'Bạn phải đồng ý với chính sách và điều khoản');
            isValid = false;
        } else {
            clearError('agreeTerms');
        }

        if (isValid) {
            const newUser = {
                fullname: `${lastNameInput.value.trim()} ${firstNameInput.value.trim()}`.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value
            };

            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            if (users.find(u => u.email === newUser.email)) {
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

    [lastNameInput, firstNameInput, emailInput, passwordInput].forEach(input => {
        input.addEventListener('input', () => clearError(input.id));
    });
    agreeTermsCheckbox.addEventListener('change', () => clearError('agreeTerms'));
});
