export function getTotalCost(array: []): number {
  return array.reduce(
    (total: number, el: { amount: number; price: number }) =>
      el.price * (el?.amount ? el.amount : 1) + total,
    0,
  );
}
