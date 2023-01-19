export enum AccountType {
  BUSINESS = "business",
  INDIVIDUAL = "individual",
}

export type DiscoverUser = {
  id: number;
  show_on_discover: boolean;
  email: string;
  industry: number;
  username: string;
  logo: string;
  description: string;
  status: string;
};

export type User = {
  id: number;
  username: string;
  password_hash: string;
  email: string;
  type: string;
  email_verified: boolean;
  stripeID: string;
  show_on_discover: boolean;
  verification_id: string;
  verification_timestamp: string;
  verify_email_otp: string;
  send_code_attempt: number;
  last_code_sent_time: string;
  is_signup_with_google: boolean;
  google_access_token: string;
  industry?: string;
  description?: string;
  logo?: string;
  status?: string;
};

export type PurchasedItem = {
  title: string;
  description: string;
  price: number;
  url: string;
  cover_url: string;
};

export type MarketplaceListCardItem = {
  id: number;
  title: string;
  description: string;
  price: string | number;
  url: string;
  cover_url: string;
  buyers: number;
  username?: string;
  creator?: string;
  logo?: string;
  published?: boolean;
};

export type Message = {
  id: string;
  sender: string;
  receiver: string;
  text: string;
  read: boolean;
  notified: boolean;
  timestamp: string;
};

export type Business = {
  id: number;
  user_id: number;
  company_name: string;
  description: string;
  logo: string;
  website: string;
  location: string;
  industry: number;
  size: string;
  profileViews: number;
  listViews: number;
  status: string;
};

export type Individual = {
  id: number;
  user_id: number;
  name: string;
  bio: string;
  profile_picture: string;
  location: string;
  profileViews: number;
  listViews: number;
  status: string;
};

export type Occupation = {
  id: number;
  name: string;
};

export type Industry = {
  id: number;
  name: string;
  occupations: Occupation[];
};

export type EmailContent = {
  subject: string;
  msg: string;
};

export interface IValidationItem {
  name: string;
  success: boolean;
  error?: string;
}

export class ValidationResponse {
  success: boolean;
  fields: IValidationItem[];

  constructor() {
    this.success = true;
    this.fields = [];
  }

  getFieldByName(name: string) {
    return this.fields.filter((field) => field.name === name)[0];
  }

  invalidateField(name: string, error: string) {
    let field = this.getFieldByName(name);
    field.success = false;
    field.error = error;
    this.success = false;
  }
}
