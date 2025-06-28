import { SlotInput } from "@/components/SlotInput";
import { Card, Tag } from "antd";
import { Controller } from "react-hook-form";

export const SeatList = (props: any) => {
  const { seats, control, maxBuy = 4 } = props;
  return (
    <>
      <Card title="Loại vé" extra="Số lượng">
        <div className="divide-gray-300 divide-y space-y-4">
          {seats.map((seat: any) => (
            <div key={seat.name} className="pb-4">
              <div>{seat.type}</div>
              <div className="flex justify-between">
                <div>{seat.price.toLocaleString()} VNĐ</div>
                <div>
                  {seat.status === "available" ? (
                    <Controller
                      render={({ field }) => <SlotInput {...field} maxValue={maxBuy} />}
                      control={control}
                      name={`seats.${seat.id}`}
                      defaultValue={0}
                    />
                  ) : (
                    <Tag>Hết vé</Tag>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};
