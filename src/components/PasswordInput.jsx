import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const inputClassName =
  'appearance-none block w-full px-3 py-2 pr-10 bg-[var(--color-bg)] border border-[var(--card-border)] text-[var(--color-text)] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-brand)] focus:border-[var(--color-brand)] sm:text-sm';

const darkInputClassName =
  'w-full px-5 py-4 pr-12 bg-[#0B0B0F] border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-gray-700';

export default function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  required = true,
  minLength = 6,
  placeholder = '••••••••',
  variant = 'default',
  labelAction = null,
}) {
  const [visible, setVisible] = useState(false);
  const inputClasses = variant === 'dark' ? darkInputClassName : inputClassName;
  const labelClasses =
    variant === 'dark'
      ? 'block text-xs font-bold text-gray-500 uppercase tracking-widest'
      : 'block text-sm font-medium text-[var(--color-text-muted)]';

  return (
    <div>
      <div className={`flex justify-between items-center ${variant === 'dark' ? 'mb-3' : ''}`}>
        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
        {labelAction}
      </div>
      <div className={`relative ${variant === 'default' ? 'mt-1' : ''}`}>
        <input
          type={visible ? 'text' : 'password'}
          id={id}
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          className={inputClasses}
          placeholder={placeholder}
          minLength={minLength}
          autoComplete={name === 'passwordConfirm' ? 'new-password' : undefined}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className={`absolute top-1/2 -translate-y-1/2 text-gray-500 transition-colors ${
            variant === 'dark'
              ? 'right-4 hover:text-emerald-400'
              : 'right-3 hover:text-[var(--color-brand)]'
          }`}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? (
            <EyeOff className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Eye className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
