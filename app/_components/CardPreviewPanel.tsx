import { useEffect, useRef, useState, type RefObject } from "react";
import {
  cardContentMargin,
  cardSize,
  openxDefaultStyle,
} from "./businessCardData";
import type {
  CardContentVisibility,
  CardData,
  FontStyle,
  LogoPresetId,
  OpenxCardStyle,
  OpenxEditablePart,
} from "./businessCardTypes";

type CardPreviewPanelProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onSavePng: () => Promise<void>;
  data: CardData;
  style: OpenxCardStyle;
  visibility: CardContentVisibility;
  selectedLogoPreset: LogoPresetId;
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

type ImageDimensions = {
  width: number;
  height: number;
};

type LoadedImageDimensions = ImageDimensions & {
  src: string;
};

type HotspotValueKey = "phone" | "fax" | "email" | "website" | "address";

type HotspotValueRow = {
  key: HotspotValueKey;
  part: Extract<OpenxEditablePart, HotspotValueKey>;
  label: string;
  x: number;
  skipHotspot?: boolean;
};

const openxLogoSize = {
  width: 196,
  height: 57,
};

const logoNameGap = 45;
const addressAwardGap = 27;
const awardStripHeight = 60;
const hiddenAwardContactOffsetY = 27;

const profileLayout = {
  nameX: cardContentMargin,
  baselineY:
    cardContentMargin +
    openxLogoSize.height +
    logoNameGap +
    openxDefaultStyle.name.size,
  roleGap: 29,
};

const contactLayout = {
  labelX: cardContentMargin,
  valueX: cardContentMargin + 40,
  addressX: cardContentMargin,
  addressBaselineY: cardSize.height - awardStripHeight - addressAwardGap,
  rowGap: 37,
};

const kcstProfileLayout = {
  rightX: cardSize.width - cardContentMargin,
  baselineY: 180,
  gap: 28,
};

const kcstContactLayout = {
  valueX: cardContentMargin + 46,
  addressOffsetY: 18,
};

const hellobellProfileLayout = {
  rightX: cardSize.width - cardContentMargin,
  nameBaselineY: 84,
  englishNameBaselineY: 125,
  roleBaselineY: 183,
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

const getRightAlignedTextBounds = (
  rightX: number,
  baselineY: number,
  text: string,
  font: FontStyle,
  useCanvasMeasurement: boolean,
): Bounds => {
  const width = Math.max(
    1,
    estimateTextWidth(text, font, useCanvasMeasurement),
  );

  return {
    x: rightX - width,
    y: baselineY - font.size * 1.05,
    width,
    height: font.size * 1.3,
  };
};

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

const getKcstProfilePositions = (
  data: CardData,
  style: OpenxCardStyle,
  visibility: CardContentVisibility,
  useCanvasMeasurement: boolean,
) => {
  const roleWidth = visibility.role
    ? estimateTextWidth(data.role, style.role, useCanvasMeasurement)
    : 0;
  const nameWidth = visibility.name
    ? estimateTextWidth(data.name, style.name, useCanvasMeasurement)
    : 0;
  const visibleGap =
    visibility.role && visibility.name ? kcstProfileLayout.gap : 0;
  const roleX = kcstProfileLayout.rightX - roleWidth - visibleGap - nameWidth;

  return {
    roleX,
    nameX: roleX + roleWidth + visibleGap,
  };
};

const getHotspotStyle = ({ x, y, width, height }: Bounds) => ({
  left: `${(x / cardSize.width) * 100}%`,
  top: `${(y / cardSize.height) * 100}%`,
  width: `${(width / cardSize.width) * 100}%`,
  height: `${(height / cardSize.height) * 100}%`,
});

const getContainedImageBounds = (
  image: ImageDimensions,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight: number,
): Bounds => {
  const ratio = Math.min(1, maxWidth / image.width, maxHeight / image.height);
  const drawWidth = image.width * ratio;
  const drawHeight = image.height * ratio;
  const drawX = x + (maxWidth - drawWidth) / 2;
  const drawY = y + (maxHeight - drawHeight) / 2;
  const visibleX = Math.max(0, drawX);
  const visibleY = Math.max(0, drawY);
  const visibleRight = Math.min(cardSize.width, drawX + drawWidth);
  const visibleBottom = Math.min(cardSize.height, drawY + drawHeight);

  return {
    x: visibleX,
    y: visibleY,
    width: Math.max(1, visibleRight - visibleX),
    height: Math.max(1, visibleBottom - visibleY),
  };
};

const buildHotspots = (
  data: CardData,
  style: OpenxCardStyle,
  visibility: CardContentVisibility,
  selectedLogoPreset: LogoPresetId,
  useCanvasMeasurement: boolean,
  customLogoDimensions: ImageDimensions | null,
): Hotspot[] => {
  const isKcst = selectedLogoPreset === "kcst";
  const isHellobell = selectedLogoPreset === "hellobell";
  const valueRows: HotspotValueRow[] = [
    {
      key: "phone",
      part: "phone",
      label: "Phone",
      x: isKcst ? kcstContactLayout.valueX : contactLayout.valueX,
    },
    {
      key: "fax",
      part: "fax",
      label: "Fax",
      x: isKcst ? kcstContactLayout.valueX : contactLayout.valueX,
    },
    {
      key: "email",
      part: "email",
      label: "Email",
      x: isKcst ? kcstContactLayout.valueX : contactLayout.valueX,
    },
    {
      key: "website",
      part: "website",
      label: "Website",
      x: isKcst ? kcstContactLayout.valueX : contactLayout.labelX,
    },
    {
      key: "address",
      part: "address",
      label: "Institute",
      x: contactLayout.addressX,
      skipHotspot: true,
    },
    {
      key: "address",
      part: "address",
      label: "Address",
      x: contactLayout.addressX,
    },
  ];
  const visibleValueRows = valueRows.filter(
    (row) => visibility[row.key] && (isKcst || !row.skipHotspot),
  );
  const awardOffsetY =
    isKcst || visibility.awardStrip ? 0 : hiddenAwardContactOffsetY;
  const firstVisibleValueRowY =
    contactLayout.addressBaselineY -
    (visibleValueRows.length - 1) * contactLayout.rowGap +
    awardOffsetY;
  const hotspots: Hotspot[] = [];

  const kcstProfilePositions = getKcstProfilePositions(
    data,
    style,
    visibility,
    useCanvasMeasurement,
  );

  if (visibility.name) {
    hotspots.push({
      part: "name",
      label: "Name",
      bounds: isHellobell
        ? getRightAlignedTextBounds(
            hellobellProfileLayout.rightX,
            hellobellProfileLayout.nameBaselineY,
            data.name,
            style.name,
            useCanvasMeasurement,
          )
        : getTextBounds(
            isKcst
            ? kcstProfilePositions.nameX
            : profileLayout.nameX,
            isKcst
            ? kcstProfileLayout.baselineY
            : profileLayout.baselineY,
            data.name,
            style.name,
            useCanvasMeasurement,
          ),
    });
  }

  if (visibility.englishName) {
    hotspots.push({
      part: "englishName",
      label: "English name",
      bounds: isHellobell
        ? getRightAlignedTextBounds(
            hellobellProfileLayout.rightX,
            hellobellProfileLayout.englishNameBaselineY,
            data.englishName,
            style.englishName,
            useCanvasMeasurement,
          )
        : getTextBounds(
            profileLayout.nameX,
            profileLayout.baselineY + style.englishName.size + 12,
            data.englishName,
            style.englishName,
            useCanvasMeasurement,
          ),
    });
  }

  if (visibility.role) {
    hotspots.push({
      part: "role",
      label: "Role",
      bounds: isHellobell
        ? getRightAlignedTextBounds(
            hellobellProfileLayout.rightX,
            hellobellProfileLayout.roleBaselineY,
            data.role,
            style.role,
            useCanvasMeasurement,
          )
        : getTextBounds(
            isKcst
          ? kcstProfilePositions.roleX
          : getProfileRoleX(data, style, visibility, useCanvasMeasurement),
            isKcst
            ? kcstProfileLayout.baselineY
            : profileLayout.baselineY,
            data.role,
            style.role,
            useCanvasMeasurement,
          ),
    });
  }

  if (visibility.logo && selectedLogoPreset === "custom" && data.logo) {
    const logoX = cardContentMargin;
    const logoY = -18 + style.logoOffsetY;
    const logoBounds = customLogoDimensions
      ? getContainedImageBounds(
          customLogoDimensions,
          logoX,
          logoY,
          style.logoSize,
          style.logoSize,
        )
      : {
          x: logoX,
          y: Math.max(0, logoY),
          width: style.logoSize,
          height: Math.max(1, style.logoSize + logoY),
        };

    hotspots.push({
      part: "logo",
      label: "Logo",
      bounds: logoBounds,
    });
  }

  visibleValueRows.forEach((row, index) => {
    const font = style[row.part];
    const addressOffsetY =
      isKcst && row.key === "address" ? kcstContactLayout.addressOffsetY : 0;
    const baselineY =
      firstVisibleValueRowY + index * contactLayout.rowGap + addressOffsetY;

    if (row.skipHotspot) {
      return;
    }

    hotspots.push({
      part: row.part,
      label: row.label,
      bounds: getTextBounds(
        row.x,
        baselineY,
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
  selectedLogoPreset,
  selectedOpenxPart,
  onSelectOpenxPart,
  canEditStyle,
  canSave,
}: CardPreviewPanelProps) => {
  const [canMeasureText, setCanMeasureText] = useState(false);
  const [loadedCustomLogoDimensions, setLoadedCustomLogoDimensions] =
    useState<LoadedImageDimensions | null>(null);
  const [visibleLabelPart, setVisibleLabelPart] =
    useState<OpenxEditablePart | null>(null);
  const labelTimeoutRef = useRef<number | null>(null);
  const customLogoDimensions =
    selectedLogoPreset === "custom" &&
    loadedCustomLogoDimensions?.src === data.logo
      ? loadedCustomLogoDimensions
      : null;
  const hotspots = buildHotspots(
    data,
    style,
    visibility,
    selectedLogoPreset,
    canMeasureText,
    customLogoDimensions,
  );

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

  useEffect(() => {
    if (selectedLogoPreset !== "custom" || !data.logo) {
      return;
    }

    let isActive = true;
    const image = new Image();

    image.onload = () => {
      if (!isActive) {
        return;
      }

      setLoadedCustomLogoDimensions({
        src: data.logo,
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height,
      });
    };
    image.src = data.logo;

    return () => {
      isActive = false;
    };
  }, [data.logo, selectedLogoPreset]);

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
                    } z-10`}
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
