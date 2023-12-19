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
  constructor(private readonly router: Router) {}

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

  async onShopNav(): Promise<void> {
    await this.router.navigate(['/catalogue'])
  }
}
