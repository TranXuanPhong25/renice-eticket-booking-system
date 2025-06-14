package com.example.demo.controllers;

import com.example.demo.config.OnepayConfig;
import com.example.demo.entities.OrderEntity;
import com.example.demo.payload.CheckoutResponse;
import com.example.demo.services.CheckoutService;
import com.example.demo.services.OnepayService;
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
    private CheckoutService checkoutService;

    @Autowired
    private OnepayService onepayService;

    @PostMapping
    public ResponseEntity<CheckoutResponse> checkout(@RequestBody OrderEntity orderEntity) {
        CheckoutResponse checkoutResponse = checkoutService.getCheckout(orderEntity);
        return ResponseEntity.ok(checkoutResponse);
    }

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

    @GetMapping("/quick")
    public String quickCheckout(HttpServletRequest req) {
        try {
            // tạo mã giao dịch giả
            String txnRef = LocalDateTime.now().toString();


            // ip của request
            String ipClient = req.getRemoteAddr();


            Map<String, Object> fields = new HashMap<>();


            fields.put("vpc_TicketNo", ipClient);
            fields.put("vpc_MerchTxnRef", txnRef);
            fields.put("vpc_OrderInfo", txnRef);
            fields.put("vpc_Merchant", vpcMerchant);
            fields.put("vpc_AccessCode", vpcAccessCode);
            fields.put("virtualPaymentClientURL", virtualPaymentClientURL);
            fields.put("vpc_Version", OnepayConfig.VPC_VERSION);
            fields.put("vpc_Command", OnepayConfig.VPC_COMMAND);
            fields.put("AgainLink", OnepayConfig.AGAIN_LINK);
            fields.put("Title", OnepayConfig.TITLE);
            fields.put("vpc_ReturnURL", "http://localhost:8080" + OnepayConfig.VPC_RETURN_URL);

            String vpc_Locale = req.getParameter("vpc_Locale");
            if (vpc_Locale == null || vpc_Locale.length() == 0) {
                vpc_Locale = OnepayConfig.VPC_LOCALE;
            }

            fields.put("vpc_Locale", vpc_Locale);
            fields.put("vpc_Amount", String.valueOf(100000 * 100));
            fields.put("user_orderId", "user_admin");

            for (Enumeration<String> enum1 = req.getParameterNames(); enum1.hasMoreElements();) {
                String fieldName = enum1.nextElement();
                String fieldValue = req.getParameter(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
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
            String redirectUrl = onePayOriginalUrl;



            return onePayOriginalUrl;
        } catch (Exception e) {
            System.out.println("CHECKOUT_SERVICE: " + e.getMessage());
            e.printStackTrace();
            return "something";
            // throw new ApiError(400, e.getMessage());
        }
    }


    @GetMapping("/ipn")
    public String ipn(HttpServletRequest req){
        Enumeration<String> requestParams = req.getParameterNames();
        while(requestParams.hasMoreElements()){
            String paramName = requestParams.nextElement();
            String[] values =  req.getParameterValues(paramName);
            if ("vpc_TxnResponseCode".equals(paramName)){
                for (String value: values){
                    System.out.println(paramName + ":" + value);
                }
            }

        }
       return "Giao dịch thành công";
    }
}
