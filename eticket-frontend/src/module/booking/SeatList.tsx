import { SlotInput } from "@/components/SlotInput";
import { Card, Divider, Tag } from "antd";
import { Controller } from "react-hook-form";

export const SeatList = (props: any) => {
  const { seats, control, maxBuy = 4 } = props;
  return (
    <>
      <Card title="Loại vé" extra="Số lượng">
        <div className="divide-gray-300 divide-y space-y-4">
          {seats.map((seat: any) => (
            <div key={seat.name} className="pb-4 relative">
              <span className="absolute !w-[5px] !h-[100%] bottom-2 -left-4 rounded-full" style={{ backgroundColor: seat.color }} ></span>

              <div className="flex items-center mb-2 "> 
                <h1>{seat.name}</h1>
              </div>
              <div className="flex justify-between items-center">
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
