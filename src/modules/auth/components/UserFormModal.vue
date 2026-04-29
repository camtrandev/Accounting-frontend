<template>
    <div class="modal-overlay" v-if="isOpen" @click.self="$emit('close')">
        <div class="modal-content">
            <div class="modal-header">
                <h3>{{ isEdit ? 'Cập nhật tài khoản' : 'Thêm tài khoản mới' }}</h3>
                <button class="close-x" @click="$emit('close')">&times;</button>
            </div>

            <form @submit.prevent="handleSubmit">
                <div class="form-body">
                    <div class="form-group">
                        <label>Tên đăng nhập (Username)</label>
                        <input v-model="formData.username" required :disabled="isEdit" placeholder="Ví dụ: admin_01" />
                    </div>

                    <div class="form-group" v-if="!isEdit">
                        <label>Mật khẩu</label>
                        <input v-model="formData.passwordHash" type="password" required
                            placeholder="Nhập mật khẩu..." />
                    </div>

                    <div class="form-group">
                        <label>Họ và tên (FullName)</label>
                        <input v-model="formData.fullName" required placeholder="Nhập tên đầy đủ..." />
                    </div>

                    <div class="form-group">
                        <label>Email</label>
                        <input v-model="formData.email" type="email" required placeholder="example@gmail.com" />
                    </div>

                    <div class="form-group">
                        <label>Quyền hạn (RoleId)</label>
                        <select v-model="formData.roleId">
                            <option :value="1">Admin</option>
                            <option :value="2">Account</option>
                            <option :value="3">Viewer</option>
                        </select>
                    </div>
                </div>

                <div class="modal-actions">
                    <button type="button" class="btn-cancel" @click="$emit('close')">Hủy</button>
                    <button type="submit" class="btn-save">
                        {{ isEdit ? 'Cập nhật' : 'Thêm người dùng' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    isOpen: Boolean,
    userData: Object, // Dữ liệu truyền vào khi Sửa
    isEdit: Boolean
});

const emit = defineEmits(['close', 'submit']);

// Khởi tạo formData khớp chính xác với class Users trong Backend
const formData = ref({
    username: '',
    passwordHash: '',
    fullName: '',
    email: '',
    roleId: 3
});

// Theo dõi khi mở modal để nạp dữ liệu
watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        if (props.isEdit && props.userData) {
            formData.value = { ...props.userData };
        } else {
            // Reset form khi thêm mới
            formData.value = {
                username: '',
                passwordHash: '',
                fullName: '',
                email: '',
                roleId: 3
            };
        }
    }
});

const handleSubmit = () => {
    // Gửi object formData chứa đủ 5 trường về Permission.vue để gọi API
    emit('submit', { ...formData.value });
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(3px);
}

.modal-content {
    background: white;
    border-radius: 12px;
    width: 450px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    overflow: hidden;
}

.modal-header {
    padding: 15px 20px;
    background: #f8f9fa;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
}

.close-x {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #999;
}

.form-body {
    padding: 20px;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
    font-size: 13px;
    color: #555;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
}

.form-group input:focus {
    border-color: #007bff;
    outline: none;
}

.modal-actions {
    padding: 15px 20px;
    background: #f8f9fa;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.btn-cancel {
    background: #6c757d;
    color: white;
    border: none;
    padding: 8px 18px;
    border-radius: 6px;
    cursor: pointer;
}

.btn-save {
    background: #28a745;
    color: white;
    border: none;
    padding: 8px 18px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
}

.btn-save:hover {
    background: #218838;
}
</style>