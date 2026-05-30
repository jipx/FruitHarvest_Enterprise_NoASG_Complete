const ROLE_KEY = "fruitharvest_role";

export function getUserRole() {
  return localStorage.getItem(ROLE_KEY) || "customer";
}

export function setUserRole(role) {
  localStorage.setItem(ROLE_KEY, role);
}

export function isCustomer() {
  return getUserRole() === "customer";
}

export function isStaff() {
  return getUserRole() === "staff";
}

export function isAdmin() {
  return getUserRole() === "admin";
}
