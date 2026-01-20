const API_SUPPLIER = 'http://localhost:8080/api/suppliers';

function getActor() {
    const userInfo = JSON.parse(localStorage.getItem('user_info'));
    return userInfo ? userInfo.username : 'SYSTEM';
}

async function loadSupplierPage() {
    const mainView = document.getElementById('main-view');
    mainView.innerHTML = `
        <div class="p-6 animate-fadeIn">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Nhà cung cấp</h2>
                    <p class="text-sm text-gray-500 mt-1">Quản lý đối tác và nguồn hàng</p>
                </div>
                <button onclick="renderAddSupplierForm()" class="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center">
                    <i class="fa-solid fa-plus mr-2"></i> Thêm mới
                </button>
            </div>
            
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-gray-50/50 border-b border-gray-100 uppercase text-[10px] font-bold text-gray-400 tracking-wider">
                        <tr>
                            <th class="px-6 py-4">Đơn vị cung cấp</th>
                            <th class="px-6 py-4">Phân loại</th>
                            <th class="px-6 py-4">Liên hệ chính</th>
                            <th class="px-6 py-4 text-center">Trạng thái</th>
                            <th class="px-6 py-4 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody id="supplier-table-body" class="divide-y divide-gray-50"></tbody>
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
                    <div class="font-bold text-gray-800 text-sm">${s.name}</div>
                    <div class="text-[11px] text-gray-400 mt-0.5"><i class="fa-solid fa-location-dot mr-1"></i>${s.address || 'Chưa cập nhật'}</div>
                </td>
                <td class="px-6 py-4">
                    ${s.type === 'PRODUCT' 
                        ? '<span class="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100">Sản phẩm</span>' 
                        : '<span class="px-2.5 py-1 rounded-md bg-purple-50 text-purple-600 text-[10px] font-bold border border-purple-100">Dịch vụ</span>'}
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-700 font-medium">${s.contactName || '---'}</div>
                    <div class="text-[11px] text-gray-400">${s.phone || ''}</div>
                </td>
                <td class="px-6 py-4 text-center">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${s.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}">
                        ${s.status === 'active' ? 'Hợp tác' : 'Ngừng'}
                    </span>
                </td>
                <td class="px-6 py-4 text-right space-x-1 opacity-100">
                    <button onclick='showSupplierDetails(${JSON.stringify(s).replace(/'/g, "&apos;")})' class="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Xem chi tiết">
                        <i class="fa-regular fa-eye"></i>
                    </button>
                    <button onclick='renderEditSupplierForm(${JSON.stringify(s).replace(/'/g, "&apos;")})' class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Chỉnh sửa">
                        <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button onclick="confirmDeleteSupplier(${s.id})" class="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Xóa">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (err) { console.error(err); }
}

window.showSupplierDetails = (s) => {
    Swal.fire({
        title: '',
        width: '600px',
        html: `
            <div class="text-left">
                <div class="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                    <div>
                        <h3 class="text-xl font-bold text-gray-800">${s.name}</h3>
                        <p class="text-xs text-gray-400 mt-1 uppercase font-bold tracking-wider">Mã hồ sơ: SUP-${s.id}</p>
                    </div>
                    <span class="${s.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'} px-3 py-1 rounded-lg text-xs font-bold uppercase">
                        ${s.status === 'active' ? 'Đang hợp tác' : 'Ngừng hợp tác'}
                    </span>
                </div>
                
                <div class="grid grid-cols-2 gap-6 mb-6">
                    <div class="col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Loại hình cung cấp</label>
                        <div class="font-semibold text-gray-700 flex items-center">
                            ${s.type === 'PRODUCT' 
                                ? '<i class="fa-solid fa-box text-blue-500 mr-2"></i> Cung cấp Sản phẩm / Linh kiện' 
                                : '<i class="fa-solid fa-truck-fast text-purple-500 mr-2"></i> Cung cấp Dịch vụ / Logistic'}
                        </div>
                    </div>

                    <div>
                        <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Người liên hệ</label>
                        <div class="font-medium text-gray-800">${s.contactName || '---'}</div>
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Số điện thoại</label>
                        <div class="font-medium text-gray-800">${s.phone || '---'}</div>
                    </div>
                    <div class="col-span-2">
                        <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Email</label>
                        <div class="font-medium text-gray-800">${s.email || '---'}</div>
                    </div>
                    <div class="col-span-2">
                        <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Địa chỉ kho / Văn phòng</label>
                        <div class="font-medium text-gray-800">${s.address || '---'}</div>
                    </div>
                </div>

                <div class="text-right border-t border-gray-100 pt-4">
                     <p class="text-[10px] text-gray-400 italic">Ngày tham gia hệ thống: ${new Date(s.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
            </div>
        `,
        showConfirmButton: false,
        showCloseButton: true
    });
}

function renderAddSupplierForm() {
    Swal.fire({
        title: 'Thêm đối tác mới',
        html: `
            <div class="space-y-4 text-left p-1">
                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Tên nhà cung cấp *</label>
                        <input id="swal-name" class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-400 outline-none" placeholder="VD: Asus Việt Nam">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Loại hình</label>
                        <select id="swal-type" class="w-full px-4 py-2 rounded-lg border outline-none bg-white">
                            <option value="PRODUCT">Sản phẩm</option>
                            <option value="SERVICE">Dịch vụ</option>
                        </select>
                    </div>
                    <div>
                         <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Người liên hệ</label>
                         <input id="swal-contact" class="w-full px-4 py-2 rounded-lg border outline-none" placeholder="Tên người đại diện">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <input id="swal-email" class="w-full px-4 py-2 rounded-lg border outline-none" placeholder="Email">
                    <input id="swal-phone" class="w-full px-4 py-2 rounded-lg border outline-none" placeholder="Số điện thoại">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Địa chỉ</label>
                    <textarea id="swal-address" rows="2" class="w-full px-4 py-2 rounded-lg border outline-none" placeholder="Địa chỉ chi tiết..."></textarea>
                </div>
            </div>`,
        confirmButtonText: 'Lưu hồ sơ',
        confirmButtonColor: '#4f46e5',
        showCancelButton: true,
        preConfirm: async () => {
            const data = {
                name: document.getElementById('swal-name').value.trim(),
                type: document.getElementById('swal-type').value,
                contactName: document.getElementById('swal-contact').value.trim(),
                email: document.getElementById('swal-email').value.trim(),
                phone: document.getElementById('swal-phone').value.trim(),
                address: document.getElementById('swal-address').value.trim(),
                status: 'active'
            };
            if (!data.name) { Swal.showValidationMessage('Tên không được để trống!'); return false; }
            return data;
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            const res = await fetch(API_SUPPLIER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Actor': getActor() },
                body: JSON.stringify(result.value)
            });
            if (res.ok) { loadSupplierPage(); Swal.fire('Thành công', '', 'success'); }
        }
    });
}

window.renderEditSupplierForm = (s) => {
    Swal.fire({
        title: 'Cập nhật hồ sơ',
        html: `
            <div class="space-y-4 text-left p-1">
                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Tên nhà cung cấp *</label>
                        <input id="swal-name" class="w-full px-4 py-2 rounded-lg border outline-none" value="${s.name}">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Loại hình</label>
                        <select id="swal-type" class="w-full px-4 py-2 rounded-lg border outline-none bg-white">
                            <option value="PRODUCT" ${s.type === 'PRODUCT' ? 'selected' : ''}>Sản phẩm</option>
                            <option value="SERVICE" ${s.type === 'SERVICE' ? 'selected' : ''}>Dịch vụ</option>
                        </select>
                    </div>
                     <div>
                         <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Người liên hệ</label>
                         <input id="swal-contact" class="w-full px-4 py-2 rounded-lg border outline-none" value="${s.contactName || ''}">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <input id="swal-email" class="w-full px-4 py-2 rounded-lg border outline-none" value="${s.email || ''}">
                    <input id="swal-phone" class="w-full px-4 py-2 rounded-lg border outline-none" value="${s.phone || ''}">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Địa chỉ</label>
                         <textarea id="swal-address" rows="2" class="w-full px-4 py-2 rounded-lg border outline-none">${s.address || ''}</textarea>
                    </div>
                    <div class="col-span-2">
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Trạng thái hợp tác</label>
                        <select id="swal-status" class="w-full px-4 py-2 rounded-lg border outline-none bg-white">
                            <option value="active" ${s.status === 'active' ? 'selected' : ''}>Đang hợp tác</option>
                            <option value="inactive" ${s.status === 'inactive' ? 'selected' : ''}>Ngừng hợp tác</option>
                        </select>
                    </div>
                </div>
            </div>`,
        confirmButtonText: 'Lưu thay đổi',
        confirmButtonColor: '#4f46e5',
        showCancelButton: true,
        preConfirm: () => {
            return {
                name: document.getElementById('swal-name').value.trim(),
                type: document.getElementById('swal-type').value,
                contactName: document.getElementById('swal-contact').value.trim(),
                email: document.getElementById('swal-email').value.trim(),
                phone: document.getElementById('swal-phone').value.trim(),
                address: document.getElementById('swal-address').value.trim(),
                status: document.getElementById('swal-status').value
            };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            const res = await fetch(`${API_SUPPLIER}/${s.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'X-Actor': getActor() },
                body: JSON.stringify(result.value)
            });
            if (res.ok) { loadSupplierPage(); Swal.fire('Đã cập nhật', '', 'success'); }
        }
    });
};

window.confirmDeleteSupplier = (id) => {
    Swal.fire({
        title: 'Xóa đối tác này?',
        text: "Dữ liệu sẽ không thể khôi phục!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Xóa ngay'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const res = await fetch(`${API_SUPPLIER}/${id}`, {
                method: 'DELETE',
                headers: { 'X-Actor': getActor() }
            });
            if (res.ok) { loadSupplierPage(); Swal.fire('Đã xóa', '', 'success'); }
        }
    });
};