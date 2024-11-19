import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/clerk-react";
import { useState, useEffect } from 'react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function useSupabaseClient() {
    const { session } = useSession();
    const [client, setClient] = useState(null);
  
    useEffect(() => {
      async function initializeClient() {
        try {
          let headers = {};
          if (session) {
            const token = await session.getToken({ template: 'supabase' });
            headers.Authorization = `Bearer ${token}`;
          }
  
          const newClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            global: { headers }
          });
  
          setClient(newClient);
        } catch (error) {
          console.error("Error initializing Supabase client:", error);
        }
      }
  
      initializeClient();
    }, [session]);
  
    return client;
  }