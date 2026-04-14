import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom, timeout } from 'rxjs';

type IpVersion = 'IPv4' | 'IPv6' | null;

interface ValidateIpResponse {
  ip: string;
  isValid: boolean;
  version: IpVersion;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly http = inject(HttpClient);
  private readonly apiPath = '/api/validate-ip';

  ipAddress = '';
  isLoading = signal(false);
  errorMessage = signal('');
  result = signal<ValidateIpResponse | null>(null);

  logInputChange(value: string): void {
    console.log('[IP Validator] Input changed:', value);
  }

  async validateIp(): Promise<void> {
    console.log('[IP Validator] Submit triggered. Raw input:', this.ipAddress);

    const normalized = this.ipAddress.trim();

    if (!normalized) {
      console.warn('[IP Validator] Submit blocked: input is empty.');
      this.errorMessage.set('Please enter an IP address.');
      this.result.set(null);
      return;
    }

    console.log('[IP Validator] Sending request.', {
      endpoint: this.apiPath,
      payload: { ip: normalized }
    });

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.result.set(null);

    try {
      const response = await firstValueFrom(
        this.http
          .post<ValidateIpResponse>(this.apiPath, { ip: normalized })
          .pipe(timeout(8000))
      );

      console.log('[IP Validator] Response received:', response);
      this.result.set(response);
    } catch (error) {
      console.error('[IP Validator] Request failed:', error);
      const requestError = error as { name?: string };
      this.errorMessage.set(
        requestError?.name === 'TimeoutError'
          ? 'Validation timed out. Please make sure backend is running on port 3000.'
          : 'Validation request failed. Check backend connectivity.'
      );
    } finally {
      console.log('[IP Validator] Request finished. isLoading -> false');
      this.isLoading.set(false);
    }
  }
}
