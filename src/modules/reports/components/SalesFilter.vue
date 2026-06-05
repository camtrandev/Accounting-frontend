<template>
    <div class="filter-wrapper">
        <div class="form-group">
            <label>Từ ngày</label>
            <input type="date" v-model="filterParams.fromDate" class="form-control" />
        </div>

        <div class="form-group">
            <label>Đến ngày</label>
            <input type="date" v-model="filterParams.toDate" class="form-control" />
        </div>

        <button @click="submitFilter" class="btn-search">
            <i class="fas fa-filter"></i> Lọc dữ liệu
        </button>
    </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';

const emit = defineEmits(['filter']);

const today = new Date();
const threeMonthsAgo = new Date();
threeMonthsAgo.setMonth(today.getMonth() - 3);

const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const filterParams = reactive({
    fromDate: formatDate(threeMonthsAgo),
    toDate: formatDate(today)
});

const submitFilter = () => {
    emit('filter', { ...filterParams });
};

onMounted(() => {
    setTimeout(() => {
        submitFilter();
    }, 200);
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
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.btn-search {
    background: #10b981;
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
    background: #059669;
}
</style>