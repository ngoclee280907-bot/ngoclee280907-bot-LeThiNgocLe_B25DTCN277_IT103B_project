document.addEventListener('DOMContentLoaded', () => {
    // Bước 1: Truy vấn các phần tử DOM cần thiết qua ID.
    const registerForm = document.getElementById('registerForm');
    const lastNameInput = document.getElementById('lastName');
    const firstNameInput = document.getElementById('firstName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rePasswordInput = document.getElementById('rePassword');
    const agreeTermsCheckbox = document.getElementById('agreeTerms');
    const toastContainer = document.getElementById('toast-container');

    // Hàm hiển thị thông báo lỗi trên giao diện người dùng.
    const showError = (inputId, message) => {
        const input = document.getElementById(inputId);
        let errorSpan = document.getElementById(inputId + 'Error');
        if (inputId === 'agreeTerms') errorSpan = document.getElementById('termsError');
        const parent = input.closest('.field') || input.closest('.checkbox-wrapper');
        
        parent.classList.add('error');
        if (errorSpan) errorSpan.textContent = message;
    };

    // Hàm xóa trạng thái lỗi (loại bỏ class error và clear text).
    const clearError = (inputId) => {
        const input = document.getElementById(inputId);
        let errorSpan = document.getElementById(inputId + 'Error');
        if (inputId === 'agreeTerms') errorSpan = document.getElementById('termsError');
        const parent = input.closest('.field') || input.closest('.checkbox-wrapper');
        
        parent.classList.remove('error');
        if (errorSpan) errorSpan.textContent = '';
    };

    // Hàm hiển thị thông báo toast thành công ở góc màn hình.
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

    // Bước 2: Xử lý sự kiện submit của form đăng ký.
    registerForm.addEventListener('submit', (e) => {
        // Ngăn trình duyệt reload trang web.
        e.preventDefault();
        
        // Biến cờ (flag) để theo dõi trạng thái hợp lệ của toàn bộ form.

        // Bước 3: Kiểm tra tính hợp lệ của dữ liệu đầu vào (Validation).
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

        // Kiểm tra tính trùng khớp của mật khẩu xác nhận.
        if (rePasswordInput.value === '') {
            showError('rePassword', 'Bạn vui lòng nhập lại mật khẩu');
            isValid = false;
        } else if (rePasswordInput.value !== passwordInput.value) {
            showError('rePassword', 'Mật khẩu không khớp');
            isValid = false;
        } else {
            clearError('rePassword');
        }

        // Kiểm tra việc chấp thuận các điều khoản dịch vụ.
        if (!agreeTermsCheckbox.checked) {
            showError('agreeTerms', 'Bạn phải đồng ý với chính sách và điều khoản');
            isValid = false;
        } else {
            clearError('agreeTerms');
        }

        // Bước 4: Thực hiện lưu trữ dữ liệu nếu thông tin hợp lệ.
        if (isValid) {
            // Khởi tạo đối tượng chứa thông tin người dùng mới.
            const newUser = {
                fullname: `${lastNameInput.value.trim()} ${firstNameInput.value.trim()}`.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value
            };

            // Đọc danh sách người dùng hiện có từ localStorage (hoặc khởi tạo mảng rỗng).
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Kiểm tra sự tồn tại của email trong danh sách người dùng.
            if (users.find(u => u.email === newUser.email)) {
                showError('email', 'Email này đã được đăng ký');
                return;
            }

            // Thêm người dùng mới vào danh sách.
            users.push(newUser);
            // Chuyển danh sách thành mảng JSON và lưu vĩnh viễn vào localStorage.
            localStorage.setItem('users', JSON.stringify(users));

            // Xóa thông tin phiên đăng nhập cũ (nếu có).
            localStorage.removeItem('currentUser');

            // Bật Toast báo Thành công
            showToast('Thành công', 'Đăng ký tài khoản thành công! Đang chuyển hướng...');
            
            // Bước 5: Chuyển hướng người dùng về trang đăng nhập sau một khoảng thời gian ngắn.
            setTimeout(() => {
                window.location.href = './login.html';
            }, 2000);
        }
    });

    // Xử lý trải nghiệm người dùng: Xóa thông báo lỗi ngay khi bắt đầu nhập liệu lại.
    [lastNameInput, firstNameInput, emailInput, passwordInput, rePasswordInput].forEach(input => {
        input.addEventListener('input', () => clearError(input.id));
    });
    agreeTermsCheckbox.addEventListener('change', () => clearError('agreeTerms'));
});
