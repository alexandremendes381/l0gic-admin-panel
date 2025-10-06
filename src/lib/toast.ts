type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

class ToastManager {
  private toasts: HTMLElement[] = [];
  private styleElement: HTMLStyleElement | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.createStyles();
    }
  }

  private createStyles() {
    if (this.styleElement || typeof window === "undefined") return;

    this.styleElement = document.createElement('style');
    this.styleElement.textContent = `
      @keyframes toast-slide-in-right {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes toast-slide-out-right {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
      @keyframes toast-slide-in-left {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes toast-slide-out-left {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(-100%); opacity: 0; }
      }
      @keyframes toast-fade-in {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes toast-fade-out {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
      }
    `;
    if (typeof window !== "undefined") {
      document.head.appendChild(this.styleElement);
    }
  }

  private getToastStyles(type: ToastType): string {
    const baseStyles = `
      position: fixed;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      max-width: 350px;
      min-width: 200px;
      word-wrap: break-word;
    `;

    const typeStyles = {
      success: 'background: #10b981; color: white;',
      error: 'background: #ef4444; color: white;',
      info: 'background: #3b82f6; color: white;',
      warning: 'background: #f59e0b; color: white;'
    };

    return baseStyles + typeStyles[type];
  }

  private getPositionStyles(position: string): string {
    const positions = {
      'top-right': 'top: 20px; right: 20px;',
      'top-left': 'top: 20px; left: 20px;',
      'bottom-right': 'bottom: 20px; right: 20px;',
      'bottom-left': 'bottom: 20px; left: 20px;',
      'top-center': 'top: 20px; left: 50%; transform: translateX(-50%);',
      'bottom-center': 'bottom: 20px; left: 50%; transform: translateX(-50%);'
    };
    return positions[position as keyof typeof positions] || positions['top-right'];
  }

  private getIcon(type: ToastType): string {
    const icons = {
      success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>`,
      error: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>`,
      info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
      </svg>`,
      warning: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
      </svg>`
    };
    return icons[type];
  }

  private getAnimation(position: string): { in: string; out: string } {
    if (position.includes('right')) {
      return { in: 'toast-slide-in-right', out: 'toast-slide-out-right' };
    }
    if (position.includes('left')) {
      return { in: 'toast-slide-in-left', out: 'toast-slide-out-left' };
    }
    return { in: 'toast-fade-in', out: 'toast-fade-out' };
  }

  private show(message: string, type: ToastType, options: ToastOptions = {}) {
    if (typeof window === "undefined") return;
    
    const { duration = 4000, position = 'top-right' } = options;
    
    const toast = document.createElement('div');
    const animations = this.getAnimation(position);
    
    toast.innerHTML = `
      <div style="${this.getToastStyles(type)} ${this.getPositionStyles(position)} animation: ${animations.in} 0.3s ease-out;">
        <div style="display: flex; align-items: center; gap: 8px;">
          ${this.getIcon(type)}
          <span>${message}</span>
        </div>
      </div>
    `;
    
    document.body.appendChild(toast);
    this.toasts.push(toast);
    
    setTimeout(() => {
      const toastElement = toast.querySelector('div') as HTMLElement;
      if (toastElement) {
        toastElement.style.animation = `${animations.out} 0.3s ease-out`;
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
          this.toasts = this.toasts.filter(t => t !== toast);
        }, 300);
      }
    }, duration);

    return toast;
  }

  success(message: string, options?: ToastOptions) {
    return this.show(message, 'success', options);
  }

  error(message: string, options?: ToastOptions) {
    return this.show(message, 'error', options);
  }

  info(message: string, options?: ToastOptions) {
    return this.show(message, 'info', options);
  }

  warning(message: string, options?: ToastOptions) {
    return this.show(message, 'warning', options);
  }

  clear() {
    if (typeof window === "undefined") return;
    
    this.toasts.forEach(toast => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    });
    this.toasts = [];
  }

  destroy() {
    this.clear();
    if (typeof window !== "undefined" && this.styleElement && document.head.contains(this.styleElement)) {
      document.head.removeChild(this.styleElement);
      this.styleElement = null;
    }
  }
}

const toast = new ToastManager();

export default toast;