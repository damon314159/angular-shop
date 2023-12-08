import { type ComponentFixture, TestBed } from '@angular/core/testing'

import { ProductBrowseComponent } from './product-browse.component'

describe('ProductBrowseComponent', () => {
  let component: ProductBrowseComponent
  let fixture: ComponentFixture<ProductBrowseComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductBrowseComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(ProductBrowseComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
