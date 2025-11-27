document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btnCreate");
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || user.role !== "professor") {
        alert("Bạn phải đăng nhập với vai trò Professor!");
        return location.href = "login.html";
    }

    btn.addEventListener("click", async () => {
        const title = document.getElementById("title").value.trim();
        const description = document.getElementById("description").value.trim();
        const deadline = document.getElementById("deadline").value;
        const category = document.getElementById("category").value.trim();

        if (!title || !deadline) {
            alert("Title và Deadline là bắt buộc!");
            return;
        }

        try {
            const res = await fetch("/api/opportunities", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    deadline,
                    category
                })
            });

            const data = await res.json();

            if (!res.ok) {
                alert("❌ Lỗi: " + data.message);
                return;
            }

            alert("🎉 Tạo cơ hội thành công!");
            window.location.href = "professor-opportunities.html";

        } catch (err) {
            console.error(err);
            alert("Lỗi kết nối server");
        }
    });
});
