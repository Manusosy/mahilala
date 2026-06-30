import { useState } from 'react';
import { supabase } from '@workspace/esaora-core/lib/supabase';

export function useNewsletterSubscribe(onSuccess?: () => void) {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribing(true);
    setError('');
    try {
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert({ email: email.trim(), is_subscribed: true });
      if (insertError && insertError.code !== '23505') throw insertError;
      setSubscribed(true);
      setEmail('');
      onSuccess?.();
    } catch {
      setError('Could not subscribe. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  return { email, setEmail, subscribing, subscribed, error, handleSubscribe };
}
