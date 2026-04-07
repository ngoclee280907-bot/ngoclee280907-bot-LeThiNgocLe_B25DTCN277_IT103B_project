document.addEventListener('DOMContentLoaded', () => {
    // Bước 1: Khai báo và móc nối với các thẻ HTML qua ID
    const registerForm = document.getElementById('registerForm');
    const lastNameInput = document.getElementById('lastName');
    const firstNameInput = document.getElementById('firstName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rePasswordInput = document.getElementById('rePassword');
    const agreeTermsCheckbox = document.getElementById('agreeTerms');
    const toastContainer = document.getElementById('toast-container');

    // Hàm phụ trợ: Hiển thị lỗi thiết kế UI
    const showError = (inputId, message) => {
        const input = document.getElementById(inputId);
        let errorSpan = document.getElementById(inputId + 'Error');
        if (inputId === 'agreeTerms') errorSpan = document.getElementById('termsError');
        const parent = input.closest('.field') || input.closest('.checkbox-wrapper');
        
        parent.classList.add('error');
        if (errorSpan) errorSpan.textContent = message;
    };

    // Hàm phụ trợ: Xóa trạng thái lỗi
    const clearError = (inputId) => {
        const input = document.getElementById(inputId);
        let errorSpan = document.getElementById(inputId + 'Error');
        if (inputId === 'agreeTerms') errorSpan = document.getElementById('termsError');
        const parent = input.closest('.field') || input.closest('.checkbox-wrapper');
        
        parent.classList.remove('error');
        if (errorSpan) errorSpan.textContent = '';
    };

    // Hàm phụ trợ: Vẽ giao diện bảng thông báo góc (Toast)
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

    // Bước 2: Bắt sự kiện khi người dùng bấm Submit Đăng ký
    registerForm.addEventListener('submit', (e) => {
        // Chặn không tải lại trang để giữ được dữ liệu JS
        e.preventDefault();
        
        // Cờ đánh dấu tình trạng hợp lệ 
        let isValid = true;

        // Bước 3: Lấy dữ liệu chữ và Kiểm tra rỗng (Validate)
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

        // Kiểm tra khớp 2 mật khẩu
        if (rePasswordInput.value === '') {
            showError('rePassword', 'Bạn vui lòng nhập lại mật khẩu');
            isValid = false;
        } else if (rePasswordInput.value !== passwordInput.value) {
            showError('rePassword', 'Mật khẩu không khớp');
            isValid = false;
        } else {
            clearError('rePassword');
        }

        // Bắt buộc tích Đồng ý
        if (!agreeTermsCheckbox.checked) {
            showError('agreeTerms', 'Bạn phải đồng ý với chính sách và điều khoản');
            isValid = false;
        } else {
            clearError('agreeTerms');
        }

        // Bước 4: Lưu dữ liệu khi Mọi thứ Hợp lệ (isValid = true)
        if (isValid) {
            // Đóng gói thông tin vừa thu thập thành 1 Object
            const newUser = {
                fullname: `${lastNameInput.value.trim()} ${firstNameInput.value.trim()}`.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value
            };

            // Lôi mảng Users từ LocalStorage lên, nếu rỗng thì tạo mảng trống []
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Dò xem mảng Users có người nào mang email kia hay chưa
            if (users.find(u => u.email === newUser.email)) {
                showError('email', 'Email này đã được đăng ký');
                return;
            }

            // Đẩy Obj của mình vào mảng tổng
            users.push(newUser);
            // Ép thành string lưu lại xuống LocalStorage
            localStorage.setItem('users', JSON.stringify(users));

            // Dọn dẹp thẻ đăng nhập nháp cũ nêútồn tại
            localStorage.removeItem('currentUser');

            // Bật Toast báo Thành công
            showToast('Thành công', 'Đăng ký tài khoản thành công! Đang chuyển hướng...');
            
            // Bước 5: Hẹn sau 2 giây thì Đá qua Trang Login
            setTimeout(() => {
                window.location.href = './login.html';
            }, 2000);
        }
    });

    // Mẹo UX: Đang gõ chữ vào ô nào thì tự động Xóa trạng thái màu Đỏ Báo lỗi
    [lastNameInput, firstNameInput, emailInput, passwordInput, rePasswordInput].forEach(input => {
        input.addEventListener('input', () => clearError(input.id));
    });
    agreeTermsCheckbox.addEventListener('change', () => clearError('agreeTerms'));
});
