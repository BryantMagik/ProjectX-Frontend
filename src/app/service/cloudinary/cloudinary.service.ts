import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  private cloudName = 'dk5b2zjck'
  private uploadPreset = 'jiro_uploads'
  private baseUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`

  constructor(private http: HttpClient) { }

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', this.uploadPreset)

    try {
      const response = await firstValueFrom(
        this.http.post<any>(this.baseUrl, formData)
      );
      console.log('Response from Cloudinary:', response)
      return response.secure_url
    } catch (error) {
      console.error('Error uploading image:', error)
      throw new Error('Error uploading image to Cloudinary')
    }
  }

}
