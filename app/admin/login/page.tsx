"use client";

import { useFormState } from "react-dom";
import { adminLogin } from "@/lib/actions";

const initialState = { error: "" };

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(adminLogin, initialState);

  return (
    <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
      <h1>Teacher Admin</h1>
      <p className="muted">Enter the admin password to manage WorksheetVault.</p>
      <form action={formAction} style={{ marginTop: 24 }}>
        <label className="label" htmlFor="password">Password</label>
        <input className="input" id="password" name="password" type="password" required />
        {state?.error && <p style={{ color: "#dc2626" }}>{state.error}</p>}
        <button className="button" type="submit" style={{ marginTop: 16 }}>
          Sign in
        </button>
      </form>
    </div>
  );
}
