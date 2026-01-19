const API_WAREHOUSE = 'http://localhost:8080/api/warehouses';

async function loadInventoryPage() {
    const mainView = document.getElementById('main-view');
    mainView.innerHTML = `
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
            <div class="p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 class="font-bold text-gray-800 text-lg">Quản lý kho hàng</h3>
                <button onclick="renderAddWarehouseForm()" class="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all shadow-md shadow-indigo-100">+ Tạo kho mới</button>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-50/50 uppercase text-[10px] font-bold text-gray-400 tracking-wider">
                            <th class="px-6 py-4">Tên kho</th>
                            <th class="px-6 py-4 text-center">Địa chỉ</th>
                            <th class="px-6 py-4 text-center">Trạng thái</th>
                            <th class="px-6 py-4 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody id="warehouse-table-body" class="divide-y divide-gray-50">
                        <tr><td colspan="4" class="text-center py-10 text-gray-400">Đang tải dữ liệu...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>`;

    try {
        const res = await fetch(API_WAREHOUSE);
        const data = await res.json();
        const tbody = document.getElementById('warehouse-table-body');
        
        tbody.innerHTML = data.map(wh => `
            <tr class="hover:bg-gray-50/50 transition-colors group">
                <td class="px-6 py-4 font-semibold text-gray-700">${wh.name}</td>
                <td class="px-6 py-4 text-sm text-gray-500 text-center">${wh.address || 'Chưa cập nhật'}</td>
                <td class="px-6 py-4 text-center">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${wh.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}">
                        ${wh.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                    </span>
                </td>
                <td class="px-6 py-4 text-right space-x-1">
                    <button onclick="openEditWarehouse(${wh.id}, '${wh.name}', '${wh.address}', '${wh.status}')" class="p-2 text-indigo-400 hover:bg-indigo-50 rounded-lg transition-all"><i class="fa-regular fa-pen-to-square"></i></button>
                    <button onclick="confirmDeleteWarehouse(${wh.id})" class="p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-all"><i class="fa-regular fa-trash-can"></i></button>
                </td>
            </tr>`).join('');
    } catch (err) { 
        console.error(err);
        document.getElementById('warehouse-table-body').innerHTML = `<tr><td colspan="4" class="text-center py-10 text-red-400">Lỗi kết nối API!</td></tr>`;
    }
}

function renderAddWarehouseForm() {
    Swal.fire({
        title: '<span class="text-xl font-bold">Tạo kho mới</span>',
        html: `
            <div class="text-left space-y-4 p-2">
                <div>
                    <label class="block text-sm font-semibold mb-1 text-gray-600">Tên kho hàng *</label>
                    <input id="wh-name" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400" placeholder="VD: Kho chính Hà Nội">
                </div>
                <div>
                    <label class="block text-sm font-semibold mb-1 text-gray-600">Địa chỉ</label>
                    <textarea id="wh-address" rows="3" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Nhập địa chỉ cụ thể..."></textarea>
                </div>
            </div>`,
        showCancelButton: true,
        confirmButtonText: 'Lưu kho',
        cancelButtonText: 'Hủy',
        confirmButtonColor: '#6366f1',
        preConfirm: () => {
            const name = document.getElementById('wh-name').value.trim();
            const address = document.getElementById('wh-address').value.trim();
            if (!name) { Swal.showValidationMessage('Vui lòng nhập tên kho!'); return false; }
            return { name, address, status: 'active' };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            const res = await fetch(API_WAREHOUSE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(result.value)
            });
            if (res.ok) {
                Swal.fire('Thành công!', 'Kho hàng đã được tạo.', 'success');
                loadInventoryPage();
            }
        }
    });
}

window.openEditWarehouse = (id, name, address, status) => {
    Swal.fire({
        title: '<span class="text-xl font-bold">Cập nhật kho hàng</span>',
        html: `
            <div class="text-left space-y-4 p-2">
                <div>
                    <label class="block text-sm font-semibold mb-1 text-gray-600">Tên kho *</label>
                    <input id="wh-edit-name" value="${name}" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400">
                </div>
                <div>
                    <label class="block text-sm font-semibold mb-1 text-gray-600">Địa chỉ</label>
                    <textarea id="wh-edit-address" rows="3" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400">${address}</textarea>
                </div>
                <div>
                    <label class="block text-sm font-semibold mb-1 text-gray-600">Trạng thái</label>
                    <select id="wh-edit-status" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none">
                        <option value="active" ${status === 'active' ? 'selected' : ''}>Hoạt động</option>
                        <option value="inactive" ${status === 'inactive' ? 'selected' : ''}>Tạm dừng</option>
                    </select>
                </div>
            </div>`,
        showCancelButton: true,
        confirmButtonText: 'Cập nhật',
        confirmButtonColor: '#6366f1',
        preConfirm: () => {
            const name = document.getElementById('wh-edit-name').value.trim();
            const address = document.getElementById('wh-edit-address').value.trim();
            const status = document.getElementById('wh-edit-status').value;
            if (!name) { Swal.showValidationMessage('Tên kho không được để trống!'); return false; }
            return { name, address, status };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            const res = await fetch(`${API_WAREHOUSE}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(result.value)
            });
            if (res.ok) {
                Swal.fire('Đã cập nhật!', '', 'success');
                loadInventoryPage();
            }
        }
    });
};

window.confirmDeleteWarehouse = (id) => {
    Swal.fire({
        title: 'Xóa kho hàng?',
        text: "Hành động này sẽ xóa vĩnh viễn kho hàng khỏi hệ thống!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Xóa ngay',
        cancelButtonText: 'Hủy'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const res = await fetch(`${API_WAREHOUSE}/${id}`, { method: 'DELETE' });
            if (res.ok) {
                Swal.fire('Đã xóa!', 'Kho hàng đã được loại bỏ.', 'success');
                loadInventoryPage();
            }
        }
    });
};