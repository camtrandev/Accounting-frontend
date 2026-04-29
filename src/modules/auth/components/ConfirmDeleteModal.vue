<template>
    <div class="modal-overlay" v-if="isOpen" @click.self="$emit('close')">
        <div class="modal-content delete-modal">
            <div class="icon-wrapper">
                <i class="fas fa-exclamation-triangle warn-icon"></i>
            </div>
            <h3>Xác nhận xoá?</h3>
            <p>
                Bạn có chắc chắn muốn xoá người dùng <strong>{{ userName }}</strong>?
                <br />Hành động này không thể hoàn tác.
            </p>
            <div class="modal-actions">
                <button class="btn-cancel" @click="$emit('close')">Hủy bỏ</button>
                <button class="btn-delete-confirm" @click="$emit('confirm')">Xác nhận xoá</button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({ isOpen: Boolean, userName: String });
defineEmits(['close', 'confirm']);
</script>

<style scoped>
/* Lớp phủ mờ toàn màn hình */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    /* Màu đen mờ */
    display: flex;
    align-items: center;
    /* Căn giữa dọc */
    justify-content: center;
    /* Căn giữa ngang */
    z-index: 9999;
    /* Luôn nằm trên cùng các thành phần khác */
    backdrop-filter: blur(2px);
    /* Hiệu ứng làm mờ background phía sau (optional) */
}

/* Nội dung Modal */
.modal-content {
    background: white;
    padding: 30px;
    border-radius: 12px;
    width: 400px;
    max-width: 90%;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    text-align: center;
    animation: fadeIn 0.3s ease-out;
    /* Hiệu ứng hiện ra nhẹ nhàng */
}

.warn-icon {
    font-size: 50px;
    color: #dc3545;
    margin-bottom: 15px;
}

h3 {
    margin: 0 0 10px 0;
    font-size: 20px;
    color: #333;
}

p {
    color: #666;
    line-height: 1.5;
    margin-bottom: 25px;
}

.modal-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
}

/* Nút bấm */
.btn-cancel {
    background: #f8f9fa;
    border: 1px solid #ddd;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: 0.2s;
}

.btn-cancel:hover {
    background: #e9ecef;
}

.btn-delete-confirm {
    background: #dc3545;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: 0.2s;
}

.btn-delete-confirm:hover {
    background: #c82333;
    box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
}

/* Hiệu ứng animation */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>