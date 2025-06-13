package com.example.demo.controllers;

import com.example.demo.payload.IpnRequest;
import com.example.demo.services.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ipn")
public class IpnController {
    @Autowired
    private TransactionService transactionService;
    @GetMapping
    ResponseEntity ipn(IpnRequest ipnRequest){
        transactionService.ipn(ipnRequest);
        return ResponseEntity.ok(true);
    }
}
