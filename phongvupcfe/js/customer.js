const API_CUSTOMER = 'http://localhost:8080/api/customers';

// --- 1. LOAD DANH SÁCH KHÁCH HÀNG ---
async function loadCustomerPage() {
    const mainView = document.getElementById('main-view');
    mainView.innerHTML = `
        <div class="p-6 animate-fadeIn">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Quản lý khách hàng</h2>
                <button onclick="showCustomerModal()" class="bg-emerald-500 text-white px-5 py-2 rounded-xl font-medium hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100">
                    + Thêm khách hàng mới
                </button>
            </div>
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-gray-50/50 uppercase text-[10px] font-bold text-gray-400 tracking-wider">
                        <tr>
                            <th class="p-4">Khách hàng</th>
                            <th class="p-4">Liên hệ</th>
                            <th class="p-4">Địa chỉ</th>
                            <th class="p-4 text-center">Trạng thái</th>
                            <th class="p-4 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody id="customer-list-data" class="divide-y divide-gray-50"></tbody>
                </table>
            </div>
        </div>`;

    try {
        const response = await fetch(API_CUSTOMER);
        const customers = await response.json();
        const tbody = document.getElementById('customer-list-data');
        
        tbody.innerHTML = customers.map(c => `
            <tr class="hover:bg-gray-50/50 transition-colors">
                <td class="p-4">
                    <div class="font-semibold text-gray-700">${c.fullName || 'Chưa cập nhật'}</div>
                    <div class="text-xs text-gray-400">@${c.username}</div>
                </td>
                <td class="p-4 text-sm text-gray-600">
                    <div><i class="fa-regular fa-envelope mr-1 text-[10px]"></i> ${c.email || 'N/A'}</div>
                    <div><i class="fa-solid fa-phone mr-1 text-[10px]"></i> ${c.phone || 'N/A'}</div>
                </td>
                <td class="p-4 text-sm text-gray-500 max-w-[200px] truncate">${c.address || 'N/A'}</td>
                <td class="p-4 text-center">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${c.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}">
                        ${c.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                </td>
                <td class="p-4 text-right space-x-1">
                    <button onclick='showCustomerModal(${JSON.stringify(c).replace(/'/g, "&apos;")})' class="p-2 text-indigo-400 hover:bg-indigo-50 rounded-lg transition-colors">
                        <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button onclick="confirmDeleteCustomer(${c.id})" class="p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-colors">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </td>
            </tr>`).join('');
    } catch (err) {
        console.error("Lỗi:", err);
    }
}

// --- 2. MODAL THÊM/SỬA KHÁCH HÀNG ---
function showCustomerModal(customer = null) {
    const isEdit = !!customer;
    Swal.fire({
        title: `<span class="text-xl font-bold">${isEdit ? 'Sửa khách hàng' : 'Thêm khách hàng'}</span>`,
        html: `
            <div class="text-left space-y-3 p-2">
                <input id="c-username" class="w-full px-4 py-2 rounded-lg border outline-none ${isEdit ? 'bg-gray-100' : ''}" placeholder="Tên đăng nhập *" value="${customer?.username || ''}" ${isEdit ? 'readonly' : ''}>
                ${!isEdit ? `<input id="c-password" type="password" class="w-full px-4 py-2 rounded-lg border outline-none" placeholder="Mật khẩu *">` : ''}
                <input id="c-fullname" class="w-full px-4 py-2 rounded-lg border outline-none" placeholder="Họ và tên" value="${customer?.fullName || ''}">
                <input id="c-email" type="email" class="w-full px-4 py-2 rounded-lg border outline-none" placeholder="Email" value="${customer?.email || ''}">
                <input id="c-phone" class="w-full px-4 py-2 rounded-lg border outline-none" placeholder="Số điện thoại" value="${customer?.phone || ''}">
                <input id="c-address" class="w-full px-4 py-2 rounded-lg border outline-none" placeholder="Địa chỉ" value="${customer?.address || ''}">
                ${isEdit ? `
                <select id="c-status" class="w-full px-4 py-2 rounded-lg border outline-none">
                    <option value="active" ${customer?.status === 'active' ? 'selected' : ''}>Hoạt động</option>
                    <option value="inactive" ${customer?.status === 'inactive' ? 'selected' : ''}>Khóa</option>
                </select>` : ''}
            </div>`,
        showCancelButton: true,
        confirmButtonText: isEdit ? 'Cập nhật' : 'Lưu lại',
        confirmButtonColor: '#10b981',
        preConfirm: () => {
            return {
                username: document.getElementById('c-username').value,
                password: isEdit ? "" : document.getElementById('c-password').value,
                fullName: document.getElementById('c-fullname').value,
                email: document.getElementById('c-email').value,
                phone: document.getElementById('c-phone').value,
                address: document.getElementById('c-address').value,
                status: isEdit ? document.getElementById('c-status').value : 'active'
            }
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            const method = isEdit ? 'PUT' : 'POST';
            const url = isEdit ? `${API_CUSTOMER}/${customer.id}` : `${API_CUSTOMER}/register`;
            
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(result.value)
            });

            if (res.ok) {
                Swal.fire('Xong!', 'Dữ liệu đã được cập nhật', 'success');
                loadCustomerPage();
            }
        }
    });
}

// --- 3. KHÓA KHÁCH HÀNG ---
function confirmDeleteCustomer(id) {
    Swal.fire({
        title: 'Khóa khách hàng này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Khóa ngay',
        confirmButtonColor: '#ef4444'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const res = await fetch(`${API_CUSTOMER}/${id}`, { method: 'DELETE' });
            if (res.ok) {
                Swal.fire('Đã khóa!', '', 'success');
                loadCustomerPage();
            }
        }
    });
}