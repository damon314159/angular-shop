import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { Component, HostListener } from '@angular/core'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'

@Component({
  standalone: true,
  imports: [MatGridListModule, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  // Dependency injection in the constructor
  constructor(private readonly router: Router) {}

  // Define a number of columns for the grid layout
  cols!: number
  // Which is calculated according to the screen width
  calculateCols(): number {
    const windowWidth = window.innerWidth
    if (windowWidth >= 600) return 2
    return 1
  }

  // A method to reassess the columns...
  private updateCols(): void {
    this.cols = this.calculateCols()
  }

  // which is called on initialisation of the component, ...
  ngOnInit(): void {
    this.updateCols()
  }

  // and if the window is resized
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateCols()
  }

  // Router command if the "Shop Now" button in one of the cards is clicked
  async onShopNav(): Promise<void> {
    await this.router.navigate(['/catalogue'])
  }
}
