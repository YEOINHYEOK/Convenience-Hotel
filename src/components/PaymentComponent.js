import React from 'react';

const PaymentComponent = ({ amount, onPaymentSuccess }) => {
  const handlePayment = () => {
    const IMP = window.IMP;
    IMP.init("imp53474078"); 

    IMP.request_pay({
      pg: "uplus",
      pay_method: "card",
      name: "예약 결제",
      amount: amount,
      buyer_name: "홍길동",
    }, (rsp) => {
      if (rsp.success) {
        onPaymentSuccess(rsp.imp_uid, rsp.paid_amount);
      } else {
        alert('결제 실패');
      }
    });
  };

  return (
    <div>
      <button onClick={handlePayment}>결제하기</button>
    </div>
  );
};

// Default export
export default PaymentComponent;
