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
  onSelectOpenxPart: (part: OpenxEditablePart) => void;
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
  "englishName",
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
  onSelectOpenxPart,
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
    <div className="flex min-h-0 flex-col rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[30px] sm:p-5 xl:flex-1 xl:overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col justify-between gap-5 overflow-y-auto">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {editableFields.map((field) => {
            if (!visibility[field]) {
              return null;
            }

            const isSelected = selectedOpenxPart === field;

            return (
              <label key={field} className="grid gap-1.5">
                <span className="text-sm font-semibold text-main">
                  {fieldLabels[field]}
                </span>
                <input
                  value={data[field]}
                  onFocus={() => onSelectOpenxPart(field)}
                  onChange={(event) => onUpdateField(field, event.target.value)}
                  className={`h-11 min-w-0 rounded-md border px-3 text-base outline-none transition focus:border-main focus:ring-2 focus:ring-teal-100 ${
                    isSelected
                      ? "border-main ring-2 ring-teal-100"
                      : "border-slate-300"
                  }`}
                />
              </label>
            );
          })}

          {visibility.logo ? (
            <label
              className={`min-w-0 gap-1.5 ${
                selectedLogoPreset === "custom" ? "grid" : "hidden"
              }`}
            >
              <span className="text-sm font-semibold text-main">
                {fieldLabels.logo}
              </span>
              <span className="grid gap-2">
                <span className="relative block">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onFocus={() => onSelectOpenxPart("logo")}
                    onChange={(event) => updateLogo(event.target.files?.[0])}
                    className={`block w-full min-w-0 rounded-md border pr-11 text-sm text-slate-700 file:mr-3 file:h-11 file:border-0 file:bg-slate-950 file:px-4 file:font-bold file:text-white hover:file:bg-main ${
                      selectedOpenxPart === "logo"
                        ? "border-main ring-2 ring-teal-100"
                        : "border-slate-300"
                    }`}
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

        <div className="h-px w-full scale-y-50 bg-[#E2E4E7]" />

        <OpenxStyleForm
          style={style}
          selectedPart={selectedOpenxPart}
          onUpdateFont={onUpdateFont}
          onResetFont={onResetFont}
          onUpdateLogoSize={onUpdateLogoSize}
          onUpdateLogoOffsetY={onUpdateLogoOffsetY}
          onResetLogoSize={onResetLogoSize}
        />

        <div className="grid gap-3">
          <button
            type="button"
            onClick={onBackToContentSelect}
            className="h-14 w-full rounded-[50px] border border-slate-300 px-5 font-bold text-slate-700 transition hover:border-main hover:text-main"
          >
            내용 선택으로 돌아가기
          </button>
          <button
            type="button"
            onClick={onSavePng}
            className="h-14 w-full rounded-[50px] bg-main px-5 font-bold text-white transition hover:bg-[#4D9ECC]"
          >
            PNG 저장
          </button>
        </div>
      </div>
    </div>
  );
};
