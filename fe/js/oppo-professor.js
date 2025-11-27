document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // ===== CHƯA ĐĂNG NHẬP =====
    if (!token || !user.role) {
        alert("Vui lòng đăng nhập trước!");
        return location.href = "login.html";
    }

    // ===== CHỈ PROFESSOR MỚI ĐƯỢC VÀO =====
    if (user.role !== "professor") {
        alert("Trang này chỉ dành cho Professor!");
        return location.href = "login.html";
    }

    // ===== HIỂN THỊ USER INFO =====
    document.querySelector(".avatar").textContent =
        (user.name || "?")[0].toUpperCase();

    document.querySelector(".profile-info-name").textContent = user.name;
    document.querySelector(".profile-info-role").textContent = "Professor";

    // ===== HIỂN THỊ NÚT POST =====
    const postButton = document.querySelector(".btn-primary");
    postButton.style.display = "inline-flex";

    postButton.addEventListener("click", () => {
    window.location.href = "create-opportunity.html";
    });

    // ===== LOAD DANH SÁCH OPPORTUNITIES =====
    const listEl = document.getElementById("opportunityList");
    listEl.innerHTML = "";

    try {
        const res = await fetch("/api/opportunities/my", {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Không tải được danh sách!");

        const opportunities = await res.json();

        if (opportunities.length === 0) {
            listEl.innerHTML = `
                <p style="text-align:center;color:#6b7280;margin-top:20px;">
                    Bạn chưa tạo cơ hội nào.
                </p>
            `;
            return;
        }

        opportunities.forEach(opp => {
            const deadline = opp.deadline ? opp.deadline.split("T")[0] : "N/A";

            listEl.insertAdjacentHTML("beforeend", `
                <article class="op-card" data-id="${opp.opportunity_id}">
                  <div class="op-card-main">
                    <h2 class="op-title">${opp.title}</h2>
                    <p class="op-description">${opp.description || ""}</p>
                    <div class="op-meta">
                      <span class="tag-pill">${opp.category || "Other"}</span>
                      <span class="meta-item">📅 Deadline: ${deadline}</span>
                    </div>
                  </div>

                  <div class="op-actions">
                    <button class="btn-icon-danger js-delete" data-id="${opp.opportunity_id}">
                      🗑
                    </button>
                  </div>
                </article>
            `);
        });

        // ===== XOÁ CƠ HỘI =====
        document.querySelectorAll(".js-delete").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.dataset.id;
                if (!confirm("Bạn có chắc muốn xoá?")) return;

                const del = await fetch(`/api/opportunities/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!del.ok) {
                    alert("Xoá thất bại!");
                    return;
                }

                alert("Xoá thành công!");
                location.reload();
            });
        });

    } catch (err) {
        console.error(err);
        alert("Lỗi tải danh sách cơ hội!");
    }

    
});
