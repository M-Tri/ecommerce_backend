import { Product } from './Products.js';
import { CartItem } from './CartItem.js';
import { DeliveryOption } from './DeliveryOptions.js';
import { Order } from './Orders.js';
import { OrderProduct} from './OrderProduct.js';

// Define associations here
CartItem.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(CartItem, { foreignKey: 'productId' });

export {
  Product,
  CartItem,
  DeliveryOption,
  Order,
  OrderProduct,
};
