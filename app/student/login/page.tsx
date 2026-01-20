export default function StudentLoginPage({
  searchParams
}: {
  searchParams: { error?: string };
}) {
  const errorMessages: Record<string, string> = {
    missing: "Please enter registration number and PIN.",
    invalid: "Invalid registration number or PIN.",
    locked: "Account locked. Please wait 2 minutes before retrying.",
    inactive: "This student is deactivated. Contact your teacher."
  };
  const errorMessage = searchParams.error ? errorMessages[searchParams.error] : "";

  return (
    <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
      <h1>Student Login</h1>
      <p className="muted">Enter your registration number and 4-digit PIN.</p>
      <form action="/student/login" method="post" style={{ marginTop: 24 }}>
        <label className="label" htmlFor="reg_no">Registration Number</label>
        <input className="input" id="reg_no" name="reg_no" required />
        <label className="label" htmlFor="pin" style={{ marginTop: 12 }}>4-digit PIN</label>
        <input className="input" id="pin" name="pin" type="password" inputMode="numeric" required />
        {errorMessage && <p style={{ color: "#dc2626" }}>{errorMessage}</p>}
        <button className="button" type="submit" style={{ marginTop: 16 }}>
          Sign in
        </button>
      </form>
    </div>
  );
}
