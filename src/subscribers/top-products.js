class TopProductsSubscriber {
  constructor({ topProductsService, eventBusService }) {
    this.topProductsService_ = topProductsService;

    eventBusService.subscribe("order.placed", this.handleTopProducts);
  }

  handleTopProducts = async (data) => {
    this.topProductsService_.updateSales(data.id);
  };
}

export default TopProductsSubscriber;