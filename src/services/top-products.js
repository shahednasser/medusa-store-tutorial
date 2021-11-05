import { BaseService } from "medusa-interfaces";

class TopProductsService extends BaseService {
  constructor({ productService, orderService }) {
    super();

    this.productService_ = productService;
    this.orderService_ = orderService;
  }

  async getTopProducts() {
    const products = await this.productService_.list({
      status: ['published']
    }, {
      relations: ["variants", "variants.prices", "options", "options.values", "images", "tags", "collection", "type"]
    });

    products.sort((a, b) => {
      const aSales = a.metadata && a.metadata.sales ? a.metadata.sales : 0;
      const bSales = b.metadata && b.metadata.sales ? b.metadata.sales : 0;

      return aSales > bSales ? -1 : (aSales < bSales ? 1 : 0);
    });

    return products.slice(0, 4);
  }

  async updateSales(orderId) {
    const order = await this.orderService_.retrieve(orderId, {
      relations: ["items", "items.variant", "items.variant.product"]
    });

    if (order.items && order.items.length) {
      for (let i = 0; i < order.items.length; i++) {
        const item = order.items[i];

        //retrieve product by id
        const product = await this.productService_.retrieve(item.variant.product.id, {
          relations: ["variants", "variants.prices", "options", "options.values", "images", "tags", "collection", "type"]
        });

        const sales = product.metadata && product.metadata.sales ? product.metadata.sales : 0;

        //update product
        await this.productService_.update(product.id, {
          metadata: { sales: sales + 1 }
        });
        
      }
    }
  }
}

export default TopProductsService;