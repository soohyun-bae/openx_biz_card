import type {
  FontStyle,
  OpenxCardStyle,
  OpenxEditablePart,
} from "./businessCardTypes";

type OpenxStyleFormProps = {
  style: OpenxCardStyle;
  selectedPart: OpenxEditablePart;
  onUpdateStyle: <Key extends keyof OpenxCardStyle>(
    key: Key,
    value: OpenxCardStyle[Key],
  ) => void;
  onUpdateFont: (
    key: FontStyleKey,
    fontKey: keyof FontStyle,
    value: number,
  ) => void;
};

type FontStyleKey = "name" | "role" | "contact" | "website";

type NumberInputProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
};

type ColorInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const partLabels: Record<OpenxEditablePart, string> = {
  background: "배경",
  border: "테두리",
  logo: "로고",
  sponsorImage: "주관사 이미지",
  name: "이름",
  role: "직책",
  contact: "연락처",
  website: "웹사이트",
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
      className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
    />
  </label>
);

const ColorInput = ({ label, value, onChange }: ColorInputProps) => (
  <label className="grid gap-1.5">
    <span className="text-xs font-semibold text-slate-600">{label}</span>
    <span className="grid grid-cols-[44px_1fr] overflow-hidden rounded-md border border-slate-300 bg-white focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100">
      <input
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-11 cursor-pointer border-0 bg-transparent p-1"
      />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 min-w-0 border-0 px-3 text-sm outline-none"
      />
    </span>
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
  onUpdateStyle,
  onUpdateFont,
}: OpenxStyleFormProps) => {
  const renderControls = () => {
    if (selectedPart === "background") {
      return (
        <ColorInput
          label="Background color"
          value={style.backgroundColor}
          onChange={(value) => onUpdateStyle("backgroundColor", value)}
        />
      );
    }

    if (selectedPart === "border") {
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <ColorInput
            label="Border color"
            value={style.borderColor}
            onChange={(value) => onUpdateStyle("borderColor", value)}
          />
          <NumberInput
            label="Border width"
            value={style.borderWidth}
            min={0}
            max={20}
            onChange={(value) => onUpdateStyle("borderWidth", value)}
          />
        </div>
      );
    }

    if (selectedPart === "logo") {
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <NumberInput
            label="Logo size"
            value={style.logoSize}
            min={24}
            max={180}
            onChange={(value) => onUpdateStyle("logoSize", value)}
          />
          <ColorInput
            label="Logo background"
            value={style.logoBackground}
            onChange={(value) => onUpdateStyle("logoBackground", value)}
          />
          <ColorInput
            label="Logo text"
            value={style.logoColor}
            onChange={(value) => onUpdateStyle("logoColor", value)}
          />
        </div>
      );
    }

    if (selectedPart === "sponsorImage") {
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <ColorInput
            label="Border color"
            value={style.borderColor}
            onChange={(value) => onUpdateStyle("borderColor", value)}
          />
          <ColorInput
            label="Text color"
            value={style.primaryColor}
            onChange={(value) => onUpdateStyle("primaryColor", value)}
          />
        </div>
      );
    }

    if (selectedPart === "contact") {
      return (
        <div className="grid gap-3">
          <ColorInput
            label="Text color"
            value={style.secondaryColor}
            onChange={(value) => onUpdateStyle("secondaryColor", value)}
          />
          <FontControls
            font={style.contact}
            onChange={(fontKey, value) =>
              onUpdateFont("contact", fontKey, value)
            }
          />
        </div>
      );
    }

    if (selectedPart === "website") {
      return (
        <div className="grid gap-3">
          <ColorInput
            label="Text color"
            value={style.secondaryColor}
            onChange={(value) => onUpdateStyle("secondaryColor", value)}
          />
          <FontControls
            font={style.website}
            onChange={(fontKey, value) =>
              onUpdateFont("website", fontKey, value)
            }
          />
        </div>
      );
    }

    return (
      <div className="grid gap-3">
        <ColorInput
          label="Text color"
          value={style.primaryColor}
          onChange={(value) => onUpdateStyle("primaryColor", value)}
        />
        <FontControls
          font={style[selectedPart]}
          onChange={(fontKey, value) =>
            onUpdateFont(selectedPart, fontKey, value)
          }
        />
      </div>
    );
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">OpenX 스타일</h2>
          <p className="mt-1 text-sm text-slate-600">
            미리보기에서 선택한 요소만 수정합니다.
          </p>
        </div>
        <span className="rounded-md bg-teal-50 px-3 py-1 text-sm font-bold text-teal-700">
          {partLabels[selectedPart]}
        </span>
      </div>
      <div className="mt-4 grid gap-3">{renderControls()}</div>
    </div>
  );
};
