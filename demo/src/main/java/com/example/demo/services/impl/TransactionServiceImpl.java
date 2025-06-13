package com.example.demo.services.impl;

import com.example.demo.entities.OrderEntity;
import com.example.demo.payload.IpnRequest;
import com.example.demo.repositories.OrderRepository;
import com.example.demo.services.OrderService;
import com.example.demo.services.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class TransactionServiceImpl implements TransactionService {
    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepository orderRepository;

    private void createTransaction(IpnRequest ipnRequest){

        // trânsctionRepository.save()
    }
    @Override
    public void ipn(IpnRequest ipnRequest) {
        // check các thông số truyền về
        // kiểm tra tính toàn vẹn của dữ liệu từ đối tác truyền sang

        UUID orderId = UUID.fromString(ipnRequest.getTxnRef());
        OrderEntity orderEntity = orderService.getOrder(orderId);

        if (orderEntity.getTotalAmount() != ipnRequest.getAmount()){
            orderEntity.setOrderStatus("FAILED");
            throw new RuntimeException("Sai thông tin số tiền thanh toán");
        }



        if (true){
            orderEntity.setOrderStatus("SUCCESS");
        }

        orderRepository.save(orderEntity);
    }
}
