// ========= API CORE =========
const API = {
    async request(url, options = {}) {
        const token = localStorage.getItem('token');

        const res = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers
            }
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({ message: 'Lỗi mạng' }));
            throw new Error(err.error || err.message || 'Đã có lỗi xảy ra');
        }


        return res.json();
    },

    post(url, data) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    get(url) {
        return this.request(url, { method: 'GET' });
    }
};


// ========= GỘP AUTH + USERS =========
const UserAPI = {
    register(data) {
        return API.post('/api/users/register', data);
    },

    async login(data) {
        const result = await API.post('/api/users/login', data);

        // Lưu token + user vào localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));

        // Điều hướng theo role
        if (result.user.role === "student") {
            window.location.href = "student-opportunities.html";
        } else if (result.user.role === "professor") {
            window.location.href = "professor-opportunities.html";
        } else if (result.user.role === "admin") {
            window.location.href = "admin.html";
        } else {
            alert("Role không hợp lệ!");
        }

        return result;
    },

    getAll() {
        return API.get('/api/users/');
    },
};
// ========= OPPORTUNITIES =========