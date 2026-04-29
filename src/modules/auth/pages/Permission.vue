<template>
    <div class="permission-container">
        <div class="header-page">
            <h1>Hệ thống tài khoản người dùng</h1>
            <button class="btn-add-small" @click="openAddModal">
                <i class="fas fa-plus"></i> Thêm mới
            </button>
        </div>

        <div class="filter-section">
            <div class="search-wrapper">
                <input type="text" v-model="searchQuery" placeholder="Tìm tên hoặc email..." />
                <i class="fas fa-search search-icon"></i>
            </div>
        </div>

        <UserTable :users="filteredUsers" @edit="openEditModal" @delete="openDeleteModal" />

        <div class="table-footer">
            <div class="total-count">Tổng số: <strong>{{ filteredUsers.length }}</strong> người dùng</div>
        </div>

        <UserFormModal :is-open="formModal.isOpen" :is-edit="formModal.isEdit" :user-data="formModal.data"
            @close="formModal.isOpen = false" @submit="handleFormSubmit" />

        <ConfirmDeleteModal :is-open="deleteModal.isOpen" :user-name="deleteModal.data?.fullName"
            @close="deleteModal.isOpen = false" @confirm="handleDelete" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import UserTable from '../components/UserTable.vue';
import UserFormModal from '../components/UserFormModal.vue';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal.vue';

// --- Cấu hình API URL ---
const API_URL = "https://localhost:7047/api/User";

// --- State ---
const users = ref([]);
const searchQuery = ref('');

// State quản lý Modals
const formModal = ref({ isOpen: false, isEdit: false, data: null });
const deleteModal = ref({ isOpen: false, data: null });

// --- Actions (API) ---

// 1. GET: Lấy danh sách
const fetchUsers = async () => {
    try {
        const res = await axios.get(API_URL);
        users.value = res.data;
    } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
    }
};

// 2. Mở Modal Thêm mới
const openAddModal = () => {
    formModal.value = { isOpen: true, isEdit: false, data: null };
};

// 3. Mở Modal Sửa
const openEditModal = (user) => {
    formModal.value = { isOpen: true, isEdit: true, data: user };
};

// 4. Mở Modal Xoá
const openDeleteModal = (user) => {
    deleteModal.value = { isOpen: true, data: user };
};

// 5. Xử lý Submit Form (POST hoặc PUT)
const handleFormSubmit = async (formData) => {
    try {
        if (formModal.value.isEdit) {
            // PUT: Cập nhật
            await axios.put(`${API_URL}/${formData.id}`, formData);
        } else {
            // POST: Thêm mới
            await axios.post(API_URL, formData);
        }
        formModal.value.isOpen = false;
        fetchUsers(); // Load lại bảng
    } catch (error) {
        alert("Thao tác thất bại. Vui lòng kiểm tra lại!");
    }
};

// 6. Xử lý Xoá (DELETE)
const handleDelete = async () => {
    try {
        await axios.delete(`${API_URL}/${deleteModal.value.data.id}`);
        deleteModal.value.isOpen = false;
        fetchUsers(); // Load lại bảng
    } catch (error) {
        alert("Không thể xoá người dùng này!");
    }
};

// --- Logic tìm kiếm ---
const filteredUsers = computed(() => {
    const q = searchQuery.value.toLowerCase().trim();
    return users.value.filter(u =>
        u.fullName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
});

onMounted(fetchUsers);
</script>


<style scoped>

.permission-container {
    padding: 24px;
    background-color: #f8f9fa;
    height: 100vh; /* Cố định chiều cao bằng màn hình */
    display: flex;
    flex-direction: column;
    overflow: hidden; /* Ngăn scroll toàn màn hình */
}

.main-table-card {
    flex: 1; /* Tự động chiếm hết không gian còn lại */
    display: flex;
    flex-direction: column;
    min-height: 0; /* Quan trọng để flexbox hoạt động đúng khi scroll */
}

.header-page {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.header-page h1 {
    font-size: 20px;
    font-weight: 700;
    color: #333;
}

/* Nút thêm mới nhỏ gọn và tinh tế hơn */
.btn-add-small {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: 0.2s;
}

.btn-add-small:hover {
    background-color: #218838;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-section {
    background: white;
    padding: 16px;
    border: 1px solid #e9ecef;
    border-bottom: none;
    border-radius: 8px 8px 0 0;
}

.search-wrapper {
    position: relative;
    width: 300px;
}

.search-wrapper input {
    width: 100%;
    padding: 8px 32px 8px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 14px;
}

.search-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #adb5bd;
}

.table-footer {
    padding: 12px 20px;
    background: white;
    border: 1px solid #e9ecef;
    border-top: none;
    border-radius: 0 0 8px 8px;
    font-size: 14px;
    color: #666;
}
</style>