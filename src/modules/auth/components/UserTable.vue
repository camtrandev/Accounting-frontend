<template>
    <div class="table-wrapper">
        <div class="scrollable-body">
            <table class="role-table">
                <thead>
                    <tr>
                        <th style="width: 80px;" class="text-center">STT</th>
                        <th style="width: 250px;">TÊN USER</th>
                        <th style="width: 250px;">EMAIL</th>
                        <th style="width: 150px;">QUYỀN</th>
                        <th class="text-center" style="width: 180px;">CHỨC NĂNG</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, index) in users" :key="user.id">
                        <td class="text-center">{{ index + 1 }}</td>
                        <td><strong>{{ user.fullName }}</strong></td>
                        <td>{{ user.email }}</td>
                        <td>
                            <span :class="['role-tag', getRoleClass(user.roleId)]">
                                {{ getRoleName(user.roleId) }}
                            </span>
                        </td>
                        <td class="role-actions">
                            <div class="action-buttons">
                                <button class="btn-icon edit" @click="$emit('edit', user)">
                                    <i class="fas fa-edit"></i> Sửa
                                </button>
                                <button class="btn-icon delete" @click="$emit('delete', user)">
                                    <i class="fas fa-trash-alt"></i> Xoá
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="users.length === 0">
                        <td colspan="5" class="empty-row">Không tìm thấy người dùng nào phù hợp</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
defineProps({
    users: Array
});
defineEmits(['edit', 'delete']);

// Hàm chuyển đổi roleId sang tên hiển thị
const getRoleName = (roleId) => {
    switch (roleId) {
        case 1: return 'Admin';
        case 2: return 'Account';
        case 3: return 'Viewer';
        default: return 'Khách';
    }
};

// Hàm gán class màu sắc riêng biệt cho từng loại
const getRoleClass = (roleId) => {
    switch (roleId) {
        case 1: return 'admin';      // Màu đỏ
        case 2: return 'account';    // Màu xanh lá
        case 3: return 'viewer';     // Màu xanh dương/xám
        default: return 'other';
    }
};
</script>

<style scoped>
.table-wrapper {
    border: 1px solid #e9ecef;
    border-radius: 0 0 8px 8px;
    background: white;
    overflow: hidden;
}

.scrollable-body {
    max-height: 60vh;
    overflow-y: auto;
}

/* Scrollbar tuning */
.scrollable-body::-webkit-scrollbar {
    width: 6px;
}

.scrollable-body::-webkit-scrollbar-thumb {
    background-color: #ced4da;
    border-radius: 10px;
}

.role-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
}

.role-table th {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: #f8f9fa;
    padding: 14px;
    text-align: left;
    font-size: 13px;
    font-weight: 700;
    color: #495057;
    text-transform: uppercase;
    border-bottom: 2px solid #dee2e6;
}

.role-table td {
    padding: 14px;
    border-bottom: 1px solid #f1f3f5;
    font-size: 14px;
}

.text-center {
    text-align: center;
}

.role-tag {
    padding: 4px 10px;
    border-radius: 4px;
    font-weight: 700;
    font-size: 11px;
    display: inline-block;
    min-width: 80px;
    text-align: center;
}

/* --- HỆ THỐNG MÀU SẮC MỚI --- */

/* Admin: Đỏ rực */
.role-tag.admin {
    background: #fff5f5;
    color: #c92a2a;
    border: 1px solid #ffa8a8;
}

/* Account: Xanh lá tươi */
.role-tag.account {
    background: #ebfbee;
    color: #2f9e44;
    border: 1px solid #b2f2bb;
}

/* Viewer: Xanh dương nhạt / Xám nhẹ */
.role-tag.viewer {
    background: #e7f5ff;
    color: #1971c2;
    border: 1px solid #a5d8ff;
}

/* Other: Màu trung tính */
.role-tag.other {
    background: #f8f9fa;
    color: #495057;
    border: 1px solid #dee2e6;
}

.action-buttons {
    display: flex;
    justify-content: center;
    gap: 16px;
}

.btn-icon {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
    transition: 0.2s;
}

.btn-icon:hover {
    opacity: 0.7;
}

.btn-icon.edit {
    color: #007bff;
}

.btn-icon.delete {
    color: #dc3545;
}

.empty-row {
    text-align: center;
    padding: 30px;
    color: #adb5bd;
}
</style>