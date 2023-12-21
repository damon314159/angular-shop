import { type Item } from './item'

// An item when retrieved by the data service is...
// given its category as a property for convenience
export interface CategorisedItem extends Item {
  category: string
}
