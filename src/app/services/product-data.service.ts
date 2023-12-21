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
  // Dependency injection in constructor
  constructor(private readonly http: HttpClient) {}

  // Would be replaced with the URL for the API to load data from in a real app.
  // Since a json of data was provided for use in the project, we set the URL...
  // to its location in the assets directory. This can be considered demonstrative
  private readonly apiURL = 'assets/'

  // Fetch the data for the products at the given API location
  // Return an Observable of an array of CategorisedItem typed objects
  getProducts(): Observable<CategorisedItem[]> {
    // The http request itself
    return this.http.get<ApiResponse<Item>>(this.apiURL + 'database/shopItems.json').pipe(
      map((response: ApiResponse<Item>): CategorisedItem[] =>
        Object.entries(response)
          // Then take each response Item from the database, which are organised by categories, ...
          // and assign their category to them as a property for convenience
          .map(([category, items]: [string, Item[]]) => items.map((item: Item) => Object.assign(item, { category })))
          .flat()
          // Adjust the URL to the image to the same API location
          .map((item: CategorisedItem) => Object.assign(item, { image: this.apiURL + item.image }))
      ),
      catchError(this.handleError.bind(this))
    )
  }

  // A similar fetch to the above more general method, but for a single product.
  // The product must be identified by both category and ID since the ID is only...
  // unique up to within its category, and may be shared across other categories
  getProductByCategoryId(category: string, id: number): Observable<CategorisedItem | undefined> {
    return this.getProducts().pipe(
      // Filter the returned set of products for only one that matches, if any
      map((products: CategorisedItem[]) => products.find((p) => p.category === category && p.id === id)),
      catchError(this.handleError.bind(this))
    )
  }

  // Simplistic error handling for anything thrown by the http requests.
  // Log a message describing it, and then pass the error back to the Observable chain
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
