import { useEffect, useState } from "react";

export const ADMIN_NAME = "HerendraAziizulHakiimMuhammadIsTheCreatorAndVeryHandsome";

function readProfile() {
  try {
    return JSON.parse(window.localStorage.getItem("embedded-for-kids-profile"));
  } catch {
    return null;
  }
}

export function isAdminProfile(profile) {
  return !!profile && profile.name === ADMIN_NAME;
}

export function useAdmin() {
  const [admin, setAdmin] = useState(() => isAdminProfile(readProfile()));
  useEffect(() => {
    const refresh = () => setAdmin(isAdminProfile(readProfile()));
    window.addEventListener("storage", refresh);
    window.addEventListener("embedded-profile-change", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("embedded-profile-change", refresh);
    };
  }, []);
  return admin;
}
