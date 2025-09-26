const API_BASE_URL = 'http://localhost:3000';

export interface CustomerData {
  // Required fields
  full_name: string;
  contact_number: string;
  occasion_for_purchase: string;
  
  // Optional fields
  email_address?: string;
  address?: string;
  community?: string;
  sub_community?: string;
  location?: string;
  date_of_birth?: string;
  anniversary_date?: string;
  gender?: string;
  marital_status?: string;
  
  // Purchase history
  purchase_history?: any[];
  
  // Additional customer information
  gift_recipient_relationship?: string;
  items_shown_or_discussed?: string;
  expressed_interest_or_intent?: string;
  in_store_query?: string;
  budget_mentioned?: string;
  frequency_of_visit?: string;
  
  // Legacy fields for backward compatibility
  phone?: string;
  email?: string;
  city?: string;
  dob?: string;
  occasion?: string;
  budget?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: any[];
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          error: errorData.error || `HTTP error! status: ${response.status}`,
          details: errorData.details || [],
        };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  // Get all customers
  async getAllCustomers(): Promise<ApiResponse<CustomerData[]>> {
    return this.request<CustomerData[]>('/customers');
  }

  // Get customer by ID
  async getCustomerById(id: string): Promise<ApiResponse<CustomerData>> {
    return this.request<CustomerData>(`/customers/${id}`);
  }

  // Create a new customer
  async createCustomer(customerData: CustomerData): Promise<ApiResponse<CustomerData>> {
    return this.request<CustomerData>('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  }

  // Update a customer
  async updateCustomer(id: string, customerData: Partial<CustomerData>): Promise<ApiResponse<CustomerData>> {
    return this.request<CustomerData>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  }

  // Delete a customer
  async deleteCustomer(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/customers/${id}`, {
      method: 'DELETE',
    });
  }

  // Check email availability
  async checkEmailAvailability(email: string): Promise<ApiResponse<{ available: boolean }>> {
    return this.request<{ available: boolean }>(`/customers/email/check/${encodeURIComponent(email)}`);
  }
}

export const apiService = new ApiService();
