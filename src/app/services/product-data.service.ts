import { Injectable } from '@angular/core'
import { HttpClient, type HttpErrorResponse } from '@angular/common/http'
import { type Observable, catchError, throwError, map } from 'rxjs'
import { type Item } from '../interfaces/item'
import { type CategorisedItem } from '../interfaces/categorised-item'
import { type ApiResponse } from '../interfaces/api-response'

@Injectable({
  providedIn: 'root'
})
export class ProductDataService {
  constructor(private readonly http: HttpClient) {}

  private readonly apiURL = '../../assets/'

  getProducts(): Observable<CategorisedItem[]> {
    return this.http.get<ApiResponse<Item>>(this.apiURL + 'database/shopItems.json').pipe(
      map((response: ApiResponse<Item>) =>
        Object.entries(response)
          .map(([category, items]: [string, Item[]]) => items.map((item: Item) => Object.assign(item, { category })))
          .flat()
          .map((item: CategorisedItem) => Object.assign(item, { image: this.apiURL + item.image }))
      ),
      catchError(this.handleError.bind(this))
    )
  }

  getProductByCategoryId(category: string, id: number): Observable<CategorisedItem | undefined> {
    return this.getProducts().pipe(
      map((products: CategorisedItem[]) => products.find((p) => p.category === category && p.id === id)),
      catchError(this.handleError.bind(this))
    )
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage: string
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`
    } else {
      errorMessage = `Server returned code: ${err.status}, error message: ${err.message}`
    }
    console.error(errorMessage)
    return throwError(() => errorMessage)
  }
}
