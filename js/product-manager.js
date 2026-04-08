document.addEventListener('DOMContentLoaded', () => {
    // Bước 1: Kiểm tra quyền truy cập. Chuyển hướng về trang login nếu chưa đăng nhập.
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.replace('./login.html');
        return;
    }
    const currentUserId = currentUser.email;

    const toastContainer = document.getElementById('toast-container');

    // Gán sự kiện hiển thị Modal Sửa qua mã hash URL.
    const editBtns = document.querySelectorAll('.edit-btn');
    editBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.hash = 'editLessonModal';
        });
    });

    // Gán sự kiện hiển thị Modal Xóa qua mã hash URL.
    const deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.hash = 'deleteModal';
        });
    });

    // Xử lý đóng tất cả Modal bằng cách reset mã hash trên URL.
    const cancelBtns = document.querySelectorAll('.btn-cancel-modal, .close-btn, .modal-backdrop-close');
    cancelBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = '#';
        });
    });

    // Hàm hiển thị thông báo toast thành công ở góc màn hình.
    function showToast(title, message) {
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

        // Hẹn giờ 3 giây tự tắt
        const autoClose = setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 300);
        }, 3000);

        // Hoặc tắt thủ công khi bấm X
        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(autoClose);
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 300);
        });
    }

    // Bước 2: Hàm kiểm tra tính hợp lệ của Form (Validation).
    const validateForm = (modalId) => {
        const modal = document.querySelector(modalId);
        const inputs = modal.querySelectorAll('input, select');
        let isValid = true;

        inputs.forEach(input => {
            const formGroup = input.closest('.form-group');
            if (input.value.trim() === '') {
                formGroup.classList.add('error'); // Thêm class báo lỗi.
                isValid = false;
            } else {
                formGroup.classList.remove('error'); // Loại bỏ class báo lỗi.
            }
        });

        return isValid;
    };

    // Bước 3: Xử lý chức năng thêm mới bài học.
    const addBtn = document.querySelector('#lessonModal .btn-submit-modal');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            // Check Validate ok chưa
            if (validateForm('#lessonModal')) {
                // (Logic LocalStorage.push sẽ diễn ra ở đây như Category Manager)

                window.location.hash = '#'; // Đóng modal
                showToast('Thành công', 'Thêm bài học thành công');
            }
        });
    }

    // Bước 4: Xử lý chức năng cập nhật thông tin bài học.
    const saveBtn = document.querySelector('#editLessonModal .btn-submit-modal');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
             // Check Validate Form Edit
            if (validateForm('#editLessonModal')) {
                // (Logic Tìm Object Cũ theo ID đè lên sẽ diễn ra ở đây)

                window.location.hash = '#'; // Đóng Modal
                showToast('Thành công', 'Cập nhật bài học thành công');
            }
        });
    }

    // Bước 5: Xử lý chức năng xóa bài học.
    const deleteConfirmBtn = document.querySelector('.btn-danger-confirm');
    if (deleteConfirmBtn) {
        deleteConfirmBtn.addEventListener('click', () => {
            // (Logic xóa phần tử .filter theo ID ra khỏi Mảng sẽ diễn ra ở đây)

            window.location.hash = '#';
            showToast('Thành công', 'Xóa bài học thành công');
        });
    }

    // Xử lý trải nghiệm người dùng: Xóa lỗi đỏ ngay khi bắt đầu nhập liệu.
    document.querySelectorAll('.form-group input, .form-group select').forEach(element => {
        element.addEventListener('input', () => {
            element.closest('.form-group').classList.remove('error');
        });
    });
});
