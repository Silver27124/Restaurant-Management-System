import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer">
      <div class="footer-content">
        <span>🍴 Saveur Restaurant Management System</span>
        <span>© {{ year }} — Built with Angular 22</span>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #1a1a2e;
      color: #a0a0b0;
      padding: 1rem 2rem;
      margin-top: auto;
    }
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
      font-size: 0.8rem;
      max-width: 1400px;
      margin: 0 auto;
    }
  `]
})
export class FooterComponent {
  year = new Date().getFullYear();
}

