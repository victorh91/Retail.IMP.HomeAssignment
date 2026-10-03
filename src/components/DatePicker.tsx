import type { Ref } from "react";

interface DatePickerProps {
  ref?: Ref<HTMLInputElement>;
  selectedDate: string;
  onDateChange: (date: string) => void;
  maxDate?: string;
}

export function DatePicker({
  ref,
  selectedDate,
  onDateChange,
  maxDate,
}: DatePickerProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-700">
      Select date:
      <input
        className="rounded border-gray-300"
        ref={ref}
        type="date"
        value={selectedDate}
        max={maxDate}
        onChange={(e) => {
          const value = e.target.value;

          if (!value || (maxDate && value > maxDate)) return;
          onDateChange(value);
        }}
      />
    </label>
  );
}
