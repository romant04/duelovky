import { ChangeEvent, FC } from "react";
import { clsx } from "clsx";

interface inputFieldData {
  name: string;
  error: string;
  label: string;
  type: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const InputField: FC<inputFieldData> = ({
  name,
  error,
  label,
  type,
  handleInputChange,
}) => (
  <div className="flex items-center gap-6">
    <label className="w-24 text-end">{label}</label>
    <div className="relative w-full">
      <p className="absolute -top-4 text-xs text-red-500">{error}</p>
      <input
        name={name}
        onChange={handleInputChange}
        className={clsx(
          "w-full rounded-sm border-[1px] bg-gray-200 p-2 text-black",
          error ? "border-red-500" : "border-gray-800"
        )}
        type={type}
      />
    </div>
  </div>
);
