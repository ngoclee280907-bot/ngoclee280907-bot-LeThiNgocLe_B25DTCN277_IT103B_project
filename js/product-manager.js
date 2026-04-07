document.addEventListener('DOMContentLoaded', () => {
    // Bước 1: Rào chắn - Chặn người không có tài khoản vào trang Quản lý bài học
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.replace('./login.html');
        return;
    }
    const currentUserId = currentUser.email;

    const toastContainer = document.getElementById('toast-container');

    // [Giao diện] Ép hiển thị Modal Sửa thông qua đường dẫn Hash
    const editBtns = document.querySelectorAll('.edit-btn');
    editBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.hash = 'editLessonModal';
        });
    });

    // [Giao diện] Ép hiển thị Modal Xóa thông qua đường dẫn Hash
    const deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.hash = 'deleteModal';
        });
    });

    // [Giao diện] Đóng tất cả Modal bằng cách trả Hash về Rỗng '#'
    const cancelBtns = document.querySelectorAll('.btn-cancel-modal, .close-btn, .modal-backdrop-close');
    cancelBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = '#';
        });
    });

    // Hàm phụ trợ: Hiển thị hộp thoại nhỏ góc màn hình (Toast)
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

    // Bước 2: Hàm chung kiểm tra Vvalidate Form không được để Rỗng
    const validateForm = (modalId) => {
        const modal = document.querySelector(modalId);
        const inputs = modal.querySelectorAll('input, select');
        let isValid = true;

        inputs.forEach(input => {
            const formGroup = input.closest('.form-group');
            if (input.value.trim() === '') {
                formGroup.classList.add('error'); // Gắn viền đỏ
                isValid = false;
            } else {
                formGroup.classList.remove('error'); // Xóa viền đỏ
            }
        });

        return isValid;
    };

    // Bước 3: Chức năng Thêm mới Bài học
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

    // Bước 4: Chức năng Cập nhật sửa Bài Học
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

    // Bước 5: Chức năng Xóa Bài học
    const deleteConfirmBtn = document.querySelector('.btn-danger-confirm');
    if (deleteConfirmBtn) {
        deleteConfirmBtn.addEventListener('click', () => {
            // (Logic xóa phần tử .filter theo ID ra khỏi Mảng sẽ diễn ra ở đây)

            window.location.hash = '#';
            showToast('Thành công', 'Xóa bài học thành công');
        });
    }

    // Mẹo UX: Tự xóa Lỗi Viền Đỏ khi người dùng đang nhập chữ vào
    document.querySelectorAll('.form-group input, .form-group select').forEach(element => {
        element.addEventListener('input', () => {
            element.closest('.form-group').classList.remove('error');
        });
    });
});
