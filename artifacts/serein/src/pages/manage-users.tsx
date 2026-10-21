import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'wouter';
import { KeyRound, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { orderDate } from './account';
import { provisionAdminAccount } from '@/lib/firebase';

type Staff = { uid: string; name: string; email: string; role: 'admin' | 'super_admin'; added_at: string };

export default function ManageUsers() {
  const { user, isReady, requestPasswordReset } = useAuth();
  const [users, setUsers] = useState<Staff[]>([]);
  const [configured, setConfigured] = useState<string[]>([]);
  const [managerRole, setManagerRole] = useState<'admin' | 'super_admin' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Staff | 'new' | null>(null);
  const [uid, setUid] = useState(''); const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [role, setRole] = useState<'admin' | 'super_admin'>('admin');
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
  const request = useCallback(async (method = 'GET', data?: object) => {
    if (!user) throw new Error('Please sign in again.');
    const response = await fetch('/api/admin/users', { method, headers: { Authorization: `Bearer ${await user.getIdToken()}`, ...(data ? { 'Content-Type': 'application/json' } : {}) }, ...(data ? { body: JSON.stringify(data) } : {}), cache: 'no-store' });
    const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Unable to manage users.'); return result;
  }, [user]);
  const load = useCallback(async () => { if (!user) return; setLoading(true); setError(''); try { const result = await request(); setUsers(result.users); setConfigured(result.configured); setManagerRole(result.managerRole); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to load users.'); } finally { setLoading(false); } }, [user, request]);
  useEffect(() => { setUsers([]); setConfigured([]); setManagerRole(null); if (user) void load(); }, [user, load]);
  function edit(staff: Staff | 'new') { setEditing(staff); setUid(staff === 'new' ? '' : staff.uid); setName(staff === 'new' ? '' : staff.name); setEmail(staff === 'new' ? '' : staff.email); setPassword(''); setRole(staff === 'new' ? 'admin' : staff.role); setMessage(''); }
  async function submit(event: FormEvent) { event.preventDefault(); setBusy(true); setMessage(''); try {
    if (editing === 'new') {
      const userToken = await provisionAdminAccount(email.trim(), password);
      await request('POST', { userToken, name, email: email.trim(), role });
    } else {
      await request('POST', { uid: uid.trim(), name, email: email.trim(), role });
    }
    setEditing(null); await load();
  } catch (e) {
    const code = typeof e === 'object' && e !== null && 'code' in e && typeof e.code === 'string' ? e.code : '';
    setMessage(code === 'auth/wrong-password' || code === 'auth/invalid-credential' ? 'An account already uses this email, but the password did not match.' : e instanceof Error ? e.message : 'Unable to save user.');
  } finally { setBusy(false); } }
  async function resetPassword(staff: Staff) { if (!staff.email) { setError('This user does not have an email address saved.'); return; } setBusy(true); setMessage(''); try { await requestPasswordReset(staff.email); setMessage(`A password reset link was sent to ${staff.email}.`); } catch { setMessage('Unable to send a password reset link right now.'); } finally { setBusy(false); } }
  async function remove(staff: Staff) { if (!window.confirm(`Remove dashboard access for ${staff.name || staff.email || staff.uid}?`)) return; setBusy(true); setError(''); try { await request('DELETE', { uid: staff.uid }); await load(); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to remove user.'); } finally { setBusy(false); } }
  const input = 'mt-2 w-full border border-foreground/20 bg-background px-3 py-3 text-sm';
  return <main className="min-h-screen px-6 pb-24 pt-10 md:px-10"><div className="mx-auto max-w-7xl"><p className="text-[10px] uppercase tracking-[0.2em] text-foreground/45">Serein administration</p><div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="mt-3 font-serif text-5xl text-primary">Users.</h1><p className="mt-3 text-sm text-foreground/60">Manage dashboard access, groups and password resets.</p></div>{user && !loading && !error && <button onClick={() => edit('new')} className="flex items-center gap-2 bg-primary px-5 py-3 text-sm text-primary-foreground"><Plus size={17} /> Add admin</button>}</div><p className="mt-5 text-xs leading-5 text-foreground/55">Admins manage products, orders and customers. Super Admins can also create and manage every group. Password changes are completed securely through an email reset link.</p>
    {!isReady ? <p className="mt-8">Checking your account…</p> : !user ? <Link href="/auth?next=manage-users" className="mt-8 inline-block underline">Sign in</Link> : loading ? <p className="mt-8">Loading users…</p> : error ? <p className="mt-8 text-sm text-red-900" role="alert">{error}</p> : <>
      {editing && <section className="mt-8"><div className="mb-3 flex justify-end"><button onClick={() => setEditing(null)} className="flex items-center gap-1 text-sm text-foreground/60"><X size={16} /> Close</button></div><form onSubmit={submit} className="border border-foreground/10 bg-[#f9f5ee] p-6"><h2 className="font-serif text-2xl text-primary">{editing === 'new' ? 'Add admin user' : 'Edit admin user'}</h2>{editing === 'new' && <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/60">Create an account that can sign in to the admin dashboard. Share the password securely; they can change it after signing in.</p>}<div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-xs">Full name<input className={input} required={editing === 'new'} maxLength={120} value={name} onChange={e => setName(e.target.value)} /></label><label className="text-xs">Email<input className={input} required={editing === 'new'} type="email" maxLength={254} value={email} onChange={e => setEmail(e.target.value)} /></label><label className="text-xs sm:col-span-2">Group<select className={input} value={role} onChange={e => setRole(e.target.value as 'admin' | 'super_admin')}><option value="admin">Admin</option><option value="super_admin" disabled={managerRole !== 'super_admin'}>Super Admin</option></select><span className="mt-2 block text-foreground/55">Super Admins can manage all user groups.</span></label>{editing === 'new' ? <label className="text-xs sm:col-span-2">Temporary password<input className={input} required type="password" minLength={8} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} /><span className="mt-2 block text-foreground/55">At least 8 characters.</span></label> : <input type="hidden" value={uid} />}</div><button disabled={busy} className="mt-5 bg-primary px-6 py-3 text-xs text-primary-foreground disabled:opacity-50">{busy ? 'Saving…' : editing === 'new' ? 'Add admin' : 'Save changes'}</button>{message && <p role="alert" className="mt-3 text-sm text-red-900">{message}</p>}</form></section>}
      <div className="mt-8 overflow-x-auto rounded-lg border border-foreground/10 bg-[#fdfbf7]"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-foreground/[0.03] text-xs text-foreground/55"><tr>{['Name / Firebase ID', 'Email', 'Group', 'Added', ''].map((label, index) => <th key={index} className="p-4 font-normal">{label}</th>)}</tr></thead><tbody>{configured.map(id => <tr key={id} className="border-t border-foreground/10"><td className="break-all p-4">{id}{user.uid === id && ' (you)'}</td><td className="p-4 text-foreground/50">Unavailable</td><td className="p-4"><span className="rounded bg-primary px-3 py-1 text-xs text-primary-foreground">Super Admin</span></td><td className="p-4 text-foreground/50">Configured</td><td className="p-4" /></tr>)}{users.map(staff => <tr key={staff.uid} className="border-t border-foreground/10"><td className="p-4"><span className="block">{staff.name || 'Name unavailable'}</span><span className="break-all text-xs text-foreground/50">{staff.uid}</span></td><td className="break-all p-4 text-foreground/65">{staff.email || 'Unavailable'}</td><td className="p-4"><span className={`rounded px-3 py-1 text-xs ${staff.role === 'super_admin' ? 'bg-primary text-primary-foreground' : 'bg-foreground/5'}`}>{staff.role === 'super_admin' ? 'Super Admin' : 'Admin'}</span></td><td className="p-4 text-foreground/60">{orderDate(staff.added_at)}</td><td className="whitespace-nowrap p-4 text-right"><button disabled={busy || !staff.email} onClick={() => void resetPassword(staff)} aria-label={`Send password reset to ${staff.name || staff.uid}`} className="p-2"><KeyRound size={17} /></button><button onClick={() => edit(staff)} aria-label={`Edit ${staff.name || staff.uid}`} className="p-2"><Pencil size={17} /></button><button disabled={busy} onClick={() => void remove(staff)} aria-label={`Remove ${staff.name || staff.uid}`} className="p-2"><Trash2 size={17} /></button></td></tr>)}</tbody></table></div>{message && !editing && <p role="status" className="mt-4 text-sm text-foreground/70">{message}</p>}
    </>}
  </div></main>;
}
