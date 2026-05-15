<template>
    <div class="modal-overlay" @click.self="handleOverlayClick">
        <div class="approval-modal-container" :class="{ 'is-detail-view': selectedDoc }">

            <header class="modal-header">
                <div class="header-left">
                    <button v-if="selectedDoc" class="btn-back" @click="selectedDoc = null">
                        <i class="fas fa-arrow-left"></i> Quay lại danh sách duyệt
                    </button>
                    <h2 v-else>
                        <i class="fas fa-list-check"></i>
                        Danh sách chứng từ chờ xét duyệt
                        <span class="count-badge">{{ pendingList.length }}</span>
                    </h2>
                </div>
                <div class="header-right">
                    <button class="close-btn" @click="$emit('close')">&times;</button>
                </div>
            </header>

            <div class="modal-body">

                <div v-if="!selectedDoc" class="list-view-content">
                    <table class="approval-table">
                        <thead>
                            <tr>
                                <th>Số CT</th>
                                <th>Loại</th>
                                <th>Ngày CT</th>
                                <th>Đối tác</th>
                                <th class="text-right">Tổng tiền</th>
                                <th class="text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in pendingList" :key="item.id" @click="selectedDoc = item"
                                class="clickable-row">
                                <td><span class="doc-no">{{ item.documentNo }}</span></td>
                                <td><span :class="['badge-type', item.docType]">{{ item.docType }}</span></td>
                                <td>{{ formatDate(item.documentDate) }}</td>
                                <td>{{ item.partnerName || '---' }}</td>
                                <td class="text-right font-bold">{{ formatVND(item.totalAmount) }}</td>
                                <td class="text-center" @click.stop>
                                    <button class="btn-action-view" @click="selectedDoc = item">Xem & Duyệt</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if="pendingList.length === 0" class="empty-state">
                        Không có chứng từ nào cần duyệt.
                    </div>
                </div>

                <div v-else class="detail-view-content">
                    <component :is="formMap[selectedDoc.docType]" :edit-id="selectedDoc.id" :is-approval-mode="true"
                        @approved="handleActionDone" @rejected="handleActionDone" />
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue';

const props = defineProps({
    pendingList: { type: Array, required: true }
});

const emit = defineEmits(['close', 'refresh']);
const selectedDoc = ref(null);

// Map đường dẫn tới các Page (Dùng ../ để ra khỏi components vào pages)
const formMap = {
    'PURCHASE': defineAsyncComponent(() => import('../pages/PurchaseInvoicePage.vue')),
    'SALE': defineAsyncComponent(() => import('../pages/SaleInvoicePage.vue')),
    'RECEIPT': defineAsyncComponent(() => import('../pages/ReceiptVoucherPage.vue')),
    'PAYMENT': defineAsyncComponent(() => import('../pages/PaymentVoucherPage.vue')),
};

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('vi-VN');
const formatVND = (val) => new Intl.NumberFormat('vi-VN').format(val || 0) + ' đ';

// Khi Admin Duyệt/Hủy thành công ở Form con
const handleActionDone = () => {
    selectedDoc.value = null; // Quay về danh sách
    emit('refresh'); // Load lại danh sách chờ duyệt
};

const handleOverlayClick = () => {
    if (!selectedDoc.value) {
        emit('close');
    } else {
        // Nếu đang xem chi tiết, click ra ngoài không cho đóng để tránh mất công đang soi
        return;
    }
};
</script>

<style scoped>
/* Lớp nền mờ Blur xung quanh */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(8px);
    /* Độ mờ xung quanh */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

/* Khung nội dung chiếm 80% */
.approval-modal-container {
    background: #fff;
    width: 80%;
    /* Chiếm 80% bề ngang */
    height: 85vh;
    /* Chiếm 85% chiều cao */
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    transition: all 0.3s ease-in-out;
}

/* Khi mở Form chi tiết, có thể cho to thêm một chút để dễ nhìn */
.approval-modal-container.is-detail-view {
    width: 95%;
    height: 95vh;
}

.modal-header {
    padding: 16px 24px;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h2 {
    font-size: 1.25rem;
    color: #1e293b;
    margin: 0;
}

.modal-body {
    flex: 1;
    overflow-y: auto;
    /* Cuộn nội dung bên trong */
    padding: 24px;
}

/* Style cho bảng danh sách */
.approval-table {
    width: 100%;
    border-collapse: collapse;
}

.approval-table th {
    text-align: left;
    padding: 12px;
    background: #f1f5f9;
    color: #475569;
    font-size: 0.85rem;
}

.approval-table td {
    padding: 14px 12px;
    border-bottom: 1px solid #f1f5f9;
    font-size: 0.9rem;
}

.clickable-row:hover {
    background: #f8fafc;
    cursor: pointer;
}

/* Nút quay lại */
.btn-back {
    background: #4f46e5;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
}

.close-btn {
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: #94a3b8;
}

.count-badge {
    background: #ef4444;
    color: white;
    padding: 2px 8px;
    border-radius: 99px;
    font-size: 0.75rem;
}

/* Loại Badge */
.badge-type {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
}

.PURCHASE {
    background: #dcfce7;
    color: #166534;
}

.PAYMENT {
    background: #fee2e2;
    color: #991b1b;
}

/* ... các loại khác ... */

.btn-action-view {
    background: #6366f1;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
}
</style>