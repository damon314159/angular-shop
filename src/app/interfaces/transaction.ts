import { type CategorisedItem } from './categorised-item'

// The cart stores transactions, which are categorised items with a quantity attached
export interface Transaction extends CategorisedItem {
  quantity: number
}
