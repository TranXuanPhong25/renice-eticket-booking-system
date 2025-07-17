export type Seat = {
   id: string;
   eventId: string;
   color: string;
   name: string;
   status: "available" | "selected" | "out";
   price: number;
   
}