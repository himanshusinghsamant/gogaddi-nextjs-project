"use client"

import React, { useState, useRef, useEffect, useMemo, forwardRef } from "react"

export type SelectOption = { value: string; label: string }

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)
const SearchIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)
const XIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)
const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

export type SelectFieldProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "className"
> & {
  label?: string
  options: SelectOption[] | string[]
  placeholder?: string
  error?: string
  containerClassName?: string
  selectClassName?: string
  labelClassName?: string
  searchable?: boolean
}

const SelectField = forwardRef<HTMLDivElement, SelectFieldProps>(
  (
    {
      label,
      options,
      placeholder = "Select an option",
      error,
      disabled = false,
      containerClassName = "",
      searchable = true,
      value,
      onChange,
      id,
      ...rest
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const containerRef = useRef<HTMLDivElement>(null)

    const normalizedOptions: SelectOption[] = useMemo(
      () => options.map((opt) => (typeof opt === "string" ? { value: opt, label: opt } : opt)),
      [options]
    )

    const selectedOption = useMemo(
      () => normalizedOptions.find((opt) => opt.value === value),
      [normalizedOptions, value]
    )

    const filteredOptions = useMemo(() => {
      return normalizedOptions.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }, [normalizedOptions, searchQuery])

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelect = (val: string) => {
      onChange?.({
        target: { value: val },
      } as React.ChangeEvent<HTMLSelectElement>)
      setIsOpen(false)
      setSearchQuery("")
    }

    const clearSelection = (e: React.MouseEvent) => {
      e.stopPropagation()
      onChange?.({
        target: { value: "" },
      } as React.ChangeEvent<HTMLSelectElement>)
      setSearchQuery("")
    }

    const selectId = id ?? (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined)

    return (
      <div
        className={`relative flex flex-col w-full ${containerClassName}`}
        ref={(node) => {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          if (typeof ref === "function") ref(node)
          else if (ref) ref.current = node
        }}
      >
        <div
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined}
          aria-disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`
            group relative flex items-center w-full min-h-[56px] rounded-2xl border transition-all duration-300 cursor-pointer
            ${isOpen ? "border-blue-500 bg-white ring-4 ring-blue-500/10" : "border-slate-200 bg-slate-50/50 hover:border-slate-300"}
            ${error ? "border-red-400 bg-red-50/30" : ""}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {label && (
            <label
              className={`
                absolute left-4 transition-all duration-300 pointer-events-none
                ${isOpen || value
                  ? "top-0 -translate-y-3.5 text-[10px] font-black uppercase tracking-widest text-blue-600"
                  : "top-2.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500"}
                ${error ? "text-red-500" : ""}
              `}
            >
              {label}
            </label>
          )}

          <div
            className={`px-4 w-full truncate text-sm font-medium text-slate-900 transition-[padding] duration-300 ${
              isOpen || value ? "pt-4 pb-3" : "pt-6 pb-3"
            }`}
          >
            {selectedOption ? selectedOption.label : !isOpen && <span className="text-slate-400">{placeholder}</span>}
          </div>

          <div className="flex items-center gap-2 pr-3">
            {value && !disabled && (
              <button
                type="button"
                onClick={clearSelection}
                className="p-1 rounded-full hover:bg-slate-200 text-slate-400 transition-colors"
                aria-label="Clear selection"
              >
                <XIcon />
              </button>
            )}
            <span
              className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            >
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        {error && (
          <p id={`${selectId}-error`} className="mt-1.5 ml-1 text-xs font-medium text-red-500 transition-all" role="alert">
            {error}
          </p>
        )}

        {isOpen && (
          <div
            className="absolute top-full left-0 z-[800] w-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden shadow-blue-900/5 select-field-dropdown"
          >
            {searchable && (
              <div className="sticky top-0 p-3 border-b border-slate-100 bg-white/50">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <SearchIcon />
                  </span>
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search options..."
                    className="w-full bg-slate-100/50 border-none rounded-xl py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div className="max-h-60 overflow-y-auto p-2">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    role="option"
                    aria-selected={value === option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`
                      flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer mb-1
                      ${value === option.value ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
                    `}
                  >
                    {option.label}
                    {value === option.value && (
                      <span className="text-blue-600">
                        <CheckIcon />
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs italic">
                  No matching results found
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    )
  }
)

SelectField.displayName = "SelectField"
export default SelectField
