<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content export-modal">
            <header class="modal-header">
                <h3>Xuất báo cáo tổng hợp Sổ cái</h3>
                <button class="close-btn" @click="$emit('close')">&times;</button>
            </header>

            <div class="modal-body">
                <div class="form-group">
                    <label>Từ ngày <span class="text-danger">*</span></label>
                    <input type="date" v-model="exportData.startDate" class="form-control" />
                    <span v-if="errors.startDate" class="error-msg">Vui lòng chọn Từ ngày</span>
                </div>

                <div class="form-group">
                    <label>Đến ngày <span class="text-danger">*</span></label>
                    <input type="date" v-model="exportData.endDate" class="form-control" />
                    <span v-if="errors.endDate" class="error-msg">Vui lòng chọn Đến ngày</span>
                </div>

                <div class="form-group custom-select-wrapper">
                    <label>Tài khoản</label>
                    <input 
                        type="text" 
                        v-model="accountSearch" 
                        @focus="showSuggestions = true"
                        @input="handleSearchInput"
                        placeholder="-- Tất cả tài khoản --" 
                        class="form-control" 
                    />
                    
                    <ul v-if="showSuggestions && filteredAccounts.length > 0" class="suggestions-list">
                        <li class="suggestion-item" @click="selectAccount('')">
                            -- Tất cả tài khoản --
                        </li>
                        <li 
                            v-for="acc in filteredAccounts" 
                            :key="acc.id" 
                            @click="selectAccount(acc)"
                            class="suggestion-item"
                        >
                            <strong>{{ acc.id }}</strong> - {{ acc.accountName }}
                        </li>
                    </ul>
                </div>

                <div class="form-group">
                    <label>Từ khóa diễn giải</label>
                    <input type="text" v-model="exportData.keyword" placeholder="Nhập diễn giải, số chứng từ..." class="form-control" />
                </div>
            </div>

            <footer class="modal-footer">
                <button class="btn-secondary" @click="$emit('close')">Hủy</button>
                <button class="btn-primary btn-success" @click="confirmExport">
                    <i class="fas fa-file-excel"></i> Xác nhận tải
                </button>
            </footer>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue';

const props = defineProps({
    initialFilters: Object,
    accounts: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['close', 'confirm']);

// Dữ liệu form export
const exportData = reactive({
    startDate: props.initialFilters?.startDate || '',
    endDate: props.initialFilters?.endDate || '',
    accountNumber: props.initialFilters?.accountNumber || '',
    keyword: props.initialFilters?.keyword || ''
});

const errors = reactive({ startDate: false, endDate: false });

// --- LOGIC AUTOCOMPLETE TÀI KHOẢN ---
const accountSearch = ref(props.initialFilters?.accountNumber || '');
const showSuggestions = ref(false);

const filteredAccounts = computed(() => {
    if (!props.accounts) return [];
    if (!accountSearch.value) return props.accounts;
    const query = accountSearch.value.toLowerCase();
    return props.accounts.filter(a => 
        (a.id && a.id.toLowerCase().includes(query)) || 
        (a.accountName && a.accountName.toLowerCase().includes(query))
    );
});

const handleSearchInput = () => {
    showSuggestions.value = true;
    exportData.accountNumber = accountSearch.value; 
};

const selectAccount = (acc) => {
    if (!acc) {
        accountSearch.value = '';
        exportData.accountNumber = '';
    } else {
        accountSearch.value = acc.id; 
        exportData.accountNumber = acc.id; 
    }
    showSuggestions.value = false;
};

const closeSuggestions = (e) => {
    if (!e.target.closest('.custom-select-wrapper')) {
        showSuggestions.value = false;
    }
};

onMounted(() => document.addEventListener('click', closeSuggestions));
onUnmounted(() => document.removeEventListener('click', closeSuggestions));

// --- LOGIC XÁC NHẬN ---
const confirmExport = () => {
    errors.startDate = false;
    errors.endDate = false;

    if (!exportData.startDate) errors.startDate = true;
    if (!exportData.endDate) errors.endDate = true;

    if (errors.startDate || errors.endDate) return;

    emit('confirm', { ...exportData });
};
</script>

<style scoped>
/* LỚP PHỦ TỐI BÊN NGOÀI (Overlay) */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4); /* Màu đen trong suốt 40% */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999; /* Đảm bảo luôn nằm trên cùng */
}

/* KHUNG TRẮNG CHỨA NỘI DUNG (Modal Box) */
.modal-content.export-modal {
    background-color: #ffffff;
    width: 450px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    overflow: visible; /* Để list gợi ý không bị cắt rụng */
}

/* PHẦN HEADER */
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
    margin: 0;
    font-size: 18px;
    color: #111;
    font-weight: 600;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    color: #666;
    cursor: pointer;
    line-height: 1;
}

.close-btn:hover {
    color: #ff0000;
}

/* PHẦN BODY */
.modal-body {
    padding: 20px 24px;
}

.form-group {
    margin-bottom: 16px;
    text-align: left;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #333;
}

.text-danger {
    color: #e81e1e;
}

.form-control {
    width: 100%;
    height: 36px;
    padding: 0 12px;
    border: 1px solid #babec5;
    border-radius: 4px;
    font-size: 14px;
    outline: none;
    box-sizing: border-box; /* Rất quan trọng để input không bị tràn viền */
    transition: border-color 0.2s;
}

.form-control:focus {
    border-color: #00a54f;
}

.error-msg {
    color: #e81e1e;
    font-size: 12px;
    margin-top: 4px;
    display: block;
}

/* LOGIC AUTOCOMPLETE DROPDOWN */
.custom-select-wrapper {
    position: relative;
}

.suggestions-list {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    background: #ffffff;
    border: 1px solid #babec5;
    border-radius: 4px;
    z-index: 10000;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    list-style: none;
    padding: 0;
    margin: 0;
}

.suggestion-item {
    padding: 10px 12px;
    font-size: 14px;
    color: #111;
    cursor: pointer;
    border-bottom: 1px solid #f2f2f2;
}

.suggestion-item:last-child {
    border-bottom: none;
}

.suggestion-item:hover {
    background-color: #ebedf0;
    color: #00a54f;
}

/* PHẦN FOOTER VÀ BUTTONS */
.modal-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    padding: 16px 24px;
    background-color: #f8f9fa; /* Màu xám rất nhạt ở chân form giống ảnh 2 */
    border-top: 1px solid #e0e0e0;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
}

.btn-secondary {
    height: 36px;
    padding: 0 16px;
    background-color: #ffffff;
    border: 1px solid #babec5;
    border-radius: 4px;
    color: #111;
    font-weight: 500;
    cursor: pointer;
}

.btn-secondary:hover {
    background-color: #ebedf0;
}

.btn-success {
    height: 36px;
    padding: 0 16px;
    background-color: #00a54f; /* Xanh lá chuẩn MISA/Accounting */
    border: none;
    border-radius: 4px;
    color: #ffffff;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
}

.btn-success:hover {
    background-color: #008f44;
}
</style>