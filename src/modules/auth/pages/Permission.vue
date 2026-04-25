<template>
    <div class="permission-container">
        <div class="header-page">
            <h1>Trang Quản Lý Phân Quyền</h1>
            <p class="subtitle">Thiết lập quyền truy cập cho từng vai trò trong hệ thống</p>
        </div>

        <div class="main-content">
            <div class="role-sidebar">
                <div class="sidebar-header">
                    <span>Vai trò người dùng</span>
                    <button class="btn-add" @click="addNewRole">+</button>
                </div>
                <ul class="role-list">
                    <li v-for="role in roles" :key="role.id" :class="{ active: selectedRole?.id === role.id }"
                        @click="selectRole(role)">
                        <i class="fas fa-user-shield"></i>
                        {{ role.name }}
                    </li>
                </ul>
            </div>

            <div class="permission-table-container">
                <div v-if="selectedRole" class="table-card">
                    <div class="table-header">
                        <h3>Quyền hạn của: <span class="role-name">{{ selectedRole.name }}</span></h3>
                        <button class="btn-save" @click="savePermissions">Lưu thay đổi</button>
                    </div>

                    <table class="permission-table">
                        <thead>
                            <tr>
                                <th>Chức năng hệ thống</th>
                                <th>Xem</th>
                                <th>Thêm</th>
                                <th>Sửa</th>
                                <th>Xóa</th>
                                <th>Duyệt/In</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="feature in features" :key="feature.key">
                                <td class="feature-name">
                                    <strong>{{ feature.name }}</strong>
                                </td>
                                <td v-for="action in actions" :key="action">
                                    <input type="checkbox" v-model="permissions[selectedRole.id][feature.key][action]">
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else class="empty-state">
                    <p>Vui lòng chọn một vai trò để thiết lập quyền hạn</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

// Giả lập danh sách vai trò
const roles = ref([
    { id: 1, name: 'Quản trị viên (Admin)' },
    { id: 2, name: 'Kế toán trưởng' },
    { id: 3, name: 'Kế toán tổng hợp' },
    { id: 4, name: 'Nhân viên kho' }
]);

// Danh sách các module chức năng khớp với sidebar của bạn
const features = [
    { key: 'dashboard', name: 'Bảng điều khiển (Dashboard)' },
    { key: 'category', name: 'Danh mục (Khách hàng, NCC, Vật tư)' },
    { key: 'voucher', name: 'Chứng từ (Thu, Chi, Nhập, Xuất)' },
    { key: 'ledger', name: 'Sổ cái (Báo cáo tài chính)' },
    { key: 'inventory', name: 'Kho (Tồn kho, Kiểm kê)' },
    { key: 'report', name: 'Báo cáo quản trị' }
];

const actions = ['view', 'create', 'edit', 'delete', 'approve'];

const selectedRole = ref(null);

// Khởi tạo object lưu trữ quyền (Thực tế sẽ lấy từ API)
// Cấu trúc: { roleId: { featureKey: { view: true, create: false, ... } } }
const permissions = reactive({
    1: { // Admin mặc định full quyền
        dashboard: { view: true, create: true, edit: true, delete: true, approve: true },
        category: { view: true, create: true, edit: true, delete: true, approve: true },
        voucher: { view: true, create: true, edit: true, delete: true, approve: true },
        ledger: { view: true, create: true, edit: true, delete: true, approve: true },
        inventory: { view: true, create: true, edit: true, delete: true, approve: true },
        report: { view: true, create: true, edit: true, delete: true, approve: true },
    },
    2: { /* Kế toán trưởng... */ },
    3: { /* ... */ },
    4: { /* ... */ }
});

// Hàm khởi tạo dữ liệu trống cho các role chưa có data
roles.value.forEach(role => {
    if (!permissions[role.id]) {
        permissions[role.id] = {};
        features.forEach(f => {
            permissions[role.id][f.key] = { view: false, create: false, edit: false, delete: false, approve: false };
        });
    }
});

const selectRole = (role) => {
    selectedRole.value = role;
};

const savePermissions = () => {
    console.log('Đang lưu quyền cho role:', selectedRole.value.name, permissions[selectedRole.value.id]);
    alert('Đã lưu phân quyền thành công!');
};

const addNewRole = () => {
    alert('Chức năng thêm vai trò mới');
};
</script>

<style scoped>
.permission-container {
    padding: 20px;
    background-color: #f8f9fa;
    min-height: 100vh;
}

.main-content {
    display: flex;
    gap: 20px;
    margin-top: 20px;
}

/* Sidebar bên trái */
.role-sidebar {
    width: 250px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.sidebar-header {
    padding: 15px;
    background: #6f42c1;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.role-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.role-list li {
    padding: 12px 15px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
    transition: all 0.3s;
}

.role-list li:hover {
    background-color: #f0ebf8;
}

.role-list li.active {
    background-color: #e9ecef;
    border-left: 4px solid #6f42c1;
    font-weight: bold;
}

/* Bảng bên phải */
.permission-table-container {
    flex: 1;
}

.table-card {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.table-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    align-items: center;
}

.role-name {
    color: #6f42c1;
}

.permission-table {
    width: 100%;
    border-collapse: collapse;
}

.permission-table th,
.permission-table td {
    border: 1px solid #dee2e6;
    padding: 12px;
    text-align: center;
}

.permission-table th {
    background-color: #f8f9fa;
}

.feature-name {
    text-align: left !important;
}

.btn-save {
    background: #28a745;
    color: white;
    border: none;
    padding: 8px 20px;
    border-radius: 4px;
    cursor: pointer;
}

.btn-add {
    background: white;
    color: #6f42c1;
    border: none;
    border-radius: 4px;
    width: 24px;
    cursor: pointer;
    font-weight: bold;
}

.empty-state {
    text-align: center;
    padding: 50px;
    background: #fff;
    border-radius: 8px;
    color: #6c757d;
}
</style>