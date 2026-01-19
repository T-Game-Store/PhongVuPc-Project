const API_SUPPLIER = 'http://localhost:8080/api/suppliers';

async function loadSupplierPage() {
    const mainView = document.getElementById('main-view');
    mainView.innerHTML = `
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
            <div class="p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 class="font-bold text-gray-800 text-lg">Quản lý nhà cung cấp</h3>
                <button onclick="renderAddSupplierForm()" class="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all shadow-md shadow-indigo-100">+ Thêm nhà cung cấp</button>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-50/50 uppercase text-[10px] font-bold text-gray-400 tracking-wider">
                            <th class="px-6 py-4">Nhà cung cấp</th>
                            <th class="px-6 py-4">Liên hệ</th>
                            <th class="px-6 py-4 text-center">Trạng thái</th>
                            <th class="px-6 py-4 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody id="supplier-table-body" class="divide-y divide-gray-50">
                        <tr><td colspan="4" class="text-center py-10 text-gray-400">Đang tải dữ liệu...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>`;

    try {
        const res = await fetch(API_SUPPLIER);
        const data = await res.json();
        const tbody = document.getElementById('supplier-table-body');
        
        tbody.innerHTML = data.map(s => `
            <tr class="hover:bg-gray-50/50 transition-colors group">
                <td class="px-6 py-4">
                    <div class="font-semibold text-gray-700">${s.name}</div>
                    <div class="text-[10px] text-gray-400 font-mono">${s.email || 'No email'}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-600 font-medium">${s.contactName || '---'}</div>
                    <div class="text-xs text-gray-400">${s.phone || 'No phone'}</div>
                </td>
                <td class="px-6 py-4 text-center">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${s.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}">
                        <span class="w-1 h-1 rounded-full mr-1.5 ${s.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}"></span>
                        ${s.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                    </span>
                </td>
                <td class="px-6 py-4 text-right space-x-1">
                    <button onclick="openEditSupplier(${s.id}, '${s.name}', '${s.contactName || ''}', '${s.email || ''}', '${s.phone || ''}', '${s.address || ''}', '${s.status}')" class="p-2 text-indigo-400 hover:bg-indigo-50 rounded-lg transition-all"><i class="fa-regular fa-pen-to-square"></i></button>
                    <button onclick="confirmDeleteSupplier(${s.id})" class="p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-all"><i class="fa-regular fa-trash-can"></i></button>
                </td>
            </tr>`).join('');
    } catch (err) { 
        console.error(err);
        document.getElementById('supplier-table-body').innerHTML = `<tr><td colspan="4" class="text-center py-10 text-red-400">Lỗi kết nối API Nhà cung cấp!</td></tr>`;
    }
}

function renderAddSupplierForm() {
    Swal.fire({
        title: '<span class="text-xl font-bold">Thêm nhà cung cấp mới</span>',
        html: `
            <div class="text-left space-y-3 p-2">
                <div>
                    <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">Tên công ty *</label>
                    <input id="s-name" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400" placeholder="VD: Công ty TNHH Phong Vũ">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">Người liên hệ</label>
                        <input id="s-contact" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">Số điện thoại</label>
                        <input id="s-phone" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400">
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">Email</label>
                    <input id="s-email" type="email" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">Địa chỉ</label>
                    <textarea id="s-address" rows="2" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400"></textarea>
                </div>
            </div>`,
        showCancelButton: true,
        confirmButtonText: 'Lưu lại',
        cancelButtonText: 'Hủy',
        confirmButtonColor: '#6366f1',
        preConfirm: () => {
            const name = document.getElementById('s-name').value.trim();
            if (!name) { Swal.showValidationMessage('Tên công ty không được để trống!'); return false; }
            return {
                name,
                contactName: document.getElementById('s-contact').value.trim(),
                phone: document.getElementById('s-phone').value.trim(),
                email: document.getElementById('s-email').value.trim(),
                address: document.getElementById('s-address').value.trim(),
                status: 'active'
            };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            const res = await fetch(API_SUPPLIER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(result.value)
            });
            if (res.ok) {
                Swal.fire({ icon: 'success', title: 'Đã lưu!', showConfirmButton: false, timer: 1500 });
                loadSupplierPage();
            }
        }
    });
}

window.openEditSupplier = (id, name, contact, email, phone, address, status) => {
    Swal.fire({
        title: '<span class="text-xl font-bold">Cập nhật thông tin NCC</span>',
        html: `
            <div class="text-left space-y-3 p-2">
                <input id="s-edit-name" value="${name}" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Tên công ty">
                <div class="grid grid-cols-2 gap-3">
                    <input id="s-edit-contact" value="${contact}" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Người liên hệ">
                    <input id="s-edit-phone" value="${phone}" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400" placeholder="SĐT">
                </div>
                <input id="s-edit-email" value="${email}" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Email">
                <textarea id="s-edit-address" rows="2" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400">${address}</textarea>
                <select id="s-edit-status" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none">
                    <option value="active" ${status === 'active' ? 'selected' : ''}>Hoạt động</option>
                    <option value="inactive" ${status === 'inactive' ? 'selected' : ''}>Tạm dừng</option>
                </select>
            </div>`,
        showCancelButton: true,
        confirmButtonText: 'Cập nhật',
        confirmButtonColor: '#6366f1',
        preConfirm: () => {
            const name = document.getElementById('s-edit-name').value.trim();
            if (!name) { Swal.showValidationMessage('Tên công ty không được để trống!'); return false; }
            return {
                name,
                contactName: document.getElementById('s-edit-contact').value.trim(),
                phone: document.getElementById('s-edit-phone').value.trim(),
                email: document.getElementById('s-edit-email').value.trim(),
                address: document.getElementById('s-edit-address').value.trim(),
                status: document.getElementById('s-edit-status').value
            };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            const res = await fetch(`${API_SUPPLIER}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(result.value)
            });
            if (res.ok) {
                Swal.fire({ icon: 'success', title: 'Đã cập nhật!', showConfirmButton: false, timer: 1500 });
                loadSupplierPage();
            }
        }
    });
};

window.confirmDeleteSupplier = (id) => {
    Swal.fire({
        title: 'Xác nhận xóa?',
        text: "Nhà cung cấp này sẽ bị loại bỏ vĩnh viễn khỏi danh sách!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Xóa ngay',
        cancelButtonText: 'Hủy'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const res = await fetch(`${API_SUPPLIER}/${id}`, { method: 'DELETE' });
            if (res.ok) {
                Swal.fire('Đã xóa!', 'Nhà cung cấp đã bị gỡ bỏ.', 'success');
                loadSupplierPage();
            }
        }
    });
};