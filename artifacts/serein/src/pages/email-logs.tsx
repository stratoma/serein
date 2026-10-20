import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import { CheckCircle2, Mail } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

type EmailLog = { id: string; recipient: string; subject: string; email_type: string; status: string; sent_at: string };

const types = [
  ['all', 'All types'],
  ['order_confirmation', 'Order confirmation'],
  ['payment_confirmation', 'Payment confirmation'],
  ['shipping_confirmation', 'Shipping confirmation'],
  ['cancellation', 'Cancellation'],
  ['refund', 'Refund'],
] as const;
const statuses = [['all', 'All statuses'], ['sent', 'Sent'], ['pending', 'Pending'], ['failed', 'Failed']] as const;

function labelForType(value: string) {
  return types.find(([key]) => key === value)?.[1] ?? value.replaceAll('_', ' ');
}
function dateTime(value: string) {
  const date = new Date(value.endsWith('Z') ? value : `${value.replace(' ', 'T')}Z`);
  return Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export default function EmailLogs() {
  const { user, isReady } = useAuth();
  const [emailType, setEmailType] = useState('all');
  const [status, setStatus] = useState('all');
  const [emails, setEmails] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true); setError('');
    try {
      const query = new URLSearchParams({ type: emailType, status });
      const response = await fetch(`/api/admin/email-logs?${query}`, { headers: { Authorization: `Bearer ${await user.getIdToken()}` }, cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load email logs.');
      setEmails(data.emails);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to load email logs.'); }
    finally { setLoading(false); }
  }, [emailType, status, user]);
  useEffect(() => { setEmails([]); if (user) void load(); }, [user, load]);
  const total = useMemo(() => emails.length, [emails]);
  const filterClass = (selected: boolean) => `rounded-md border px-3 py-2 text-sm transition-colors ${selected ? 'border-primary bg-primary text-primary-foreground' : 'border-foreground/30 bg-background text-foreground hover:border-primary'}`;

  return <main className="min-h-screen px-6 pb-24 pt-10 md:px-10"><div className="mx-auto max-w-7xl">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[0.2em] text-foreground/45">Serein administration</p><h1 className="mt-3 font-serif text-5xl text-primary">Email logs.</h1><p className="mt-3 text-sm text-foreground/60">Monitor transactional emails sent to customers.</p></div>{isReady && user && !loading && !error && <p className="text-sm text-foreground/60">{total} {total === 1 ? 'email' : 'emails'}</p>}</div>
    {!isReady ? <p className="mt-8">Checking your account…</p> : !user ? <Link href="/auth?next=email-logs" className="mt-8 inline-block underline">Sign in</Link> : <>
      <div className="mt-8 flex flex-wrap gap-2" aria-label="Email type filters">{types.map(([value, label]) => <button key={value} onClick={() => setEmailType(value)} className={filterClass(emailType === value)}>{label}</button>)}</div>
      <div className="mt-3 flex flex-wrap gap-2" aria-label="Email status filters">{statuses.map(([value, label]) => <button key={value} onClick={() => setStatus(value)} className={filterClass(status === value)}>{label}</button>)}</div>
      {loading ? <p className="mt-8">Loading email logs…</p> : error ? <p role="alert" className="mt-8 text-sm text-red-900">{error}</p> : <div className="mt-8 overflow-hidden rounded-lg border border-foreground/10 bg-[#fdfbf7]"><div className="overflow-x-auto"><table className="w-full min-w-[780px] text-left text-sm"><thead className="bg-foreground/[0.03] text-xs text-foreground/55"><tr><th className="w-12 p-4"><span className="sr-only">Email</span></th>{['Recipient', 'Subject / type', 'Status', 'Date'].map(label => <th key={label} className="p-4 font-normal">{label}</th>)}</tr></thead><tbody>{emails.map(email => <tr key={email.id} className="border-t border-foreground/10"><td className="p-4 text-foreground/55"><Mail size={19} /></td><td className="break-all p-4 font-medium text-primary">{email.recipient}</td><td className="p-4"><span className="block font-medium text-primary">{email.subject}</span><span className="mt-1 block text-xs uppercase tracking-[0.08em] text-foreground/50">{labelForType(email.email_type)}</span></td><td className="p-4"><span className={`inline-flex items-center gap-1 rounded px-3 py-1 text-xs ${email.status === 'sent' ? 'bg-primary text-primary-foreground' : email.status === 'failed' ? 'bg-red-100 text-red-900' : 'bg-foreground/5 text-foreground/70'}`}>{email.status === 'sent' && <CheckCircle2 size={14} />}{email.status[0].toUpperCase() + email.status.slice(1)}</span></td><td className="whitespace-nowrap p-4 text-foreground/60">{dateTime(email.sent_at)}</td></tr>)}</tbody></table>{!emails.length && <p className="p-8 text-sm text-foreground/60">No emails match these filters. New order confirmations will appear here after they are sent.</p>}</div></div>}
    </>}
  </div></main>;
}
