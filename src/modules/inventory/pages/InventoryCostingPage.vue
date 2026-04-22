<template>
    <div class="inventory-form-container">
        <div class="form-header">
            <div class="header-left">
                <button class="btn-back" @click="goBack"><i class="fas fa-arrow-left"></i> Quay lại</button>
                <h2 class="page-title">Tính Giá Vốn Xuất Kho</h2>
            </div>
        </div>

        <div class="costing-card">
            <div class="info-alert">
                <i class="fas fa-info-circle"></i>
                <span>Chức năng này sẽ tự động tính toán lại đơn giá vốn và cập nhật giá trị tiền cho toàn bộ các Phiếu
                    Xuất Kho trong kỳ. Vui lòng không thao tác nghiệp vụ kho khác trong lúc hệ thống đang chạy.</span>
            </div>

            <div class="costing-form">
                <div class="form-row">
                    <label>Kỳ tính giá <span class="required">*</span></label>
                    <input type="month" v-model="period" class="input-box" />
                </div>

                <div class="form-row">
                    <label>Phương pháp tính <span class="required">*</span></label>
                    <select v-model="method" class="input-box">
                        <option value="BGGQ_CUOIKY">Bình quân gia quyền cuối kỳ (Phổ biến nhất)</option>
                        <option value="BGGQ_LIENTUC">Bình quân gia quyền liên tục</option>
                        <option value="FIFO">Nhập trước Xuất trước (FIFO)</option>
                    </select>
                </div>

                <div class="action-area">
                    <button class="btn-run" @click="runCosting" :disabled="isProcessing">
                        <i class="fas fa-cogs" :class="{ 'fa-spin': isProcessing }"></i>
                        {{ isProcessing ? 'Hệ thống đang xử lý, vui lòng đợi...' : 'Thực hiện Tính Giá' }}
                    </button>
                </div>
            </div>

            <div v-if="result" class="result-box">
                <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                <h3>Tính giá hoàn tất!</h3>
                <ul class="result-details">
                    <li><strong>Thời gian xử lý:</strong> {{ result.time }} giây</li>
                    <li><strong>Số phiếu xuất được cập nhật:</strong> {{ result.updatedVouchers }} chứng từ</li>
                    <li><strong>Tổng giá vốn xuất kho:</strong> <span class="text-red-600 font-bold">{{
                            result.totalValue }}</span> VNĐ</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const period = ref('2026-04')
const method = ref('BGGQ_CUOIKY')
const isProcessing = ref(false)
const result = ref(null)

const goBack = () => router.push({ name: 'InventoryDashboard' })

const runCosting = () => {
    isProcessing.value = true
    result.value = null

    // Giả lập thời gian Backend .NET xử lý (Ví dụ mất 2.5 giây để update DB)
    setTimeout(() => {
        isProcessing.value = false
        result.value = {
            time: 2.5,
            updatedVouchers: 42,
            totalValue: '1,250,400,000'
        }
    }, 2500)
}
</script>

<style scoped>
.inventory-form-container {
    padding: 24px;
    background-color: #f8f9fc;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-header {
    display: flex;
    align-items: center;
}

.page-title {
    margin: 0 0 0 16px;
    font-size: 24px;
    color: #111827;
}

.btn-back {
    background: transparent;
    border: none;
    font-size: 14px;
    color: #4b5563;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
}

.costing-card {
    background: white;
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
}

.info-alert {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #1e3a8a;
    padding: 16px;
    border-radius: 8px;
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    line-height: 1.5;
    font-size: 14px;
}

.info-alert i {
    font-size: 20px;
    margin-top: 2px;
    color: #3b82f6;
}

.costing-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-row label {
    font-size: 14px;
    color: #4b5563;
    font-weight: 600;
}

.input-box {
    height: 40px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 0 12px;
    outline: none;
    font-size: 14px;
}

.input-box:focus {
    border-color: #9333ea;
}

.required {
    color: #dc2626;
}

.action-area {
    margin-top: 16px;
    display: flex;
    justify-content: center;
    border-top: 1px solid #e5e7eb;
    padding-top: 24px;
}

.btn-run {
    background: #9333ea;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 32px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.2s;
}

.btn-run:hover:not(:disabled) {
    background: #7e22ce;
}

.btn-run:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.result-box {
    margin-top: 32px;
    background: #f0fdf4;
    border: 1px dashed #86efac;
    border-radius: 8px;
    padding: 24px;
    text-align: center;
}

.success-icon {
    font-size: 48px;
    color: #22c55e;
    margin-bottom: 12px;
}

.result-box h3 {
    margin: 0 0 16px 0;
    color: #166534;
    font-size: 20px;
}

.result-details {
    list-style: none;
    padding: 0;
    margin: 0;
    display: inline-block;
    text-align: left;
    font-size: 15px;
    color: #374151;
    line-height: 2;
}
</style>