"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Trash2, Pencil, CheckCircle2, XCircle, Search } from "lucide-react";
import { AdminButton, AdminInput, AdminSelect, AdminCard, AdminTableToolbar, EmptyState, LoadingSkeleton, SearchField, Modal, ConfirmDialog, InlineLoader } from "@/src/components/admin/admin-ui";
import { useAdminToast } from "@/src/components/admin/admin-toast";

export type PlanCodeRow = { id: number; planKey: string; planCode: string; description: string; isActive: boolean; createdAt: string; updatedAt: string };
export type PlanCodeForm = { id: number; planKey: string; planCode: string; description: string; isActive: boolean };

export default function PlanCodesRegistryTab() {
  const { showToast } = useAdminToast();
  const [rows, setRows] = useState<PlanCodeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<PlanCodeForm>({ id: 0, planKey: "", planCode: "", description: "", isActive: true });
  const requestRef = useRef<AbortController | null>(null);

  const loadPlanCodes = useCallback(async () => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/plan-codes", { signal: controller.signal });
      const payload = await res.json();
      if (!res.ok || !payload.success) throw new Error(payload.message || "Failed to load.");
      setRows(payload.data?.result || []);
    } catch (e) { if (!controller.signal.aborted) showToast({ tone: "error", title: "Error", description: (e as Error).message }); }
    finally { if (!controller.signal.aborted) setLoading(false); }
  }, [showToast]);

  useEffect(() => { void loadPlanCodes(); return () => requestRef.current?.abort(); }, [loadPlanCodes]);

  const filtered = rows.filter(r => {
    if (filter === "active" && !r.isActive) return false;
    if (filter === "inactive" && r.isActive) return false;
    if (search) { const s = search.toLowerCase(); return (r.planKey||"").toLowerCase().includes(s) || (r.planCode||"").toLowerCase().includes(s) || (r.description||"").toLowerCase().includes(s); }
    return true;
  });

  function openCreate() { setForm({ id:0, planKey:"", planCode:"", description:"", isActive:true }); setModalOpen(true); }
  function openEdit(r: PlanCodeRow) { setForm({ id:r.id, planKey:r.planKey, planCode:r.planCode, description:r.description||"", isActive:r.isActive }); setModalOpen(true); }

  async function handleSave() {
    if (!form.planKey.trim() || !form.planCode.trim()) { showToast({ tone:"error", title:"Validation", description:"Plan Key and Plan Code required." }); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/plan-codes", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ ...form, planKey: form.planKey.toUpperCase().trim().replace(/\s+/g,"_") }) });
      const payload = await res.json();
      if (!res.ok || !payload.success) throw new Error(payload.message || "Save failed");
      setModalOpen(false); showToast({ tone:"success", title:"Saved", description: payload.message }); void loadPlanCodes();
    } catch (e) { showToast({ tone:"error", title:"Save Error", description:(e as Error).message }); } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/plan-codes?id=${deleteId}`, { method:"DELETE" });
      const payload = await res.json();
      if (!res.ok || !payload.success) throw new Error(payload.message || "Delete failed");
      setDeleteId(null); showToast({ tone:"success", title:"Deleted", description: payload.message }); void loadPlanCodes();
    } catch (e) { showToast({ tone:"error", title:"Delete Error", description:(e as Error).message }); }
  }

  async function toggleStatus(r: PlanCodeRow) {
    try {
      const res = await fetch("/api/admin/plan-codes", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ id:r.id, planKey:r.planKey, planCode:r.planCode, description:r.description, isActive: !r.isActive }) });
      const payload = await res.json();
      if (!res.ok || !payload.success) throw new Error(payload.message||"Status failed");
      showToast({ tone:"success", title:"Updated", description: `Plan code is now ${!r.isActive ? "active" : "inactive"}` }); void loadPlanCodes();
    } catch (e) { showToast({ tone:"error", title:"Error", description:(e as Error).message }); }
  }

  const currentFormPlanCode = form.planCode;
  const usedPlanCodes = rows.map((r) => r.planCode).filter(Boolean);

  const allPlanCodes = [
    { value: "WIIZ_MONTHLY_STARTER_PLAN_V2_DEV", label: "WIIZ_MONTHLY_STARTER_PLAN_V2_DEV — Monthly Starter Plan - DEV" },
    { value: "WIIZ_ANNUAL_STARTER_PLAN_V2_DEV", label: "WIIZ_ANNUAL_STARTER_PLAN_V2_DEV — Annual Starter Plan – DEV" },
    { value: "WIIZ_FREE_PLAN_V2_DEV", label: "WIIZ_FREE_PLAN_V2_DEV — Free Plan V2 - DEV" },
    { value: "WIIZ_MONTHLY_BUSINESS_ENTRY_PLAN_V2_DEV", label: "WIIZ_MONTHLY_BUSINESS_ENTRY_PLAN_V2_DEV — Monthly Business Entry Plan - DEV" },
    { value: "WIIZ_ANNUAL_BUSINESS_ENTRY_PLAN_V2_DEV", label: "WIIZ_ANNUAL_BUSINESS_ENTRY_PLAN_V2_DEV — Annual Business Entry Plan - DEV" },
    { value: "WIIZ_MONTHLY_BUSINESS_STANDARD_PLAN_V2_DEV", label: "WIIZ_MONTHLY_BUSINESS_STANDARD_PLAN_V2_DEV — Monthly Business Standard Plan - DEV" },
    { value: "WIIZ_ANNUAL_BUSINESS_STANDARD_PLAN_V2_DEV", label: "WIIZ_ANNUAL_BUSINESS_STANDARD_PLAN_V2_DEV — Annual Business Standard Plan - DEV" },
    { value: "ENTERPRISE_ANNUAL_BUSINESS_PLAN_V2_DEV", label: "ENTERPRISE_ANNUAL_BUSINESS_PLAN_V2_DEV — Enterprise Annual Business Plan - DEV" },
    { value: "ADDON_PLAN_TEST", label: "ADDON_PLAN_TEST — WiiZ AddOns Plan" },
    { value: "WIIZ_1000RUNS_ADDON_TEST", label: "WIIZ_1000RUNS_ADDON_TEST — 1000 Runs AddOn" },
    { value: "WIIZ_5000RUNS_ADDON_TEST", label: "WIIZ_5000RUNS_ADDON_TEST — 5000 Runs AddOn" },
    { value: "WIIZ_10000RUNS_ADDON_TEST", label: "WIIZ_10000RUNS_ADDON_TEST — 10000 Runs AddOn" },
  ];

  return (
    <div className="space-y-6">
      <AdminCard className="overflow-hidden rounded-[10px] border border-slate-200/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <AdminTableToolbar search={ <div className="flex flex-col gap-3 sm:flex-row"><div className="min-w-0 flex-1"><SearchField value={search} onChange={setSearch} placeholder="Search code or key..."/></div><div className="sm:w-44"><AdminSelect label="" value={filter} onChange={e=>setFilter(e.target.value as any)} className="h-11 py-0"><option value="all">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option></AdminSelect></div></div> } primaryAction={<AdminButton onClick={openCreate}><Plus className="mr-2 h-4 w-4"/>Add Code</AdminButton>} secondaryActions={loading?<InlineLoader label="..."/>:null}/>
        {loading?<LoadingSkeleton rows={5}/>:null}
        {!loading && filtered.length===0?<div className="p-6"><EmptyState title="No codes" description="Adjust filters or add new."/></div>:null}
        {!loading && filtered.length>0?
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 border-y border-slate-200"><tr><th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500">Plan Key</th><th className="px-5 py-3">Zoho Code</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">
            {filtered.map(row=> <tr key={row.id} className="hover:bg-slate-50/50"><td className="px-5 py-4"><div className="flex flex-col"><span className="font-mono text-xs font-semibold text-slate-900">{row.planKey}</span><span className="text-[11px] text-slate-500 mt-0.5">{row.description||""}</span></div></td><td className="px-5 py-4"><span className="inline-block rounded bg-slate-100 border border-slate-200 px-2 py-1 text-[11px] font-mono text-slate-700 font-semibold">{row.planCode}</span></td><td className="px-5 py-4"><button onClick={()=>toggleStatus(row)} className="flex items-center gap-1.5 text-xs font-medium"><span className={row.isActive ? "text-emerald-600" : "text-slate-400"}>{row.isActive ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500"/> : <XCircle className="h-3.5 w-3.5"/>}</span><span>{row.isActive?"Active":"Inactive"}</span></button></td><td className="px-5 py-4 text-right"><div className="flex justify-end gap-1"><button onClick={()=>openEdit(row)} className="h-8 w-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"><Pencil className="h-4 w-4"/></button><button onClick={()=>setDeleteId(row.id)} className="h-8 w-8 rounded-lg hover:bg-rose-50 text-rose-400 hover:text-rose-600"><Trash2 className="h-4 w-4"/></button></div></td></tr>)}
          </tbody></table></div>:null}
      </AdminCard>
      <Modal open={modalOpen} onClose={()=>!saving&&setModalOpen(false)} title={form.id>0?"Edit Plan Code":"Add Plan Code"} description="Update Zoho billing code mapping." footer={<div className="flex justify-end gap-3"><AdminButton variant="secondary" onClick={()=>setModalOpen(false)} disabled={saving}>Cancel</AdminButton><AdminButton onClick={()=>void handleSave()} disabled={saving}>{saving?"Saving...":"Save"}</AdminButton></div>}>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2"><AdminInput label="Plan Key" value={form.planKey} onChange={e=>setForm(c=>({...c,planKey:e.target.value}))} placeholder="STARTER_MONTHLY"/><AdminSelect label="Zoho Plan Code" value={form.planCode} onChange={e=>setForm(c=>({...c,planCode:e.target.value}))}><option value="">Select a plan...</option>{allPlanCodes.map((code) => {
            const isUsed = usedPlanCodes.includes(code.value) && code.value !== currentFormPlanCode;
            const isCurrent = code.value === currentFormPlanCode;
            return (
              <option key={code.value} value={code.value} disabled={isUsed && !isCurrent} className={isUsed ? "text-slate-300" : ""}>
                {isUsed ? `✓ Used — ${code.label}` : code.label}
              </option>
            );
          })}</AdminSelect></div>
          <AdminInput label="Description" value={form.description} onChange={e=>setForm(c=>({...c,description:e.target.value}))} placeholder="Internal reference..."/>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={e=>setForm(c=>({...c,isActive:e.target.checked}))} className="h-4 w-4 rounded text-[#98235f] border-slate-300 focus:ring-[#98235f]"/><span className="text-sm font-medium text-slate-700">Active in production</span></label>
        </div>
      </Modal>
      <ConfirmDialog open={deleteId!==null} onClose={()=>setDeleteId(null)} onConfirm={()=>void handleDelete()} title="Delete Plan Code?" description="Permanent removal." confirmLabel="Delete" />
    </div>
  );
}