/** Input numérico estilizado con el tema del mod generator. */
export const NumberInput = ({ value, onChange, placeholder, step = '1', min, max, className = '' }) => (
  <input
    type="number" value={value} onChange={onChange} placeholder={placeholder}
    step={step} min={min} max={max}
    className={`w-full px-3.5 py-2 bg-mc-dark border-2 border-mc-border rounded focus:outline-none focus:border-mc-gold text-slate-200 transition-colors placeholder:text-slate-600 ${className}`}
  />
)
