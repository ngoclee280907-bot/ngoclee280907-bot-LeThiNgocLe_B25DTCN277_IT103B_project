document.addEventListener('DOMContentLoaded', () => {
    // Bước 1: Rào chắn Khóa trang
    // Đoạn này kiểm tra nếu thấy đã Đăng Nhập Rồi thì đá thẳng vô Dashboard, không cho phép lãng vãng ở Login
    if (localStorage.getItem('currentUser')) {
        window.location.replace('./dashboard.html');
        return;
    }

    // Bước 2: Bắt element
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

    // Bước 3: Bắt sự kiện Bấm Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Chặn tải lại form
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

        // Bước 4: So khớp với dữ liệu gốc ở LocalStorage
        if (isValid) {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Xài hàm .find() tìm ra ông Tướng nào có Email và Pass Y chang như những gì vừa gõ
            const user = users.find(u => u.email === emailInput.value.trim() && u.password === passwordInput.value);

            // Bước 5: Nếu tìm thấy thì chứng tỏ gõ đúng
            if (user) {
                // Tạo thẻ Bài Session `currentUser` để sau này đi lại vòng vòng trang quản lý
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Đá vô trang Quản Lý
                window.location.replace('./dashboard.html');
            } else {
                // Nếu tìm không thấy -> báo Tài khoản sai.
                showError('email', 'Email hoặc mật khẩu không chính xác');
                showError('password', '');
            }
        }
    });

    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('input', () => clearError(input.id));
    });
});