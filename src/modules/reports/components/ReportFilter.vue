<template>
    <div class="filter-wrapper">
        <div v-if="showFromDate" class="form-group">
            <label>Từ ngày</label>
            <input type="date" v-model="filterParams.fromDate" />
        </div>

        <div class="form-group">
            <label>Đến ngày</label>
            <input type="date" v-model="filterParams.toDate" />
        </div>

        <button @click="submitFilter" class="btn-search">
            <i class="fas fa-filter"></i>
            Xem báo cáo
        </button>
    </div>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
    showFromDate: { type: Boolean, default: true }
})

const emit = defineEmits(['filter'])

const today = new Date()
const startOfYear = new Date(today.getFullYear(), 0, 1)

const filterParams = reactive({
    fromDate: startOfYear.toISOString().split('T')[0],
    toDate: today.toISOString().split('T')[0]
})

const submitFilter = () => {
    emit('filter', { ...filterParams })
}

// Chạy mặc định khi load trang
setTimeout(() => { submitFilter() }, 100)
</script>

<style scoped>
.filter-wrapper {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 20px;
    display: flex;
    align-items: flex-end;
    gap: 20px;
    margin-bottom: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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
    margin-bottom: 6px;
    letter-spacing: 0.5px;
}

.form-group input {
    padding: 8px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    outline: none;
    font-size: 14px;
    color: #1e293b;
    min-width: 180px;
}

.form-group input:focus {
    border-color: #3b82f6;
}

.btn-search {
    background: #2563eb;
    color: white;
    border: none;
    padding: 0 20px;
    height: 38px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: background 0.2s;
}

.btn-search i {
    margin-right: 8px;
}

.btn-search:hover {
    background: #1d4ed8;
}
</style>