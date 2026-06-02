import { useEffect, useRef, useState, type RefObject } from "react";
import { cardSize } from "./businessCardData";
import type {
  CardContentVisibility,
  CardData,
  FontStyle,
  OpenxCardStyle,
  OpenxEditablePart,
} from "./businessCardTypes";

type CardPreviewPanelProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onSavePng: () => Promise<void>;
  data: CardData;
  style: OpenxCardStyle;
  visibility: CardContentVisibility;
  selectedOpenxPart: OpenxEditablePart;
  onSelectOpenxPart: (part: OpenxEditablePart) => void;
  canEditStyle: boolean;
  canSave: boolean;
};

type Hotspot = {
  part: OpenxEditablePart;
  label: string;
  bounds: Bounds;
  showLabel?: boolean;
};

type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const profileLayout = {
  nameX: 72,
  baselineY: 210,
  roleGap: 36,
};

const estimateTextWidth = (
  text: string,
  font: FontStyle,
  useCanvasMeasurement: boolean,
) => {
  const characters = Array.from(text);
  const context =
    !useCanvasMeasurement || typeof document === "undefined"
      ? null
      : document.createElement("canvas").getContext("2d");

  if (context) {
    context.font = `${font.weight} ${font.size}px Arial, Helvetica, sans-serif`;

    return (
      characters.reduce(
        (width, character) => width + context.measureText(character).width,
        0,
      ) +
      Math.max(characters.length - 1, 0) * font.letterSpacing
    );
  }

  return characters.reduce(
    (width, character) => {
      const isNarrow = /[ijlI.,:|]/.test(character);
      const isWide = /[MW@#%&]/.test(character);
      const ratio = isNarrow ? 0.32 : isWide ? 0.82 : 0.58;

      return width + font.size * ratio;
    },
    Math.max(characters.length - 1, 0) * font.letterSpacing,
  );
};

const getTextBounds = (
  x: number,
  baselineY: number,
  text: string,
  font: FontStyle,
  useCanvasMeasurement: boolean,
): Bounds => ({
  x,
  y: baselineY - font.size * 1.05,
  width: Math.max(1, estimateTextWidth(text, font, useCanvasMeasurement)),
  height: font.size * 1.3,
});

const getProfileRoleX = (
  data: CardData,
  style: OpenxCardStyle,
  visibility: CardContentVisibility,
  useCanvasMeasurement: boolean,
) => {
  if (!visibility.name) {
    return profileLayout.nameX;
  }

  return (
    profileLayout.nameX +
    estimateTextWidth(data.name, style.name, useCanvasMeasurement) +
    profileLayout.roleGap
  );
};

const getHotspotStyle = ({ x, y, width, height }: Bounds) => ({
  left: `${(x / cardSize.width) * 100}%`,
  top: `${(y / cardSize.height) * 100}%`,
  width: `${(width / cardSize.width) * 100}%`,
  height: `${(height / cardSize.height) * 100}%`,
});

const buildHotspots = (
  data: CardData,
  style: OpenxCardStyle,
  visibility: CardContentVisibility,
  useCanvasMeasurement: boolean,
): Hotspot[] => {
  const valueRows = [
    { key: "phone", part: "phone", label: "Phone", x: 132, baselineY: 350 },
    { key: "fax", part: "fax", label: "Fax", x: 132, baselineY: 388 },
    { key: "email", part: "email", label: "Email", x: 132, baselineY: 426 },
    {
      key: "website",
      part: "website",
      label: "Website",
      x: 132,
      baselineY: 464,
    },
    {
      key: "address",
      part: "address",
      label: "Address",
      x: 72,
      baselineY: 502,
    },
  ] as const;
  const hotspots: Hotspot[] = [
    {
      part: "background",
      label: "Background",
      bounds: { x: 0, y: 0, width: cardSize.width, height: cardSize.height },
    },
  ];

  if (visibility.name) {
    hotspots.push({
      part: "name",
      label: "Name",
      bounds: getTextBounds(
        profileLayout.nameX,
        profileLayout.baselineY,
        data.name,
        style.name,
        useCanvasMeasurement,
      ),
    });
  }

  if (visibility.role) {
    hotspots.push({
      part: "role",
      label: "Role",
      bounds: getTextBounds(
        getProfileRoleX(data, style, visibility, useCanvasMeasurement),
        profileLayout.baselineY,
        data.role,
        style.role,
        useCanvasMeasurement,
      ),
    });
  }

  valueRows.forEach((row) => {
    if (!visibility[row.key]) {
      return;
    }

    const font =
      row.key === "website"
        ? {
            ...style.website,
            size: style.contact.size,
          }
        : style.contact;

    hotspots.push({
      part: row.part,
      label: row.label,
      bounds: getTextBounds(
        row.x,
        row.baselineY,
        data[row.key],
        font,
        useCanvasMeasurement,
      ),
    });
  });

  return hotspots;
};

export const CardPreviewPanel = ({
  canvasRef,
  onSavePng,
  data,
  style,
  visibility,
  selectedOpenxPart,
  onSelectOpenxPart,
  canEditStyle,
  canSave,
}: CardPreviewPanelProps) => {
  const [canMeasureText, setCanMeasureText] = useState(false);
  const [visibleLabelPart, setVisibleLabelPart] =
    useState<OpenxEditablePart | null>(null);
  const labelTimeoutRef = useRef<number | null>(null);
  const hotspots = buildHotspots(data, style, visibility, canMeasureText);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setCanMeasureText(true));

    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(
    () => () => {
      if (labelTimeoutRef.current !== null) {
        window.clearTimeout(labelTimeoutRef.current);
      }
    },
    [],
  );

  const selectHotspot = (part: OpenxEditablePart) => {
    onSelectOpenxPart(part);
    setVisibleLabelPart(part);

    if (labelTimeoutRef.current !== null) {
      window.clearTimeout(labelTimeoutRef.current);
    }

    labelTimeoutRef.current = window.setTimeout(() => {
      setVisibleLabelPart(null);
      labelTimeoutRef.current = null;
    }, 900);
  };

  return (
    <section className="flex w-full max-w-[866px] min-w-0 flex-col gap-4 rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:h-[var(--editor-panel-height)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-sub">실시간 미리보기</h2>
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
            className="h-11 rounded-md bg-slate-950 px-5 font-bold text-white transition hover:bg-main"
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
                    onClick={() => selectHotspot(hotspot.part)}
                    style={getHotspotStyle(hotspot.bounds)}
                    className={`absolute rounded-sm border text-[10px] font-bold uppercase tracking-[0.12em] transition ${
                      isSelected
                        ? "border-[#5ABCF4] bg-transparent text-[#5ABCF4]"
                        : "border-transparent text-transparent hover:border-main hover:bg-main/10 hover:text-teal-700"
                    } ${hotspot.part === "background" ? "z-0" : "z-10"}`}
                  >
                    {isSelected &&
                    visibleLabelPart === hotspot.part &&
                    hotspot.showLabel !== false ? (
                      <span className="absolute left-1 top-1 rounded bg-white/90 px-1.5 py-0.5 shadow-sm">
                        {hotspot.label}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
