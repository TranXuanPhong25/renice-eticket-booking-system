"use client";

import { Button, InputNumber } from "antd";
import { useState } from "react";

export const SlotInput = (props: any) => {
  const { value = 0, onChange, maxValue = 4 } = props;

  const increase = () => {
    if (value < maxValue) {
      onChange(value + 1);
    }
  };
  
  const decrease = () => {
    if (value <= 0) {
      onChange(0);
    } else {
      onChange(value - 1);
    }
  };
  
  const handleInputChange = (newValue: number | null) => {
    // Nếu người dùng xóa hết giá trị (null) hoặc nhập 0, set giá trị là 0
    if (newValue === null || newValue < 0) {
      onChange(0);
    } 
    // Nếu giá trị vượt quá maxValue, giới hạn tại maxValue
    else if (newValue > maxValue) {
      onChange(maxValue);
    }
    // Nếu giá trị hợp lệ, cập nhật
    else {
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button 
        onClick={decrease} 
        disabled={value <= 0}
      >
        -
      </Button>
      <InputNumber 
        value={value} 
        onChange={handleInputChange}
        min={0}
        max={maxValue}
        onPressEnter={(e) => {
          // Đảm bảo khi Enter, giá trị được cập nhật chính xác
          const target = e.target as HTMLInputElement;
          const val = parseInt(target.value);
          if (!isNaN(val)) {
            handleInputChange(val);
          }
        }}
      />
      <Button 
        onClick={increase}
        disabled={value >= maxValue}
      >
        +
      </Button>
    </div>
  );
};
