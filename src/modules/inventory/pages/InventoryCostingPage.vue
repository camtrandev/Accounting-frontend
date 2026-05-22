<template>
    <div class="inventory-form-container">
        <div v-if="isProcessing" class="loading-overlay">
            <div class="spinner">
                <i class="fas fa-circle-notch fa-spin"></i>
            </div>
            <h2>Hệ thống đang xử lý giá vốn...</h2>
            <p>Vui lòng không đóng trình duyệt hoặc làm mới trang!</p>
        </div>

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
                    <input type="month" v-model="period" class="input-box" :disabled="isProcessing" />
                </div>

                <div class="form-row">
                    <label>Phương pháp tính <span class="required">*</span></label>
                    <select v-model="method" class="input-box" :disabled="isProcessing">
                        <option value="BGGQ_CUOIKY">Bình quân gia quyền cuối kỳ (Phổ biến nhất)</option>
                        <option value="BGGQ_LIENTUC">Bình quân gia quyền liên tục</option>
                        <option value="FIFO">Nhập trước Xuất trước (FIFO)</option>
                    </select>
                </div>

                <div class="action-area">
                    <button class="btn-run" @click="runCosting" :disabled="isProcessing">
                        <i class="fas fa-cogs" :class="{ 'fa-spin': isProcessing }"></i>
                        {{ isProcessing ? 'Đang thực hiện...' : 'Thực hiện Tính Giá' }}
                    </button>
                </div>
            </div>

            <div v-if="result" class="result-box">
                <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                <h3>Tính giá hoàn tất!</h3>
                <ul class="result-details">
                    <li v-if="result.time"><strong>Thời gian xử lý:</strong> {{ result.time }} giây</li>
                    <li><strong>Số phiếu xuất được cập nhật:</strong> {{ result.updatedVouchers }} chứng từ</li>
                    <li v-if="result.totalValue"><strong>Tổng giá vốn xuất kho:</strong> <span
                            class="text-red-600 font-bold">{{ result.totalValue }}</span> VNĐ</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import inventoryApi from '../service/inventory.api'

const router = useRouter()
const toast = useToast()

const period = ref('')
const method = ref('BGGQ_CUOIKY') // Mặc định chọn Bình quân cuối kỳ
const isProcessing = ref(false)
const result = ref(null)

onMounted(() => {
    // Tự động gán kỳ tính giá là tháng hiện tại khi mở form
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    period.value = `${currentYear}-${currentMonth}`;
})

const goBack = () => router.push({ name: 'InventoryDashboard' })

const runCosting = async () => {
    if (!period.value) {
        toast.warning("Vui lòng chọn kỳ tính giá!")
        return
    }

    isProcessing.value = true
    result.value = null

    // 1. Bóc tách Input type="month" (VD: "2026-04")
    const [yearStr, monthStr] = period.value.split('-')

    // 2. BỔ SUNG TRƯỜNG METHOD VÀO PAYLOAD ĐỂ C# HIỂU ĐƯỢC
    const payload = {
        month: Number(monthStr),
        year: Number(yearStr),
        method: method.value
    }

    try {
        const response = await inventoryApi.calculatePrice(payload)
        const responseData = response.data || {}

        // 3. XỬ LÝ LOGIC TRẢ VỀ TỪ BACKEND
        if (!responseData.success) {
            // Nếu Backend báo lỗi (Hoặc chọn FIFO chưa hỗ trợ), ném lỗi ra catch để hiển thị Toast đỏ
            throw new Error(responseData.message || "Lỗi xử lý từ máy chủ!");
        }

        toast.success(responseData.message || `Đã tính giá vốn thành công cho kỳ ${monthStr}/${yearStr}!`)

        // 4. Map chính xác các trường dữ liệu mà Backend C# mới trả về
        const data = responseData.data || {}
        result.value = {
            updatedVouchers: data.updatedVouchers || 0,
            totalValue: data.totalValue ? new Intl.NumberFormat('vi-VN').format(data.totalValue) : '0',
            time: data.time || 0
        }

    } catch (error) {
        console.error("Lỗi khi tính giá vốn:", error)

        // Hiển thị thông báo lỗi chi tiết từ C# gửi lên (Nếu có)
        const errorMessage = error.response?.data?.message || error.message || "Có lỗi xảy ra khi tính giá vốn!"
        toast.error(errorMessage)

    } finally {
        isProcessing.value = false
    }
}
</script>

<style scoped>
/* Lớp phủ ngăn người dùng click bậy khi đang chạy API */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(4px);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #1e3a8a;
}

.loading-overlay .spinner {
    font-size: 48px;
    color: #9333ea;
    margin-bottom: 20px;
}

.loading-overlay h2 {
    margin: 0 0 8px 0;
    font-size: 24px;
}

.loading-overlay p {
    margin: 0;
    color: #6b7280;
}

.inventory-form-container {
    padding: 24px;
    background-color: #f8f9fc;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
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
    box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.1);
}

.input-box:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
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
    box-shadow: 0 4px 6px -1px rgba(147, 51, 234, 0.3);
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
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
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