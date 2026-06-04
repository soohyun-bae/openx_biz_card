import {
  cardContentMargin,
  cardSize,
  initialContentVisibility,
  logoPresets,
  openxDefaultStyle,
  sponsorLogoPresets,
} from "./businessCardData";
import type {
  CardContentVisibility,
  CardData,
  CardTemplateId,
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

const kcstProfileLayout = {
  rightX: cardSize.width - cardContentMargin,
  baselineY: 180,
  gap: 28,
};

const contactLayout = {
  labelX: cardContentMargin,
  valueX: cardContentMargin + 40,
  addressBaselineY: cardSize.height - awardStripHeight - addressAwardGap,
  rowGap: 37,
};

const kcstContactLayout = {
  addressOffsetY: 18,
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

const drawCustomLogoUploadGuide = (
  context: CanvasRenderingContext2D,
  style: OpenxCardStyle,
) => {
  context.save();
  context.fillStyle = style.primaryColor;
  context.textAlign = "left";
  setFont(context, 24, 700, 0);
  drawText(
    context,
    "내용 수정 단계에서  이미지를 첨부해주세요.",
    cardContentMargin,
    cardContentMargin + 24,
  );
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
  phone: {
    ...openxDefaultStyle.phone,
    ...style?.phone,
  },
  fax: {
    ...openxDefaultStyle.fax,
    ...style?.fax,
  },
  email: {
    ...openxDefaultStyle.email,
    ...style?.email,
  },
  website: {
    ...openxDefaultStyle.website,
    ...style?.website,
  },
  address: {
    ...openxDefaultStyle.address,
    ...style?.address,
  },
});

const drawOpenxBackground = (
  context: CanvasRenderingContext2D,
  style: OpenxCardStyle,
) => {
  context.fillStyle = style.backgroundColor;
  context.fillRect(0, 0, cardSize.width, cardSize.height);
};

const drawKcstBackground = (
  context: CanvasRenderingContext2D,
  background: HTMLImageElement | null,
  style: OpenxCardStyle,
) => {
  drawOpenxBackground(context, style);

  if (!background) {
    return;
  }

  const maxWidth = cardSize.width * 0.55;
  const maxHeight = cardSize.height * 0.7;
  const ratio = Math.min(
    maxWidth / background.width,
    maxHeight / background.height,
  );
  const drawWidth = background.width * ratio;
  const drawHeight = background.height * ratio;

  context.save();
  context.globalAlpha = 0.05;
  context.drawImage(
    background,
    (cardSize.width - drawWidth) / 2,
    (cardSize.height - drawHeight) / 2,
    drawWidth,
    drawHeight,
  );
  context.restore();
};

const drawOpenxLogo = (
  context: CanvasRenderingContext2D,
  logo: HTMLImageElement | null,
  style: OpenxCardStyle,
  logoPreset: LogoPresetId,
) => {
  const x = cardContentMargin;
  const y = logoPreset === "openx" ? cardContentMargin : -18;
  const logoSize = style.logoSize;

  if (logoPreset === "openx" && logo) {
    context.drawImage(logo, x, y, openxLogoSize.width, openxLogoSize.height);
    return;
  }

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
    drawCustomLogoUploadGuide(context, style);
    return;
  }

  context.save();
  context.fillStyle = style.logoBackground;
  context.strokeStyle = style.logoBackground;

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

const drawKcstLogo = (
  context: CanvasRenderingContext2D,
  logo: HTMLImageElement | null,
  style: OpenxCardStyle,
) => {
  const x = cardContentMargin;
  const y = -119;
  const logoSize = style.logoSize * 2;

  context.save();

  if (logo) {
    drawLogoBox(
      context,
      logo,
      "KCST",
      x,
      y,
      logoSize,
      style.logoBackground,
      style.logoColor,
    );
    context.restore();
    return;
  }

  context.fillStyle = style.logoBackground;
  context.textAlign = "left";
  setFont(context, Math.round(style.logoSize * 0.34), 800, 1);
  drawText(context, "KCST", x, y + style.logoSize * 0.52, 1);
  context.fillRect(x, y + style.logoSize * 0.68, style.logoSize * 1.22, 8);
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
        setFont(
          context,
          style.name.size,
          style.name.weight,
          style.name.letterSpacing,
        ),
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

const drawKcstProfile = (
  context: CanvasRenderingContext2D,
  data: CardData,
  style: OpenxCardStyle,
  visibility: CardContentVisibility,
) => {
  const roleWidth = visibility.role
    ? measureText(
        context,
        data.role,
        setFont(
          context,
          style.role.size,
          style.role.weight,
          style.role.letterSpacing,
        ),
      )
    : 0;
  const nameWidth = visibility.name
    ? measureText(
        context,
        data.name,
        setFont(
          context,
          style.name.size,
          style.name.weight,
          style.name.letterSpacing,
        ),
      )
    : 0;
  const visibleGap =
    visibility.role && visibility.name ? kcstProfileLayout.gap : 0;
  const roleX = kcstProfileLayout.rightX - roleWidth - visibleGap - nameWidth;
  const nameX = roleX + roleWidth + visibleGap;

  drawVisibleText(
    context,
    visibility.role,
    data.role,
    roleX,
    kcstProfileLayout.baselineY,
    style.primaryColor,
    style.role,
  );
  drawVisibleText(
    context,
    visibility.name,
    data.name,
    nameX,
    kcstProfileLayout.baselineY,
    style.primaryColor,
    style.name,
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
      key: "phone",
      label: "T",
      value: data.phone,
      font: style.phone,
    },
    {
      key: "fax",
      label: "F",
      value: data.fax,
      font: style.fax,
    },
    {
      key: "email",
      label: "E",
      value: data.email,
      font: style.email,
    },
    {
      key: "website",
      label: "",
      value: data.website,
      font: style.website,
    },
    {
      key: "address",
      label: "",
      value: data.address,
      font: style.address,
    },
  ] as const;
  const visibleRows = rows.filter((row) => visibility[row.key]);
  const awardOffsetY = visibility.awardStrip ? 0 : hiddenAwardContactOffsetY;
  const firstVisibleRowY =
    contactLayout.addressBaselineY -
    (visibleRows.length - 1) * contactLayout.rowGap +
    awardOffsetY;

  visibleRows.forEach((row, index) => {
    const y = firstVisibleRowY + index * contactLayout.rowGap;

    if (!row.label) {
      drawStyledText(
        context,
        row.value,
        contactLayout.labelX,
        y,
        style.secondaryColor,
        row.font,
      );
      return;
    }

    drawStyledText(
      context,
      row.label,
      contactLayout.labelX,
      y,
      style.secondaryColor,
      {
        ...row.font,
        weight: 700,
      },
    );
    drawStyledText(
      context,
      row.value,
      contactLayout.valueX,
      y,
      style.secondaryColor,
      row.font,
    );
  });
};

const drawKcstContact = (
  context: CanvasRenderingContext2D,
  data: CardData,
  style: OpenxCardStyle,
  visibility: CardContentVisibility,
) => {
  const badgeColor = "#E0AF6C";
  const badgeSize = 28;
  const badgeTextFont = {
    ...style.contact,
    size: 16,
    weight: 700,
    letterSpacing: 0,
  };
  const instituteFont = {
    ...style.address,
    weight: 600,
  };
  const rows = [
    {
      key: "phone",
      label: "T",
      value: data.phone,
      font: style.phone,
    },
    {
      key: "fax",
      label: "F",
      value: data.fax,
      font: style.fax,
    },
    {
      key: "email",
      label: "E",
      value: data.email,
      font: style.email,
    },
    {
      key: "website",
      label: "H",
      value: data.website,
      font: style.website,
    },
    {
      key: "address",
      label: "",
      value: "대한민국고객만족평가원",
      font: instituteFont,
    },
    {
      key: "address",
      label: "",
      value: data.address,
      font: style.address,
    },
  ] as const;
  const visibleRows = rows.filter((row) => visibility[row.key]);
  const firstVisibleRowY =
    contactLayout.addressBaselineY -
    (visibleRows.length - 1) * contactLayout.rowGap;

  visibleRows.forEach((row, index) => {
    const addressOffsetY =
      row.key === "address" ? kcstContactLayout.addressOffsetY : 0;
    const y = firstVisibleRowY + index * contactLayout.rowGap + addressOffsetY;

    if (!row.label) {
      drawStyledText(
        context,
        row.value,
        contactLayout.labelX,
        y,
        style.secondaryColor,
        row.font,
      );
      return;
    }

    const badgeX = contactLayout.labelX;
    const badgeCenterX = badgeX + badgeSize / 2;
    const badgeCenterY = y - badgeSize / 2 + 4;

    context.save();
    context.fillStyle = badgeColor;
    context.beginPath();
    context.arc(badgeCenterX, badgeCenterY, badgeSize / 2, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#ffffff";
    context.textAlign = "center";
    context.textBaseline = "middle";
    setFont(
      context,
      badgeTextFont.size,
      badgeTextFont.weight,
      badgeTextFont.letterSpacing,
    );
    drawText(context, row.label, badgeCenterX, badgeCenterY);
    context.restore();

    drawStyledText(
      context,
      row.value,
      badgeX + badgeSize + 18,
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
  showContent: boolean,
) => {
  if (!showContent) {
    return;
  }

  const stripColor = "#D1D6DF";
  const stripHeight = awardStripHeight;
  const tailHeight = 9;
  const stripTop = cardSize.height - stripHeight;
  const stripCenterY = stripTop + 29;
  const tailTop = cardSize.height - tailHeight;
  const curveStartX = cardSize.width * 0.61;
  const curveEndX = curveStartX + 75;

  context.save();
  context.fillStyle = stripColor;
  context.beginPath();
  context.moveTo(0, cardSize.height);
  context.lineTo(0, stripTop);
  context.lineTo(curveStartX, stripTop);
  context.bezierCurveTo(
    curveStartX + 34,
    stripTop,
    curveStartX + 39,
    tailTop,
    curveEndX,
    tailTop,
  );
  context.lineTo(cardSize.width, tailTop);
  context.lineTo(cardSize.width, cardSize.height);
  context.closePath();
  context.fill();

  if (awardLogo) {
    drawImageNatural(
      context,
      awardLogo,
      cardContentMargin + 20,
      stripCenterY,
      70,
      30,
    );
  }

  context.fillStyle = "#575757";
  context.textAlign = "left";
  context.textBaseline = "middle";
  setFont(context, 20, 700, 0);
  drawText(
    context,
    "고용노동부 장관상 수상 기업",
    cardContentMargin + 50,
    stripTop + 31,
  );
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
  const sponsorImageMaxWidth = 250;
  const sponsorX = 570;
  const sponsorImageY = 50;
  const sponsorImageMaxHeight = 90;

  context.textAlign = "left";
  context.fillStyle = "#ffffff";
  context.lineWidth = 2;
  context.fillStyle = style.primaryColor;
  setFont(context, 14, 700, 0.8);
  // drawText(context, "브랜드어워즈공식주관사", sponsorX, 73, 0.8);

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
  drawText(context, "OPENX", sponsorX, 123, 2);
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
  drawOpenxAwardStrip(context, awardLogo, style, visibility.awardStrip);
};

const drawKcstTemplate = (
  context: CanvasRenderingContext2D,
  logo: HTMLImageElement | null,
  background: HTMLImageElement | null,
  data: CardData,
  styleInput?: Partial<OpenxCardStyle>,
  visibilityInput?: CardContentVisibility,
) => {
  const style = mergeOpenxStyle(styleInput);
  const visibility = visibilityInput ?? initialContentVisibility;

  // KCST keeps the business-card content system but owns its logo/template layer.
  drawKcstBackground(context, background, style);
  if (visibility.logo) {
    drawKcstLogo(context, logo, style);
  }
  drawKcstProfile(context, data, style, visibility);
  drawKcstContact(context, data, style, visibility);
};

const getCardTemplateId = (logoPreset?: LogoPresetId): CardTemplateId =>
  logoPreset === "kcst" ? "kcst" : "openx";

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
  const templateId = getCardTemplateId(styles?.logoPreset);
  const logo =
    styles?.content?.logo === false
      ? null
      : await loadLogo(presetLogoSrc ?? "");
  const selectedSponsorLogoPreset = sponsorLogoPresets[0];
  const sponsorLogo =
    templateId === "kcst" || styles?.content?.sponsorImage === false
      ? null
      : await loadLogo(selectedSponsorLogoPreset?.src ?? "");
  const awardLogo =
    templateId === "kcst" || styles?.content?.awardStrip === false
      ? null
      : await loadLogo("/logos/biz-card-bottom-logo.png");
  const kcstBackground =
    templateId === "kcst" ? await loadLogo("/logos/kcst-bg.png") : null;

  context.save();
  context.scale(scale, scale);
  context.clearRect(0, 0, cardSize.width, cardSize.height);
  context.textBaseline = "alphabetic";

  if (templateId === "kcst") {
    drawKcstTemplate(
      context,
      logo,
      kcstBackground,
      data,
      styles?.openx,
      styles?.content,
    );
  } else {
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
  }

  context.restore();
};
