<template>
    <div class="pagination-wrapper">
        <div class="page-info">
            Hiển thị {{ startIndex + 1 }} - {{ Math.min(endIndex, totalItems) }} trên tổng số {{ totalItems }} bản ghi
        </div>
        <div class="pagination-controls">
            <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)" class="btn-page">
                <i class="fas fa-chevron-left"></i> Trước
            </button>

            <span class="page-numbers">
                <button v-for="page in totalPages" :key="page" :class="['btn-page', { active: page === currentPage }]"
                    @click="changePage(page)">
                    {{ page }}
                </button>
            </span>

            <button :disabled="currentPage === totalPages || totalPages === 0" @click="changePage(currentPage + 1)"
                class="btn-page">
                Sau <i class="fas fa-chevron-right"></i>
            </button>

            <select v-model="localPageSize" @change="changeSize" class="size-select">
                <option :value="10">10 / trang</option>
                <option :value="20">20 / trang</option>
                <option :value="50">50 / trang</option>
            </select>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
    totalItems: { type: Number, required: true },
    currentPage: { type: Number, required: true },
    pageSize: { type: Number, default: 10 }
});

const emit = defineEmits(['update:currentPage', 'update:pageSize']);

const localPageSize = ref(props.pageSize);

const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize));
const startIndex = computed(() => (props.currentPage - 1) * props.pageSize);
const endIndex = computed(() => startIndex.value + props.pageSize);

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        emit('update:currentPage', page);
    }
};

const changeSize = () => {
    emit('update:pageSize', localPageSize.value);
    emit('update:currentPage', 1); // Đổi số lượng thì tự động quay về trang 1
};

// Đồng bộ nếu prop thay đổi từ bên ngoài
watch(() => props.pageSize, (newVal) => {
    localPageSize.value = newVal;
});
</script>

<style scoped>
.pagination-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: #fff;
    border-top: 1px solid #e2e8f0;
    border-radius: 0 0 8px 8px;
    margin-top: 10px;
}

.page-info {
    color: #64748b;
    font-size: 14px;
}

.pagination-controls {
    display: flex;
    gap: 8px;
    align-items: center;
}

.btn-page {
    padding: 6px 12px;
    border: 1px solid #cbd5e1;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    color: #334155;
    transition: all 0.2s;
}

.btn-page:hover:not(:disabled) {
    background: #f1f5f9;
}

.btn-page:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-page.active {
    background: #2563eb;
    color: white;
    border-color: #2563eb;
}

.size-select {
    padding: 6px;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    margin-left: 10px;
}
</style>