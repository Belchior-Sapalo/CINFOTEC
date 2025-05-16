import { useState, type ChangeEvent } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export function PasswordInput({value, onChange}: {value: string, onChange: Function}) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <div>
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e)}
        className="auth-input"
        placeholder="senha"
        required
      />
      <button
        className="cursor-pointer"
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? (
          <FaEyeSlash className="text-gray-600" />
        ) : (
          <FaEye className="text-gray-600" />
        )}
      </button>
    </div>
  );
}

export function SearchInput({value, placeholder, onChange}:{value: string, placeholder:string, onChange(e: ChangeEvent<HTMLInputElement>): Function}){
  return (
    <form className="flex gap-2 py-2">
    <input
      type="text"
      autoFocus
      value={value}
      onChange={(e) => onChange(e)}
      className="border border-gray-500 focus:border-gray-900 p-1 outline-none rounded"
      placeholder={placeholder}
    />
  </form>
  )
}
