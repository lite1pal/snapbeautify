"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, RefreshCw, Copy } from "lucide-react";

export function EditorLayout() {
  const [image, setImage] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    padding: 120,
    shadow: 20,
    rounded: 20,
    backgroundColor: "gradient",
    backgroundPreset: "midnight",
    width: 100, // Width percentage (100% = original size)
    showCode: false,
    codeSnippet: `function hello() {\n  console.log('Hello World!')\n}`,
    useImageColors: false, // New setting for image-based gradient
    imageGradientIndex: 0, // Index of selected image gradient
    aspectRatio: "auto", // Aspect ratio of the background container: auto, 16/9, 4/3, 1/1, 9/16, etc.
    exportFormat: "png", // New setting for export format
  });

  const [originalImg, setOriginalImg] = useState<HTMLImageElement | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Track slider interaction for better UX
  const [activeSlider, setActiveSlider] = useState<string | null>(null);

  // State for custom generated presets
  const [customBackgroundPresets, setCustomBackgroundPresets] = useState<
    Record<string, [string, string]>
  >({});
  const [useCustomPresets, setUseCustomPresets] = useState<boolean>(false);

  // Function to generate a random color in HSL format
  const generateRandomColor = () => {
    // Generate random HSL values
    const h = Math.floor(Math.random() * 360); // Hue: 0-359
    const s = 65 + Math.floor(Math.random() * 20); // Saturation: 65-85%
    const l = 50 + Math.floor(Math.random() * 20); // Lightness: 50-70%
    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  // Function to generate a complementary or analogous color
  const generateHarmoniousColor = (baseColor: string) => {
    // Parse the HSL values from the base color
    const hslMatch = baseColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!hslMatch) return generateRandomColor();

    const h = parseInt(hslMatch[1]);
    const s = parseInt(hslMatch[2]);
    const l = parseInt(hslMatch[3]);

    // Choose a color relationship (analogous, complementary, etc.)
    const relationship = Math.floor(Math.random() * 3);
    let newH;

    switch (relationship) {
      case 0: // Analogous (+30 degrees)
        newH = (h + 30) % 360;
        break;
      case 1: // Analogous (-30 degrees)
        newH = (h - 30 + 360) % 360;
        break;
      case 2: // Complementary (+180 degrees)
        newH = (h + 180) % 360;
        break;
      default:
        newH = h;
    }

    // Vary the saturation and lightness slightly
    const newS = Math.max(Math.min(s + (Math.random() * 20 - 10), 100), 50);
    const newL = Math.max(Math.min(l + (Math.random() * 20 - 10), 75), 40);

    return `hsl(${newH}, ${newS}%, ${newL}%)`;
  };

  // Function to generate a new set of gradient presets
  const generateCustomPresets = () => {
    const customPresets: Record<string, [string, string]> = {};

    const categories = [
      "custom1",
      "custom2",
      "custom3",
      "custom4",
      "custom5",
      "custom6",
      "custom7",
      "custom8",
      "custom9",
      "custom10",
      "custom11",
      "custom12",
      "custom13",
      "custom14",
      "custom15",
    ];

    categories.forEach((category) => {
      const baseColor = generateRandomColor();
      const secondColor = generateHarmoniousColor(baseColor);

      try {
        customPresets[category] = [baseColor, secondColor];
      } catch (e) {
        customPresets[category] = ["#61d2ff", "#6ba1ff"]; // Fallback to a safe gradient
      }
    });

    return customPresets;
  };

  // Function to handle regenerating and using custom presets
  const handleRegeneratePresets = () => {
    const newPresets = generateCustomPresets();
    setCustomBackgroundPresets(newPresets);
    setUseCustomPresets(true);

    // If we switched to custom presets, update the background preset to the first custom one
    if (!useCustomPresets) {
      setSettings((prev) => ({
        ...prev,
        backgroundPreset: "custom1",
        useImageColors: false,
      }));
    } else if (useCustomPresets) {
      // When switching to default presets, set to midnight (or another default)
      setSettings((prev) => ({
        ...prev,
        backgroundPreset: "midnight",
        useImageColors: false,
      }));
    }
  };

  // Generate initial custom presets if none exist
  useEffect(() => {
    if (Object.keys(customBackgroundPresets).length === 0) {
      setCustomBackgroundPresets(generateCustomPresets());
    }
  }, []);

  // Enhanced background color presets - more beautiful gradients
  const backgroundPresets = {
    // Row 1
    peach: ["#ffb076", "#ff9a5a"],
    coral: ["#ff7285", "#ff5a8b"],
    blush: ["#ffb6c1", "#ffc8d3"],
    mint: ["#a9f1df", "#86e3cd"],
    lavender: ["#c1b7ff", "#d1c4ff"],

    // Row 2
    lime: ["#b4e876", "#8ed56b"],
    cobalt: ["#6678ff", "#826fff"],
    sunset: ["#ff6b6b", "#6b8cff"],
    oceanBreeze: ["#61d2ff", "#6ba1ff"],
    midnight: ["#1c2440", "#2a3c70"],

    // Row 3
    ruby: ["#ff5e62", "#ff9966"],
    goldenHour: ["#f9d976", "#f39f86"],
    ember: ["#ff7d59", "#ff5631"],
    tropicalWater: ["#43c6ac", "#f8ffae"],
    twilight: ["#6441a5", "#2a0845"],
  };

  // Store extracted colors from the image
  const [extractedColors, setExtractedColors] = useState<string[][]>([]);

  // Function to extract dominant colors from an image
  const extractColorsFromImage = (
    img: HTMLImageElement
  ): Promise<string[][]> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve([["#1c2440", "#2a3c70"]]); // Default fallback colors
        return;
      }

      // Set canvas size - reducing size for performance
      const maxSize = 150; // Increase sample size slightly for better color representation
      const ratio = img.width / img.height;
      let width = ratio >= 1 ? maxSize : maxSize * ratio;
      let height = ratio >= 1 ? maxSize / ratio : maxSize;

      canvas.width = width;
      canvas.height = height;

      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Get image data
      const imageData = ctx.getImageData(0, 0, width, height).data;

      // Sample colors from different regions of the image
      const colorMap: Record<
        string,
        { count: number; rgb: [number, number, number] }
      > = {};
      const samplingStep = 4; // Sample every 4 pixels for better balance of performance and accuracy

      // Functions to help with color analysis
      const rgbToHsl = (
        r: number,
        g: number,
        b: number
      ): [number, number, number] => {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0,
          s = 0,
          l = (max + min) / 2;

        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

          switch (max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h = (b - r) / d + 2;
              break;
            case b:
              h = (r - g) / d + 4;
              break;
          }

          h /= 6;
        }

        return [h, s, l];
      };

      const hslToRgb = (
        h: number,
        s: number,
        l: number
      ): [number, number, number] => {
        let r, g, b;

        if (s === 0) {
          r = g = b = l;
        } else {
          const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
          };

          const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          const p = 2 * l - q;

          r = hue2rgb(p, q, h + 1 / 3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1 / 3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
      };

      // Track colors by frequency and store RGB values
      for (let i = 0; i < imageData.length; i += 4 * samplingStep) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];

        // Skip very dark, very light, or low-saturation colors
        const [h, s, l] = rgbToHsl(r, g, b);
        if (l < 0.15 || l > 0.85 || s < 0.15) continue;

        const color = `#${r.toString(16).padStart(2, "0")}${g
          .toString(16)
          .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

        if (colorMap[color]) {
          colorMap[color].count++;
        } else {
          colorMap[color] = { count: 1, rgb: [r, g, b] };
        }
      }

      // Group colors into clusters by hue to find dominant color themes
      const hueGroups: Record<
        number,
        {
          colors: string[];
          totalCount: number;
          avgHsl: [number, number, number];
        }
      > = {};

      Object.entries(colorMap).forEach(([color, { count, rgb }]) => {
        const [h, s, l] = rgbToHsl(...rgb);
        // Group by hue in 30-degree segments (12 main hue groups)
        const hueGroup = Math.floor(h * 12);

        if (!hueGroups[hueGroup]) {
          hueGroups[hueGroup] = {
            colors: [],
            totalCount: 0,
            avgHsl: [0, 0, 0],
          };
        }

        hueGroups[hueGroup].colors.push(color);
        hueGroups[hueGroup].totalCount += count;

        // Update the running average of HSL values
        const currentAvg = hueGroups[hueGroup].avgHsl;
        const totalCount = hueGroups[hueGroup].totalCount;
        hueGroups[hueGroup].avgHsl = [
          (currentAvg[0] * (totalCount - count) + h * count) / totalCount,
          (currentAvg[1] * (totalCount - count) + s * count) / totalCount,
          (currentAvg[2] * (totalCount - count) + l * count) / totalCount,
        ];
      });

      // Sort hue groups by total count
      const sortedHueGroups = Object.entries(hueGroups)
        .sort((a, b) => b[1].totalCount - a[1].totalCount)
        .slice(0, 3); // Take top 3 hue groups

      // Generate multiple gradient options
      const gradientOptions: string[][] = [];

      if (sortedHueGroups.length > 0) {
        // Get top colors from each dominant hue group
        const dominantHueGroup = sortedHueGroups[0][1];

        // Find the most frequent color in this group
        const dominantColor = dominantHueGroup.colors.sort(
          (a, b) => colorMap[b].count - colorMap[a].count
        )[0];

        // Get RGB of dominant color
        const [r, g, b] = colorMap[dominantColor].rgb;

        // Get HSL values
        const [h, s, l] = rgbToHsl(r, g, b);

        // Option 1: Complementary gradient (opposite on color wheel)
        const complementaryH = (h + 0.5) % 1;
        const [cr, cg, cb] = hslToRgb(complementaryH, s, l);
        const complementaryColor = `#${cr.toString(16).padStart(2, "0")}${cg
          .toString(16)
          .padStart(2, "0")}${cb.toString(16).padStart(2, "0")}`;
        gradientOptions.push([dominantColor, complementaryColor]);

        // Option 2: Analogous gradient (slightly shifted hue)
        const analogousH = (h + 0.08) % 1;
        const [ar, ag, ab] = hslToRgb(
          analogousH,
          Math.min(1, s * 1.1),
          Math.min(0.9, l * 0.9)
        );
        const analogousColor = `#${ar.toString(16).padStart(2, "0")}${ag
          .toString(16)
          .padStart(2, "0")}${ab.toString(16).padStart(2, "0")}`;
        gradientOptions.push([dominantColor, analogousColor]);

        // Option 3: Contrast gradient (light/dark variant)
        const variantL = l > 0.5 ? l * 0.6 : l * 1.6;
        const [vr, vg, vb] = hslToRgb(h, s, variantL);
        const variantColor = `#${vr.toString(16).padStart(2, "0")}${vg
          .toString(16)
          .padStart(2, "0")}${vb.toString(16).padStart(2, "0")}`;
        gradientOptions.push([dominantColor, variantColor]);

        // Option 4: If we have another color group, use it
        if (sortedHueGroups.length > 1) {
          const secondHueGroup = sortedHueGroups[1][1];
          const secondColor = secondHueGroup.colors.sort(
            (a, b) => colorMap[b].count - colorMap[a].count
          )[0];
          gradientOptions.push([dominantColor, secondColor]);
        }
      }

      // If we couldn't generate enough options, add fallbacks
      if (gradientOptions.length === 0) {
        gradientOptions.push(["#1c2440", "#2a3c70"]);
      }

      resolve(gradientOptions);
    });
  };

  // Set up clipboard paste event listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (settings.showCode) return; // Skip if in code mode

      // Check if clipboard has images
      if (e.clipboardData && e.clipboardData.items) {
        const items = e.clipboardData.items;

        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
              loadImage(blob);
              e.preventDefault(); // Prevent default paste behavior
              break;
            }
          }
        }
      }
    };

    // Add event listener to the document
    document.addEventListener("paste", handlePaste);

    // Cleanup
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [settings.showCode]); // Re-attach if code mode changes

  const getBackgroundStyle = () => {
    if (!image) return { background: "transparent" };

    if (settings.useImageColors && extractedColors.length > 0) {
      // Use colors extracted from the image
      const colors = extractedColors[settings.imageGradientIndex] || [
        "#FFFFFF",
        "#EEEEEE",
      ];
      return {
        background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
      };
    } else {
      // Use preset colors
      const colors =
        currentPresets[
          settings.backgroundPreset as keyof typeof currentPresets
        ] ||
        currentPresets.midnight ||
        backgroundPresets.midnight;
      return {
        background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
      };
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadImage(file);
    }
  };

  const loadImage = (file: File) => {
    setLoadingImage(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setImage(imageUrl);

      // Create an image element to get dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalImg(img);
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);

        // Extract colors from the image for gradient
        extractColorsFromImage(img).then((gradientOptions) => {
          setExtractedColors(gradientOptions);
          // Auto-enable the image colors option
          setSettings((prev) => ({
            ...prev,
            showCode: false,
            useImageColors: true,
            imageGradientIndex: 0,
          }));
        });

        setLoadingImage(false);
      };
      img.onerror = () => {
        alert("Error loading image. Please try another image.");
        setLoadingImage(false);
      };
      img.src = imageUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      loadImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Helper function to apply the background to canvas consistently for both code and image exports
  const applyBackgroundToCanvas = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    const bgStyle = getBackgroundStyle();

    if (bgStyle.background.includes("linear-gradient")) {
      const gradient = ctx.createLinearGradient(0, 0, width, height);

      // Extract colors from the linear-gradient CSS
      const colorMatch = bgStyle.background.match(
        /linear-gradient\(135deg,\s*(#[a-f0-9]+|rgb\([^)]+\)|hsl\([^)]+\)),\s*(#[a-f0-9]+|rgb\([^)]+\)|hsl\([^)]+\))\)/i
      );

      if (colorMatch && colorMatch.length >= 3) {
        // Use the exact colors from the UI
        gradient.addColorStop(0, colorMatch[1]);
        gradient.addColorStop(1, colorMatch[2]);
      } else {
        // Fallback
        const colors =
          currentPresets[
            settings.backgroundPreset as keyof typeof currentPresets
          ] ||
          currentPresets.midnight ||
          backgroundPresets.midnight;
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1]);
      }

      ctx.fillStyle = gradient;
    } else {
      // For solid backgrounds
      ctx.fillStyle = bgStyle.background;
    }

    ctx.fillRect(0, 0, width, height);
  };

  // Add this function to handle format selection
  const handleFormatChange = (format: string) => {
    setSettings((prev) => ({ ...prev, exportFormat: format }));
  };

  // Update the handleExport function
  const handleExport = () => {
    if (!settings.showCode && (!image || !originalImg)) {
      alert("Please upload an image first or enable code mode");
      return;
    }

    try {
      const exportButton = document.getElementById(
        "export-button"
      ) as HTMLButtonElement;
      if (exportButton) {
        exportButton.disabled = true;
      }

      // Get the preview container
      const previewContainer = document.getElementById(
        "preview-container"
      ) as HTMLElement;
      if (!previewContainer) {
        throw new Error("Preview container not found");
      }

      // Get the actual dimensions of the preview container
      const rect = previewContainer.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Account for device pixel ratio for high-DPI displays
      const dpr = window.devicePixelRatio || 1;

      // Create canvas with high resolution
      const canvas = document.createElement("canvas");
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Scale all drawing operations by the device pixel ratio
      ctx.scale(dpr, dpr);

      if (settings.showCode) {
        // Draw background
        applyBackgroundToCanvas(ctx, width, height);

        // For code, we need to render the code block
        const codeElement = document.getElementById("code-editor");
        if (codeElement) {
          const codeBlockHeight = 120;
          const codeBlockWidth = width - settings.padding * 2;
          const codeX = settings.padding;
          const codeY = (height - codeBlockHeight) / 2;

          // Draw code container background with shadow
          ctx.save();
          ctx.shadowColor = "rgba(0,0,0,0.3)";
          ctx.shadowBlur = 20;
          ctx.shadowOffsetY = 5;
          ctx.shadowOffsetX = 0;

          // Draw code background
          ctx.fillStyle = "rgba(30, 30, 35, 0.9)";
          roundedRect(
            ctx,
            codeX,
            codeY,
            codeBlockWidth,
            codeBlockHeight,
            settings.rounded
          );
          ctx.fill();
          ctx.restore();

          // Draw code text
          ctx.fillStyle = "#ffffff";
          ctx.font = "14px SF Mono, ui-monospace, monospace";
          ctx.fillText("function hello() {", codeX + 20, codeY + 30);
          ctx.fillStyle = "#ffcc00";
          ctx.fillText("  console.log('Hello World!')", codeX + 20, codeY + 60);
          ctx.fillStyle = "#ffffff";
          ctx.fillText("}", codeX + 20, codeY + 90);
        }
      } else if (image && originalImg) {
        // Draw background
        applyBackgroundToCanvas(ctx, width, height);

        // Get the actual displayed image element
        const displayedImg = previewContainer.querySelector(
          "img"
        ) as HTMLImageElement;
        if (!displayedImg) {
          throw new Error("Displayed image not found");
        }

        // Get the actual dimensions of the displayed image
        const imgRect = displayedImg.getBoundingClientRect();
        const imgWidth = imgRect.width;
        const imgHeight = imgRect.height;

        // Create a temporary canvas to draw the image with rounded corners and shadow
        const imgCanvas = document.createElement("canvas");
        imgCanvas.width = imgWidth * dpr;
        imgCanvas.height = imgHeight * dpr;
        const imgCtx = imgCanvas.getContext("2d");
        if (!imgCtx) {
          throw new Error("Could not get image canvas context");
        }

        // Scale the image canvas context
        imgCtx.scale(dpr, dpr);

        // Apply shadow if needed
        if (settings.shadow > 0) {
          imgCtx.save();
          imgCtx.shadowColor = "rgba(0,0,0,0.1)";
          imgCtx.shadowBlur = settings.shadow * 2;
          imgCtx.shadowOffsetY = settings.shadow / 2;
          imgCtx.shadowOffsetX = 0;
        }

        // Create rounded rectangle path for the image
        roundedRect(imgCtx, 0, 0, imgWidth, imgHeight, settings.rounded);
        imgCtx.clip();

        // Draw the image
        imgCtx.drawImage(
          originalImg,
          0,
          0,
          originalImg.width,
          originalImg.height,
          0,
          0,
          imgWidth,
          imgHeight
        );

        if (settings.shadow > 0) {
          imgCtx.restore();
        }

        // Calculate the position to center the image in the canvas
        const imageX = (width - imgWidth) / 2;
        const imageY = (height - imgHeight) / 2;

        // Draw the processed image onto the main canvas
        ctx.drawImage(imgCanvas, imageX, imageY, imgWidth, imgHeight);
      }

      // Convert to data URL with the selected format
      let mimeType: string;
      let quality: number;
      let fileExtension: string;

      switch (settings.exportFormat) {
        case "jpg":
          mimeType = "image/jpeg";
          quality = 0.9; // 90% quality for JPEG
          fileExtension = "jpg";
          break;
        case "webp":
          mimeType = "image/webp";
          quality = 0.9; // 90% quality for WebP
          fileExtension = "webp";
          break;
        case "png":
        default:
          mimeType = "image/png";
          quality = 1; // PNG is lossless
          fileExtension = "png";
          break;
      }

      // For PNG, we don't specify quality as it's lossless
      const dataUrl =
        settings.exportFormat === "png"
          ? canvas.toDataURL(mimeType)
          : canvas.toDataURL(mimeType, quality);

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `snapbeautify-export.${fileExtension}`;
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        if (exportButton) {
          exportButton.disabled = false;
        }
      }, 100);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("There was an error generating your image. Please try again.");

      const exportButton = document.getElementById(
        "export-button"
      ) as HTMLButtonElement;
      if (exportButton) {
        exportButton.disabled = false;
      }
    }
  };

  // Helper function to draw rounded rectangles on canvas
  const roundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  // Get the current set of presets based on user selection
  const currentPresets = useCustomPresets
    ? customBackgroundPresets
    : backgroundPresets;

  // Add this function to handle copying to clipboard
  const handleCopyToClipboard = async () => {
    if (!settings.showCode && (!image || !originalImg)) {
      alert("Please upload an image first or enable code mode");
      return;
    }

    try {
      const copyButton = document.getElementById(
        "copy-button"
      ) as HTMLButtonElement;
      if (copyButton) {
        copyButton.disabled = true;
      }

      // Get the preview container
      const previewContainer = document.getElementById(
        "preview-container"
      ) as HTMLElement;
      if (!previewContainer) {
        throw new Error("Preview container not found");
      }

      // Get the actual dimensions of the preview container
      const rect = previewContainer.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Account for device pixel ratio for high-DPI displays
      const dpr = window.devicePixelRatio || 1;

      // Create canvas with high resolution
      const canvas = document.createElement("canvas");
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Scale all drawing operations by the device pixel ratio
      ctx.scale(dpr, dpr);

      // Reuse the same drawing logic as in handleExport
      if (settings.showCode) {
        // Draw background
        applyBackgroundToCanvas(ctx, width, height);

        // For code, we need to render the code block
        const codeElement = document.getElementById("code-editor");
        if (codeElement) {
          const codeBlockHeight = 120;
          const codeBlockWidth = width - settings.padding * 2;
          const codeX = settings.padding;
          const codeY = (height - codeBlockHeight) / 2;

          // Draw code container background with shadow
          ctx.save();
          ctx.shadowColor = "rgba(0,0,0,0.3)";
          ctx.shadowBlur = 20;
          ctx.shadowOffsetY = 5;
          ctx.shadowOffsetX = 0;

          // Draw code background
          ctx.fillStyle = "rgba(30, 30, 35, 0.9)";
          roundedRect(
            ctx,
            codeX,
            codeY,
            codeBlockWidth,
            codeBlockHeight,
            settings.rounded
          );
          ctx.fill();
          ctx.restore();

          // Draw code text
          ctx.fillStyle = "#ffffff";
          ctx.font = "14px SF Mono, ui-monospace, monospace";
          ctx.fillText("function hello() {", codeX + 20, codeY + 30);
          ctx.fillStyle = "#ffcc00";
          ctx.fillText("  console.log('Hello World!')", codeX + 20, codeY + 60);
          ctx.fillStyle = "#ffffff";
          ctx.fillText("}", codeX + 20, codeY + 90);
        }
      } else if (image && originalImg) {
        // Draw background
        applyBackgroundToCanvas(ctx, width, height);

        // Get the actual displayed image element
        const displayedImg = previewContainer.querySelector(
          "img"
        ) as HTMLImageElement;
        if (!displayedImg) {
          throw new Error("Displayed image not found");
        }

        // Get the actual dimensions of the displayed image
        const imgRect = displayedImg.getBoundingClientRect();
        const imgWidth = imgRect.width;
        const imgHeight = imgRect.height;

        // Create a temporary canvas to draw the image with rounded corners and shadow
        const imgCanvas = document.createElement("canvas");
        imgCanvas.width = imgWidth * dpr;
        imgCanvas.height = imgHeight * dpr;
        const imgCtx = imgCanvas.getContext("2d");
        if (!imgCtx) {
          throw new Error("Could not get image canvas context");
        }

        // Scale the image canvas context
        imgCtx.scale(dpr, dpr);

        // Apply shadow if needed
        if (settings.shadow > 0) {
          imgCtx.save();
          imgCtx.shadowColor = "rgba(0,0,0,0.1)";
          imgCtx.shadowBlur = settings.shadow * 2;
          imgCtx.shadowOffsetY = settings.shadow / 2;
          imgCtx.shadowOffsetX = 0;
        }

        // Create rounded rectangle path for the image
        roundedRect(imgCtx, 0, 0, imgWidth, imgHeight, settings.rounded);
        imgCtx.clip();

        // Draw the image
        imgCtx.drawImage(
          originalImg,
          0,
          0,
          originalImg.width,
          originalImg.height,
          0,
          0,
          imgWidth,
          imgHeight
        );

        if (settings.shadow > 0) {
          imgCtx.restore();
        }

        // Calculate the position to center the image in the canvas
        const imageX = (width - imgWidth) / 2;
        const imageY = (height - imgHeight) / 2;

        // Draw the processed image onto the main canvas
        ctx.drawImage(imgCanvas, imageX, imageY, imgWidth, imgHeight);
      }

      // Convert canvas to blob
      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            throw new Error("Failed to create blob from canvas");
          }

          try {
            // Use the Clipboard API to copy the image
            const item = new ClipboardItem({ [blob.type]: blob });
            await navigator.clipboard.write([item]);

            // Show success feedback
            const copyButton: any = document.getElementById("copy-button");
            if (copyButton) {
              copyButton.textContent = "Copied!";
              setTimeout(() => {
                copyButton.textContent = "Copy to Clipboard (worse quality)";
                copyButton.disabled = false;
              }, 2000);
            }
          } catch (err) {
            console.error("Failed to copy image: ", err);
            alert(
              "Failed to copy image to clipboard. This feature may not be supported in your browser."
            );

            if (copyButton) {
              copyButton.disabled = false;
            }
          }
        },
        `image/${
          settings.exportFormat === "jpg" ? "jpeg" : settings.exportFormat
        }`,
        0.9
      );
    } catch (error) {
      console.error("Error generating image for clipboard:", error);
      alert("There was an error copying the image. Please try again.");

      const copyButton = document.getElementById(
        "copy-button"
      ) as HTMLButtonElement;
      if (copyButton) {
        copyButton.disabled = false;
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Controls - Dark theme */}
        <div className="w-[350px] bg-background p-4 overflow-y-auto flex flex-col gap-5">
          {/* Background Control - Top section like in the image */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-[#f5f5f7]">
                Background
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`px-2 py-1 text-xs ${
                    useCustomPresets
                      ? "bg-[#2c2c2e] text-[#f5f5f7]"
                      : "text-[#8e8e93]"
                  }`}
                  onClick={() => {
                    setUseCustomPresets(!useCustomPresets);
                    if (
                      !useCustomPresets &&
                      Object.keys(customBackgroundPresets).length > 0
                    ) {
                      // When switching to custom presets, set to the first custom preset
                      setSettings((prev) => ({
                        ...prev,
                        backgroundPreset: "custom1",
                        useImageColors: false,
                      }));
                    } else if (useCustomPresets) {
                      // When switching to default presets, set to midnight (or another default)
                      setSettings((prev) => ({
                        ...prev,
                        backgroundPreset: "midnight",
                        useImageColors: false,
                      }));
                    }
                  }}
                >
                  {useCustomPresets ? "Custom" : "Default"}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#8e8e93] hover:text-[#f5f5f7]"
                  onClick={handleRegeneratePresets}
                  title="Generate new color presets"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* First row */}
            <div className="grid grid-cols-5 gap-2">
              {Object.keys(currentPresets).map((preset) => {
                const colors =
                  currentPresets[preset as keyof typeof currentPresets];
                return (
                  <button
                    key={preset}
                    className={`h-[50px] cursor-pointer w-full rounded-[10px] ${
                      settings.backgroundPreset === preset &&
                      !settings.useImageColors
                        ? "active"
                        : ""
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                      boxShadow:
                        image &&
                        settings.backgroundPreset === preset &&
                        !settings.useImageColors
                          ? "0 0 0 2px #ffffff"
                          : "none",
                    }}
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        backgroundPreset: preset,
                        useImageColors: false,
                      }))
                    }
                  />
                );
              })}
            </div>
          </div>

          {/* Image Colors Gradient Option */}
          {image && extractedColors.length > 0 && (
            <div className="mt-2 mb-4 flex flex-col gap-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-[#f5f5f7]">
                  Image Colors
                </span>
                <span className="bg-[#2c2c2e] text-[#f5f5f7] text-xs px-2 py-0.5 rounded-full">
                  Auto
                </span>
              </div>

              {/* Display gradient options in a grid */}
              <div className="grid grid-cols-2 gap-2 mb-1">
                {extractedColors.map((colors, index) => (
                  <button
                    key={`image-gradient-${index}`}
                    className={`h-[50px] cursor-pointer rounded-[8px] flex items-center justify-center relative overflow-hidden`}
                    style={{
                      background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                      boxShadow:
                        settings.useImageColors &&
                        settings.imageGradientIndex === index
                          ? "0 0 0 2px #ffffff"
                          : "none",
                    }}
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        useImageColors: true,
                        imageGradientIndex: index,
                      }))
                    }
                  >
                    {settings.useImageColors &&
                      settings.imageGradientIndex === index && (
                        <div className="absolute top-1 right-1 bg-white/20 backdrop-blur-sm rounded-full p-0.5">
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M20 6L9 17L4 12"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                  </button>
                ))}
              </div>

              {/* Display selected gradient colors */}
              {/* <div className="flex justify-between items-center mt-1">
                <div
                  className="w-5 h-5 rounded-full"
                  style={{
                    background:
                      extractedColors[settings.imageGradientIndex]?.[0] ||
                      extractedColors[0]?.[0],
                  }}
                ></div>
                <div className="h-[1px] flex-1 bg-white/10 mx-2"></div>
                <div
                  className="w-5 h-5 rounded-full"
                  style={{
                    background:
                      extractedColors[settings.imageGradientIndex]?.[1] ||
                      extractedColors[0]?.[1],
                  }}
                ></div>
              </div> */}
            </div>
          )}

          {/* Padding Control */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-[#f5f5f7]">
                Padding
              </span>
              <span
                className={`bg-[#2c2c2e] text-[#f5f5f7] text-xs px-2 py-0.5 rounded-full ${
                  activeSlider === "padding" ? "bg-primary" : ""
                }`}
              >
                {settings.padding}
              </span>
            </div>
            <div className="range-slider">
              <Slider
                value={[settings.padding]}
                min={0}
                max={300}
                step={4}
                onValueChange={(value) =>
                  setSettings((prev) => ({ ...prev, padding: value[0] }))
                }
                onValueCommit={() => setActiveSlider(null)}
                onMouseDown={() => setActiveSlider("padding")}
                onTouchStart={() => setActiveSlider("padding")}
                className="mt-2"
              />
            </div>
          </div>

          {/* Shadow Control */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-[#f5f5f7]">Shadow</span>
              <span
                className={`bg-[#2c2c2e] text-[#f5f5f7] text-xs px-2 py-0.5 rounded-full ${
                  activeSlider === "shadow" ? "bg-primary" : ""
                }`}
              >
                {settings.shadow}
              </span>
            </div>
            <div className="range-slider">
              <Slider
                value={[settings.shadow]}
                min={0}
                max={30}
                step={1}
                onValueChange={(value) =>
                  setSettings((prev) => ({ ...prev, shadow: value[0] }))
                }
                onValueCommit={() => setActiveSlider(null)}
                onMouseDown={() => setActiveSlider("shadow")}
                onTouchStart={() => setActiveSlider("shadow")}
                className="mt-2"
              />
            </div>
          </div>

          {/* Rounded Control */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-[#f5f5f7]">
                Rounded
              </span>
              <span
                className={`bg-[#2c2c2e] text-[#f5f5f7] text-xs px-2 py-0.5 rounded-full ${
                  activeSlider === "rounded" ? "bg-primary" : ""
                }`}
              >
                {settings.rounded}
              </span>
            </div>
            <div className="range-slider">
              <Slider
                value={[settings.rounded]}
                min={0}
                max={40}
                step={2}
                onValueChange={(value) =>
                  setSettings((prev) => ({ ...prev, rounded: value[0] }))
                }
                onValueCommit={() => setActiveSlider(null)}
                onMouseDown={() => setActiveSlider("rounded")}
                onTouchStart={() => setActiveSlider("rounded")}
                className="mt-2"
              />
            </div>
          </div>

          {/* Aspect Ratio Control */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-[#f5f5f7]">
                Aspect Ratio
              </span>
              <span
                className={`bg-[#2c2c2e] text-[#f5f5f7] text-xs px-2 py-0.5 rounded-full ${
                  settings.aspectRatio !== "auto" ? "bg-primary" : ""
                }`}
              >
                {settings.aspectRatio === "auto"
                  ? "Auto"
                  : settings.aspectRatio.replace("/", ":")}
              </span>
            </div>
            <Select
              value={settings.aspectRatio}
              onValueChange={(value) =>
                setSettings((prev) => ({ ...prev, aspectRatio: value }))
              }
            >
              <SelectTrigger className="w-full bg-[#2c2c2e] text-[#f5f5f7] border-[#38383a]">
                <SelectValue placeholder="Select aspect ratio" />
              </SelectTrigger>
              <SelectContent className="bg-[#2c2c2e] text-[#f5f5f7] border-[#38383a]">
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="16/9">16:9 (Landscape)</SelectItem>
                <SelectItem value="4/3">4:3 (Landscape)</SelectItem>
                <SelectItem value="3/2">3:2 (Landscape)</SelectItem>
                <SelectItem value="1/1">1:1 (Square)</SelectItem>
                <SelectItem value="2/3">2:3 (Portrait)</SelectItem>
                <SelectItem value="9/16">9:16 (Portrait)</SelectItem>
                <SelectItem value="4/5">4:5 (Instagram)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-[#f5f5f7]">
              Show Code
            </span>
            <Switch
              checked={settings.showCode}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, showCode: checked }))
              }
              className="dark-mode-switch"
            />
          </div> */}

          {/* Upload Image Button - Dark theme */}
        </div>

        {/* Main Content Area - Dark theme */}
        <div className="flex flex-col w-full">
          {/* Bottom Action Bar - Dark theme */}
          <div className="p-4 flex justify-between items-center bg-background">
            {/* Format selection */}

            {!settings.showCode && (
              <div>
                {/* <Button onClick={() => fileInputRef.current?.click()}>
              Upload Image
            </Button> */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            )}

            <div className="flex gap-2 ml-auto">
              {!["jpg", "webp"].includes(settings.exportFormat) && (
                <Button
                  id="copy-button"
                  onClick={handleCopyToClipboard}
                  className="flex items-center gap-2 bg-[#2c2c2e] hover:bg-[#3c3c3e] border-0 rounded-md text-white"
                >
                  <Copy className="h-4 w-4" />
                  Copy to Clipboard (worse quality)
                </Button>
              )}
              <div className="flex rounded-md overflow-hidden">
                <Button
                  variant="ghost"
                  className={`px-3 py-1 rounded-none ${
                    settings.exportFormat === "png"
                      ? "bg-primary text-white hover:bg-primary"
                      : "bg-[#2c2c2e] text-[#f5f5f7]"
                  }`}
                  onClick={() => handleFormatChange("png")}
                >
                  PNG
                </Button>
                <Button
                  variant="ghost"
                  className={`px-3 py-1 rounded-none ${
                    settings.exportFormat === "jpg"
                      ? "bg-primary text-white hover:bg-primary"
                      : "bg-[#2c2c2e] text-[#f5f5f7]"
                  }`}
                  onClick={() => handleFormatChange("jpg")}
                >
                  JPG
                </Button>
                <Button
                  variant="ghost"
                  className={`px-3 py-1 rounded-none ${
                    settings.exportFormat === "webp"
                      ? "bg-primary text-white hover:bg-primary"
                      : "bg-[#2c2c2e] text-[#f5f5f7]"
                  }`}
                  onClick={() => handleFormatChange("webp")}
                >
                  WebP
                </Button>
              </div>
              <Button
                id="export-button"
                onClick={handleExport}
                className="flex items-center gap-2 bg-primary hover:bg-primary/80 border-0 rounded-md text-white"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
          <div
            ref={mainContentRef}
            className="flex-1 flex items-center justify-center relative overflow-y-hidden bg-background"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            tabIndex={0} // Make div focusable to receive paste events
          >
            <div className="flex items-center justify-center w-full h-full">
              <div
                id="preview-container"
                className={`relative flex items-center justify-center ${
                  settings.aspectRatio !== "auto" ? "mx-auto" : "w-full h-full"
                }`}
                style={{
                  ...getBackgroundStyle(),
                  width: settings.aspectRatio !== "auto" ? "auto" : "100%",
                  height: settings.aspectRatio !== "auto" ? "auto" : "100%",
                  aspectRatio:
                    settings.aspectRatio !== "auto"
                      ? (() => {
                          const [width, height] = settings.aspectRatio
                            .split("/")
                            .map(Number);
                          return width / height;
                        })()
                      : undefined,
                  maxHeight: settings.aspectRatio !== "auto" ? "80vh" : "100%",
                  maxWidth: settings.aspectRatio !== "auto" ? "95%" : "100%",
                }}
              >
                {loadingImage ? (
                  <div>
                    <span className="w-2 h-2 ml-2 rounded-full bg-gray-200 inline-block animate-flash"></span>
                    <span className="w-2 h-2 ml-2 rounded-full bg-gray-200 inline-block animate-flash [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 ml-2 rounded-full bg-gray-200 inline-block animate-flash [animation-delay:0.4s]"></span>
                  </div>
                ) : image ? (
                  <div style={{ padding: `${settings.padding}px` }}>
                    <img
                      src={image}
                      alt="Uploaded"
                      className="max-w-full h-auto max-h-[80vh]"
                      style={{
                        borderRadius: `${settings.rounded}px`,
                        boxShadow:
                          settings.shadow > 0
                            ? `0 ${settings.shadow / 2}px ${
                                settings.shadow * 2
                              }px rgba(0,0,0,0.1)`
                            : "none",
                      }}
                    />
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="text-center text-2xl cursor-pointer"
                  >
                    <p className="mb-2">
                      Click to upload image or drag and drop
                    </p>
                    <p className="text-base mb-2">
                      or paste from clipboard (Cmd+V)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
