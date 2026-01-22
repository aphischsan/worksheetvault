"use client";

import { useRouter } from "next/navigation";

export default function StudentLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    // Clear the student cookie by calling a small API or clearing it via document.cookie
    // For simplicity, we expire the cookie directly
    document.cookie = "wv_student=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    
    // Redirect to the login page
    router.push("/student/login");
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout} 
      className="button secondary" 
      style={{ padding: "8px 16px", fontSize: "0.85rem" }}
    >
      Logout
    </button>
  );
}
