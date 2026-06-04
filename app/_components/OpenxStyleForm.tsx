import type {
  FontStyle,
  OpenxCardStyle,
  OpenxEditablePart,
} from "./businessCardTypes";

type FontStyleKey = Exclude<OpenxEditablePart, "logo">;

type OpenxStyleFormProps = {
  style: OpenxCardStyle;
  selectedPart: OpenxEditablePart;
  onUpdateFont: (
    key: FontStyleKey,
    fontKey: keyof FontStyle,
    value: number,
  ) => void;
  onResetFont: (key: FontStyleKey) => void;
  onUpdateLogoSize: (value: number) => void;
  onUpdateLogoOffsetY: (value: number) => void;
  onResetLogoSize: () => void;
};

type NumberInputProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
};

const partLabels: Record<OpenxEditablePart, string> = {
  logo: "로고",
  name: "이름",
  englishName: "영어 이름",
  role: "직책",
  phone: "폰 번호",
  fax: "FAX",
  email: "이메일",
  website: "사이트",
  address: "주소",
};

const toNumber = (value: string, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const NumberInput = ({
  label,
  value,
  min = 0,
  max,
  step = 1,
  onChange,
}: NumberInputProps) => (
  <label className="flex min-w-[120px] flex-1 items-center gap-2">
    <span className="shrink-0 text-sm font-bold text-main">{label}</span>
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(event) => onChange(toNumber(event.target.value, value))}
      className="number-input h-10 min-w-0 flex-1 appearance-auto rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-main focus:ring-2 focus:ring-teal-100"
    />
  </label>
);

const FontControls = ({
  font,
  onChange,
}: {
  font: FontStyle;
  onChange: (fontKey: keyof FontStyle, value: number) => void;
}) => (
  <>
    <NumberInput
      label="크기"
      value={font.size}
      min={8}
      max={120}
      onChange={(value) => onChange("size", value)}
    />
    <NumberInput
      label="굵기"
      value={font.weight}
      min={100}
      max={900}
      step={100}
      onChange={(value) => onChange("weight", value)}
    />
    <NumberInput
      label="간격"
      value={font.letterSpacing}
      min={0}
      max={40}
      onChange={(value) => onChange("letterSpacing", value)}
    />
  </>
);

export const OpenxStyleForm = ({
  style,
  selectedPart,
  onUpdateFont,
  onResetFont,
  onUpdateLogoSize,
  onUpdateLogoOffsetY,
  onResetLogoSize,
}: OpenxStyleFormProps) => {
  const isLogoSelected = selectedPart === "logo";
  const controls = isLogoSelected ? (
    <>
      <NumberInput
        label="크기"
        value={style.logoSize}
        min={60}
        max={360}
        onChange={onUpdateLogoSize}
      />
      <NumberInput
        label="세로"
        value={style.logoOffsetY}
        min={-120}
        max={220}
        onChange={onUpdateLogoOffsetY}
      />
    </>
  ) : (
    <FontControls
      font={style[selectedPart]}
      onChange={(fontKey, value) => onUpdateFont(selectedPart, fontKey, value)}
    />
  );

  const resetSelectedStyle = () => {
    if (isLogoSelected) {
      onResetLogoSize();
      return;
    }

    onResetFont(selectedPart);
  };

  return (
    <div className="grid gap-3 rounded-lg bg-white">
      <h2 className="text-lg font-bold text-main">스타일 변경</h2>
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 text-sm text-slate-600">
          명함 위 요소를 클릭하면 해당 스타일만 바로 수정할 수 있습니다.
        </p>
        <span className="shrink-0 rounded-[50px] bg-[#F1F5F9] px-3 py-1 text-sm font-bold text-main">
          {partLabels[selectedPart]}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {controls}
        <button
          type="button"
          onClick={resetSelectedStyle}
          className="h-10 shrink-0 rounded-md border border-slate-300 px-4 text-sm font-bold text-slate-700 transition hover:border-main hover:text-main"
        >
          기본값으로 돌아가기
        </button>
      </div>
    </div>
  );
};
