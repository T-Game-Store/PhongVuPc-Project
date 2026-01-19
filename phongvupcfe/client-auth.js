const API_CLIENT = 'http://localhost:8080/api/customers';

// Chuyển đổi giữa Login và Register
function toggleAuth(showLogin) {
    const loginSec = document.getElementById('login-section');
    const regSec = document.getElementById('register-section');
    if (showLogin) {
        loginSec.classList.remove('hidden');
        regSec.classList.add('hidden');
    } else {
        loginSec.classList.add('hidden');
        regSec.classList.remove('hidden');
    }
}

// XỬ LÝ ĐĂNG KÝ
document.getElementById('client-register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        username: document.getElementById('reg-username').value.trim(),
        password: document.getElementById('reg-password').value,
        fullName: document.getElementById('reg-fullname').value.trim(),
        email: document.getElementById('reg-email').value.trim()
    };

    try {
        const res = await fetch(`${API_CLIENT}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            Swal.fire('Thành công!', 'Tài khoản đã được tạo. Hãy đăng nhập nhé!', 'success');
            toggleAuth(true);
        } else {
            Swal.fire('Lỗi', await res.text(), 'error');
        }
    } catch (err) { alert("Không thể kết nối Backend!"); }
});

// XỬ LÝ ĐĂNG NHẬP
document.getElementById('client-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        username: document.getElementById('login-username').value.trim(),
        password: document.getElementById('login-password').value
    };

    try {
        const res = await fetch(`${API_CLIENT}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            const clientInfo = await res.json();
            // Lưu vào localStorage riêng cho Client để tránh trùng với Admin
            localStorage.setItem('client_session', JSON.stringify(clientInfo));
            window.location.href = 'home.html';
        } else {
            Swal.fire('Thất bại', 'Sai tài khoản hoặc mật khẩu!', 'error');
        }
    } catch (err) { alert("Lỗi kết nối!"); }
});