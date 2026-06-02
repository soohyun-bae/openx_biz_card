export type FieldKey =
  | "logo"
  | "name"
  | "role"
  | "phone"
  | "fax"
  | "email"
  | "website"
  | "address";

export type CardData = Record<FieldKey, string>;

export type CardContentKey =
  | "sponsorImage"
  | "awardStrip"
  | "name"
  | "role"
  | "logo"
  | "phone"
  | "fax"
  | "email"
  | "website"
  | "address";

export type CardContentVisibility = Record<CardContentKey, boolean>;

export type LogoPresetId = "openx" | "kcst" | "hellobell" | "custom";

export type CardTemplateId = "openx" | "kcst";

export type LogoPreset = {
  id: LogoPresetId;
  name: string;
  src?: string;
};

export type SponsorLogoPresetId = "hostCompanyLogos";

export type SponsorLogoPreset = {
  id: SponsorLogoPresetId;
  name: string;
  src: string;
};

export type FontStyle = {
  size: number;
  weight: number;
  letterSpacing: number;
};

export type OpenxCardStyle = {
  backgroundColor: string;
  logoSize: number;
  logoBackground: string;
  logoColor: string;
  primaryColor: string;
  secondaryColor: string;
  name: FontStyle;
  role: FontStyle;
  contact: FontStyle;
  phone: FontStyle;
  fax: FontStyle;
  email: FontStyle;
  website: FontStyle;
  address: FontStyle;
};

export type OpenxEditablePart =
  | "name"
  | "role"
  | "phone"
  | "fax"
  | "email"
  | "website"
  | "address";
