"use client";
import { useForm } from "react-hook-form";
import { SeatList } from "./SeatList";
import { SelectedSeatSummary } from "./SelectedSeatSummary";
import { Image, Alert } from "antd";
import { useEffect, useState } from "react";

export const SlotSelection = (props: any) => {
  const { eventData } = props;
  const { zones: seats } = eventData;
  const maxBuy = eventData.maxBuy || 4; // Lấy giới hạn mua vé từ eventData hoặc mặc định là 4
  const [totalTickets, setTotalTickets] = useState(0);
  const [exceedLimit, setExceedLimit] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      seats: {
        CAT1: 0,
      } as any,
    },
  });

  const watchAllFields = watch();

  // Theo dõi tổng số vé được chọn
  useEffect(() => {
    if (watchAllFields.seats) {
      const total = Object.values(watchAllFields.seats).reduce(
        (sum: number, quantity: any) => sum + (parseInt(quantity) || 0),
        0
      );
      setTotalTickets(total);
      setExceedLimit(total > maxBuy);

      // Nếu tổng số vé vượt quá giới hạn, điều chỉnh số lượng vé về 0 cho lựa chọn mới nhất
      if (total > maxBuy) {
        console.warn(`Tổng số vé (${total}) vượt quá giới hạn cho phép (${maxBuy})`);
      }
    }
  }, [watchAllFields, maxBuy]);

  const getSelectedSeats = () => {
    const values = watch();
    const seatKeys = Object.keys(values.seats);
    const selectedSeatKeys = seatKeys.filter(
      (seatKey: any) => values.seats[seatKey] > 0
    );
    const selectedSeats = seats
      .filter((seat: any) => selectedSeatKeys.includes(seat.id))
      .map((x: any) => ({
        ...x,
        quantity: values.seats[x.id],
      }));
    return selectedSeats;
  };

  return (
    <>
      {exceedLimit && (
        <Alert
          message={`Bạn chỉ có thể mua tối đa ${maxBuy} vé cho sự kiện này.`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      <div className="grid grid-cols-2 gap-4 py-4 h-full">
        <div className="w-full rounded-2xl flex items-center ">
          <Image 
          preview={true}
          className=" shadow-2xl !w-screen"
          src={eventData.zoneMap || eventData.image}
          alt={eventData.name}
          style={{ objectFit: "cover" }}
          fallback="https://via.placeholder.com/600x400?text=Không+có+sơ+đồ+khu+vực"
        />
        </div>
        <div className="h-full flex flex-col">
          <SeatList seats={seats} control={control} maxBuy={maxBuy} />
          <div className="mt-4">
            <SelectedSeatSummary 
              selectedSeats={getSelectedSeats()} 
              maxBuy={maxBuy}
              totalTickets={totalTickets}
            />
          </div>
        </div>
      </div>
    </>
  );
};
