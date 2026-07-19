export type BillingCycle = 'monthly' | 'yearly'
export type SubscriptionStatus = 'active' | 'trial' | 'cancelled'
export type Subscription = { id: string; user_id: string; name: string; category: string; logo?: string | null; cost: number; currency: string; billing_cycle: BillingCycle; purchase_date?: string | null; renewal_date: string; trial_end_date?: string | null; email_used?: string | null; payment_method?: string | null; auto_renew: boolean; notes?: string | null; status: SubscriptionStatus; created_at?: string }
