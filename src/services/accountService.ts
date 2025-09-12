import { supabase } from "@/integrations/supabase/client";

const API_BASE_URL = 'https://api.costras.com';

export interface DeleteAccountError extends Error {
  status?: number;
}

export const deleteAccount = async (userId: string, password?: string): Promise<void> => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    // Get the current session to get the access token
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.access_token) {
      const error = new Error("Authentication required") as DeleteAccountError;
      error.status = 401;
      throw error;
    }

    // Make the API call to delete the account
    const requestBody = password ? { password } : {};
    const response = await fetch(`${API_BASE_URL}/api/delete-account/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete account';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // Use default message if response is not JSON
        if (response.status === 400) {
          errorMessage = 'Password is required for email accounts';
        } else if (response.status === 403) {
          errorMessage = 'Invalid password. Please try again.';
        } else if (response.status === 404) {
          errorMessage = 'Account not found';
        } else if (response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      }
      
      const error = new Error(errorMessage) as DeleteAccountError;
      error.status = response.status;
      throw error;
    }

    return;
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const networkError = new Error('Network error. Please check your connection.') as DeleteAccountError;
      networkError.status = 0;
      throw networkError;
    }
    
    throw error;
  }
};

export const exportUserData = async (userId: string): Promise<void> => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.access_token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${API_BASE_URL}/api/export-data/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to export data');
    }

    // The actual implementation would handle the data export
    // For now, we'll just return success
    return;
  } catch (error: any) {
    throw error;
  }
};