import { useRef } from "react";
import { fieldLabels } from "./businessCardData";
import { OpenxStyleForm } from "./OpenxStyleForm";
import type {
  CardContentVisibility,
  CardData,
  FieldKey,
  FontStyle,
  LogoPresetId,
  OpenxCardStyle,
  OpenxEditablePart,
} from "./businessCardTypes";

type OpenxFontStyleKey = Exclude<OpenxEditablePart, "logo">;

type CardFieldsFormProps = {
  data: CardData;
  visibility: CardContentVisibility;
  selectedLogoPreset: LogoPresetId;
  style: OpenxCardStyle;
  selectedOpenxPart: OpenxEditablePart;
  onUpdateField: (field: FieldKey, value: string) => void;
  onUpdateFont: (
    key: OpenxFontStyleKey,
    fontKey: keyof FontStyle,
    value: number,
  ) => void;
  onResetFont: (key: OpenxFontStyleKey) => void;
  onUpdateLogoSize: (value: number) => void;
  onUpdateLogoOffsetY: (value: number) => void;
  onResetLogoSize: () => void;
  onBackToContentSelect: () => void;
  onSavePng: () => Promise<void>;
};

type EditableField = Extract<FieldKey, keyof CardContentVisibility>;

const editableFields: EditableField[] = [
  "name",
  "role",
  "phone",
  "fax",
  "email",
  "website",
  "address",
];

export const CardFieldsForm = ({
  data,
  visibility,
  selectedLogoPreset,
  style,
  selectedOpenxPart,
  onUpdateField,
  onUpdateFont,
  onResetFont,
  onUpdateLogoSize,
  onUpdateLogoOffsetY,
  onResetLogoSize,
  onBackToContentSelect,
  onSavePng,
}: CardFieldsFormProps) => {
  const logoInputRef = useRef<HTMLInputElement>(null);

  const updateLogo = (file: File | undefined) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onUpdateField("logo", String(reader.result ?? ""));
    };
    reader.readAsDataURL(file);
  };

  const clearLogo = () => {
    onUpdateField("logo", "");

    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-0 rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm lg:flex-1 lg:overflow-y-auto">
      <div className="mt-4 grid grid-cols-2 gap-3">
        {editableFields.map((field) =>
          visibility[field] ? (
            <label key={field} className="grid gap-1.5">
              <span className="text-sm font-semibold text-main">
                {fieldLabels[field]}
              </span>
              <input
                value={data[field]}
                onChange={(event) => onUpdateField(field, event.target.value)}
                className="h-11 rounded-md border border-slate-300 px-3 text-base outline-none transition focus:border-main focus:ring-2 focus:ring-teal-100"
              />
            </label>
          ) : null,
        )}

        {visibility.logo && selectedLogoPreset === "custom" ? (
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold text-main">
              {fieldLabels.logo}
            </span>
            <span className="grid gap-2">
              <span className="relative block">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(event) => updateLogo(event.target.files?.[0])}
                  className="block w-full rounded-md border border-slate-300 pr-11 text-sm text-slate-700 file:mr-3 file:h-11 file:border-0 file:bg-slate-950 file:px-4 file:font-bold file:text-white hover:file:bg-main"
                />
                {data.logo ? (
                  <button
                    type="button"
                    onClick={clearLogo}
                    aria-label="Cancel uploaded logo"
                    className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-lg font-bold leading-none text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                  >
                    x
                  </button>
                ) : null}
              </span>
            </span>
          </label>
        ) : null}
      </div>
      <div className="my-5 h-px w-full scale-y-50 bg-[#E2E4E7]" />
      <div>
        <OpenxStyleForm
          style={style}
          selectedPart={selectedOpenxPart}
          onUpdateFont={onUpdateFont}
          onResetFont={onResetFont}
          onUpdateLogoSize={onUpdateLogoSize}
          onUpdateLogoOffsetY={onUpdateLogoOffsetY}
          onResetLogoSize={onResetLogoSize}
        />
      </div>
      <button
        type="button"
        onClick={onBackToContentSelect}
        className="mt-4 h-14 w-full rounded-[50px] border border-slate-300 px-5 font-bold text-slate-700 transition hover:border-main hover:text-main"
      >
        내용 선택으로 돌아가기
      </button>
      <button
        type="button"
        onClick={onSavePng}
        className="mt-3 h-14 w-full rounded-[50px] bg-main px-5 font-bold text-white transition hover:bg-[#4D9ECC]"
      >
        PNG 저장
      </button>
    </div>
  );
};
