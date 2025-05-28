export const getMaxMinPrice = (seatMaps: any) => {
  const pricesOnly = seatMaps.map((seat: any) => seat.price);
  const maxPrice = pricesOnly.reduce((a: any, b: any) => (a > b ? a : b));
  const minPrice = pricesOnly.reduce((a: any, b: any) => (a < b ? a : b));
  return {
    maxPrice: maxPrice,
    minPrice: minPrice,
  };
};
