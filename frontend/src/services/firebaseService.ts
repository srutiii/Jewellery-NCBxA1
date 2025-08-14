import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { CustomerData } from './api';

export interface FirebaseCustomerData extends Omit<CustomerData, 'created_at' | 'updated_at'> {
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface FirebaseApiResponse<T> {
  data?: T;
  error?: string;
  id?: string;
}

class FirebaseService {
  private readonly collectionName = 'customers';

  // Clean customer data by removing undefined values and converting to Firestore-compatible format
  private cleanCustomerData(data: CustomerData): any {
    const cleaned: any = {};
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // Handle arrays (like purchase_history)
        if (Array.isArray(value)) {
          if (value.length > 0) {
            cleaned[key] = value.map(item => this.cleanCustomerData(item));
          }
        }
        // Handle objects (like gemstone_details, discount_applied)
        else if (typeof value === 'object' && value !== null) {
          const cleanedObj = this.cleanCustomerData(value);
          if (Object.keys(cleanedObj).length > 0) {
            cleaned[key] = cleanedObj;
          }
        }
        // Handle primitive values
        else {
          cleaned[key] = value;
        }
      }
    });
    
    return cleaned;
  }

  // Create a new customer
  async createCustomer(customerData: CustomerData): Promise<FirebaseApiResponse<FirebaseCustomerData>> {
    try {
      // Filter out undefined values and convert to Firestore-compatible data
      const cleanData = this.cleanCustomerData(customerData);
      
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...cleanData,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
      });

      const newCustomer = await getDoc(docRef);
      return {
        data: newCustomer.data() as FirebaseCustomerData,
        id: docRef.id
      };
    } catch (error) {
      console.error('Error creating customer:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to create customer'
      };
    }
  }

  // Get all customers
  async getAllCustomers(): Promise<FirebaseApiResponse<FirebaseCustomerData[]>> {
    try {
      const q = query(collection(db, this.collectionName), orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const customers: FirebaseCustomerData[] = [];
      querySnapshot.forEach((doc) => {
        customers.push({
          id: doc.id,
          ...doc.data()
        } as FirebaseCustomerData);
      });

      return { data: customers };
    } catch (error) {
      console.error('Error fetching customers:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch customers'
      };
    }
  }

  // Get customer by ID
  async getCustomerById(id: string): Promise<FirebaseApiResponse<FirebaseCustomerData>> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { error: 'Customer not found' };
      }

      return {
        data: {
          id: docSnap.id,
          ...docSnap.data()
        } as FirebaseCustomerData
      };
    } catch (error) {
      console.error('Error fetching customer:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch customer'
      };
    }
  }

  // Update a customer
  async updateCustomer(id: string, customerData: Partial<CustomerData>): Promise<FirebaseApiResponse<FirebaseCustomerData>> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...customerData,
        updated_at: Timestamp.now()
      });

      const updatedDoc = await getDoc(docRef);
      return {
        data: {
          id: updatedDoc.id,
          ...updatedDoc.data()
        } as FirebaseCustomerData
      };
    } catch (error) {
      console.error('Error updating customer:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to update customer'
      };
    }
  }

  // Delete a customer
  async deleteCustomer(id: string): Promise<FirebaseApiResponse<void>> {
    try {
      await deleteDoc(doc(db, this.collectionName, id));
      return { data: undefined };
    } catch (error) {
      console.error('Error deleting customer:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to delete customer'
      };
    }
  }

  // Search customers by name or contact number
  async searchCustomers(searchTerm: string): Promise<FirebaseApiResponse<FirebaseCustomerData[]>> {
    try {
      const q = query(collection(db, this.collectionName), orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const customers: FirebaseCustomerData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (
          data.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.contact_number?.includes(searchTerm) ||
          data.phone?.includes(searchTerm)
        ) {
          customers.push({
            id: doc.id,
            ...data
          } as FirebaseCustomerData);
        }
      });

      return { data: customers };
    } catch (error) {
      console.error('Error searching customers:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to search customers'
      };
    }
  }
}

export const firebaseService = new FirebaseService();
