document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('toggle-password');
    const icon = togglePassword.querySelector('i');

    togglePassword.addEventListener('click', () => {
        if(passwordInput.type === 'password'){
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });

    const modal = document.getElementById('login-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalIcon = document.getElementById('modal-icon');
    const modalClose = document.getElementById('modal-close');

    function showModal(success, message){
        if(success){
            modalIcon.innerHTML = '<i class="fa-solid fa-circle-check text-green-500"></i>';
            modalTitle.textContent = "Đăng nhập thành công!";
            modalMessage.textContent = message;
        } else {
            modalIcon.innerHTML = '<i class="fa-solid fa-circle-xmark text-red-500"></i>';
            modalTitle.textContent = "Đăng nhập thất bại!";
            modalMessage.textContent = message;
        }
        modal.classList.remove('hidden');
    }

    modalClose.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if(response.ok){
                const user = await response.json();
                localStorage.setItem('user_info', JSON.stringify(user));
                showModal(true, `Xin chào ${user.username}, bạn sẽ được chuyển hướng sau vài giây!`);
                setTimeout(()=> window.location.href='index.html', 2000);
            } else {
                const errorMsg = await response.text();
                showModal(false, errorMsg);
            }
        } catch(error){
            console.error(error);
            showModal(false, "Không thể kết nối tới server!");
        }
    });
});
