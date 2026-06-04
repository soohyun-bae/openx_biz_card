import type {
  FontStyle,
  OpenxCardStyle,
  OpenxEditablePart,
} from "./businessCardTypes";

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

type FontStyleKey = Exclude<OpenxEditablePart, "logo">;

type NumberInputProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
};

const partLabels: Record<OpenxEditablePart, string> = {
  logo: "Logo",
  name: "이름",
  role: "직책",
  phone: "폰 번호",
  fax: "FAX",
  email: "이메일",
  website: "사이트 주소",
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
  <label className="grid gap-1.5">
    <span className="text-xs font-semibold text-slate-600">{label}</span>
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(event) => onChange(toNumber(event.target.value, value))}
      className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-main focus:ring-2 focus:ring-teal-100"
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
  <div className="grid gap-3 sm:grid-cols-3">
    <NumberInput
      label="Font size"
      value={font.size}
      min={8}
      max={120}
      onChange={(value) => onChange("size", value)}
    />
    <NumberInput
      label="Weight"
      value={font.weight}
      min={100}
      max={900}
      step={100}
      onChange={(value) => onChange("weight", value)}
    />
    <NumberInput
      label="Letter spacing"
      value={font.letterSpacing}
      min={0}
      max={40}
      onChange={(value) => onChange("letterSpacing", value)}
    />
  </div>
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
  const renderControls = () => {
    if (selectedPart === "logo") {
      return (
        <div className="grid gap-3">
          <NumberInput
            label="Logo size"
            value={style.logoSize}
            min={60}
            max={360}
            onChange={onUpdateLogoSize}
          />
          <NumberInput
            label="Logo vertical position"
            value={style.logoOffsetY}
            min={-120}
            max={220}
            onChange={onUpdateLogoOffsetY}
          />
          <button
            type="button"
            onClick={onResetLogoSize}
            className="h-11 rounded-md border border-slate-300 px-4 text-sm font-bold text-slate-700 transition hover:border-main hover:text-main"
          >
            기본값으로 돌아가기
          </button>
        </div>
      );
    }

    return (
      <FontControls
        font={style[selectedPart]}
        onChange={(fontKey, value) =>
          onUpdateFont(selectedPart, fontKey, value)
        }
      />
    );
  };

  const controls = renderControls();
  const resetSelectedFont = () => {
    if (selectedPart !== "logo") {
      onResetFont(selectedPart);
    }
  };
  const fontResetClassName =
    selectedPart === "logo"
      ? "hidden"
      : "h-11 rounded-md border border-slate-300 px-4 text-sm font-bold text-slate-700 transition hover:border-main hover:text-main";

  return (
    <div className="rounded-lg  bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-main">스타일 변경</h2>
          <p className="mt-1 text-sm text-slate-600">
            미리보기에서 선택한 요소를 수정합니다.
          </p>
        </div>
        <span className="rounded-[50px] bg-[#F1F5F9] px-3 py-1 text-sm font-bold text-main">
          {partLabels[selectedPart]}
        </span>
      </div>
      {controls ? (
        <div className="mt-4 grid gap-3">
          {controls}
          <button
            type="button"
            onClick={resetSelectedFont}
            className={fontResetClassName}
          >
            기본값으로 돌아가기
          </button>
        </div>
      ) : null}
    </div>
  );
};
