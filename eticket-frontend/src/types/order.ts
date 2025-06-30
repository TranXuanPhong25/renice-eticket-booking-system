export type SeatSelection = {
   zoneId: string;
   quantity: number;
}
export type OrderRequest = {
   userId: string;
   customerName: string;
   customerEmail: string;
   seatSelections: SeatSelection[];
   totalAmount: number;
}
export type OrderResponse = {
   id: string;
   customerName: string;
   customerEmail: string;
   orderTime: number;
   totalAmount: number;
   orderStatus: string;
   status: string;
   tickets: TicketResponse[];
}

export type TicketResponse = {
   id: string;
   zoneId: string;
   name: string;
   email: string;
   amount: number;
   orderId: string;
}