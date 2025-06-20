"use client";

import { useState } from "react";
import { Button, Card, Modal, Badge } from "antd";
import { IoEyeOutline } from "react-icons/io5";
import TicketZoneMap from "@/module/booking/TicketZoneMap";
import { Seat } from "@/types/seat";


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

export const SeatMapPreview = ({ seats }: any) => {
   const [isModalOpen, setIsModalOpen] = useState(false);

   const showModal = () => {
      setIsModalOpen(true);
   };

   const handleClose = () => {
      setIsModalOpen(false);
   };

   return (
      <>
         <Card className="shadow-sm">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-2xl font-semibold text-gray-800">Sơ đồ chỗ ngồi</h2>
               <Button
                  type="primary"
                  icon={<IoEyeOutline />}
                  onClick={showModal}
                  className="bg-blue-500 hover:bg-blue-600"
               >
                  Xem chi tiết
               </Button>
            </div>

            {/* Preview Map - Small version */}
            <div className="relative w-full h-[300px] overflow-hidden rounded-lg border">
               <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 400 600"
                  className="bg-gray-50"
               >
                  {seats.map((zone: any) => (
                     <polygon
                        key={zone.id}
                        points={zone.points}
                        fill={zone.status === "out" ? "#adb5bd" : zone.color}
                        stroke="#000"
                        strokeWidth="1"
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                     />
                  ))}

                  {/* Stage indicator */}
                  <rect
                     x="150"
                     y="50"
                     width="100"
                     height="30"
                     fill="#2563eb"
                     rx="5"
                  />
                  <text
                     x="200"
                     y="70"
                     textAnchor="middle"
                     fill="white"
                     fontSize="14"
                     fontWeight="bold"
                  >
                     SÂNG KHẤU
                  </text>
               </svg>

               {/* Overlay with "Click to view details" */}
               <div
                  className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center cursor-pointer hover:bg-opacity-30 transition-all group"
                  onClick={showModal}
               >
                  <div className="bg-white bg-opacity-90 px-6 py-3 rounded-lg text-center shadow-md group-hover:bg-opacity-100 transition-all">
                     <IoEyeOutline size={24} className="mx-auto mb-2 text-blue-600" />
                     <p className="text-sm font-medium text-gray-700">Nhấn để xem chi tiết</p>
                     <p className="text-xs text-gray-500 mt-1">Chọn vị trí ngồi mong muốn</p>
                  </div>
               </div>
            </div>

            {/* Legend */}

            {/* Ticket Pricing */}
            <TicketPricing seats={seats} />

         </Card>

         {/* Modal with full size map */}
         <Modal
            title={
               <div className="flex items-center gap-2">
                  <IoEyeOutline className="text-blue-600" />
                  <span>Sơ đồ chỗ ngồi chi tiết</span>
               </div>
            }
            open={isModalOpen}
            onCancel={handleClose}
            footer={
               <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                     Nhấp vào các khu vực để xem thông tin chi tiết
                  </div>
                  <Button onClick={handleClose}>Đóng</Button>
               </div>
            }
            width={900}
            className="seat-map-modal"
            centered
         >
            <div className="p-6">
               <div className="mb-4 text-center">
                  <p className="text-gray-600">Chọn khu vực bằng cách nhấp vào sơ đồ bên dưới</p>
               </div>

               <TicketZoneMap seats={seats} />

               {/* Seat pricing table in modal */}
               <div className="mt-8">
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                     💺 Bảng giá vé chi tiết
                  </h4>
                  <div className="grid gap-3">
                     {seats.map((seat:Seat) => (
                        <div key={seat.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border hover:shadow-md transition-shadow">
                           <div className="flex items-center gap-3">
                              <div
                                 className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                                 style={{ backgroundColor: seat.status === 'out' ? '#adb5bd' : seat.color }}
                              ></div>
                              <div>
                                 <span className="font-medium text-gray-800">{seat.name}</span>
                                 <Badge
                                    status={seat.status === 'available' ? 'success' : seat.status === 'out' ? 'error' : 'warning'}
                                    text={seat.status === 'available' ? 'Còn vé' : seat.status === 'out' ? 'Hết vé' : 'Sắp hết'}
                                    className="ml-3"
                                 />
                              </div>
                           </div>
                           <div className="text-right">
                              <div className="text-xl font-bold text-blue-600">
                                 {seat.price.toLocaleString('vi-VN')}đ
                              </div>
                              <div className="text-sm text-gray-500">/ vé</div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </Modal>
      </>
   );
};
