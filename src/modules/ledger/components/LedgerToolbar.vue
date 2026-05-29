<template>
    <div class="toolbar">
        <div class="filter-group">
            <div class="input-wrapper">
                <label class="input-label">Từ ngày</label>
                <input type="date" v-model="filters.startDate" class="form-control" @keyup.enter="submitFilter" />
            </div>

            <div class="input-wrapper">
                <label class="input-label">Đến ngày</label>
                <input type="date" v-model="filters.endDate" class="form-control" @keyup.enter="submitFilter" />
            </div>

            <div class="input-wrapper select-wrapper">
                <label class="input-label">Tài khoản</label>
                <select v-model="filters.accountNumber" class="form-control select-control" @change="submitFilter">
                    <option value="">-- Tất cả tài khoản --</option>
                    <option v-for="acc in accounts" :key="acc.id" :value="acc.id">
                        {{ acc.id }} - {{ acc.accountName }}
                    </option>
                </select>
            </div>

            <div class="input-wrapper keyword-wrapper">
                <label class="input-label">Tìm kiếm nhanh</label>
                <input type="text" v-model="filters.keyword" placeholder="Số chứng từ, diễn giải..."
                    class="form-control" @keyup.enter="submitFilter" />
            </div>
        </div>

        <div class="action-group">
            <button class="btn-filter" @click="submitFilter">
                <i class="fas fa-filter"></i> Lọc dữ liệu
            </button>
            <button class="btn-export" @click="submitExport">
                <i class="fas fa-file-excel"></i> Xuất Excel
            </button>
        </div>
    </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';

// 1. Nhận danh sách tài khoản động từ API (do file LedgerPage truyền xuống)
const props = defineProps({
    accounts: {
        type: Array,
        default: () => []
    }
});

const filters = reactive({
    startDate: '',
    endDate: '',
    accountNumber: '',
    keyword: ''
});

// 2. Tự động set ngày đầu tháng và cuối tháng cho ô input UI không bị trống
onMounted(() => {
    const date = new Date();
    filters.startDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    filters.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
});

const emit = defineEmits(['onFilter', 'onExport']);

// 3. Hàm kích hoạt lọc (truyền cục data ra cho file cha gọi API)
const submitFilter = () => {
    emit('onFilter', { ...filters });
};

// 4. Hàm kích hoạt xuất Excel
const submitExport = () => {
    emit('onExport', { ...filters });
};
</script>

<style scoped>
.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    /* Căn các nhóm nút và input đều chân với nhau */
    background: white;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    flex-wrap: wrap;
    gap: 16px;
}

.filter-group {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    flex: 1;
}

.input-wrapper {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.input-label {
    font-size: 12px;
    font-weight: 600;
    color: #666;
}

.keyword-wrapper {
    min-width: 220px;
    flex-grow: 1;
}

.select-wrapper {
    min-width: 180px;
}

.form-control {
    padding: 8px 12px;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    outline: none;
    font-size: 14px;
    height: 38px;
    box-sizing: border-box;
    transition: border-color 0.2s;
}

.select-control {
    background-color: #fff;
    cursor: pointer;
}

.form-control:focus {
    border-color: #007bff;
}

.action-group {
    display: flex;
    gap: 10px;
    height: 38px;
}

.btn-filter,
.btn-export {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0 16px;
    height: 100%;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.2s;
}

.btn-filter:hover,
.btn-export:hover {
    opacity: 0.9;
}

.btn-filter {
    background: #007bff;
    color: white;
}

.btn-export {
    background: #28a745;
    color: white;
}
</style>