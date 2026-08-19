/** Select estilizado con el tema del mod generator. */
export const SelectInput = ({ value, onChange, children, options, className = '' }) => (
  <select
    value={value} onChange={onChange}
    className={`w-full px-3 py-2 bg-mc-dark border-2 border-mc-border rounded focus:outline-none focus:border-mc-gold text-slate-200 transition-colors cursor-pointer ${className}`}
  >
    {options
      ? options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))
      : children}
  </select>
)
