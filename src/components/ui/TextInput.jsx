/** Input de texto estilizado con el tema del mod generator. */
export const TextInput = ({ value, onChange, placeholder, className = '', ...props }) => (
  <input
    type="text" value={value} onChange={onChange} placeholder={placeholder}
    className={`w-full px-3.5 py-2 bg-mc-dark border-2 border-mc-border rounded focus:outline-none focus:border-mc-gold text-slate-200 transition-colors placeholder:text-slate-600 ${className}`}
    {...props}
  />
)
