/** Fila de checkbox con icono y label. */
export const CheckboxRow = ({ checked, onChange, icon, label }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 rounded focus:ring-0 accent-green-600 cursor-pointer" />
    <div className="flex items-center gap-1.5 text-sm text-slate-300 group-hover:text-slate-100 transition-colors">
      {icon}{label}
    </div>
  </label>
)
