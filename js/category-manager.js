document.addEventListener('DOMContentLoaded', () => {
    // Bước 1: Kiểm tra quyền truy cập. Nếu chưa đăng nhập, chuyển hướng về trang login.
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
    
    // Lấy toàn bộ danh mục từ localStorage hoặc khởi tạo mảng rỗng nếu chưa có dữ liệu.
    let allCategories = JSON.parse(localStorage.getItem('categories')) || [];
    // Lọc danh sách danh mục thuộc về người dùng hiện tại.
    let categories = allCategories.filter(c => c.userId === currentUserId);
    
    // Khởi tạo dữ liệu mẫu nếu hệ thống chưa có dữ liệu.
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
        allCategories = allCategories.filter(c => c.userId !== currentUserId); // Loại bỏ các bản ghi cũ của user này khỏi mảng tổng.
        allCategories.push(...categories); // Thêm các bản ghi đã cập nhật vào mảng tổng.
        localStorage.setItem('categories', JSON.stringify(allCategories)); // Lưu mảng tổng vào localStorage.
    };

    // Các biến quản lý trạng thái: trang hiện tại, số lượng bản ghi mỗi trang, ID đang xóa/sửa.
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

        // Lọc mảng categories theo từ khóa tìm kiếm và trạng thái hoạt động.
        let filtered = categories.filter(c => {
            const matchName = c.name.toLowerCase().includes(query);
            const matchStatus = filter === '' || c.status === filter;
            return matchName && matchStatus;
        });

        // Sắp xếp danh sách dựa trên tên (tăng dần/giảm dần).
        filtered.sort((a, b) => {
            if (sort === 'name_asc') return a.name.localeCompare(b.name);
            if (sort === 'name_desc') return b.name.localeCompare(a.name);
            return 0;
        });

        // [Phần Phân Trang]
        // Tính toán tổng số trang dựa trên số bản ghi đã lọc.
        const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;

        // Công thức cắt: Start = (Current - 1) * 5
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        // Sử dụng slice để lấy tập dữ liệu con tương ứng với trang hiện tại.
        const paginated = filtered.slice(startIndex, endIndex);

        // Xóa nội dung bảng hiện tại trước khi render lại dữ liệu mới.
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
        
        // Gán lại sự kiện Sửa/Xóa cho các dòng dữ liệu mới vừa render.
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
        // Gán sự kiện cho nút Xóa.
        const deleteBtns = document.querySelectorAll('.btn-delete-row');
        deleteBtns.forEach(btn => {
            btn.onclick = (e) => {
                // Lấy ID từ thuộc tính data-id và cập nhật vào biến currentDeleteId.
                currentDeleteId = parseInt(btn.getAttribute('data-id'));
                deleteCategoryNameSpan.textContent = btn.getAttribute('data-name');
            };
        });

        // Gán sự kiện cho nút Sửa và đổ dữ liệu lên form Modal.
        const editBtns = document.querySelectorAll('.btn-edit-row');
        editBtns.forEach(btn => {
            btn.onclick = () => {
                // Nhặt cái ID 
                currentEditId = parseInt(btn.getAttribute('data-id'));
                
                // Tìm danh mục cụ thể theo ID trong mảng categories.
                const categoryToEdit = categories.find(c => c.id === currentEditId);
                if (categoryToEdit) {
                    // Điền tên danh mục hiện tại vào ô input.
                    editCategoryNameInput.value = categoryToEdit.name;
                    
                    // Cập nhật trạng thái (radio button) tương ứng.
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
            // Loại bỏ danh mục có ID tương ứng ra khỏi mảng dữ liệu.
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
            
            // Kiểm tra tính hợp lệ của dữ liệu (không để trống, không được trùng tên).
            if (nameValue === '') {
                errorMessage.textContent = 'Tên môn học không được để trống';
                formGroup.classList.add('field-error');
            } else if (categories.some(c => c.name.toLowerCase() === nameValue.toLowerCase())) {
                errorMessage.textContent = 'Tên môn học không được phép trùng';
                formGroup.classList.add('field-error');
            } else {
                formGroup.classList.remove('field-error');
                
                // Nếu dữ liệu hợp lệ, tạo đối tượng danh mục mới.
                const statusRadio = document.querySelector('input[name="statusAdd"]:checked');
                const newCategory = {
                    id: Date.now(),
                    userId: currentUserId,
                    name: nameValue,
                    status: statusRadio ? statusRadio.value : 'active',
                    createdAt: Date.now()
                };
                
                // Thêm đối tượng mới vào mảng và lưu lại vào localStorage.
                categories.push(newCategory);
                saveCategories();
                
                document.querySelector('#categoryModal .btn-cancel').click(); // Đóng modal.
                showToast('Thành công', 'Thêm mới môn học thành công'); // Thông báo thành công.
                categoryNameInput.value = ''; // Reset input.
                
                currentPage = 1;
                renderCategories(); // Cập nhật lại giao diện bảng.
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
                
                // Tìm vị trí của phần tử cần cập nhật trong mảng.
                const categoryIndex = categories.findIndex(c => c.id === currentEditId);
                
                if (categoryIndex !== -1) {
                    // Cập nhật các thuộc tính mới vào phần tử tại vị trí đã tìm thấy.
                    categories[categoryIndex].name = nameValue;
                    categories[categoryIndex].status = statusRadio ? statusRadio.value : 'active';
                    
                    saveCategories(); // Lưu lại dữ liệu sau khi chỉnh sửa.
                    
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
