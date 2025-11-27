// fe/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    const publicPages = ['login.html', 'register.html', 'index.html'];
    const currentPage = location.pathname.split('/').pop() || 'index.html';

    if (!publicPages.includes(currentPage) && !localStorage.getItem('token')) {
        alert('Vui lòng đăng nhập để tiếp tục!');
        location.href = 'login.html';
    }

    // Hiển thị tên user nếu đã login (tùy chọn)
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && user.name) {
        const welcomeEl = document.querySelector('#welcome-name');
        if (welcomeEl) welcomeEl.textContent = user.name;
    }
});