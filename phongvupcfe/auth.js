function checkAuth() {
    const userInfo = JSON.parse(localStorage.getItem('user_info'));
    
    if (!userInfo) {
        window.location.href = 'login.html';
        return;
    }

   
    const userDisplay = document.querySelector('.user-info-name'); 
    const roleDisplay = document.querySelector('.user-info-role'); 

    if (userDisplay) userDisplay.innerText = userInfo.username;
    if (roleDisplay) roleDisplay.innerText = userInfo.role;
}

function logout() {
    localStorage.removeItem('user_info');
    window.location.href = 'login.html';
}

checkAuth();