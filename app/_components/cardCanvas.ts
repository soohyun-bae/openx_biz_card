import {
  cardSize,
  initialContentVisibility,
  openxDefaultStyle,
} from "./businessCardData";
import type {
  CardContentVisibility,
  CardData,
  FontStyle,
  LogoPresetId,
  OpenxCardStyle,
} from "./businessCardTypes";

const setFont = (
  context: CanvasRenderingContext2D,
  size: number,
  weight: number | string = 400,
  letterSpacing = 0,
) => {
  context.font = `${weight} ${size}px Arial, Helvetica, sans-serif`;
  return letterSpacing;
};

const measureText = (
  context: CanvasRenderingContext2D,
  text: string,
  letterSpacing = 0,
) => {
  const characters = Array.from(text);
  const textWidth = characters.reduce(
    (width, character) => width + context.measureText(character).width,
    0,
  );

  return textWidth + Math.max(characters.length - 1, 0) * letterSpacing;
};

const drawText = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  letterSpacing = 0,
) => {
  if (!letterSpacing) {
    context.fillText(text, x, y);
    return;
  }

  const align = context.textAlign;
  const textWidth = measureText(context, text, letterSpacing);
  let cursorX = x;

  if (align === "center") {
    cursorX -= textWidth / 2;
  }

  if (align === "right" || align === "end") {
    cursorX -= textWidth;
  }

  context.textAlign = "left";
  Array.from(text).forEach((character) => {
    context.fillText(character, cursorX, y);
    cursorX += context.measureText(character).width + letterSpacing;
  });
  context.textAlign = align;
};

const drawStyledText = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string,
  font: FontStyle,
) => {
  context.fillStyle = color;
  context.textAlign = "left";
  const letterSpacing = setFont(
    context,
    font.size,
    font.weight,
    font.letterSpacing,
  );
  drawText(context, text, x, y, letterSpacing);
};

const drawVisibleText = (
  context: CanvasRenderingContext2D,
  isVisible: boolean,
  text: string,
  x: number,
  y: number,
  color: string,
  font: FontStyle,
) => {
  if (!isVisible) {
    return;
  }

  drawStyledText(context, text, x, y, color, font);
};

const loadLogo = (src: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }

    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });

const drawImageNatural = (
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  centerX: number,
  centerY: number,
  maxWidth: number,
  maxHeight: number,
) => {
  const ratio = Math.min(1, maxWidth / image.width, maxHeight / image.height);
  const drawWidth = image.width * ratio;
  const drawHeight = image.height * ratio;

  context.drawImage(
    image,
    centerX - drawWidth / 2,
    centerY - drawHeight / 2,
    drawWidth,
    drawHeight,
  );
};

const drawLogoText = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
) => {
  context.fillStyle = color;
  context.textAlign = "center";
  const letterSpacing = setFont(context, Math.min(width, height) * 0.36, 800, 4);
  drawText(
    context,
    text.slice(0, 2).toUpperCase(),
    x + width / 2,
    y + height * 0.6,
    letterSpacing,
  );
};

const drawLogoBox = (
  context: CanvasRenderingContext2D,
  image: HTMLImageElement | null,
  fallbackText: string,
  x: number,
  y: number,
  size: number,
  background: string,
  color: string,
) => {
  context.save();

  if (image) {
    drawImageNatural(context, image, x + size / 2, y + size / 2, size, size);
  } else {
    context.fillStyle = background;
    context.fillRect(x, y, size, size);
    drawLogoText(context, fallbackText, x, y, size, size, color);
  }

  context.restore();
};

const mergeOpenxStyle = (
  style?: Partial<OpenxCardStyle>,
): OpenxCardStyle => ({
  ...openxDefaultStyle,
  ...style,
  name: {
    ...openxDefaultStyle.name,
    ...style?.name,
  },
  role: {
    ...openxDefaultStyle.role,
    ...style?.role,
  },
  contact: {
    ...openxDefaultStyle.contact,
    ...style?.contact,
  },
  website: {
    ...openxDefaultStyle.website,
    ...style?.website,
  },
});

const drawOpenxBackground = (
  context: CanvasRenderingContext2D,
  style: OpenxCardStyle,
) => {
  context.fillStyle = style.backgroundColor;
  context.fillRect(0, 0, cardSize.width, cardSize.height);
};

const drawOpenxBorder = (
  context: CanvasRenderingContext2D,
  style: OpenxCardStyle,
) => {
  context.strokeStyle = style.borderColor;
  context.lineWidth = style.borderWidth;
  context.strokeRect(56, 56, 938, 488);
};

const drawOpenxLogo = (
  context: CanvasRenderingContext2D,
  logo: HTMLImageElement | null,
  style: OpenxCardStyle,
  logoPreset: LogoPresetId,
) => {
  const x = 72;
  const y = 64;

  if (logoPreset === "custom") {
    drawLogoBox(
      context,
      logo,
      "OPENX",
      x,
      y,
      style.logoSize,
      style.logoBackground,
      style.logoColor,
    );
    return;
  }

  context.save();
  context.fillStyle = style.logoBackground;
  context.strokeStyle = style.logoBackground;

  if (logoPreset === "wordmark") {
    context.textAlign = "left";
    setFont(context, Math.round(style.logoSize * 0.34), 800, 1);
    drawText(context, "OPENX", x, y + style.logoSize * 0.52, 1);
    context.fillRect(x, y + style.logoSize * 0.68, style.logoSize * 1.22, 8);
    context.restore();
    return;
  }

  if (logoPreset === "square") {
    context.fillRect(x, y, style.logoSize, style.logoSize);
    drawLogoText(
      context,
      "OX",
      x,
      y,
      style.logoSize,
      style.logoSize,
      style.logoColor,
    );
    context.restore();
    return;
  }

  context.lineWidth = 9;
  context.beginPath();
  context.moveTo(x + 4, y + style.logoSize * 0.5);
  context.lineTo(x + style.logoSize * 0.38, y + 4);
  context.lineTo(x + style.logoSize - 4, y + style.logoSize - 4);
  context.stroke();
  context.beginPath();
  context.arc(
    x + style.logoSize * 0.72,
    y + style.logoSize * 0.32,
    style.logoSize * 0.18,
    0,
    Math.PI * 2,
  );
  context.fill();
  context.restore();
};

const drawOpenxProfile = (
  context: CanvasRenderingContext2D,
  data: CardData,
  style: OpenxCardStyle,
  visibility: CardContentVisibility,
) => {
  drawVisibleText(
    context,
    visibility.name,
    data.name,
    72,
    238,
    style.primaryColor,
    style.name,
  );
  drawVisibleText(
    context,
    visibility.role,
    data.role,
    288,
    238,
    style.primaryColor,
    style.role,
  );
};

const drawOpenxContact = (
  context: CanvasRenderingContext2D,
  data: CardData,
  style: OpenxCardStyle,
  visibility: CardContentVisibility,
) => {
  const rows = [
    {
      key: "address",
      value: data.address,
    },
    {
      key: "website",
      value: data.website,
    },
    {
      key: "email",
      value: data.email,
    },
    {
      key: "fax",
      value: `F ${data.fax}`,
    },
    {
      key: "phone",
      value: `M ${data.phone}`,
    },
  ] as const;

  rows.forEach((row, index) => {
    if (!visibility[row.key]) {
      return;
    }

    drawStyledText(
      context,
      row.value,
      72,
      386 + index * 38,
      style.secondaryColor,
      row.key === "website" ? style.website : style.contact,
    );
  });
};

const drawOpenxSponsor = (
  context: CanvasRenderingContext2D,
  style: OpenxCardStyle,
  visibility: CardContentVisibility,
) => {
  if (!visibility.sponsorImage) {
    return;
  }

  context.save();
  context.textAlign = "center";
  context.strokeStyle = style.borderColor;
  context.fillStyle = "#ffffff";
  context.lineWidth = 2;
  context.strokeRect(772, 72, 206, 86);
  context.fillStyle = style.primaryColor;
  setFont(context, 21, 800, 1);
  drawText(
    context,
    "주관사",
    875,
    112,
    1,
  );
  setFont(context, 20, 700, 2);
  drawText(context, "OPENX", 875, 142, 2);
  context.restore();
};

const drawOpenxTemplate = (
  context: CanvasRenderingContext2D,
  logo: HTMLImageElement | null,
  data: CardData,
  styleInput?: Partial<OpenxCardStyle>,
  visibilityInput?: CardContentVisibility,
  logoPreset: LogoPresetId = "openx",
) => {
  const style = mergeOpenxStyle(styleInput);
  const visibility = visibilityInput ?? initialContentVisibility;

  drawOpenxBackground(context, style);
  drawOpenxBorder(context, style);
  if (visibility.logo) {
    drawOpenxLogo(context, logo, style, logoPreset);
  }
  drawOpenxSponsor(context, style, visibility);
  drawOpenxProfile(context, data, style, visibility);
  drawOpenxContact(context, data, style, visibility);
};

export const drawCard = async (
  context: CanvasRenderingContext2D,
  data: CardData,
  scale = 1,
  styles?: {
    openx?: Partial<OpenxCardStyle>;
    content?: CardContentVisibility;
    logoPreset?: LogoPresetId;
  },
) => {
  const logo =
    styles?.logoPreset === "custom" ? await loadLogo(data.logo) : null;

  context.save();
  context.scale(scale, scale);
  context.clearRect(0, 0, cardSize.width, cardSize.height);
  context.textBaseline = "alphabetic";

  drawOpenxTemplate(
    context,
    logo,
    data,
    styles?.openx,
    styles?.content,
    styles?.logoPreset,
  );

  context.restore();
};
