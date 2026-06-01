import type { RefObject } from "react";
import type { OpenxEditablePart } from "./businessCardTypes";

type CardPreviewPanelProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onSavePng: () => Promise<void>;
  selectedOpenxPart: OpenxEditablePart;
  onSelectOpenxPart: (part: OpenxEditablePart) => void;
  canEditStyle: boolean;
  canSave: boolean;
};

type Hotspot = {
  part: OpenxEditablePart;
  label: string;
  className: string;
  showLabel?: boolean;
};

const hotspots: Hotspot[] = [
  {
    part: "background",
    label: "Background",
    className: "inset-0",
  },
  {
    part: "border",
    label: "Border",
    className: "left-[5.3%] top-[9.3%] h-[3%] w-[89.4%]",
    showLabel: true,
  },
  {
    part: "border",
    label: "Border",
    className: "left-[5.3%] top-[87.6%] h-[3%] w-[89.4%]",
    showLabel: false,
  },
  {
    part: "border",
    label: "Border",
    className: "left-[5.3%] top-[9.3%] h-[81.3%] w-[1.8%]",
    showLabel: false,
  },
  {
    part: "border",
    label: "Border",
    className: "left-[92.9%] top-[9.3%] h-[81.3%] w-[1.8%]",
    showLabel: false,
  },
  {
    part: "logo",
    label: "Logo",
    className: "left-[6.8%] top-[10.6%] h-[19.7%] w-[11.2%]",
  },
  {
    part: "sponsorImage",
    label: "Sponsor",
    className: "left-[73.5%] top-[12%] h-[14.3%] w-[19.6%]",
  },
  {
    part: "name",
    label: "Name",
    className: "left-[6.8%] top-[34.5%] h-[9%] w-[19%]",
  },
  {
    part: "role",
    label: "Role",
    className: "left-[27.4%] top-[35%] h-[8%] w-[24%]",
  },
  {
    part: "contact",
    label: "Contact",
    className: "left-[6.8%] top-[62.5%] h-[26%] w-[43%]",
  },
  {
    part: "website",
    label: "Website",
    className: "left-[6.8%] top-[70.5%] h-[6.5%] w-[32%]",
  },
];

export const CardPreviewPanel = ({
  canvasRef,
  onSavePng,
  selectedOpenxPart,
  onSelectOpenxPart,
  canEditStyle,
  canSave,
}: CardPreviewPanelProps) => (
  <section className="flex min-w-0 flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-bold">실시간 미리보기</h2>
        <p className="mt-1 text-sm text-slate-600">
          {canEditStyle
            ? "명함 위 요소를 클릭하면 해당 스타일만 바로 수정할 수 있습니다."
            : "선택한 내용이 예시 정보로 어떻게 배치되는지 확인할 수 있습니다."}
        </p>
      </div>
      {canSave ? (
        <button
          type="button"
          onClick={onSavePng}
          className="h-11 rounded-md bg-slate-950 px-5 font-bold text-white transition hover:bg-teal-700"
        >
          PNG 저장
        </button>
      ) : null}
    </div>

    <div className="flex flex-1 items-center justify-center overflow-auto rounded-md bg-slate-100 p-4 sm:p-8">
      <div className="relative max-w-full">
        <canvas
          ref={canvasRef}
          aria-label="명함 미리보기"
          className="block h-auto max-w-full rounded-md shadow-2xl"
        />
        {canEditStyle ? (
          <div className="absolute inset-0 rounded-md">
            {hotspots.map((hotspot, index) => {
              const isSelected = selectedOpenxPart === hotspot.part;

              return (
                <button
                  key={`${hotspot.part}-${index}`}
                  type="button"
                  aria-label={`${hotspot.label} edit`}
                  onClick={() => onSelectOpenxPart(hotspot.part)}
                  className={`absolute rounded-sm border text-[10px] font-bold uppercase tracking-[0.12em] transition ${
                    isSelected
                      ? "border-teal-500 bg-teal-500/10 text-teal-700"
                      : "border-transparent text-transparent hover:border-teal-400 hover:bg-teal-400/10 hover:text-teal-700"
                  } ${hotspot.part === "background" ? "z-0" : "z-10"} ${hotspot.className}`}
                >
                  <span className="absolute left-1 top-1 rounded bg-white/90 px-1.5 py-0.5 shadow-sm">
                    {isSelected && hotspot.showLabel !== false
                      ? hotspot.label
                      : ""}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  </section>
);
