import axiosInstance from '../axiosInstance';
import {
    IMP_CODE,
    PAY_METHOD_MAP,
    PAYMENT_METHOD_MAP,
    PG_MAP,
    PLAN_NAME,
} from '../../data/user/paymentData';

// 포트원 SDK 결제 요청
// 결제창을 띄우고 완료되면 imp_uid, merchant_uid 반환
function requestPayment({ planType, productId, paymentMethod, amount }) {
    return new Promise((resolve, reject) => {
        const merchantUid = `order_${Date.now()}`;

        IMP.init(IMP_CODE);
        IMP.request_pay(
    {
        pg: 'html5_inicis.INIpayTest',  // 
        pay_method: PAY_METHOD_MAP[paymentMethod],
        merchant_uid: merchantUid,
        name: PLAN_NAME[productId],
        amount,
        buyer_email: '',
        buyer_name: '',
    },
            (response) => {
    console.log('포트원 응답:', response); // << 추가
    if (response.success) {
        console.log('imp_uid:', response.imp_uid); // << 추가
        resolve({
            impUid: response.imp_uid,
            merchantUid: response.merchant_uid,
        });
    } else {
        reject(new Error(response.error_msg || '결제에 실패했습니다.'));
    }
}
        );
    });
}

// 백엔드 결제 검증 및 구독 생성
async function verifyPayment({ impUid, merchantUid, planType, paymentMethod, paymentAmount }) {
    const response = await axiosInstance.post('/api/payments/verify', {
        impUid,
        merchantUid,
        planType,
        paymentMethod: PAYMENT_METHOD_MAP[paymentMethod],
        paymentAmount,
    });
    return response.data;
}

// 현재 구독 상태 조회
async function getSubscription() {
    const response = await axiosInstance.get('/api/payments/subscription');
    return response.data;
}

// 구독 취소
async function cancelSubscription() {
    const response = await axiosInstance.delete('/api/payments/subscription');
    return response.data;
}

export const paymentService = {
    requestPayment,
    verifyPayment,
    getSubscription,
    cancelSubscription,
};