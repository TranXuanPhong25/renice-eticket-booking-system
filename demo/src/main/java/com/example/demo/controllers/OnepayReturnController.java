package com.example.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/onepay")
public class OnepayReturnController {
    @GetMapping("/return")
    public String handleReturn(@RequestParam Map<String, String> params) {
        // Lấy secure hash từ params
        String secureHash = params.get("vpc_SecureHash");
        String secureHashType = params.get("vpc_SecureHashType");

        // Tạo chuỗi hash lại từ các param trả về (trừ vpc_SecureHash, vpc_SecureHashType)
        Map<String, String> filteredParams = new java.util.TreeMap<>();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            String key = entry.getKey();
            if ((key.startsWith("vpc_") || key.startsWith("user_")) &&
                !key.equals("vpc_SecureHash") && !key.equals("vpc_SecureHashType") &&
                entry.getValue() != null && !entry.getValue().isEmpty()) {
                filteredParams.put(key, entry.getValue());
            }
        }
        String hashData = filteredParams.entrySet().stream()
                .map(e -> e.getKey() + "=" + e.getValue())
                .reduce((a, b) -> a + "&" + b).orElse("");

        // Hash lại để so sánh
//        String expectedHash = onepayPaymentUtil.buildSecureHash(hashData);
//        boolean valid = secureHash != null && secureHash.equalsIgnoreCase(expectedHash);

        // Kiểm tra trạng thái giao dịch
        String txnResponseCode = params.get("vpc_TxnResponseCode");
        String message;
//        if (!valid) {
//            message = "Dữ liệu không hợp lệ (sai secure hash)!";
//        } else if ("0".equals(txnResponseCode)) {
//            message = "Thanh toán thành công!";
//        } else {
//            message = "Thanh toán thất bại! Mã lỗi: " + txnResponseCode;
//        }
        return "message";
    }
} 