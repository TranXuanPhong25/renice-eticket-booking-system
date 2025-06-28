import { Button, Card, Tooltip, Divider } from "antd";

export const SelectedSeatSummary = (props: any) => {
  const { selectedSeats, maxBuy = 4, totalTickets = 0 } = props;
  
  // Tính tổng tiền
  const totalPrice = selectedSeats.reduce(
    (sum: number, seat: any) => sum + (seat.price * seat.quantity),
    0
  );
  
  // Kiểm tra xem có vượt quá giới hạn không
  const exceedLimit = totalTickets > maxBuy;
  
  return (
    <>
      <Card
        size="small"
        title="Vé đã chọn"
        extra={<span className="text-xs text-gray-500">Giới hạn: {maxBuy} vé</span>}
        actions={[
          <Tooltip 
            title={exceedLimit ? `Bạn chỉ có thể mua tối đa ${maxBuy} vé` : (selectedSeats.length === 0 ? "Vui lòng chọn ít nhất 1 vé" : "")} 
            key="continue"
          >
            <Button 
              size="large" 
              className="w-full mx-2" 
              type="primary"
              disabled={exceedLimit || selectedSeats.length === 0}
            >
              {exceedLimit ? `Vượt quá giới hạn ${maxBuy} vé` : "Thanh toán"}
            </Button>
          </Tooltip>,
        ]}
      >
        {selectedSeats.length > 0 ? (
          <div className="space-y-3">
            {selectedSeats.map((seat: any) => (
              <div key={seat.id} className="rounded-lg border border-gray-200">
                <div className="flex justify-between gap-1 p-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs">Hạng vé</span>
                    <div className="text-sm">{seat.name}</div>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-xs">Số lượng</span>
                    <span className="text-sm">x{seat.quantity}</span>
                  </div>
                </div>
                <Divider className="my-1" />
                <div className="flex justify-between px-3 pb-3">
                  <span className="text-xs">Đơn giá:</span>
                  <span className="text-sm font-medium">{seat.price.toLocaleString()} VNĐ</span>
                </div>
              </div>
            ))}
            
            <div className="pt-2 flex justify-between font-medium">
              <span>Tổng cộng:</span>
              <span>{totalPrice.toLocaleString()} VNĐ</span>
            </div>
            
            <div className="text-xs text-gray-500 pt-1">
              Đã chọn: {totalTickets}/{maxBuy} vé
            </div>
          </div>
        ) : (
          <div className="py-2 text-center text-gray-500">
            Bạn chưa chọn vé, vui lòng lựa chọn vé để thanh toán!
          </div>
        )}
      </Card>
    </>
  );
};
