import { type Item } from './item'

export interface Transaction extends Item {
  quantity: number
}
