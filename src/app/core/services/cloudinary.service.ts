import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs'
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private http = inject(HttpClient);

  private uploadUrl = `${environment.apiUrl}upload/image`;

  constructor() { }

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)

    try {
      console.log('Uploading to backend:', {
        url: this.uploadUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        token: sessionStorage.getItem('token') ? 'Present' : 'Missing'
      });

      const response = await firstValueFrom(
        this.http.post<{ success: boolean; url: string }>(this.uploadUrl, formData)
      );
      console.log('Response from backend:', response)
      return response.url
    } catch (error: any) {
      console.error('Error uploading image:', error)
      console.error('Full error object:', error);
      console.error('Error details:', {
        status: error?.status,
        statusText: error?.statusText,
        message: error?.message,
        error: error?.error,
        url: error?.url
      });
      throw error;
    }
  }

}
