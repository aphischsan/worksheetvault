export default function AdminLoginPage({
  searchParams
}: {
  searchParams: { error?: string };
}) {
  const errorMessages: Record<string, string> = {
    invalid: "Incorrect password.",
    missing_env: "ADMIN_PASSWORD is not configured."
  };
  const errorMessage = searchParams.error ? errorMessages[searchParams.error] : "";

  return (
    <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
      <h1>Teacher Admin</h1>
      <p className="muted">Enter the admin password to manage WorksheetVault.</p>
      <form action="/admin/login-action" method="post" style={{ marginTop: 24 }}>
        <label className="label" htmlFor="password">Password</label>
        <input className="input" id="password" name="password" type="password" required />
        {errorMessage && <p style={{ color: "#dc2626" }}>{errorMessage}</p>}
        <button className="button" type="submit" style={{ marginTop: 16 }}>
          Sign in
        </button>
      </form>
    </div>
  );
}
