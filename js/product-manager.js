document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.replace('./login.html');
        return;
    }
    const currentUserId = currentUser.email;

    const toastContainer = document.getElementById('toast-container');

    const editBtns = document.querySelectorAll('.edit-btn');
    editBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.hash = 'editLessonModal';
        });
    });

    const deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.hash = 'deleteModal';
        });
    });

    const cancelBtns = document.querySelectorAll('.btn-cancel-modal, .close-btn, .modal-backdrop-close');
    cancelBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = '#';
        });
    });

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

        const autoClose = setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 300);
        }, 3000);

        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(autoClose);
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 300);
        });
    }

    const validateForm = (modalId) => {
        const modal = document.querySelector(modalId);
        const inputs = modal.querySelectorAll('input, select');
        let isValid = true;

        inputs.forEach(input => {
            const formGroup = input.closest('.form-group');
            if (input.value.trim() === '') {
                formGroup.classList.add('error');
                isValid = false;
            } else {
                formGroup.classList.remove('error');
            }
        });

        return isValid;
    };

    const addBtn = document.querySelector('#lessonModal .btn-submit-modal');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            if (validateForm('#lessonModal')) {
                window.location.hash = '#';
                showToast('Thành công', 'Thêm bài học thành công');
            }
        });
    }

    const saveBtn = document.querySelector('#editLessonModal .btn-submit-modal');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            if (validateForm('#editLessonModal')) {
                window.location.hash = '#';
                showToast('Thành công', 'Cập nhật bài học thành công');
            }
        });
    }

    const deleteConfirmBtn = document.querySelector('.btn-danger-confirm');
    if (deleteConfirmBtn) {
        deleteConfirmBtn.addEventListener('click', () => {
            window.location.hash = '#';
            showToast('Thành công', 'Xóa bài học thành công');
        });
    }

    document.querySelectorAll('.form-group input, .form-group select').forEach(element => {
        element.addEventListener('input', () => {
            element.closest('.form-group').classList.remove('error');
        });
    });
});
