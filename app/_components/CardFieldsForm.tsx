import { useRef } from "react";
import { CustomTemplateForm } from "./CustomTemplateForm";
import { fieldLabels } from "./businessCardData";
import { OpenxStyleForm } from "./OpenxStyleForm";
import type {
  CardContentVisibility,
  CardData,
  CustomImageLayer,
  CustomLayer,
  CustomTextLayer,
  FieldKey,
  FontStyle,
  LogoPresetId,
  OpenxCardStyle,
  OpenxEditablePart,
} from "./businessCardTypes";

type OpenxFontStyleKey = Exclude<OpenxEditablePart, "logo">;
type CustomLayerPatch = Partial<CustomTextLayer> | Partial<CustomImageLayer>;

type CardFieldsFormProps = {
  data: CardData;
  visibility: CardContentVisibility;
  selectedLogoPreset: LogoPresetId;
  style: OpenxCardStyle;
  selectedOpenxPart: OpenxEditablePart;
  customLayers: CustomLayer[];
  selectedCustomLayerId: string | null;
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
  onSelectCustomLayer: (id: string) => void;
  onAddCustomTextLayer: () => void;
  onAddCustomImageLayer: (file: File | undefined) => void;
  onUpdateCustomLayer: (id: string, patch: CustomLayerPatch) => void;
  onDeleteCustomLayer: (id: string) => void;
  onMoveCustomLayer: (id: string, direction: -1 | 1) => void;
  onUpdateBackgroundColor: (color: string) => void;
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
  customLayers,
  selectedCustomLayerId,
  onUpdateField,
  onUpdateFont,
  onResetFont,
  onUpdateLogoSize,
  onUpdateLogoOffsetY,
  onResetLogoSize,
  onSelectCustomLayer,
  onAddCustomTextLayer,
  onAddCustomImageLayer,
  onUpdateCustomLayer,
  onDeleteCustomLayer,
  onMoveCustomLayer,
  onUpdateBackgroundColor,
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

  if (selectedLogoPreset === "customTemplate") {
    return (
      <CustomTemplateForm
        layers={customLayers}
        selectedLayerId={selectedCustomLayerId}
        backgroundColor={style.backgroundColor}
        onSelectLayer={onSelectCustomLayer}
        onAddTextLayer={onAddCustomTextLayer}
        onAddImageLayer={onAddCustomImageLayer}
        onUpdateLayer={onUpdateCustomLayer}
        onDeleteLayer={onDeleteCustomLayer}
        onMoveLayer={onMoveCustomLayer}
        onUpdateBackgroundColor={onUpdateBackgroundColor}
        onBackToContentSelect={onBackToContentSelect}
        onSavePng={onSavePng}
      />
    );
  }

  return (
    <div className="flex min-h-0 flex-col rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm lg:flex-1 lg:overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col justify-between gap-5 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
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
