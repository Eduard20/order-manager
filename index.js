const orderBook = require("./orders.json");
const { OrderManager } = require("./order-manager");

(async () => {
  try {
    const manager = new OrderManager();
    for (const order of orderBook) {
      manager.processOrder(order);
    }
    console.log(manager.executedOrders);
    console.log(manager.ordersBook);
  } catch (err) {
    console.error(err);
  }
})();
