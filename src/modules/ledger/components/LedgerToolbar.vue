<template>
    <div class="toolbar">
        <div class="filter-group">
            <div class="input-wrapper">
                <label class="input-label">Từ ngày</label>
                <input type="date" v-model="filters.startDate" class="form-control" />
            </div>

            <div class="input-wrapper">
                <label class="input-label">Đến ngày</label>
                <input type="date" v-model="filters.endDate" class="form-control" />
            </div>

            <div class="input-wrapper select-wrapper">
                <label class="input-label">Tài khoản</label>
                <select v-model="filters.accountNumber" class="form-control select-control">
                    <option value="">-- Tất cả tài khoản --</option>
                    <option v-for="acc in accountList" :key="acc.id" :value="acc.code">
                        {{ acc.code }} - {{ acc.name }}
                    </option>
                </select>
            </div>

            <div class="input-wrapper keyword-wrapper">
                <label class="input-label">Tìm kiếm nhanh</label>
                <input type="text" v-model="filters.keyword" placeholder="Số chứng từ, diễn giải..."
                    class="form-control" />
            </div>
        </div>

        <div class="action-group">
            <button class="btn-filter" @click="submitFilter">
                <i class="fas fa-filter"></i> Lọc dữ liệu
            </button>
            <button class="btn-export" @click="$emit('onExport')">
                <i class="fas fa-file-excel"></i> Xuất Excel
            </button>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

// Nhận danh sách tài khoản từ component cha truyền vào (nếu có)
const props = defineProps({
    accounts: {
        type: Array,
        default: () => []
    }
});

// Data mẫu nếu không truyền từ cha (Bạn thay thế bằng danh sách thực tế của bạn)
const accountList = ref(props.accounts.length ? props.accounts : [
    { id: 1, code: '111', name: 'Tiền mặt' },
    { id: 2, code: '112', name: 'Tiền gửi ngân hàng' },
    { id: 3, code: '152', name: 'Nguyên liệu, vật liệu' },
    { id: 4, code: '331', name: 'Phải trả cho người bán' },
    { id: 5, code: '131', name: 'Phải thu của khách hàng' },
]);

const filters = reactive({
    startDate: '',
    endDate: '',
    accountNumber: '', // Thêm field tài khoản
    keyword: ''
});

const emit = defineEmits(['onFilter', 'onExport']);

const submitFilter = () => {
    // Gửi dữ liệu filter chuẩn chỉnh lên component cha xử lý API
    emit('onFilter', { ...filters });
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