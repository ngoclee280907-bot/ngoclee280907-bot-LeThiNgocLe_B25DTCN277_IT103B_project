document.addEventListener('DOMContentLoaded', () => {
    const confirmLogoutBtn = document.getElementById('confirmLogout');
    const toastContainer = document.getElementById('toast-container');

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
            <div class="toast-close">&times;</div>
        `;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 300);
        }, 3000);

        toast.querySelector('.toast-close').onclick = () => {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 300);
        };
    };

    // Chức năng Đăng Xuất (Logout)
    if (confirmLogoutBtn) {
        // Lắng nghe sự kiện Bấm nút 'Đồng ý' ở Modal Đăng xuất
        confirmLogoutBtn.onclick = () => {
            // Bước 1: Thu hồi thẻ bài / Xóa trạng thái đăng nhập
            localStorage.removeItem('currentUser');
            // Tắt Modal bằng cách xóa hash trên thanh URL
            window.location.hash = '#';
            
            showToast('Thành công', 'Bạn đã đăng xuất thành công. Đang quay lại trang đăng nhập...');
            
            // Bước 2: Đá văng người dùng về màn hình đăng nhập sau 2 giây
            setTimeout(() => {
                window.location.href = './login.html';
            }, 2000);
        };
    }
});
