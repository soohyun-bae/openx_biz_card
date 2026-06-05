import { contentLabels, logoPresets } from "./businessCardData";
import type {
  CardContentKey,
  CardContentVisibility,
  LogoPresetId,
} from "./businessCardTypes";

type ContentSelectorProps = {
  visibility: CardContentVisibility;
  selectedLogoPreset: LogoPresetId;
  onToggleContent: (key: CardContentKey, enabled: boolean) => void;
  onSelectLogoPreset: (presetId: LogoPresetId) => void;
  onNext: () => void;
};

const contentKeys: CardContentKey[] = [
  "sponsorImage",
  "awardStrip",
  "phone",
  "fax",
  "email",
  "website",
  "address",
];

export const ContentSelector = ({
  visibility,
  selectedLogoPreset,
  onToggleContent,
  onSelectLogoPreset,
  onNext,
}: ContentSelectorProps) => {
  const selectableContentKeys = contentKeys.filter(
    (key) =>
      !(
        (selectedLogoPreset === "kcst" &&
          (key === "sponsorImage" || key === "awardStrip")) ||
        (selectedLogoPreset === "hellobell" && key === "sponsorImage")
      ),
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg text-main text-center font-bold">템플릿 선택</h2>
      {visibility.logo ? (
        <div className="mt-4 grid gap-2 border-slate-200">
          <div className="grid grid-cols-2 gap-3">
            {logoPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectLogoPreset(preset.id)}
                className={`flex h-20 items-center justify-center rounded-[20px] border px-3 text-center text-sm leading-tight transition ${
                  selectedLogoPreset === preset.id
                    ? "border-main text-main font-bold"
                    : "border-[#F1F5F9] bg-white text-sub hover:border-slate-400"
                }`}
              >
                {preset.src ? (
                  <img
                    src={preset.src}
                    alt={preset.name}
                    className={`${preset.name === "kcst" ? "w-[60%]" : "w-[40%]"} max-h-16 object-contain`}
                  />
                ) : (
                  <p>{preset.name}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <div className="h-[0.5px] mt-5 w-full bg-slate-300" />
      <div className="mt-5 grid min-h-0 flex-1 grid-cols-2 auto-rows-[minmax(3.75rem,1fr)] gap-3">
        {selectableContentKeys.map((key) => {
          const isVisible = visibility[key];

          return (
            <button
              key={key}
              type="button"
              aria-pressed={isVisible}
              onClick={() => onToggleContent(key, !isVisible)}
              className={`flex items-center justify-center rounded-[20px] border px-3 py-2 text-center text-sm leading-tight transition text-sub ${
                isVisible
                  ? "border-main text-main font-bold"
                  : "border-[#F1F5F9] bg-white text-sub hover:border-slate-400"
              }`}
            >
              {contentLabels[key]}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onNext}
        className="mt-5 h-14 w-full rounded-[50px] bg-main px-5 font-bold text-white transition hover:bg-[#4D9ECC]"
      >
        다음
      </button>
    </div>
  );
};
