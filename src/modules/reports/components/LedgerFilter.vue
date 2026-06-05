<template>
    <div class="filter-wrapper">
        <div class="form-group">
            <label>Tài khoản</label>
            <select v-model="filterParams.accountCode" class="form-control select-account">
                <option value="">-- Tất cả tài khoản --</option>

                <option v-for="(acc, index) in accountList" :key="index"
                    :value="acc.accountCode || acc.accountId || acc.code || acc.id">
                    {{ acc.accountCode || acc.accountId || acc.code || acc.id }} - {{ acc.accountName || acc.name ||
                    'Chưa có tên' }}
                </option>
            </select>
        </div>

        <div class="form-group">
            <label>Từ ngày</label>
            <input type="date" v-model="filterParams.fromDate" class="form-control" />
        </div>

        <div class="form-group">
            <label>Đến ngày</label>
            <input type="date" v-model="filterParams.toDate" class="form-control" />
        </div>

        <button @click="submitFilter" class="btn-search">
            <i class="fas fa-filter"></i> Xem sổ
        </button>
    </div>
</template>

<script setup>
import { reactive, onMounted, computed } from 'vue';
import { useReportStore } from '../store/report.store';

const props = defineProps({
    reportId: { type: String, required: true }
});

const emit = defineEmits(['filter']);
const reportStore = useReportStore();

// TẠO COMPUTED ĐỂ LUÔN BẮT ĐƯỢC DỮ LIỆU MỚI NHẤT TỪ STORE
const accountList = computed(() => reportStore.accounts);

const today = new Date();
const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const filterParams = reactive({
    accountCode: '', // Rỗng = Chọn Tất cả tài khoản
    fromDate: formatDate(startOfMonth),
    toDate: formatDate(today)
});

const submitFilter = () => {
    const payload = {
        fromDate: filterParams.fromDate,
        toDate: filterParams.toDate
    };

    if (filterParams.accountCode !== '') {
        if (props.reportId === 'cash-book') {
            payload.accountCode = filterParams.accountCode;
        } else if (props.reportId === 'general-ledger') {
            payload.accountId = filterParams.accountCode;
        }
    }

    emit('filter', payload);
};

onMounted(async () => {
    // GỌI API NGAY LẬP TỨC
    await reportStore.fetchAccounts();

    // Tự động kích hoạt lọc dữ liệu
    submitFilter();
});
</script>

<style scoped>
/* Bạn giữ nguyên thẻ <style scoped> hiện tại của bạn nhé, không cần thay đổi */
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
    min-width: 150px;
    transition: all 0.2s;
    background-color: white;
}

.select-account {
    min-width: 250px;
    max-width: 400px;
}

.form-control:focus {
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.btn-search {
    background: #f59e0b;
    color: white;
    border: none;
    padding: 0 24px;
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
    background: #d97706;
}
</style>