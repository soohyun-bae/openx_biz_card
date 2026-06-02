import {
  cardSize,
  initialContentVisibility,
  logoPresets,
  openxDefaultStyle,
  sponsorLogoPresets,
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

const profileLayout = {
  nameX: 72,
  baselineY: 210,
  roleGap: 36,
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
  const letterSpacing = setFont(
    context,
    Math.min(width, height) * 0.36,
    800,
    4,
  );
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

const mergeOpenxStyle = (style?: Partial<OpenxCardStyle>): OpenxCardStyle => ({
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

const drawOpenxLogo = (
  context: CanvasRenderingContext2D,
  logo: HTMLImageElement | null,
  style: OpenxCardStyle,
  logoPreset: LogoPresetId,
) => {
  const x = logoPreset === "kcst" ? 65 : 72;
  const y = logoPreset === "kcst" ? -95 : -20;
  const logoSize =
    logoPreset === "kcst" ? style.logoSize * 1.6 : style.logoSize;

  if (logo) {
    drawLogoBox(
      context,
      logo,
      "OPENX",
      x,
      y,
      logoSize,
      style.logoBackground,
      style.logoColor,
    );
    return;
  }

  if (logoPreset === "custom") {
    drawLogoBox(
      context,
      null,
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

  if (logoPreset === "kcst") {
    context.textAlign = "left";
    setFont(context, Math.round(style.logoSize * 0.34), 800, 1);
    drawText(context, "OPENX", x, y + style.logoSize * 0.52, 1);
    context.fillRect(x, y + style.logoSize * 0.68, style.logoSize * 1.22, 8);
    context.restore();
    return;
  }

  if (logoPreset === "hellobell") {
    context.fillRect(x, y, style.logoSize, style.logoSize);
    drawLogoText(
      context,
      "HelloBell",
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
  const roleX = visibility.name
    ? profileLayout.nameX +
      measureText(
        context,
        data.name,
        setFont(context, style.name.size, style.name.weight, style.name.letterSpacing),
      ) +
      profileLayout.roleGap
    : profileLayout.nameX;

  drawVisibleText(
    context,
    visibility.name,
    data.name,
    profileLayout.nameX,
    profileLayout.baselineY,
    style.primaryColor,
    style.name,
  );
  drawVisibleText(
    context,
    visibility.role,
    data.role,
    roleX,
    profileLayout.baselineY,
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
  const markColor = "#DBAD24";
  const labelX = 72;
  const markX = 104;
  const valueX = 132;
  const rowY = 350;
  const rowGap = 38;
  const addressValueFont = {
    ...style.contact,
    weight: 400,
  };
  const rows = [
    {
      key: "phone",
      label: "T",
      value: data.phone,
      font: addressValueFont,
    },
    {
      key: "fax",
      label: "F",
      value: data.fax,
      font: addressValueFont,
    },
    {
      key: "email",
      label: "E",
      value: data.email,
      font: addressValueFont,
    },
    {
      key: "website",
      label: "H",
      value: data.website,
      font: {
        ...style.website,
        size: addressValueFont.size,
        weight: addressValueFont.weight,
      },
    },
    {
      key: "address",
      label: "",
      value: data.address,
      font: addressValueFont,
    },
  ] as const;

  rows.forEach((row, index) => {
    if (!visibility[row.key]) {
      return;
    }

    const y = rowY + index * rowGap;

    if (!row.label) {
      drawStyledText(
        context,
        row.value,
        labelX,
        y,
        style.secondaryColor,
        row.font,
      );
      return;
    }

    drawStyledText(context, row.label, labelX, y, style.secondaryColor, {
      ...style.contact,
      weight: 700,
    });
    drawStyledText(context, "x", markX, y, markColor, {
      ...style.contact,
      weight: 400,
    });
    drawStyledText(
      context,
      row.value,
      valueX,
      y,
      style.secondaryColor,
      row.font,
    );
  });
};

const drawOpenxAwardStrip = (
  context: CanvasRenderingContext2D,
  awardLogo: HTMLImageElement | null,
  style: OpenxCardStyle,
) => {
  const stripColor = "#D1D6DF";
  const stripHeight = 60;
  const tailHeight = 10;
  const stripTop = cardSize.height - stripHeight;
  const stripCenterY = stripTop + 32;
  const tailTop = cardSize.height - tailHeight;
  const curveStartX = cardSize.width * (2 / 3);
  const curveEndX = curveStartX + 92;

  context.save();
  context.fillStyle = stripColor;
  context.beginPath();
  context.moveTo(0, cardSize.height);
  context.lineTo(0, stripTop);
  context.lineTo(curveStartX, stripTop);
  context.bezierCurveTo(
    curveStartX + 42,
    stripTop,
    curveStartX + 48,
    tailTop,
    curveEndX,
    tailTop,
  );
  context.lineTo(cardSize.width, tailTop);
  context.lineTo(cardSize.width, cardSize.height);
  context.closePath();
  context.fill();

  if (awardLogo) {
    drawImageNatural(context, awardLogo, 85, stripCenterY, 86, 28);
  }

  context.fillStyle = style.primaryColor;
  context.textAlign = "left";
  context.textBaseline = "middle";
  setFont(context, 20, 700, 0);
  drawText(context, "고용노동부 장관상 수상 기업", 110, stripTop + 32);
  context.restore();
};

const drawOpenxSponsor = (
  context: CanvasRenderingContext2D,
  sponsorLogo: HTMLImageElement | null,
  style: OpenxCardStyle,
  visibility: CardContentVisibility,
) => {
  if (!visibility.sponsorImage) {
    return;
  }

  context.save();
  const sponsorX = 750;
  const sponsorImageY = 90;
  const sponsorImageMaxWidth = 260;
  const sponsorImageMaxHeight = 48;

  context.textAlign = "left";
  context.strokeStyle = style.borderColor;
  context.fillStyle = "#ffffff";
  context.lineWidth = 2;
  context.fillStyle = style.primaryColor;
  setFont(context, 14, 700, 0.8);
  drawText(context, "브랜드어워즈공식주관사", sponsorX, 80, 0.8);

  if (sponsorLogo) {
    const ratio = Math.min(
      1,
      sponsorImageMaxWidth / sponsorLogo.width,
      sponsorImageMaxHeight / sponsorLogo.height,
    );
    const drawWidth = sponsorLogo.width * ratio;
    const drawHeight = sponsorLogo.height * ratio;

    context.drawImage(
      sponsorLogo,
      sponsorX,
      sponsorImageY,
      drawWidth,
      drawHeight,
    );
    context.restore();
    return;
  }

  setFont(context, 20, 700, 2);
  drawText(context, "OPENX", sponsorX, 134, 2);
  context.restore();
};

const drawOpenxTemplate = (
  context: CanvasRenderingContext2D,
  logo: HTMLImageElement | null,
  sponsorLogo: HTMLImageElement | null,
  awardLogo: HTMLImageElement | null,
  data: CardData,
  styleInput?: Partial<OpenxCardStyle>,
  visibilityInput?: CardContentVisibility,
  logoPreset: LogoPresetId = "openx",
) => {
  const style = mergeOpenxStyle(styleInput);
  const visibility = visibilityInput ?? initialContentVisibility;

  drawOpenxBackground(context, style);
  if (visibility.logo) {
    drawOpenxLogo(context, logo, style, logoPreset);
  }
  drawOpenxSponsor(context, sponsorLogo, style, visibility);
  drawOpenxProfile(context, data, style, visibility);
  drawOpenxContact(context, data, style, visibility);
  drawOpenxAwardStrip(context, awardLogo, style);
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
  const selectedLogoPreset = logoPresets.find(
    (preset) => preset.id === styles?.logoPreset,
  );
  const presetLogoSrc =
    styles?.logoPreset === "custom" ? data.logo : selectedLogoPreset?.src;
  const logo =
    styles?.content?.logo === false
      ? null
      : await loadLogo(presetLogoSrc ?? "");
  const selectedSponsorLogoPreset = sponsorLogoPresets[0];
  const sponsorLogo =
    styles?.content?.sponsorImage === false
      ? null
      : await loadLogo(selectedSponsorLogoPreset?.src ?? "");
  const awardLogo = await loadLogo("/logos/biz-card-bottom-logo.png");

  context.save();
  context.scale(scale, scale);
  context.clearRect(0, 0, cardSize.width, cardSize.height);
  context.textBaseline = "alphabetic";

  drawOpenxTemplate(
    context,
    logo,
    sponsorLogo,
    awardLogo,
    data,
    styles?.openx,
    styles?.content,
    styles?.logoPreset,
  );

  context.restore();
};
