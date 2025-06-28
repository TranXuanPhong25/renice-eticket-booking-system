"use client";

import { useState } from "react";
import { Button, Card, Modal, Badge, Image } from "antd";
import { IoEyeOutline } from "react-icons/io5";
import { Seat } from "@/types/seat";
import { EventDetails } from "@/hooks/useGetEventById";


const TicketPricing = ({ seats }: { seats: Seat[] }) => {
   return (
      <div className="bg-white mt-6">
         <h3 className="text-xl font-semibold mb-4 text-gray-800">Bảng giá vé</h3>
         <div className="space-y-3">
            {seats.map((seat) => (
               <div key={seat.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                     <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: seat.color }}
                     ></div>
                     <span className="font-medium text-gray-700">{seat.name}</span>
                     <Badge
                        status={seat.status === 'available' ? 'success' : seat.status === 'out' ? 'error' : 'warning'}
                        text={seat.status === 'available' ? 'Còn vé' : seat.status === 'out' ? 'Hết vé' : 'Sắp hết'}
                     />
                  </div>
                  <div className="text-lg font-semibold text-blue-600">
                     {seat.price.toLocaleString('vi-VN')} VNĐ
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

export const SeatMapPreview = ({ event }: { event: EventDetails }) => {
   const { zones, zoneMap } = event;
   let seats = zones || [];
   const [isModalOpen, setIsModalOpen] = useState(false);

   const showModal = () => {
      setIsModalOpen(true);
   };

   const handleClose = () => {
      setIsModalOpen(false);
   };

   return (
      <>
         <Card className="shadow-sm ">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-2xl font-semibold text-gray-800">Sơ đồ chỗ ngồi</h2>

            </div>

            {/* Preview Map - Small version */}
            <div className="relative w-full overflow-hidden rounded-lg">
               <Image
                  src={zoneMap}
                  alt="Zone Map"
                  className="rounded-lg "
                  preview={true}
                  style={{ height: '100%',width: '100vw' }}
               />

            </div>

            <TicketPricing seats={seats} />

         </Card>


      </>
   );
};
