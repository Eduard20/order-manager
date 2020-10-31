const orderBook = require("../orders.json");
const { OrderManager } = require("../order-manager-2");

describe("OrderManager - class", () => {
  test("it should return proper values", () => {
    const manager = new OrderManager();
    orderBook.forEach((order) => {
      manager.processOrder(order);
    });
    expect(manager.executedOrders).toEqual([
      expect.objectContaining({
        price: 101,
        amount: 2.25,
        type: 'sell'
      }),
      expect.objectContaining({
        price: 100.55,
        amount: 2.734,
        type: 'sell'
      }),
      expect.objectContaining({
        price: 100.75,
        amount: 0.5,
        type: 'buy'
      }),
    ]);
  });
});
