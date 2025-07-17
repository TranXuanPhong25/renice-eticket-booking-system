package com.example.demo.controllers;

import com.example.demo.config.OnepayConfig;
import com.example.demo.entities.OrderEntity;
import com.example.demo.payload.CheckoutRequest;
import com.example.demo.services.OnepayService;
import com.example.demo.services.OrderService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/checkout")
public class CheckoutController {

    @Autowired
    private OnepayService onepayService;
    @Autowired
    private OrderService orderService;
    @Value("${onepay.virtual-payment-client-url}")
    private String virtualPaymentClientURL;

    @Value("${onepay.vpc-merchant}")
    private String vpcMerchant;

    @Value("${onepay.promotion-list}")
    private String promotionList;

    @Value("${onepay.vpc-access-code}")
    private String vpcAccessCode;

    @Value("${onepay.secure-secret}")
    private String secureSecret;


    @PostMapping
    public ResponseEntity<String> checkout(HttpServletRequest req, @RequestBody CheckoutRequest checkoutRequest) {
        String txnRef =checkoutRequest.getOrderId().replaceAll("-","");
        String ipClient = req.getRemoteAddr();
        String ticketName = checkoutRequest.getEventName();
        String againLink = checkoutRequest.getAgainLink();
        String amount = String.valueOf(Long.parseLong(checkoutRequest.getAmount()) * 100);
        Map<String, Object> fields = new HashMap<>();
        fields.put("vpc_TicketNo", ipClient);
        fields.put("vpc_MerchTxnRef", txnRef);
        fields.put("vpc_OrderInfo", txnRef);
        fields.put("vpc_Merchant", vpcMerchant);
        fields.put("vpc_AccessCode", vpcAccessCode);
        fields.put("virtualPaymentClientURL", virtualPaymentClientURL);
        fields.put("vpc_Version", OnepayConfig.VPC_VERSION);
        fields.put("vpc_Command", OnepayConfig.VPC_COMMAND);
        fields.put("AgainLink",againLink);
        fields.put("Title", OnepayConfig.TITLE + ticketName);
        fields.put("vpc_ReturnURL", "http://localhost:3000" + OnepayConfig.VPC_RETURN_URL);

        String vpc_Locale = req.getParameter("vpc_Locale");
        if (vpc_Locale == null || vpc_Locale.isEmpty()) {
            vpc_Locale = OnepayConfig.VPC_LOCALE;
        }

        fields.put("vpc_Locale", vpc_Locale);
        fields.put("vpc_Amount", amount);

        for (Enumeration<String> enum1 = req.getParameterNames(); enum1.hasMoreElements();) {
            String fieldName = enum1.nextElement();
            String fieldValue = req.getParameter(fieldName);
            if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vpcURL = (String) fields.remove("virtualPaymentClientURL");
        fields.remove("SubButL");

        System.out.println("fields" + fields.toString());
        if (secureSecret != null && secureSecret.length() > 0) {
            String secureHash = onepayService.hashAllFields(fields);
            fields.put("vpc_SecureHash", secureHash);
        }

        StringBuffer buf = new StringBuffer();
        buf.append(vpcURL).append('?');

        OnepayConfig.appendQueryFields(buf, fields);

        String onePayOriginalUrl = buf.toString();
        return ResponseEntity.ok(onePayOriginalUrl);
    }






    @GetMapping("/ipn")
    public String ipn(HttpServletRequest req){
        String responseCode = req.getParameterValues("vpc_TxnResponseCode")[0];
        String message = onepayService.getResponseDescription(responseCode);

        String orderId = req.getParameter("vpc_OrderInfo");
        String part1 = orderId.substring(0, 8);
        String part2 = orderId.substring(8, 12);
        String part3 = orderId.substring(12, 16);
        String part4 = orderId.substring(16, 20);
        String part5 = orderId.substring(20);
        String originalOrderId = part1 + "-" + part2 + "-" + part3 + "-" + part4 + "-" + part5;
        OrderEntity orderEntity = orderService.getOrder(UUID.fromString(originalOrderId));
        orderEntity.setStatus(message);
        orderEntity.setOrderStatus(message);
        return onepayService.getResponseDescription(responseCode);

    }
}

