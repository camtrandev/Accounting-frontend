<template>
    <div class="toolbar">
        <div class="filter-group">
            <input type="date" v-model="filters.startDate" class="form-control" />
            <input type="date" v-model="filters.endDate" class="form-control" />
            <input type="text" v-model="filters.keyword" placeholder="Tìm số chứng từ, tài khoản..."
                class="form-control" />
            <button class="btn-filter" @click="submitFilter">Lọc dữ liệu</button>
        </div>
        <div class="action-group">
            <button class="btn-export" @click="$emit('onExport')">Xuất Excel</button>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';

const filters = reactive({
    startDate: '',
    endDate: '',
    keyword: ''
});

const emit = defineEmits(['onFilter', 'onExport']);

const submitFilter = () => {
    // Gửi object filter từ con lên cha
    emit('onFilter', { ...filters });
};
</script>

<style scoped>
.toolbar {
    display: flex;
    justify-content: space-between;
    background: white;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    flex-wrap: wrap;
    gap: 10px;
}

.filter-group {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.form-control {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    outline: none;
}

.form-control:focus {
    border-color: #007bff;
}

.btn-filter {
    background: #007bff;
    color: white;
    border: none;
    padding: 8px 20px;
    border-radius: 6px;
    cursor: pointer;
}

.btn-export {
    background: #28a745;
    color: white;
    border: none;
    padding: 8px 20px;
    border-radius: 6px;
    cursor: pointer;
}
</style>