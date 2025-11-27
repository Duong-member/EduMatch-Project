document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "/api/application";

  // 🟣 Load danh sách application
  async function loadApplications() {
    try {
      const res = await fetch(API_URL);

      if (!res.ok) {
        console.error("❌ Server responded:", res.status);
        return;
      }

      const data = await res.json();
      console.log("Applications:", data);

      const tbody = document.querySelector("table tbody");
      tbody.innerHTML = "";

      // Không có hồ sơ
      if (!Array.isArray(data) || data.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td class="td" colspan="4" style="text-align:center; padding:20px;">
              No applications found
            </td>
          </tr>`;
        return;
      }

      // Render danh sách
      data.forEach((app) => {
        const safeStudent = String(app.student_id)
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");

        tbody.innerHTML += `
          <tr>
            <td class="td">
              <div class="td-student">${safeStudent}</div>
              <div class="td-student-sub">Opportunity: ${app.opportunity_id}</div>
            </td>

            <td class="td">
              <span class="status-pill status-${app.status}">
                ${app.status}
              </span>
            </td>

            <td class="td">
              <span class="match-link">
                <span class="match-icon">⚡</span>
                <span>Calculate Match</span>
              </span>
            </td>

            <td class="td">
              <div class="actions-cell">
                <div class="action-btn action-accept"
                     onclick="updateStatus(${app.application_id}, 'approved')">✔</div>
                <div class="action-btn action-reject"
                     onclick="updateStatus(${app.application_id}, 'rejected')">✘</div>
              </div>
            </td>
          </tr>`;
      });
    } catch (err) {
      console.error("Error loading applications:", err);
    }
  }

  // 🟣 Update status
  window.updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/application/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        console.error("❌ Update failed:", res.status);
      }

      loadApplications();
    } catch (err) {
      console.error("Error updating:", err);
    }
  };

  // Chạy khi mở trang
  loadApplications();
});
