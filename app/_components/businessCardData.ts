import type {
  CardContentKey,
  CardContentVisibility,
  CardData,
  FieldKey,
  LogoPreset,
  OpenxCardStyle,
  Template,
} from "./businessCardTypes";

export const cardSize = {
  width: 1050,
  height: 600,
};

export const fieldLabels: Record<FieldKey, string> = {
  logo: "로고",
  name: "이름",
  role: "직급",
  company: "회사명",
  phone: "핸드폰 번호",
  fax: "FAX",
  email: "이메일",
  website: "웹사이트",
  address: "주소",
  slogan: "슬로건",
};

export const initialData: CardData = {
  logo: "",
  name: "홍길동",
  role: "Brand Designer",
  company: "OPENX Studio",
  phone: "010-1234-5678",
  fax: "02-1234-5678",
  email: "hello@openx.kr",
  website: "openx.kr",
  address: "Seoul, Korea",
  slogan: "Design that opens new value",
};

export const openxDefaultStyle: OpenxCardStyle = {
  backgroundColor: "#fafafa",
  borderColor: "#111827",
  borderWidth: 3,
  logoSize: 118,
  logoBackground: "#111827",
  logoColor: "#ffffff",
  primaryColor: "#111827",
  secondaryColor: "#334155",
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
  company: {
    size: 34,
    weight: 700,
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
  },
  {
    id: "wordmark",
    name: "Wordmark",
  },
  {
    id: "square",
    name: "Square",
  },
  {
    id: "custom",
    name: "직접 업로드",
  },
];

export const templates: Template[] = [
  {
    id: "openx",
    name: "Minimal Line",
    description: "얇은 라인과 넓은 여백",
    fields: ["logo", "name", "role", "company", "phone", "email", "website"],
  },
  {
    id: "bold",
    name: "Bold Signal",
    description: "강한 로고 블록과 선명한 대비",
    fields: ["logo", "name", "role", "company", "phone", "email", "address"],
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "세로 타이포그래피 중심의 구성",
    fields: ["logo", "name", "company", "phone", "email", "website", "slogan"],
  },
  {
    id: "tech",
    name: "Tech Grid",
    description: "그리드와 포인트 컬러",
    fields: ["logo", "name", "role", "company", "phone", "email", "website"],
  },
  {
    id: "premium",
    name: "Premium Mark",
    description: "고급스러운 중앙 심볼",
    fields: ["logo", "name", "role", "company", "phone", "email", "address"],
  },
];
