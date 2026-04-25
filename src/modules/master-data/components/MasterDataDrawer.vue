<template>
    <transition name="slide">
        <div class="drawer-overlay" @click.self="$emit('close')">
            <div class="drawer-content">
                <div class="drawer-header">
                    <h3>{{ isEdit ? 'Sửa khách hàng' : 'Thêm mới khách hàng' }}</h3>
                    <button class="btn-close" @click="$emit('close')">×</button>
                </div>

                <div class="drawer-body">
                    <form @submit.prevent="save">
                        <div class="form-group">
                            <label>Mã khách hàng <span class="required">*</span></label>
                            <input v-model="formData.Code" type="text" placeholder="KH001" ref="firstInput" />
                            <small class="error-text" v-if="errors.Code">{{ errors.Code }}</small>
                        </div>

                        <div class="form-group">
                            <label>Tên khách hàng <span class="required">*</span></label>
                            <input v-model="formData.Name" type="text" placeholder="Công ty TNHH ABC" />
                        </div>

                        <div class="grid-2">
                            <div class="form-group">
                                <label>Mã số thuế</label>
                                <input v-model="formData.TaxCode" type="text" />
                            </div>
                            <div class="form-group">
                                <label>Số điện thoại</label>
                                <input v-model="formData.Phone" type="text" />
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Địa chỉ</label>
                            <textarea v-model="formData.Address" rows="3"></textarea>
                        </div>

                        <div class="form-group checkbox-group">
                            <input type="checkbox" id="active" v-model="formData.IsActive" />
                            <label for="active">Đang theo dõi</label>
                        </div>
                    </form>
                </div>

                <div class="drawer-footer">
                    <button class="btn-cancel" @click="$emit('close')">Hủy bỏ</button>
                    <button class="btn-save" @click="save">Cất (Lưu)</button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps(['initialData']);
const isEdit = ref(!!props.initialData?.Id);
const firstInput = ref(null);

const formData = ref({
    Code: '',
    Name: '',
    TaxCode: '',
    Phone: '',
    Address: '',
    IsActive: true,
    ...props.initialData
});

const errors = ref({});

onMounted(() => {
    // Tự động focus vào ô đầu tiên khi mở form
    firstInput.value?.focus();
});

const save = () => {
    // Logic validation cơ bản
    if (!formData.value.Code) {
        errors.value.Code = "Mã không được để trống";
        return;
    }
    console.log("Saving data...", formData.value);
    // Gọi Store: store.save(formData.value)
};
</script>

<style scoped>
/* OVERLAY & LAYOUT */
.drawer-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    z-index: 100;
    display: flex;
    justify-content: flex-end;
}

.drawer-content {
    width: 450px;
    max-width: 90%;
    height: 100%;
    background: white;
    display: flex;
    flex-direction: column;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
}

/* HEADER */
.drawer-header {
    padding: 16px 24px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.drawer-header h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #1f2937;
}

.btn-close {
    font-size: 24px;
    background: none;
    border: none;
    cursor: pointer;
}

/* BODY & FORM */
.drawer-body {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    margin-bottom: 6px;
    font-weight: 500;
    font-size: 14px;
}

.required {
    color: red;
}

input,
textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 14px;
}

input:focus {
    border-color: #2563eb;
    outline: none;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.checkbox-group {
    display: flex;
    align-items: center;
    gap: 8px;
}

.checkbox-group input {
    width: auto;
}

/* FOOTER */
.drawer-footer {
    padding: 16px 24px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.btn-cancel {
    padding: 10px 20px;
    border: 1px solid #d1d5db;
    background: white;
    border-radius: 4px;
    cursor: pointer;
}

.btn-save {
    padding: 10px 20px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
}

.btn-save:hover {
    background: #1d4ed8;
}

/* ANIMATION */
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
}

.error-text {
    color: #dc2626;
    font-size: 12px;
    margin-top: 4px;
}
</style>