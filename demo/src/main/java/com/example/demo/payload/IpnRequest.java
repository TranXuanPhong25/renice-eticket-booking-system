package com.example.demo.payload;


public class IpnRequest {
    String vpc_Version;
    String vpc_Currency;
    String secureCode;
    Long amount;
    String txnRef;

    public String getVpc_Version() {
        return vpc_Version;
    }

    public void setVpc_Version(String vpc_Version) {
        this.vpc_Version = vpc_Version;
    }

    public String getVpc_Currency() {
        return vpc_Currency;
    }

    public void setVpc_Currency(String vpc_Currency) {
        this.vpc_Currency = vpc_Currency;
    }

    public String getSecureCode() {
        return secureCode;
    }

    public void setSecureCode(String secureCode) {
        this.secureCode = secureCode;
    }

    public String getTxnRef() {
        return txnRef;
    }

    public void setTxnRef(String txnRef) {
        this.txnRef = txnRef;
    }

    public Long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }
}
