package com.example.demo.services;

import com.example.demo.payload.IpnRequest;

public interface TransactionService {
    void ipn(IpnRequest ipnRequest);
}
