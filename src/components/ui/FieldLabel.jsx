/** Label de campo con asterisco opcional para campos requeridos. */
export const FieldLabel = ({ children, required }) => (
  <label className="block text-sm font-semibold text-slate-300 mb-1">
    {children} {required && <span className="text-rose-500">*</span>}
  </label>
)
