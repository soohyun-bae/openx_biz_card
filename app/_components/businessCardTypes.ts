export type FieldKey =
  | "logo"
  | "name"
  | "englishName"
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
  | "englishName"
  | "role"
  | "logo"
  | "phone"
  | "fax"
  | "email"
  | "website"
  | "address";

export type CardContentVisibility = Record<CardContentKey, boolean>;

export type LogoPresetId =
  | "openx"
  | "kcst"
  | "hellobell"
  | "custom"
  | "customTemplate";

export type CardTemplateId = "openx" | "kcst" | "custom";

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
  logoOffsetY: number;
  logoBackground: string;
  logoColor: string;
  primaryColor: string;
  secondaryColor: string;
  name: FontStyle;
  englishName: FontStyle;
  role: FontStyle;
  contact: FontStyle;
  phone: FontStyle;
  fax: FontStyle;
  email: FontStyle;
  website: FontStyle;
  address: FontStyle;
};

export type OpenxEditablePart =
  | "logo"
  | "name"
  | "englishName"
  | "role"
  | "phone"
  | "fax"
  | "email"
  | "website"
  | "address";

export type CustomTextAlign = "left" | "center" | "right";

export type CustomTextLayer = {
  id: string;
  type: "text";
  text: string;
  x: number;
  y: number;
  size: number;
  weight: number;
  letterSpacing: number;
  color: string;
  align: CustomTextAlign;
};

export type CustomImageLayer = {
  id: string;
  type: "image";
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
};

export type CustomLayer = CustomTextLayer | CustomImageLayer;
