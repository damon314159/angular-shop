import { CommonModule } from '@angular/common'
import { Component, HostListener } from '@angular/core'
import { MatGridListModule } from '@angular/material/grid-list'

@Component({
  standalone: true,
  imports: [MatGridListModule, CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  cols!: number

  calculateCols(): number {
    const windowWidth = window.innerWidth
    if (windowWidth >= 600) return 2
    return 1
  }

  private updateCols(): void {
    this.cols = this.calculateCols()
  }

  ngOnInit(): void {
    this.updateCols()
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateCols()
  }
}
