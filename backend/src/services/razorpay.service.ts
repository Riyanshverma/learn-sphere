import axios, { type AxiosInstance } from 'axios';
import type { RazorpayContactParams, RazorpayFundAccountParams } from '../types';

class RazorpayService {
  apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: 'https://api.razorpay.com/v1',
      auth: {
        username: Bun.env.RAZORPAY_KEY_ID,
        password: Bun.env.RAZORPAY_SECRET_KEY,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async createRazorpayContact(params: RazorpayContactParams): Promise<string> {
    try {  
      const response = await this.apiClient.post('/contacts', params);

      return response.data.id;
    } catch (error: any) {
      console.error(error.message)
      throw error
    }
  }
  
  async createRazorpayFundAccount(params: RazorpayFundAccountParams): Promise<string> {
    try {
      const response = await this.apiClient.post('/fund_accounts', params);

      return response.data.id;
    } catch (error: any) {
      console.error(error.message)
      throw error
    }
  }
}

export const razorpayService = new RazorpayService();
