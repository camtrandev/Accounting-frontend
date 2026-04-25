<template>
    <div class="pagination-container">
        <div class="pagination-left">
            <span class="total-text">Tổng số: <b>{{ total }}</b> bản ghi</span>
        </div>

        <div class="pagination-right">
            <div class="page-size-selector">
                <select :value="pageSize" @change="onPageSizeChange">
                    <option :value="10">10 bản ghi/trang</option>
                    <option :value="20">20 bản ghi/trang</option>
                    <option :value="50">50 bản ghi/trang</option>
                    <option :value="100">100 bản ghi/trang</option>
                </select>
            </div>

            <div class="page-controls">
                <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)" class="btn-nav">
                    <i class="fas fa-chevron-left"></i> Trước
                </button>

                <div class="page-numbers hidden-mobile">
                    <button v-for="page in totalPages" :key="page"
                        :class="['btn-page', { active: page === currentPage }]" @click="changePage(page)">
                        {{ page }}
                    </button>
                </div>

                <span class="md:hidden text-sm px-2">Trang {{ currentPage }}/{{ totalPages }}</span>

                <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)" class="btn-nav">
                    Sau <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    total: { type: Number, default: 0 },
    pageSize: { type: Number, default: 20 },
    currentPage: { type: Number, default: 1 }
});

const emit = defineEmits(['update:currentPage', 'update:pageSize', 'change']);

const totalPages = computed(() => {
    return Math.ceil(props.total / props.pageSize) || 1;
});

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        emit('update:currentPage', page);
        emit('change');
    }
};

const onPageSizeChange = (event) => {
    emit('update:pageSize', Number(event.target.value));
    emit('update:currentPage', 1); // Reset về trang 1 khi đổi size
    emit('change');
};
</script>

<style scoped>
.pagination-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 20px;
    background: white;
    border-top: 1px solid #e5e7eb;
    font-size: 14px;
}

.pagination-right {
    display: flex;
    align-items: center;
    gap: 24px;
}

.page-size-selector select {
    padding: 4px 8px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    outline: none;
}

.page-controls {
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-nav {
    padding: 4px 12px;
    border: 1px solid #d1d5db;
    background: white;
    border-radius: 4px;
    cursor: pointer;
}

.btn-nav:disabled {
    color: #d1d5db;
    cursor: not-allowed;
}

.page-numbers {
    display: flex;
    gap: 4px;
}

.btn-page {
    width: 32px;
    height: 32px;
    border: 1px solid #d1d5db;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-page.active {
    background: #2563eb;
    color: white;
    border-color: #2563eb;
}

.btn-page:hover:not(.active) {
    background: #f3f4f6;
}

@media (max-width: 768px) {
    .hidden-mobile {
        display: none;
    }

    .pagination-container {
        flex-direction: column;
        gap: 10px;
        padding: 12px;
    }
}
</style>