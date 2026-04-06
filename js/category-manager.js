document.addEventListener('DOMContentLoaded', () => {
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
    
    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    if (categories.length === 0) {
        categories = [
            { id: 1, name: 'Lập trình C', status: 'active', createdAt: Date.now() - 100000 },
            { id: 2, name: 'Lập trình Frontend với ReactJS', status: 'inactive', createdAt: Date.now() - 90000 },
            { id: 3, name: 'Lập trình Backend với Spring boot', status: 'active', createdAt: Date.now() - 80000 },
            { id: 4, name: 'Lập trình Frontend với VueJS', status: 'inactive', createdAt: Date.now() - 70000 },
            { id: 5, name: 'Cấu trúc dữ liệu và giải thuật', status: 'inactive', createdAt: Date.now() - 60000 },
            { id: 6, name: 'Phân tích và thiết kế hệ thống', status: 'inactive', createdAt: Date.now() - 50000 },
            { id: 7, name: 'Toán cao cấp', status: 'active', createdAt: Date.now() - 40000 },
            { id: 8, name: 'Tiếng Anh chuyên ngành', status: 'inactive', createdAt: Date.now() - 30000 }
        ];
        localStorage.setItem('categories', JSON.stringify(categories));
    }

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

    const renderCategories = () => {
        const query = (searchInput.value || '').toLowerCase().trim();
        const filter = filterSelect.value;
        const sort = sortSelect.value;

        let filtered = categories.filter(c => {
            const matchName = c.name.toLowerCase().includes(query);
            const matchStatus = filter === '' || c.status === filter;
            return matchName && matchStatus;
        });

        filtered.sort((a, b) => {
            if (sort === 'time_desc') return b.createdAt - a.createdAt;
            if (sort === 'time_asc') return a.createdAt - b.createdAt;
            if (sort === 'name_asc') return a.name.localeCompare(b.name);
            if (sort === 'name_desc') return b.name.localeCompare(a.name);
            return 0;
        });

        const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginated = filtered.slice(startIndex, endIndex);

        categoryTableBody.innerHTML = '';
        if (paginated.length === 0) {
            categoryTableBody.innerHTML = `<tr><td colspan="3" style="text-align: center; padding: 20px;">Không tìm thấy môn học nào</td></tr>`;
        } else {
            paginated.forEach(c => {
                const tr = document.createElement('tr');
                const statusText = c.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động';
                const statusClass = c.status === 'active' ? 'active' : 'inactive';

                tr.innerHTML = `
                    <td>${c.name}</td>
                    <td><span class="status ${statusClass}">${statusText}</span></td>
                    <td>
                        <a href="#deleteModal" class="icon-btn btn-delete-row" data-id="${c.id}" data-name="${c.name}">
                            <img src="../assets/images/trash-2.png" alt="Xóa">
                        </a>
                        <a href="#editModal" class="icons-btn btn-edit-row" data-id="${c.id}">
                            <img src="../assets/images/_Button base.png" alt="Sửa">
                        </a>
                    </td>
                `;
                categoryTableBody.appendChild(tr);
            });
        }

        renderPagination(totalPages);
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

    const bindRowEvents = () => {
        const deleteBtns = document.querySelectorAll('.btn-delete-row');
        deleteBtns.forEach(btn => {
            btn.onclick = (e) => {
                currentDeleteId = parseInt(btn.getAttribute('data-id'));
                deleteCategoryNameSpan.textContent = btn.getAttribute('data-name');
            };
        });

        const editBtns = document.querySelectorAll('.btn-edit-row');
        editBtns.forEach(btn => {
            btn.onclick = () => {
                currentEditId = parseInt(btn.getAttribute('data-id'));
                const categoryToEdit = categories.find(c => c.id === currentEditId);
                if (categoryToEdit) {
                    editCategoryNameInput.value = categoryToEdit.name;
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

    if (deleteConfirmBtn) {
        deleteConfirmBtn.onclick = () => {
            categories = categories.filter(c => c.id !== currentDeleteId);
            localStorage.setItem('categories', JSON.stringify(categories));
            
            document.querySelector('#deleteModal .btn-cancel').click();
            showToast('Thành công', 'Xóa môn học thành công');
            renderCategories();
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

    if (addCategoryBtn) {
        addCategoryBtn.onclick = () => {
            const nameValue = categoryNameInput.value.trim();
            const formGroup = categoryNameInput.closest('.form-group');
            const errorMessage = formGroup.querySelector('.error-message');
            
            if (nameValue === '') {
                errorMessage.textContent = 'Tên môn học không được để trống';
                formGroup.classList.add('field-error');
            } else if (categories.some(c => c.name.toLowerCase() === nameValue.toLowerCase())) {
                errorMessage.textContent = 'Tên môn học không được phép trùng';
                formGroup.classList.add('field-error');
            } else {
                formGroup.classList.remove('field-error');
                
                const statusRadio = document.querySelector('input[name="statusAdd"]:checked');
                const newCategory = {
                    id: Date.now(),
                    name: nameValue,
                    status: statusRadio ? statusRadio.value : 'active',
                    createdAt: Date.now()
                };
                
                categories.push(newCategory);
                localStorage.setItem('categories', JSON.stringify(categories));
                
                document.querySelector('#categoryModal .btn-cancel').click(); // Close modal
                showToast('Thành công', 'Thêm mới môn học thành công');
                categoryNameInput.value = '';
                
                currentPage = 1;
                renderCategories();
            }
        };
    }

    if (editCategoryBtn) {
        editCategoryBtn.onclick = () => {
            const nameValue = editCategoryNameInput.value.trim();
            const formGroup = editCategoryNameInput.closest('.form-group');
            const errorMessage = formGroup.querySelector('.error-message');
            
            if (nameValue === '') {
                errorMessage.textContent = 'Tên môn học không được để trống';
                formGroup.classList.add('field-error');
            } else if (categories.some(c => c.id !== currentEditId && c.name.toLowerCase() === nameValue.toLowerCase())) {
                errorMessage.textContent = 'Tên môn học không được phép trùng';
                formGroup.classList.add('field-error');
            } else {
                formGroup.classList.remove('field-error');
                
                const statusRadio = document.querySelector('input[name="statusEdit"]:checked');
                const categoryIndex = categories.findIndex(c => c.id === currentEditId);
                
                if (categoryIndex !== -1) {
                    categories[categoryIndex].name = nameValue;
                    categories[categoryIndex].status = statusRadio ? statusRadio.value : 'active';
                    
                    localStorage.setItem('categories', JSON.stringify(categories));
                    
                    document.querySelector('#editModal .btn-cancel').click(); // Close modal
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
