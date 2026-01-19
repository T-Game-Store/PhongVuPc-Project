const BASE_URL = 'http://localhost:8080';
const API_CATEGORY = `${BASE_URL}/api/categories`;
const NO_IMAGE = 'https://placehold.co/100x100?text=No+Image';

function resolveImageUrl(imageUrl) {
    if (!imageUrl) return NO_IMAGE;
    if (imageUrl.startsWith('http')) return imageUrl;
    let path = imageUrl;
    if (!path.startsWith('/')) path = '/' + path;
    return BASE_URL + path;
}

async function loadCategoriesPage() {
    const mainView = document.getElementById('main-view');
    mainView.innerHTML = `
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
            <div class="p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 class="font-bold text-gray-800 text-lg">Quản lý danh mục</h3>
                <button onclick="renderAddCategoryForm()"
                    class="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-medium shadow-md transition-all">
                    + Thêm mới
                </button>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-50 uppercase text-[10px] font-bold text-gray-400">
                            <th class="px-6 py-4">Hình ảnh</th>
                            <th class="px-6 py-4">Tên danh mục</th>
                            <th class="px-6 py-4 text-center">Trạng thái</th>
                            <th class="px-6 py-4 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody id="category-table-body">
                        <tr><td colspan="4" class="text-center py-10 text-gray-400 italic">Đang tải dữ liệu...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>`;

    try {
        const res = await fetch(API_CATEGORY);
        const data = await res.json();
        const tbody = document.getElementById('category-table-body');
        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center py-10 text-gray-400">Chưa có danh mục nào.</td></tr>`;
            return;
        }
        tbody.innerHTML = data.map(cat => {
            const imgSrc = resolveImageUrl(cat.imageUrl);
            return `
                <tr class="hover:bg-gray-50 transition border-b border-gray-50 last:border-0">
                    <td class="px-6 py-4">
                        <img src="${imgSrc}"
                             onerror="this.src='${NO_IMAGE}'"
                             class="w-12 h-12 rounded-lg object-cover border border-gray-100 shadow-sm">
                    </td>
                    <td class="px-6 py-4">
                        <div class="font-semibold text-gray-700">${cat.name}</div>
                        <div class="text-[10px] text-gray-400 italic">${cat.slug || ''}</div>
                    </td>
                    <td class="px-6 py-4 text-center">
                        <span class="px-2 py-1 rounded-full text-[10px] font-bold
                            ${cat.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}">
                            ${cat.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right space-x-1">
                        <button onclick='openEditModal(${JSON.stringify(cat).replace(/'/g, "&apos;")})'
                            class="p-2 text-indigo-400 hover:bg-indigo-50 rounded-lg transition-colors">
                            <i class="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button onclick="confirmDelete(${cat.id})"
                            class="p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-colors">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </td>
                </tr>`;
        }).join('');
    } catch (err) {
        document.getElementById('category-table-body').innerHTML = `<tr><td colspan="4" class="text-center py-10 text-red-500">Lỗi kết nối tới Server!</td></tr>`;
    }
}

function handleImagePreview(input) {
    if (!input.files || !input.files[0]) return;
    const reader = new FileReader();
    reader.onload = e => {
        const img = document.getElementById('image-preview');
        if (img) {
            img.src = e.target.result;
            img.classList.remove('hidden');
            img.style.display = 'block';
        }
    };
    reader.readAsDataURL(input.files[0]);
}

async function uploadCategoryImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_CATEGORY}/upload`, {
        method: 'POST',
        body: formData
    });
    if (!res.ok) throw new Error('Upload thất bại');
    return await res.text();
}

function renderAddCategoryForm() {
    Swal.fire({
        title: 'Thêm danh mục mới',
        html: `
            <div class="space-y-4 p-2 text-left">
                <div class="flex flex-col items-center">
                    <img id="image-preview" class="w-24 h-24 rounded-full border mb-2 object-cover hidden shadow-sm">
                    <label class="cursor-pointer bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-bold">
                        Chọn ảnh
                        <input type="file" id="swal-file" class="hidden" accept="image/*"
                               onchange="handleImagePreview(this)">
                    </label>
                </div>
                <input id="swal-name" class="w-full px-4 py-2 rounded-lg border outline-none" placeholder="Tên danh mục">
                <textarea id="swal-desc" rows="3" class="w-full px-4 py-2 rounded-lg border outline-none" placeholder="Mô tả"></textarea>
            </div>`,
        confirmButtonText: 'Lưu',
        showCancelButton: true,
        preConfirm: async () => {
            const name = document.getElementById('swal-name').value.trim();
            const desc = document.getElementById('swal-desc').value.trim();
            const fileInput = document.getElementById('swal-file');
            if (!name) {
                Swal.showValidationMessage('Tên không được để trống');
                return false;
            }
            try {
                let imageUrl = '';
                if (fileInput.files.length > 0) imageUrl = await uploadCategoryImage(fileInput.files[0]);
                return { name, description: desc, imageUrl, status: 'active' };
            } catch (err) {
                Swal.showValidationMessage(`Lỗi: ${err.message}`);
                return false;
            }
        }
    }).then(async res => {
        if (res.isConfirmed) {
            await fetch(API_CATEGORY, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(res.value)
            });
            loadCategoriesPage();
        }
    });
}

window.openEditModal = (cat) => {
    const currentImg = resolveImageUrl(cat.imageUrl);
    Swal.fire({
        title: 'Cập nhật danh mục',
        html: `
            <div class="space-y-4 p-2 text-left">
                <div class="flex flex-col items-center">
                    <img id="image-preview" src="${currentImg}" class="w-24 h-24 rounded-full border mb-2 object-cover shadow-sm mx-auto">
                    <label class="cursor-pointer bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-bold block text-center w-32 mx-auto">
                        Đổi ảnh
                        <input type="file" id="swal-file" class="hidden" accept="image/*" onchange="handleImagePreview(this)">
                    </label>
                </div>
                <input id="swal-name" class="w-full px-4 py-2 rounded-lg border outline-none" value="${cat.name}">
                <textarea id="swal-desc" rows="3" class="w-full px-4 py-2 rounded-lg border outline-none">${cat.description || ''}</textarea>
                <select id="swal-status" class="w-full px-4 py-2 rounded-lg border outline-none">
                    <option value="active" ${cat.status === 'active' ? 'selected' : ''}>Hoạt động</option>
                    <option value="inactive" ${cat.status === 'inactive' ? 'selected' : ''}>Tạm dừng</option>
                </select>
            </div>`,
        confirmButtonText: 'Cập nhật',
        showCancelButton: true,
        preConfirm: async () => {
            let imageUrl = cat.imageUrl;
            const fileInput = document.getElementById('swal-file');
            if (fileInput.files.length > 0) imageUrl = await uploadCategoryImage(fileInput.files[0]);
            return {
                name: document.getElementById('swal-name').value.trim(),
                description: document.getElementById('swal-desc').value.trim(),
                status: document.getElementById('swal-status').value,
                imageUrl
            };
        }
    }).then(async res => {
        if (res.isConfirmed) {
            await fetch(`${API_CATEGORY}/${cat.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(res.value)
            });
            loadCategoriesPage();
        }
    });
};

window.confirmDelete = (id) => {
    Swal.fire({
        title: 'Xóa danh mục?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444'
    }).then(async res => {
        if (res.isConfirmed) {
            await fetch(`${API_CATEGORY}/${id}`, { method: 'DELETE' });
            loadCategoriesPage();
        }
    });
};