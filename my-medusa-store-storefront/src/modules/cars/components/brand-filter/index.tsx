"use client"

import SelectField from "@modules/common/components/select-field"

export type BrandFilterOption = { value: string; label: string } | string

type Props = {
  options: BrandFilterOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  className?: string
}

/** Reusable brand filter dropdown. Options can be string[] or { value, label }[]. */
export default function BrandFilter({
  options,
  value,
  onChange,
  placeholder = "All brands",
  label = "Brand",
  className = "",
}: Props) {
  const selectOptions =
    options.length > 0 && typeof options[0] === "string"
      ? (options as string[]).map((b) => ({ value: b, label: b }))
      : (options as { value: string; label: string }[])

  return (
    <div className={className}>
      <SelectField
        label={label}
        options={selectOptions}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        containerClassName="text-sm"
      />
    </div>
  )
}
