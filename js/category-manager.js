document.addEventListener('DOMContentLoaded', () => {
    const toastContainer = document.getElementById('toast-container');
    const deleteConfirmBtn = document.querySelector('.btn-delete-confirm');

    const hideToast = (toast) => {
        toast.classList.add('hide');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
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

    if (deleteConfirmBtn) {
        deleteConfirmBtn.onclick = () => {
            window.location.hash = '#';
            showToast('Thành công', 'Xóa bài học thành công');
        };
    }
});
