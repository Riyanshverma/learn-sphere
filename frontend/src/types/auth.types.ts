type role = "admin" | "teacher" | "staff" | "parent" | "student";

export interface userLoginResponse {
  identity_id: string;
  role: role;
  verified: boolean;
  active: boolean;
}