import { supabase } from "@/lib/supabase";

export interface DeleteAccountError extends Error {
  status?: number;
}

export const deleteAccount = async (userId: string, password: string): Promise<void> => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!password) {
    throw new Error("Password is required");
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
    const response = await fetch(`/api/delete-account/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || 'Failed to delete account') as DeleteAccountError;
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

    const response = await fetch(`/api/export-data/${userId}`, {
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