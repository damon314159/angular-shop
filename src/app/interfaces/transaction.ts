import { type CategorisedItem } from './categorised-item'

export interface Transaction extends CategorisedItem {
  quantity: number
}
