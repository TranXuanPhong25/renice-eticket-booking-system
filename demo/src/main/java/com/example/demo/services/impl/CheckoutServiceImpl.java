package com.example.demo.services.impl;

import com.example.demo.entities.OrderEntity;
import com.example.demo.payload.CheckoutResponse;
import com.example.demo.services.CheckoutService;
import com.example.demo.utils.OnepayPaymentUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService {
    private final OnepayPaymentUtil onepayPaymentUtil;

    @Autowired
    public CheckoutServiceImpl(OnepayPaymentUtil onepayPaymentUtil) {
        this.onepayPaymentUtil = onepayPaymentUtil;
    }

    @Override
    public CheckoutResponse getCheckout(OrderEntity orderEntity) {
        UUID orderId = orderEntity.getId();
        Long totalPayment = orderEntity.getTotalAmount();
        String customerEmail = orderEntity.getCustomerEmail();

        // Tạo link thanh toán Onepay
        String paymentUrl = onepayPaymentUtil.buildPaymentUrl(orderId.toString(), totalPayment, customerEmail);

        CheckoutResponse response = new CheckoutResponse();
        response.setPaymentUrl(paymentUrl);
        return response;
    }
}
