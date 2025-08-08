import { Product } from './Products.js';
import { CartItem } from './CartItem.js';
import { DeliveryOption } from './DeliveryOptions.js';
import { Order } from './Orders.js';
import { OrderProduct } from './OrderProduct.js';

// CartItem <-> Product
CartItem.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(CartItem, { foreignKey: 'productId' });

// CartItem <-> DeliveryOption ✅ Add this
CartItem.belongsTo(DeliveryOption, { foreignKey: 'deliveryOptionId' });
DeliveryOption.hasMany(CartItem, { foreignKey: 'deliveryOptionId' });

// Order <-> Product (many-to-many via OrderProduct)
Order.belongsToMany(Product, { through: OrderProduct, foreignKey: 'orderId' });
Product.belongsToMany(Order, { through: OrderProduct, foreignKey: 'productId' });

// OrderProduct <-> Product
OrderProduct.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(OrderProduct, { foreignKey: 'productId' });

export {
  Product,
  CartItem,
  DeliveryOption,
  Order,
  OrderProduct,
};
