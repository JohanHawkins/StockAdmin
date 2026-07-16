import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class ToastComponent implements OnChanges {
  @Input() message = '';

  @Input() type: 'success' | 'error' = 'success';

  @Input() visible = false;

  @Input() duration = 3000;

  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.startTimer();
    }
  }

  private startTimer(): void {
    this.clearTimer();

    this.timeoutId = setTimeout(() => {
      this.visible = false;
    }, this.duration);
  }

  private clearTimer(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  close(): void {
    this.clearTimer();
    this.visible = false;
  }
}
