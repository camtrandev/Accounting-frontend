<template>
    <div class="filter-wrapper">
        <div class="form-group">
            <label>Kho hàng</label>
            <select v-model="filterParams.warehouseId" class="form-control">
                <option value="">-- Tất cả kho --</option>
                <option v-for="wh in reportStore.warehouses" :key="wh.id" :value="wh.id">
                    {{ wh.warehouseCode }} - {{ wh.warehouseName }}
                </option>
            </select>
        </div>

        <div v-if="reportId === 'inventory-detail'" class="form-group">
            <label>Vật tư / Hàng hóa (*)</label>
            <select v-model="filterParams.itemId" class="form-control">
                <option value="">-- Chọn vật tư --</option>
                <option v-for="item in reportStore.items" :key="item.id" :value="item.id">
                    {{ item.itemCode }} - {{ item.itemName }}
                </option>
            </select>
        </div>

        <div v-if="reportId === 'slow-moving'" class="form-group">
            <label>Số ngày không GD (*)</label>
            <input type="number" v-model="filterParams.daysUnmoved" class="form-control" placeholder="VD: 90" min="1" />
        </div>

        <div v-if="reportId !== 'slow-moving'" class="form-group">
            <label>Từ ngày</label>
            <input type="date" v-model="filterParams.fromDate" class="form-control" />
        </div>

        <div class="form-group">
            <label>Đến ngày</label>
            <input type="date" v-model="filterParams.toDate" class="form-control" />
        </div>

        <button @click="submitFilter" class="btn-search">
            <i class="fas fa-search"></i> Lọc dữ liệu
        </button>
    </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useReportStore } from '../store/report.store';

const props = defineProps({
    reportId: { type: String, required: true }
});

const emit = defineEmits(['filter']);
const reportStore = useReportStore();

const today = new Date();
const startOfYear = new Date(today.getFullYear(), 0, 1);
const formatDate = (date) => date.toISOString().split('T')[0];

// Khởi tạo các biến đúng y hệt tên tham số trên Swagger
const filterParams = reactive({
    warehouseId: '',
    itemId: '',
    daysUnmoved: 90, // Mặc định 90 ngày
    fromDate: formatDate(startOfYear),
    toDate: formatDate(today)
});

const submitFilter = () => {
    // Validate cơ bản
    if (props.reportId === 'inventory-detail' && !filterParams.itemId) {
        alert("Vui lòng chọn Vật tư/Hàng hóa để xem sổ chi tiết!");
        return;
    }
    if (props.reportId === 'slow-moving' && !filterParams.daysUnmoved) {
        alert("Vui lòng nhập số ngày không giao dịch!");
        return;
    }

    // Lọc bớt các tham số không cần thiết tùy báo cáo để gửi API cho sạch
    const payload = {};
    if (filterParams.warehouseId) payload.warehouseId = filterParams.warehouseId;
    payload.toDate = filterParams.toDate;

    if (props.reportId === 'stock-report') {
        payload.fromDate = filterParams.fromDate;
    } else if (props.reportId === 'inventory-detail') {
        payload.fromDate = filterParams.fromDate;
        payload.itemId = filterParams.itemId;
    } else if (props.reportId === 'slow-moving') {
        payload.daysUnmoved = filterParams.daysUnmoved;
    }

    emit('filter', payload);
};

onMounted(() => {
    // Tự động kéo dữ liệu Kho và Vật tư về để điền vào Dropdown
    if (reportStore.warehouses.length === 0 || reportStore.items.length === 0) {
        reportStore.fetchMasterData();
    }
});
</script>

<style scoped>
.filter-wrapper {
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    padding: 20px;
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    margin-bottom: 8px;
}

.form-control {
    padding: 9px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    outline: none;
    font-size: 14px;
    color: #1e293b;
    min-width: 160px;
    max-width: 200px;
    transition: all 0.2s;
    background-color: white;
}

.form-control:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.btn-search {
    background: #0ea5e9;
    color: white;
    border: none;
    padding: 0 20px;
    height: 40px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: background 0.2s;
}

.btn-search i {
    margin-right: 8px;
}

.btn-search:hover {
    background: #0284c7;
}
</style>