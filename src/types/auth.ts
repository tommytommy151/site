export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "customer" | "admin";
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  city: string;
  county: string;
  postalCode: string;
  isDefault: boolean;
}
