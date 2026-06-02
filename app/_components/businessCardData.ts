import type {
  CardContentKey,
  CardContentVisibility,
  CardData,
  FieldKey,
  LogoPreset,
  OpenxCardStyle,
  SponsorLogoPreset,
} from "./businessCardTypes";

export const cardSize = {
  width: 1050,
  height: 600,
};

export const fieldLabels: Record<FieldKey, string> = {
  logo: "로고",
  name: "이름",
  role: "직급",
  phone: "핸드폰 번호",
  fax: "FAX",
  email: "이메일",
  website: "웹사이트",
  address: "주소",
};

export const initialData: CardData = {
  logo: "",
  name: "홍길동",
  role: "Brand Designer",
  phone: "010-1234-5678",
  fax: "02-1234-5678",
  email: "hello@openx.kr",
  website: "openx.kr",
  address: "서울시 마포구 성암로330, DMC첨단산업센터 B동 808호",
};

export const openxDefaultStyle: OpenxCardStyle = {
  backgroundColor: "#fafafa",
  logoSize: 240,
  logoBackground: "#111827",
  logoColor: "#ffffff",
  primaryColor: "#111827",
  secondaryColor: "#111827",
  name: {
    size: 40,
    weight: 700,
    letterSpacing: 14,
  },
  role: {
    size: 30,
    weight: 500,
    letterSpacing: 0,
  },
  contact: {
    size: 28,
    weight: 500,
    letterSpacing: 0,
  },
  website: {
    size: 26,
    weight: 600,
    letterSpacing: 0,
  },
};

export const contentLabels: Record<CardContentKey, string> = {
  sponsorImage: "주관사 이미지",
  awardStrip: "수상 기업 문구",
  name: "이름",
  role: "직급",
  logo: "로고 이미지",
  phone: "핸드폰 번호",
  fax: "FAX",
  email: "Email",
  website: "홈페이지 링크",
  address: "주소",
};

export const initialContentVisibility: CardContentVisibility = {
  sponsorImage: true,
  awardStrip: true,
  name: true,
  role: true,
  logo: true,
  phone: true,
  fax: true,
  email: true,
  website: true,
  address: true,
};

export const logoPresets: LogoPreset[] = [
  {
    id: "openx",
    name: "OPENX",
    src: "/logos/openx-logo.png",
  },
  {
    id: "kcst",
    name: "kcst",
    src: "/logos/kcst-logo.png",
  },
  {
    id: "hellobell",
    name: "HelloBell",
    src: "/logos/hellobell-logo.png",
  },
  {
    id: "custom",
    name: "직접 업로드",
  },
];

export const sponsorLogoPresets: SponsorLogoPreset[] = [
  {
    id: "hostCompanyLogos",
    name: "Host Company Logos",
    src: "/logos/host-company-logos.png",
  },
];
