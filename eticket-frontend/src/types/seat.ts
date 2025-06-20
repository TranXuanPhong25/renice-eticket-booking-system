export type Seat = {
   id: number;
   zoneId: number;
   row: string;
   column: string;
   color: string;
   name: string;
   status: "available" | "selected" | "out";
   price: number;
}