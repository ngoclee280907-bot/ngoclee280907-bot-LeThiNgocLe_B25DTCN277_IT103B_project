document.addEventListener('DOMContentLoaded', () => {
    // Bước 1: Rào chắn - Đâm thủng ai chưa đăng nhập mà dám mò vào
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.replace('./login.html');
        return;
    }
    const currentUserId = currentUser.email;

    const toastContainer = document.getElementById('toast-container');
    const categoryTableBody = document.getElementById('categoryTableBody');
    const paginationContainer = document.getElementById('pagination');
    const searchInput = document.getElementById('searchCategory');
    const filterSelect = document.getElementById('filterStatus');
    const sortSelect = document.getElementById('sortCategory');
    
    const addCategoryBtn = document.querySelector('#categoryModal .btn-submit');
    const categoryNameInput = document.getElementById('categoryName');
    
    const editCategoryBtn = document.querySelector('#editModal .btn-submit');
    const editCategoryNameInput = document.getElementById('editCategoryName');
    
    const deleteConfirmBtn = document.querySelector('.btn-delete-confirm');
    const deleteCategoryNameSpan = document.getElementById('deleteCategoryName');
    
    // Nơi chứa dữ liệu: Mảng gốc (Tất cả user)
    let allCategories = JSON.parse(localStorage.getItem('categories')) || [];
    // Mảng con: Lọc dành riêng cho người user hiện tại
    let categories = allCategories.filter(c => c.userId === currentUserId);
    
    // Đổ tí dữ liệu mồi nếu mới tinh
    if (allCategories.length === 0) {
        categories = [
            { id: 1, userId: currentUserId, name: 'Lập trình C', status: 'active', createdAt: Date.now() - 100000 },
            { id: 2, userId: currentUserId, name: 'Lập trình Frontend với ReactJS', status: 'inactive', createdAt: Date.now() - 90000 },
            { id: 3, userId: currentUserId, name: 'Lập trình Backend với Spring boot', status: 'active', createdAt: Date.now() - 80000 },
            { id: 4, userId: currentUserId, name: 'Lập trình Frontend với VueJS', status: 'inactive', createdAt: Date.now() - 70000 },
            { id: 5, userId: currentUserId, name: 'Cấu trúc dữ liệu và giải thuật', status: 'inactive', createdAt: Date.now() - 60000 },
            { id: 6, userId: currentUserId, name: 'Phân tích và thiết kế hệ thống', status: 'inactive', createdAt: Date.now() - 50000 },
            { id: 7, userId: currentUserId, name: 'Toán cao cấp', status: 'active', createdAt: Date.now() - 40000 },
            { id: 8, userId: currentUserId, name: 'Tiếng Anh chuyên ngành', status: 'inactive', createdAt: Date.now() - 30000 }
        ];
        allCategories = [...categories];
        localStorage.setItem('categories', JSON.stringify(allCategories));
    }

    // Hàm Phụ: Lưu đè mảng mỗi khi có thay đổi (Thêm/Sửa/Xóa)
    const saveCategories = () => {
        allCategories = allCategories.filter(c => c.userId !== currentUserId); // Bỏ mấy phần tử cũ đi
        allCategories.push(...categories); // Nhét mảng mới cập nhật vào
        localStorage.setItem('categories', JSON.stringify(allCategories)); // Lưu xuống két
    };

    // Các biến phụ lưu Trạng Thái hiện tại (Ai đang sửa, ai đang bị xóa, trang số mấy)
    let currentPage = 1;
    const itemsPerPage = 5;
    let currentDeleteId = null;
    let currentEditId = null;

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

    // ============== CHỨC NĂNG HIỂN THỊ DỮ LIỆU BẢNG ==============
    const renderCategories = () => {
        // [Phần Tìm kiếm & Sắp xếp]
        const query = (searchInput.value || '').toLowerCase().trim();
        const filter = filterSelect.value;
        const sort = sortSelect.value;

        // Bỏ mảng vô cái Xào lọc dữ liệu (Bỏ ai không giống Search Bar)
        let filtered = categories.filter(c => {
            const matchName = c.name.toLowerCase().includes(query);
            const matchStatus = filter === '' || c.status === filter;
            return matchName && matchStatus;
        });

        // Hàm Sắp xếp lại chữ cái
        filtered.sort((a, b) => {
            if (sort === 'name_asc') return a.name.localeCompare(b.name);
            if (sort === 'name_desc') return b.name.localeCompare(a.name);
            return 0;
        });

        // [Phần Phân Trang]
        // Bóc tách Số trang (Tổng = length / 5)
        const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;

        // Công thức cắt: Start = (Current - 1) * 5
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        // Thái mảng bằng .slice để lấy 1 khúc đi In (Render)
        const paginated = filtered.slice(startIndex, endIndex);

        // Làm sạch bàn
        categoryTableBody.innerHTML = '';
        if (paginated.length === 0) {
            categoryTableBody.innerHTML = `<tr><td colspan="3" style="text-align: center; padding: 20px;">Không tìm thấy môn học nào</td></tr>`;
        } else {
            // Duyệt Mảng khúc cắt, Rải HTML
            paginated.forEach(c => {
                const tr = document.createElement('tr');
                const statusText = c.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động';
                const statusClass = c.status === 'active' ? 'active' : 'inactive';

                tr.innerHTML = `
                    <td>${c.name}</td>
                    <td><span class="status ${statusClass}">${statusText}</span></td>
                    <td>
                        <!-- Nút Xóa mang theo DATA-ID -->
                        <a href="#deleteModal" class="icon-btn btn-delete-row" data-id="${c.id}" data-name="${c.name}">
                            <img src="../assets/images/trash-2.png" alt="Xóa">
                        </a>
                        <!-- Nút Sửa mang theo DATA-ID -->
                        <a href="#editModal" class="icons-btn btn-edit-row" data-id="${c.id}">
                            <img src="../assets/images/_Button base.png" alt="Sửa">
                        </a>
                    </td>
                `;
                categoryTableBody.appendChild(tr);
            });
        }

        // Gọi Hàm Sinh vẽ Nút Trang
        renderPagination(totalPages);
        
        // Gọi Hàm Khởi tạo Bắt Sự kiện Cho 2 Nút (Sửa, Xóa) vừa được đắp vào web
        bindRowEvents();
    };

    const renderPagination = (totalPages) => {
        paginationContainer.innerHTML = '';
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-btn';
        prevBtn.textContent = '<';
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                renderCategories();
            }
        };
        paginationContainer.appendChild(prevBtn);

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.onclick = () => {
                currentPage = i;
                renderCategories();
            };
            paginationContainer.appendChild(pageBtn);
        }

        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-btn';
        nextBtn.textContent = '>';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderCategories();
            }
        };
        paginationContainer.appendChild(nextBtn);
    };

    // Xử lý Gán Sự Kiện Xóa, Sửa khi bấm trên Dòng Dữ liệu
    const bindRowEvents = () => {
        // [Xác định ai bị Xóa]
        const deleteBtns = document.querySelectorAll('.btn-delete-row');
        deleteBtns.forEach(btn => {
            btn.onclick = (e) => {
                // Nhặt lấy cái Id từ Data HTML gài sẵn. Set vào biến cắm cờ
                currentDeleteId = parseInt(btn.getAttribute('data-id'));
                deleteCategoryNameSpan.textContent = btn.getAttribute('data-name');
            };
        });

        // [Xác định ai bị Sửa, Đổ dữ liệu Data lên Form]
        const editBtns = document.querySelectorAll('.btn-edit-row');
        editBtns.forEach(btn => {
            btn.onclick = () => {
                // Nhặt cái ID 
                currentEditId = parseInt(btn.getAttribute('data-id'));
                
                // Mở mảng tìm thằng đang mang ID đó
                const categoryToEdit = categories.find(c => c.id === currentEditId);
                if (categoryToEdit) {
                    // Đổ "Tên" cũ vào ô input của Modal Mới
                    editCategoryNameInput.value = categoryToEdit.name;
                    
                    // Tự check trạng thái Cũ
                    const statusRadios = document.querySelectorAll('input[name="statusEdit"]');
                    statusRadios.forEach(radio => {
                        radio.checked = (radio.value === categoryToEdit.status);
                    });
                    editCategoryNameInput.closest('.form-group').classList.remove('field-error');
                }
            };
        });
    };

    searchInput.addEventListener('input', () => {
        currentPage = 1; 
        renderCategories();
    });

    filterSelect.addEventListener('change', () => {
        currentPage = 1;
        renderCategories();
    });

    sortSelect.addEventListener('change', () => {
        currentPage = 1;
        renderCategories();
    });

    // ============== CHỨC NĂNG XÓA CHÍNH THỨC ==============
    if (deleteConfirmBtn) {
        deleteConfirmBtn.onclick = () => {
            // Lệnh Lọc gọt: Bẻ gãy loại bỏ phần tử cũ rích mang dòng id bị Cắm cờ
            categories = categories.filter(c => c.id !== currentDeleteId);
            saveCategories(); // Lưu đè cục mới
            
            document.querySelector('#deleteModal .btn-cancel').click();
            showToast('Thành công', 'Xóa môn học thành công');
            renderCategories(); // Cập nhật mảng trên màn hình
        };
    }

    // Add Category Modal trigger
    const addModalTriggerEvent = document.querySelector('.btn-add');
    if (addModalTriggerEvent) {
        addModalTriggerEvent.addEventListener('click', () => {
            categoryNameInput.value = '';
            categoryNameInput.closest('.form-group').classList.remove('field-error');
            document.querySelector('input[name="statusAdd"][value="active"]').checked = true;
        });
    }

    // ============== CHỨC NĂNG THÊM MỚI ==============
    if (addCategoryBtn) {
        addCategoryBtn.onclick = () => {
            const nameValue = categoryNameInput.value.trim();
            const formGroup = categoryNameInput.closest('.form-group');
            const errorMessage = formGroup.querySelector('.error-message');
            
            // Validate Kiểm tra: Trống ko -> Trùng Ko? 
            if (nameValue === '') {
                errorMessage.textContent = 'Tên môn học không được để trống';
                formGroup.classList.add('field-error');
            } else if (categories.some(c => c.name.toLowerCase() === nameValue.toLowerCase())) {
                errorMessage.textContent = 'Tên môn học không được phép trùng';
                formGroup.classList.add('field-error');
            } else {
                formGroup.classList.remove('field-error');
                
                // Mọi thứ hoàn hảo -> Tạo Object
                const statusRadio = document.querySelector('input[name="statusAdd"]:checked');
                const newCategory = {
                    id: Date.now(),
                    userId: currentUserId,
                    name: nameValue,
                    status: statusRadio ? statusRadio.value : 'active',
                    createdAt: Date.now()
                };
                
                // Nhét Data mới -> Mảng Tổng -> Nhét vô Két Sắt
                categories.push(newCategory);
                saveCategories();
                
                document.querySelector('#categoryModal .btn-cancel').click(); // Đóng Modal
                showToast('Thành công', 'Thêm mới môn học thành công'); // Khen
                categoryNameInput.value = ''; // Làm sạch
                
                currentPage = 1;
                renderCategories(); // Quét vẽ lại bàn ăn Bảng HTML mới
            }
        };
    }

    // ============== CHỨC NĂNG CẬP NHẬT ==============
    if (editCategoryBtn) {
        editCategoryBtn.onclick = () => {
            const nameValue = editCategoryNameInput.value.trim();
            const formGroup = editCategoryNameInput.closest('.form-group');
            const errorMessage = formGroup.querySelector('.error-message');
            
            // Xác thực (Giống hệt ở Thêm Mới, Đừng trùng Tên với đứa KHÁC)
            if (nameValue === '') {
                errorMessage.textContent = 'Tên môn học không được để trống';
                formGroup.classList.add('field-error');
            } else if (categories.some(c => c.id !== currentEditId && c.name.toLowerCase() === nameValue.toLowerCase())) {
                errorMessage.textContent = 'Tên môn học không được phép trùng';
                formGroup.classList.add('field-error');
            } else {
                formGroup.classList.remove('field-error');
                
                const statusRadio = document.querySelector('input[name="statusEdit"]:checked');
                
                // Móc ID tìm ra VỊ TRÍ (Index) của thằng dữ liệu đang bị sửa
                const categoryIndex = categories.findIndex(c => c.id === currentEditId);
                
                if (categoryIndex !== -1) {
                    // Đè thuộc Tính Mới Lên thẳng cái Bản Phôi Tại vị trí mảng đó
                    categories[categoryIndex].name = nameValue;
                    categories[categoryIndex].status = statusRadio ? statusRadio.value : 'active';
                    
                    saveCategories(); // Lưu lại đè két sắt
                    
                    document.querySelector('#editModal .btn-cancel').click(); // Đóng cúp modal
                    showToast('Thành công', 'Cập nhật môn học thành công');
                    renderCategories();
                }
            }
        };
    }

    if (categoryNameInput) {
        categoryNameInput.oninput = () => {
            categoryNameInput.closest('.form-group').classList.remove('field-error');
        };
    }

    if (editCategoryNameInput) {
        editCategoryNameInput.oninput = () => {
            editCategoryNameInput.closest('.form-group').classList.remove('field-error');
        };
    }

    renderCategories();
});
