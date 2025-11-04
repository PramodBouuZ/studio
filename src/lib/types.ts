export type VendorProfile = {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  location: string;
  logoUrl: string;
  products: string;
  status: 'pending_approval' | 'approved' | 'rejected';
  createdAt: string;
};
