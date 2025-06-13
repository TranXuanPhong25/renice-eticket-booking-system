package com.example.demo.utils;

import com.example.demo.config.OnepayConfig;
import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;

@Component
public class OnepayPaymentUtil {
    private final OnepayConfig config;

    public OnepayPaymentUtil(OnepayConfig config) {
        this.config = config;
    }

    public String buildPaymentUrl(String orderId, long amount, String customerEmail) {
        Map<String, String> params = new LinkedHashMap<>();
        params.put("vpc_Version", "2");
        params.put("vpc_Command", "pay");
        params.put("vpc_Merchant", config.getMerchantId());
        params.put("vpc_AccessCode", config.getAccessCode());
        params.put("vpc_MerchTxnRef", orderId);
        params.put("vpc_OrderInfo", "Order " + orderId);
        params.put("vpc_Amount", String.valueOf(amount * 100)); // Onepay yêu cầu đơn vị là cent
        params.put("vpc_Locale", "vn");
        params.put("vpc_Currency", "VND");
        params.put("vpc_ReturnURL", config.getReturnUrl());
        params.put("vpc_TicketNo", customerEmail); // Có thể dùng IP hoặc email

        // Build query string
        StringBuilder query = new StringBuilder();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            try {
                query.append(URLEncoder.encode(entry.getKey(), "UTF-8"))
                        .append("=")
                        .append(URLEncoder.encode(entry.getValue(), "UTF-8"))
                        .append("&");
            } catch (UnsupportedEncodingException e) {
                throw new RuntimeException(e);
            }
        }
        // Remove last &
        if (query.length() > 0) query.setLength(query.length() - 1);

        // Tạo chuỗi để hash
        String hashData = createHashData(params);
        String secureHash = hmacSHA256(config.getSecureSecret(), hashData);

        // Thêm secure hash vào URL
        String paymentUrl = config.getPaymentUrl() + "?" + query + "&vpc_SecureHashType=SHA256&vpc_SecureHash=" + secureHash;
        return paymentUrl;
    }

    private String createHashData(Map<String, String> params) {
        // Theo Onepay: chỉ hash các param bắt đầu bằng vpc_ hoặc user_ và value khác rỗng
        StringBuilder sb = new StringBuilder();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if ((entry.getKey().startsWith("vpc_") || entry.getKey().startsWith("user_")) && entry.getValue() != null && !entry.getValue().isEmpty()) {
                sb.append(entry.getKey()).append("=").append(entry.getValue()).append("&");
            }
        }
        if (sb.length() > 0) sb.setLength(sb.length() - 1);
        return sb.toString();
    }

    private static String hmacSHA256(String key, String data) {
        try {
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
            javax.crypto.spec.SecretKeySpec secretKey = new javax.crypto.spec.SecretKeySpec(key.getBytes("UTF-8"), "HmacSHA256");
            mac.init(secretKey);
            byte[] hashBytes = mac.doFinal(data.getBytes("UTF-8"));
            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString().toUpperCase();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public String buildSecureHash(String data) {
        return hmacSHA256(config.getSecureSecret(), data);
    }
} 