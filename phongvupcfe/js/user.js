const API_USER = 'http://localhost:8080/api/users';

async function loadUserPage() {
    const mainView = document.getElementById('main-view');
    mainView.innerHTML = `
        <div class="p-6 animate-fadeIn">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Quản lý nhân sự</h2>
                <button onclick="showUserModal()" class="bg-indigo-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
                    + Thêm nhân viên
                </button>
            </div>
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-gray-50/50 uppercase text-[10px] font-bold text-gray-400 tracking-wider">
                        <tr>
                            <th class="p-4">Nhân viên</th>
                            <th class="p-4">Vai trò</th>
                            <th class="p-4 text-center">Trạng thái</th>
                            <th class="p-4 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody id="user-list-data" class="divide-y divide-gray-50"></tbody>
                </table>
            </div>
        </div>`;

    try {
        const response = await fetch(API_USER);
        const users = await response.json();
        const tbody = document.getElementById('user-list-data');
        
        tbody.innerHTML = users.map(u => `
            <tr class="hover:bg-gray-50/50 transition-colors">
                <td class="p-4">
                    <div class="font-semibold text-gray-700">${u.username}</div>
                    <div class="text-xs text-gray-400">${u.email || 'N/A'}</div>
                </td>
                <td class="p-4">
                    <span class="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md text-[10px] font-bold uppercase">${u.role}</span>
                </td>
                <td class="p-4 text-center">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${u.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}">
                        ${u.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                </td>
                <td class="p-4 text-right space-x-2">
                    <button onclick="showUserModal(${JSON.stringify(u).replace(/"/g, '&quot;')})" class="p-2 text-indigo-400 hover:bg-indigo-50 rounded-lg"><i class="fa-regular fa-pen-to-square"></i></button>
                    <button onclick="confirmDeleteUser(${u.id})" class="p-2 text-rose-400 hover:bg-rose-50 rounded-lg"><i class="fa-regular fa-trash-can"></i></button>
                </td>
            </tr>`).join('');
    } catch (err) { console.error(err); }
}

function showUserModal(user = null) {
    const isEdit = !!user;
    Swal.fire({
        title: `<span class="text-xl font-bold">${isEdit ? 'Cập nhật nhân sự' : 'Thêm nhân sự mới'}</span>`,
        html: `
            <div class="text-left space-y-3 p-2">
                <input id="swal-username" class="w-full px-4 py-2 rounded-lg border outline-none ${isEdit ? 'bg-gray-100 cursor-not-allowed' : ''}" placeholder="Tên đăng nhập *" value="${user?.username || ''}" ${isEdit ? 'readonly' : ''}>
                <input id="swal-email" type="email" class="w-full px-4 py-2 rounded-lg border outline-none" placeholder="Email" value="${user?.email || ''}">
                <input id="swal-password" type="password" class="w-full px-4 py-2 rounded-lg border outline-none" placeholder="${isEdit ? 'Mật khẩu mới (bỏ trống nếu không đổi)' : 'Mật khẩu *'}">
                <select id="swal-role" class="w-full px-4 py-2 rounded-lg border outline-none">
                    <option value="ADMIN" ${user?.role === 'ADMIN' ? 'selected' : ''}>Quản trị viên (ADMIN)</option>
                    <option value="SALES" ${user?.role === 'SALES' ? 'selected' : ''}>Nhân viên bán hàng (SALES)</option>
                    <option value="INVENTORY" ${user?.role === 'INVENTORY' ? 'selected' : ''}>Thủ kho (INVENTORY)</option>
                </select>
                ${isEdit ? `
                <select id="swal-status" class="w-full px-4 py-2 rounded-lg border outline-none">
                    <option value="active" ${user?.status === 'active' ? 'selected' : ''}>Hoạt động</option>
                    <option value="inactive" ${user?.status === 'inactive' ? 'selected' : ''}>Khóa tài khoản</option>
                </select>` : ''}
            </div>`,
        showCancelButton: true,
        confirmButtonText: isEdit ? 'Cập nhật' : 'Tạo mới',
        confirmButtonColor: '#4f46e5',
        preConfirm: () => {
            const data = {
                username: document.getElementById('swal-username').value.trim(),
                email: document.getElementById('swal-email').value.trim(),
                password: document.getElementById('swal-password').value,
                role: document.getElementById('swal-role').value,
                status: isEdit ? document.getElementById('swal-status').value : 'active'
            };
            if (!data.username || (!isEdit && !data.password)) {
                Swal.showValidationMessage('Vui lòng nhập đủ thông tin bắt buộc!');
                return false;
            }
            return data;
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            const url = isEdit ? `${API_USER}/${user.id}` : `${API_USER}/register`;
            const method = isEdit ? 'PUT' : 'POST';
            
            const userInfo = JSON.parse(localStorage.getItem('user_info'));
            const actor = userInfo ? userInfo.username : 'SYSTEM';

            const res = await fetch(url, {
                method: method,
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Actor': actor
                },
                body: JSON.stringify(result.value)
            });
            
            if (res.ok) {
                Swal.fire('Thành công!', '', 'success');
                loadUserPage();
            } else {
                Swal.fire('Lỗi!', await res.text(), 'error');
            }
        }
    });
}

window.confirmDeleteUser = (id) => {
    Swal.fire({
        title: 'Khóa tài khoản này?',
        text: "Nhân viên này sẽ không thể đăng nhập vào hệ thống!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Đồng ý khóa'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const userInfo = JSON.parse(localStorage.getItem('user_info'));
            const actor = userInfo ? userInfo.username : 'SYSTEM';

            const res = await fetch(`${API_USER}/${id}`, { 
                method: 'DELETE',
                headers: {
                    'X-Actor': actor
                }
            });

            if (res.ok) {
                Swal.fire('Đã khóa!', '', 'success');
                loadUserPage();
            }
        }
    });
};