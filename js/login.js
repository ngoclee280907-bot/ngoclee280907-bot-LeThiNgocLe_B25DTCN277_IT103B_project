document.addEventListener('DOMContentLoaded', () => {
    // Bước 1: Kiểm tra trạng thái đăng nhập.
    // Nếu đã đăng nhập, chuyển hướng ngay tới trang Dashboard để tránh đăng nhập lại.
    if (localStorage.getItem('currentUser')) {
        window.location.replace('./dashboard.html');
        return;
    }

    // Bước 2: Truy vấn các phần tử DOM cần thiết.
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

    // Bước 3: Xử lý sự kiện submit form đăng nhập.
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

        // Bước 4: Xác thực thông tin với dữ liệu lưu trong localStorage.
        if (isValid) {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Sử dụng hàm find() để tìm người dùng có email và mật khẩu trùng khớp.
            const user = users.find(u => u.email === emailInput.value.trim() && u.password === passwordInput.value);

            // Bước 5: Xử lý khi đăng nhập thành công.
            if (user) {
                // Lưu thông tin người dùng hiện tại vào localStorage để duy trì phiên làm việc.
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Chuyển hướng sang trang Dashboard.
                window.location.replace('./dashboard.html');
            } else {
                // Hiển thị thông báo lỗi nếu tài khoản hoặc mật khẩu không đúng.
                showError('email', 'Email hoặc mật khẩu không chính xác');
                showError('password', '');
            }
        }
    });

    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('input', () => clearError(input.id));
    });
});