import { supabase } from './supabase'
import type { Subscription } from '../types'
export async function getSubscriptions(userId:string){ if(!supabase) return demoSubscriptions; const {data,error}=await supabase.from('Subscriptions').select('*').eq('user_id',userId).order('renewal_date'); if(error) throw error; return (data ?? []) as Subscription[] }
export async function saveSubscription(subscription:Partial<Subscription> & {user_id:string}){ if(!supabase) return {...subscription,id:crypto.randomUUID()} as Subscription; const query=subscription.id ? supabase.from('Subscriptions').update(subscription).eq('id',subscription.id).select().single() : supabase.from('Subscriptions').insert(subscription).select().single(); const {data,error}=await query;if(error)throw error;return data as Subscription }
export async function deleteSubscription(id:string){ if(!supabase)return; const {error}=await supabase.from('Subscriptions').delete().eq('id',id);if(error)throw error }
export const demoSubscriptions:Subscription[]=[
 {id:'netflix',user_id:'demo',name:'Netflix',category:'Entertainment',cost:22.99,currency:'USD',billing_cycle:'monthly',renewal_date:'2026-07-22',auto_renew:true,status:'active',payment_method:'Visa •••• 4242'},
 {id:'adobe',user_id:'demo',name:'Adobe Creative Cloud',category:'Design',cost:59.99,currency:'USD',billing_cycle:'monthly',renewal_date:'2026-07-28',auto_renew:true,status:'active'},
 {id:'notion',user_id:'demo',name:'Notion',category:'Productivity',cost:10,currency:'USD',billing_cycle:'monthly',renewal_date:'2026-08-02',auto_renew:true,status:'active'},
 {id:'headspace',user_id:'demo',name:'Headspace',category:'Wellness',cost:69.99,currency:'USD',billing_cycle:'yearly',renewal_date:'2026-08-14',trial_end_date:'2026-07-25',auto_renew:true,status:'trial'},
 {id:'icloud',user_id:'demo',name:'iCloud+',category:'Storage',cost:2.99,currency:'USD',billing_cycle:'monthly',renewal_date:'2026-08-19',auto_renew:true,status:'active'}]
