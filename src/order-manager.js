class OrderManager {
  constructor() {
    this.ORDER_TYPES = ['buy', 'sell'];
    this._orders = [];
    this._executedOrders = [];
  }

  processOrder(order) {
    const matchedOrders = this.findAllMatches(order);
    if (!matchedOrders.length) {
      return this.add(order);
    }
    let operationInProgress = true;
    while(operationInProgress) {
      const bestMatch = matchedOrders.shift();
      if (!bestMatch) {
        this.add(order);
        operationInProgress = false;
        continue;
      }
      if (bestMatch.amount >= order.amount) {
        this.closeOrder(new Order({
          ...order,
          price: bestMatch.price
        }));
        if (bestMatch.amount === order.amount) {
          this.closeOrder(new Order(bestMatch));
        } else {
          this.update(bestMatch.id, {
            ...bestMatch,
            amount: bestMatch.amount - order.amount
          })
        }
        operationInProgress = false;
      } else {
        // this.closeOrder(new Order(bestMatch));
        this.closeOrder(new Order({
          ...order,
          price: bestMatch.price,
          amount: bestMatch.amount
        }));
        this.remove(bestMatch.id);
        order = {
          ...order,
          amount: order.amount - bestMatch.amount
        }
      }
    }
  }

  findAllMatches ({type, price}) {
    switch (type) {
      case this.ORDER_TYPES[0]:
        return (this.orders.map((item, id) => ({...item, id}))
          .filter(order => type !== order.type && price >= order.price))
          .sort((a, b) => b.price - a.price);
      case this.ORDER_TYPES[1]:
        return (this.orders.map((item, id) => ({...item, id}))
          .filter(order => type !== order.type && price <= order.price))
          .sort((a, b) => a.price - b.price);
    }
  }

  add(order) {
    return this._orders.push(order);
  }

  update(id, order) {
    return this._orders[id] = order;
  }

  remove(id) {
    this._orders.splice(id, 1);
  }

  closeOrder(order) {
    return this._executedOrders.push(order);
  }

  get executedOrders() {
    return this._executedOrders.map(({ id, ...other }) => other);
  }

  get orders() {
    return this._orders;
  }
}

class Order {
  constructor({price, type, amount}) {
    this.price = price;
    this.type = type;
    this.amount = amount;
    this.date = new Date();
  }
}

module.exports = { OrderManager };
