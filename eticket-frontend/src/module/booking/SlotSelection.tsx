"use client";
import { useForm } from "react-hook-form";
import { SeatList } from "./SeatList";
import { SelectedSeatSummary } from "./SelectedSeatSummary";
import TicketZoneMap from "./TicketZoneMap";

export const SlotSelection = (props: any) => {
  const { eventData } = props;
  const { seats } = eventData;

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      seats: {
        CAT1: 0,
      } as any,
    },
  });

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
      <div className="grid grid-cols-2 gap-4 py-4 h-full">
        <TicketZoneMap seats={eventData.seats} />
        <div className="h-full flex flex-col">
          <SeatList seats={seats} control={control} />
          <div className="mt-4">
            <SelectedSeatSummary selectedSeats={getSelectedSeats()} />
          </div>
        </div>
      </div>
    </>
  );
};
