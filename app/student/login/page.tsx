"use client";

import { useFormState } from "react-dom";
import { studentLogin } from "@/lib/actions";

const initialState = { error: "" };

export default function StudentLoginPage() {
  const [state, formAction] = useFormState(studentLogin, initialState);

  return (
    <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
      <h1>Student Login</h1>
      <p className="muted">Enter your registration number and 4-digit PIN.</p>
      
      <form action={formAction} style={{ marginTop: 24 }}>
        <label className="label" htmlFor="reg_no">Registration Number</label>
        <input className="input" id="reg_no" name="reg_no" required />
        
        <label className="label" htmlFor="pin" style={{ marginTop: 12 }}>4-digit PIN</label>
        <input 
          className="input" 
          id="pin" 
          name="pin" 
          type="password" 
          inputMode="numeric" 
          required 
        />
        
        {state?.error && (
          <p style={{ color: "#dc2626", marginTop: 8, fontSize: "0.9rem" }}>
            {state.error}
          </p>
        )}

        <button className="button" type="submit" style={{ marginTop: 16 }}>
          Sign in
        </button>
      </form>
    </div>
  );
}
