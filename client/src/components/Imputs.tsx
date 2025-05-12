import { useState } from "react";
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
