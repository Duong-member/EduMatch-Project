document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // ===== CHƯA ĐĂNG NHẬP =====
    if (!token || user.role !== "student") {
        alert("Vui lòng đăng nhập với vai trò Sinh viên!");
        return (window.location.href = "login.html");
    }

    // ===== LẤY ELEMENT =====
    const listEl = document.getElementById("opp-list");

    try {
        // Gọi API thật
        const res = await fetch("/api/opportunities", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Không thể tải danh sách cơ hội");

        const opportunities = await res.json();

        // Xóa UI demo
        listEl.innerHTML = "";

        if (!opportunities || opportunities.length === 0) {
            listEl.innerHTML = `
                <p class="text-gray-500 text-center col-span-3 mt-6">
                    Không có cơ hội nào được tìm thấy.
                </p>`;
            return;
        }

        // ===== RENDER CƠ HỘI =====
        opportunities.forEach((opp) => {
            const category = opp.category || "Other";
            const deadline = opp.deadline
                ? opp.deadline.split("T")[0]
                : "N/A";

            const card = `
            <div class="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition bg-white flex flex-col">
                <div class="flex justify-between items-start mb-4">
                    <span class="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded uppercase">
                        ${category}
                    </span>
                    <div class="flex items-center text-gray-400 text-xs">
                        <i data-lucide="calendar" class="w-3 h-3 mr-1"></i> ${deadline}
                    </div>
                </div>

                <h3 class="text-lg font-bold text-gray-900 mb-2">${opp.title}</h3>
                <p class="text-gray-600 text-sm mb-6 flex-1">${opp.description || ""}</p>

                <div class="flex items-center mb-6">
                    <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                        <i data-lucide="user" class="w-4 h-4"></i>
                    </div>
                    <span class="text-sm text-gray-700 font-medium">
                        ${opp.professor_id || "Unknown Professor"}
                    </span>
                </div>

                <button 
                    class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition flex items-center justify-center group btn-apply"
                    data-id="${opp.opportunity_id}"
                >
                    Apply Now 
                    <i data-lucide="arrow-right" class="w-4 h-4 ml-2"></i>
                </button>
            </div>
            `;

            listEl.insertAdjacentHTML("beforeend", card);
        });

        // Render icons
        lucide.createIcons();

        // ====== XỬ LÝ APPLY ======
        document.querySelectorAll(".btn-apply").forEach((btn) => {
            btn.addEventListener("click", async () => {
                const oppId = btn.dataset.id;

                alert(`Bạn đã apply vào cơ hội #${oppId}. API apply sẽ được thêm sau.`);
            });
        });

    } catch (err) {
        console.error(err);
        alert("Lỗi tải cơ hội, vui lòng thử lại!");
    }
});
