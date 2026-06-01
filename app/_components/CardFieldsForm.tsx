import { fieldLabels } from "./businessCardData";
import type {
  CardContentVisibility,
  CardData,
  FieldKey,
  LogoPresetId,
} from "./businessCardTypes";

type CardFieldsFormProps = {
  data: CardData;
  visibility: CardContentVisibility;
  selectedLogoPreset: LogoPresetId;
  onUpdateField: (field: FieldKey, value: string) => void;
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
  onUpdateField,
}: CardFieldsFormProps) => {
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

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-bold">정보 입력</h2>
      <div className="mt-4 grid gap-3">
        {editableFields.map((field) =>
          visibility[field] ? (
            <label key={field} className="grid gap-1.5">
              <span className="text-sm font-semibold text-slate-700">
                {fieldLabels[field]}
              </span>
              <input
                value={data[field]}
                onChange={(event) => onUpdateField(field, event.target.value)}
                className="h-11 rounded-md border border-slate-300 px-3 text-base outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </label>
          ) : null,
        )}

        {visibility.logo && selectedLogoPreset === "custom" ? (
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold text-slate-700">
              {fieldLabels.logo}
            </span>
            <span className="grid gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(event) => updateLogo(event.target.files?.[0])}
                className="block w-full rounded-md border border-slate-300 text-sm text-slate-700 file:mr-3 file:h-11 file:border-0 file:bg-slate-950 file:px-4 file:font-bold file:text-white hover:file:bg-teal-700"
              />
              {data.logo ? (
                <button
                  type="button"
                  onClick={() => onUpdateField("logo", "")}
                  className="h-9 justify-self-start rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition hover:border-teal-500 hover:text-teal-700"
                >
                  로고 제거
                </button>
              ) : null}
            </span>
          </label>
        ) : null}
      </div>
    </div>
  );
};
