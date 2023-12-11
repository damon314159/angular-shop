import { CommonModule } from '@angular/common'
import { Component, HostListener, type TemplateRef, ViewChild } from '@angular/core'
import { MatGridListModule } from '@angular/material/grid-list'

export interface Tile {
  name: string
  template: TemplateRef<any>
  cols: number
  rows: number
}

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [MatGridListModule, CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  @ViewChild('tileOne') tileOneTemplate!: TemplateRef<any>
  @ViewChild('tileTwo') tileTwoTemplate!: TemplateRef<any>
  @ViewChild('tileThree') tileThreeTemplate!: TemplateRef<any>

  tiles: Tile[] = [
    { name: 'tileOne', template: this.tileOneTemplate, cols: 1, rows: 1 },
    { name: 'tileTwo', template: this.tileTwoTemplate, cols: 1, rows: 2 },
    { name: 'tileThree', template: this.tileThreeTemplate, cols: 1, rows: 1 }
  ]

  cols!: number

  getTileTemplate(tile: Tile): TemplateRef<any> {
    return tile.template
  }

  ngAfterViewInit(): void {
    this.tiles.forEach((tile) => {
      tile.template = this.getTemplateByName(tile.name)
    })
  }

  private getTemplateByName(name: string): TemplateRef<any> {
    switch (name) {
      case 'tileOne':
        return this.tileOneTemplate
      case 'tileTwo':
        return this.tileTwoTemplate
      case 'tileThree':
        return this.tileThreeTemplate
      default:
        return this.tileOneTemplate
    }
  }

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
