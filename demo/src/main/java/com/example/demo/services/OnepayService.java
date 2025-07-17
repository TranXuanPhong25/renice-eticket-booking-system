package com.example.demo.services;

import java.io.ByteArrayOutputStream;
import java.util.*;

import javax.crypto.Mac;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import com.example.demo.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class OnepayService {
    @Value("${onepay.secure-secret}")
    private String secureSecret;
    static public final char[] HEX_TABLE = new char[]{
            '0', '1', '2', '3', '4', '5', '6', '7',
            '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'};
    private static byte[] decodeHexArray = new byte[103];

    static {
        int i = 0;
        for (byte b : new byte[]{'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'}) {
            decodeHexArray[b] = (byte) i++;
        }
        decodeHexArray['a'] = decodeHexArray['A'];
        decodeHexArray['b'] = decodeHexArray['B'];
        decodeHexArray['c'] = decodeHexArray['C'];
        decodeHexArray['d'] = decodeHexArray['D'];
        decodeHexArray['e'] = decodeHexArray['E'];
        decodeHexArray['f'] = decodeHexArray['F'];
    }

    private static final Map<String, String> map_result = new HashMap<String, String>() {
        {
            put("0", "Giao dịch thành công");
            put("1", "Ngân hàng từ chối giao dịch");
            put("3", "Mã đơn vị không tồn tại");
            put("4", "Không đúng access code");
            put("5", "Số tiền không hợp lệ");
            put("6", "Mã tiền tệ không tồn tại");
            put("7", "Lỗi không xác định");
            put("8", "Số thẻ không đúng");
            put("9", "Tên chủ thẻ không đúng");
            put("10", "Thẻ hết hạn/Thẻ bị khóa");
            put("11", "Thẻ chưa đăng ký sử dụng dịch vụ");
            put("12", "Ngày phát hành/Hết hạn không đúng");
            put("13", "Vượt quá hạn mức thanh toán");
            put("21", "Số tiền không đủ để thanh toán");
            put("22", "Giao dịch không thành công. Thông tin tài khoản không đúng. Vui lòng kiểm tra và thực hiện thanh toán lại");
            put("23", "Giao dịch không thành công. Tài khoản bị khóa.Vui lòng liên hê ngân hàng theo số điện thoại sau mặt thẻ để được hỗ trợ");
            put("24", "Giao dịch không thành công. Thông tin thẻ không đúng. Vui lòng kiểm tra và thực hiện thanh toán lại");
            put("25", "Giao dịch không thành công. OTP không đúng.Vui lòng kiểm tra và thực hiện thanh toán lạ");
            put("253", "Giao dịch không thành công. Quá thời gian thanh toán. Vui lòng thực hiện thanh toán lại");
            put("99", "Giao dịch không thành công. Người sử dụng hủy giao dịch");
            put("B", "Giao dịch không thành công do không xác thực được 3D-Secure. Vui lòng liên hệ ngân hàng theo số điện thoại sau mặt thẻ được hỗ trợ chi tiết.");
            put("E", "Giao dịch không thành công do nhập sai CSC (Card Security Card) hoặc ngân hàng từ chối cấp phép cho giao dịch. Vui lòng liên hệ ngân hàng theo số điện thoại sau mặt thẻ được hỗ trợ chi tiết.");
            put("F", "Giao dịch không thành công do không xác thực được 3D-Secure. Vui lòng liên hệ ngân hàng theo số điện thoại sau mặt thẻ được hỗ trợ chi tiết.");
            put("Z", "Giao dịch của bạn bị từ chối. Vui lòng liên hệ Đơn vị chấp nhận thẻ để được hỗ trợ.");
        }
    };


    public String hashAllFields(Map fields) {
        List fieldNames = new ArrayList(fields.keySet());
        Collections.sort(fieldNames);
        StringBuffer buf = new StringBuffer();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) fields.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0) && (fieldName.indexOf("vpc_") == 0 || fieldName.indexOf("user_") == 0)) {
                System.out.println("-------------------" + fieldName + " = " + fieldValue);
                buf.append(fieldName + "=" + fieldValue);
                if (itr.hasNext()) {
                    buf.append('&');
                }
            }
        }
        byte[] mac = null;
        try {
            byte[] b = decodeHexa(secureSecret.getBytes());
            SecretKey key = new SecretKeySpec(b, "HMACSHA256");
            Mac m = Mac.getInstance("HMACSHA256");
            m.init(key);
            m.update(buf.toString().getBytes("UTF-8"));
            mac = m.doFinal();
        } catch (Exception e) {
            e.printStackTrace();
        }
        String hashValue = hex(mac);
        return hashValue;

    }

    public static byte[] decodeHexa(byte[] data) throws Exception {
        if (data == null) {
            return null;
        }
        if (data.length % 2 != 0) {
            throw new Exception("Invalid data length:" + data.length);
        }
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        byte b1, b2;
        int i = 0;
        while (i < data.length) {
            b1 = decodeHexArray[data[i++]];
            b2 = decodeHexArray[data[i++]];
            out.write((b1 << 4) | b2);
        }
        out.flush();
        out.close();
        return out.toByteArray();
    }

    static String hex(byte[] input) {
        StringBuffer sb = new StringBuffer(input.length * 2);
        for (int i = 0; i < input.length; i++) {
            sb.append(HEX_TABLE[(input[i] >> 4) & 0xf]);
            sb.append(HEX_TABLE[input[i] & 0xf]);
        }
        return sb.toString();
    }
    public String getResponseDescription(String vResponseCode) {
        return map_result.getOrDefault(vResponseCode, "Mã lỗi không hợp lệ hoặc không được hỗ trợ");
    }
}

