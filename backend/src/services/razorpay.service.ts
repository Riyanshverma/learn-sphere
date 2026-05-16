import axios, { type AxiosInstance } from 'axios';

import type { RazorpayContactParams, RazorpayFundAccountParams, RazorpayPayoutType } from '../types';

import { ConfirmEmployeePayrollByOnlineType } from '../validations';

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
      const { data } = await this.apiClient.post('/contacts', params);

      return data.id;
    } catch (error: any) {
      console.error(error.message)
      throw error
    }
  }
  
  async createRazorpayFundAccount(params: RazorpayFundAccountParams): Promise<string> {
    try {
      const { data } = await this.apiClient.post('/fund_accounts', params);

      return data.id;
    } catch (error: any) {
      console.error(error.message)
      throw error
    }
  }

  async createRazorpayPayout(params: ConfirmEmployeePayrollByOnlineType): Promise<any> {
    try {
      const { data } = await this.apiClient.post('/payouts', {
        account_number: Bun.env.RAZORPAY_CUSTOMER_IDENTIFIER,
        fund_account_id: params.razorpay_fund_account_id,
        amount: params.net_salary * 100,
        currency: "INR",
        mode: "IMPS",
        purpose: "salary",
        queue_if_low_balance: true, 
        reference_id: params.employee_id,
        narration: "Salary Payout",
      }, {
        headers: {
          'X-Payout-Idempotency': params.payroll_id,
        },
      });

      return data;
    } catch (error: any) {
      console.error(error.message)
      throw error
    }
  }
}

export const razorpayService = new RazorpayService();
