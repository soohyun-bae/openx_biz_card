export type FieldKey =
  | "logo"
  | "name"
  | "role"
  | "company"
  | "phone"
  | "fax"
  | "email"
  | "website"
  | "address"
  | "slogan";

export type CardData = Record<FieldKey, string>;

export type CardContentKey =
  | "sponsorImage"
  | "name"
  | "role"
  | "logo"
  | "phone"
  | "fax"
  | "email"
  | "website"
  | "address";

export type CardContentVisibility = Record<CardContentKey, boolean>;

export type LogoPresetId = "openx" | "wordmark" | "square" | "custom";

export type LogoPreset = {
  id: LogoPresetId;
  name: string;
};

export type FontStyle = {
  size: number;
  weight: number;
  letterSpacing: number;
};

export type OpenxCardStyle = {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  logoSize: number;
  logoBackground: string;
  logoColor: string;
  primaryColor: string;
  secondaryColor: string;
  name: FontStyle;
  role: FontStyle;
  company: FontStyle;
  contact: FontStyle;
  website: FontStyle;
};

export type TemplateStyles = {
  openx: OpenxCardStyle;
};

export type OpenxEditablePart =
  | "background"
  | "border"
  | "logo"
  | "sponsorImage"
  | "name"
  | "role"
  | "contact"
  | "website";

export type Template = {
  id: string;
  name: string;
  description: string;
  fields: FieldKey[];
};
