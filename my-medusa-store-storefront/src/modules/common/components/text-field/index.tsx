"use client"

import React, { forwardRef, useState } from "react"

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)

export type TextFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "className"
> & {
  label?: string
  error?: string
  containerClassName?: string
  inputClassName?: string
  labelClassName?: string
  onClear?: () => void
  /** Rendered inside the field on the right (e.g. icon button). Shown after the clear control when present. */
  suffix?: React.ReactNode
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      error,
      containerClassName = "",
      inputClassName = "",
      labelClassName = "",
      id,
      value,
      onFocus,
      onBlur,
      onChange,
      suffix,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const inputId = id ?? (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined)
    const hasValue = value !== undefined && value !== null && String(value).trim() !== ""
    const isFloated = isFocused || hasValue

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    }
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation()
      onChange?.({
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>)
    }

    return (
      <div className={`relative flex flex-col w-full ${containerClassName}`}>
        <div
          className={`
            group relative flex items-center w-full min-h-[56px] rounded-2xl border transition-all duration-300 overflow-hidden
            ${isFocused ? "border-blue-500 bg-white ring-4 ring-blue-500/10" : "border-slate-200 bg-slate-50/50 hover:border-slate-300"}
            ${error ? "border-red-400 bg-red-50/30" : ""}
            ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {label && (
            <label
              htmlFor={inputId}
              className={`
                absolute left-4 transition-all duration-300 pointer-events-none
                ${isFloated
                  ? "top-0 -translate-y-3.5 text-[10px] font-black uppercase tracking-widest text-blue-600"
                  : "top-2.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500"}
                ${error ? "text-red-500" : ""}
                ${isFloated && error ? "text-red-500" : ""}
                ${labelClassName}
              `}
            >
              {label}
            </label>
          )}

          <input
            ref={ref}
            id={inputId}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`
              w-full flex-1 min-w-0 bg-transparent border-none rounded-2xl pl-4 outline-none text-sm font-medium text-slate-900 placeholder:text-slate-400
              transition-[padding] duration-300
              ${isFloated ? "pt-4 pb-3" : "pt-6 pb-3"}
              ${suffix || (hasValue && !props.disabled && props.type !== "password") ? "pr-2" : "pr-4"}
              ${props.disabled ? "cursor-not-allowed" : ""}
              ${inputClassName}
            `}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />

          {hasValue && !props.disabled && props.type !== "password" && (
            <button
              type="button"
              onClick={handleClear}
              className={`p-1 rounded-full hover:bg-slate-200 text-slate-400 transition-colors shrink-0 ${suffix != null ? "mr-0" : "mr-2"}`}
              aria-label="Clear"
              tabIndex={-1}
            >
              <XIcon />
            </button>
          )}
          {suffix != null ? <div className="shrink-0 flex items-center pr-1">{suffix}</div> : null}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 ml-1 text-xs font-medium text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

TextField.displayName = "TextField"
export default TextField
