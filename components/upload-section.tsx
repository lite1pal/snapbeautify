"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Paintbrush,
  ImageIcon,
  Upload,
  Download,
  Maximize,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

export function UploadSection() {
  const [image, setImage] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    margin: 32,
    borderRadius: 12,
    shadow: true,
    shadowBlur: 20,
    shadowColor: "#000000",
    shadowOpacity: 25,
    backgroundColor: "gradient",
    gradientFrom: "#4f46e5",
    gradientTo: "#e879f9",
    solidColor: "#ffffff",
    width: 100, // Width percentage (100% = original size)
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [originalImg, setOriginalImg] = useState<HTMLImageElement | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [loadingImage, setLoadingImage] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadImage(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDownload = () => {
    if (!image || !originalImg) {
      alert("Please upload an image first");
      return;
    }

    try {
      const downloadButton = document.getElementById(
        "download-button"
      ) as HTMLButtonElement;
      if (downloadButton) {
        downloadButton.textContent = "Processing...";
        downloadButton.disabled = true;
      }

      // Calculate dimensions
      const scale = settings.width / 100;
      const scaledWidth = Math.round(originalWidth * scale);
      const scaledHeight = Math.round(originalHeight * scale);

      // Add margins and create canvas
      const canvasWidth = scaledWidth + settings.margin * 2;
      const canvasHeight = scaledHeight + settings.margin * 2;

      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Draw background
      if (settings.backgroundColor === "gradient") {
        const gradient = ctx.createLinearGradient(
          0,
          0,
          canvasWidth,
          canvasHeight
        );
        gradient.addColorStop(0, settings.gradientFrom);
        gradient.addColorStop(1, settings.gradientTo);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = settings.solidColor;
      }

      // Fill the background
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // If we need shadow, we draw it first
      if (settings.shadow) {
        ctx.save();
        ctx.shadowColor =
          settings.shadowColor +
          Math.round(settings.shadowOpacity * 2.55)
            .toString(16)
            .padStart(2, "0");
        ctx.shadowBlur = settings.shadowBlur;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Create a path for the rounded rectangle to receive shadow
        roundedRect(
          ctx,
          settings.margin,
          settings.margin,
          scaledWidth,
          scaledHeight,
          settings.borderRadius
        );

        ctx.fillStyle = "rgba(0,0,0,0)"; // Transparent fill to just create shadow
        ctx.fill();
        ctx.restore();
      }

      // Now draw the image with rounded corners by creating a clipping region
      ctx.save();
      roundedRect(
        ctx,
        settings.margin,
        settings.margin,
        scaledWidth,
        scaledHeight,
        settings.borderRadius
      );
      ctx.clip();

      // Draw the image inside the clipping region
      ctx.drawImage(
        originalImg,
        settings.margin,
        settings.margin,
        scaledWidth,
        scaledHeight
      );

      ctx.restore();

      // Convert to data URL
      const dataUrl = canvas.toDataURL("image/png");

      // Create and trigger download
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "beautified-screenshot.png";
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        if (downloadButton) {
          downloadButton.textContent = "Download";
          downloadButton.disabled = false;
        }
      }, 100);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("There was an error generating your image. Please try again.");

      const downloadButton = document.getElementById(
        "download-button"
      ) as HTMLButtonElement;
      if (downloadButton) {
        downloadButton.textContent = "Download";
        downloadButton.disabled = false;
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

  const handleBackgroundColorChange = (type: string) => {
    setSettings((prev) => ({
      ...prev,
      backgroundColor: type,
    }));
  };

  // Calculate width based on the percentage and original width
  const getDisplayWidth = () => {
    if (!originalWidth) return "auto";
    const scaledWidth = (originalWidth * settings.width) / 100;
    return `${scaledWidth}px`;
  };

  return (
    <section className="py-8">
      {!image ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">Upload your screenshot</h3>
          <p className="text-gray-500 text-sm mb-4">
            Drag and drop or click to upload (PNG, JPG)
          </p>
          <Button variant="outline" size="sm">
            Select File
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-[1fr_300px] gap-8">
          <Card className="p-6 flex items-center justify-center bg-slate-50 overflow-hidden min-h-[400px]">
            {loadingImage ? (
              <div className="flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-2"></div>
                <p className="text-sm text-gray-500">Loading image...</p>
              </div>
            ) : (
              <div
                id="image-preview-container"
                className="relative"
                style={{
                  padding: `${settings.margin}px`,
                  borderRadius: "8px",
                  background:
                    settings.backgroundColor === "gradient"
                      ? `linear-gradient(135deg, ${settings.gradientFrom}, ${settings.gradientTo})`
                      : settings.solidColor,
                }}
              >
                <img
                  src={image}
                  alt="Uploaded screenshot"
                  style={{
                    display: "block",
                    maxWidth: "100%",
                    width: getDisplayWidth(),
                    height: "auto",
                    borderRadius: `${settings.borderRadius}px`,
                    boxShadow: settings.shadow
                      ? `0 0 ${settings.shadowBlur}px ${
                          settings.shadowColor +
                          Math.round(settings.shadowOpacity * 2.55)
                            .toString(16)
                            .padStart(2, "0")
                        }`
                      : "none",
                  }}
                />
              </div>
            )}
          </Card>

          <div>
            <Card className="p-4">
              <Tabs defaultValue="appearance">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="appearance">
                    <Paintbrush className="h-4 w-4 mr-2" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger value="image">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Image
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="appearance" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-gray-500">
                        Background Style
                      </Label>
                      <div className="grid grid-cols-2 gap-2 mt-1.5">
                        <Button
                          variant={
                            settings.backgroundColor === "gradient"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className="justify-start"
                          onClick={() =>
                            handleBackgroundColorChange("gradient")
                          }
                        >
                          <div className="h-3 w-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mr-2"></div>
                          Gradient
                        </Button>
                        <Button
                          variant={
                            settings.backgroundColor === "solid"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className="justify-start"
                          onClick={() => handleBackgroundColorChange("solid")}
                        >
                          <div className="h-3 w-3 rounded-full bg-white border mr-2"></div>
                          Solid Color
                        </Button>
                      </div>
                    </div>

                    {settings.backgroundColor === "gradient" && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label
                            htmlFor="gradient-from"
                            className="text-xs text-gray-500"
                          >
                            Gradient From
                          </Label>
                          <input
                            id="gradient-from"
                            type="color"
                            value={settings.gradientFrom}
                            onChange={(e) =>
                              setSettings((prev) => ({
                                ...prev,
                                gradientFrom: e.target.value,
                              }))
                            }
                            className="w-full h-8 mt-1"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="gradient-to"
                            className="text-xs text-gray-500"
                          >
                            Gradient To
                          </Label>
                          <input
                            id="gradient-to"
                            type="color"
                            value={settings.gradientTo}
                            onChange={(e) =>
                              setSettings((prev) => ({
                                ...prev,
                                gradientTo: e.target.value,
                              }))
                            }
                            className="w-full h-8 mt-1"
                          />
                        </div>
                      </div>
                    )}

                    {settings.backgroundColor === "solid" && (
                      <div>
                        <Label
                          htmlFor="solid-color"
                          className="text-xs text-gray-500"
                        >
                          Background Color
                        </Label>
                        <input
                          id="solid-color"
                          type="color"
                          value={settings.solidColor}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              solidColor: e.target.value,
                            }))
                          }
                          className="w-full h-8 mt-1"
                        />
                      </div>
                    )}

                    <div>
                      <div className="flex justify-between">
                        <Label
                          htmlFor="margin-slider"
                          className="text-xs text-gray-500"
                        >
                          Margin
                        </Label>
                        <span className="text-xs text-gray-500">
                          {settings.margin}px
                        </span>
                      </div>
                      <Slider
                        id="margin-slider"
                        min={0}
                        max={100}
                        step={1}
                        value={[settings.margin]}
                        onValueChange={(value) =>
                          setSettings((prev) => ({
                            ...prev,
                            margin: value[0],
                          }))
                        }
                        className="mt-2"
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <Label
                        htmlFor="shadow-toggle"
                        className="text-xs text-gray-500"
                      >
                        Shadow
                      </Label>
                      <Switch
                        id="shadow-toggle"
                        checked={settings.shadow}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            shadow: checked,
                          }))
                        }
                      />
                    </div>

                    {settings.shadow && (
                      <div>
                        <div className="flex justify-between">
                          <Label
                            htmlFor="shadow-blur"
                            className="text-xs text-gray-500"
                          >
                            Shadow Blur
                          </Label>
                          <span className="text-xs text-gray-500">
                            {settings.shadowBlur}px
                          </span>
                        </div>
                        <Slider
                          id="shadow-blur"
                          min={0}
                          max={100}
                          step={1}
                          value={[settings.shadowBlur]}
                          onValueChange={(value) =>
                            setSettings((prev) => ({
                              ...prev,
                              shadowBlur: value[0],
                            }))
                          }
                          className="mt-2"
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="image" className="space-y-4">
                  <div>
                    <div className="flex justify-between">
                      <Label
                        htmlFor="border-radius"
                        className="text-xs text-gray-500"
                      >
                        Border Radius
                      </Label>
                      <span className="text-xs text-gray-500">
                        {settings.borderRadius}px
                      </span>
                    </div>
                    <Slider
                      id="border-radius"
                      min={0}
                      max={40}
                      step={1}
                      value={[settings.borderRadius]}
                      onValueChange={(value) =>
                        setSettings((prev) => ({
                          ...prev,
                          borderRadius: value[0],
                        }))
                      }
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="width-slider"
                        className="text-xs text-gray-500"
                      >
                        Image Width
                      </Label>
                      <div className="flex items-center">
                        <Maximize className="h-3 w-3 mr-1 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {settings.width}%
                        </span>
                      </div>
                    </div>
                    <Slider
                      id="width-slider"
                      min={20}
                      max={150}
                      step={1}
                      value={[settings.width]}
                      onValueChange={(value) =>
                        setSettings((prev) => ({
                          ...prev,
                          width: value[0],
                        }))
                      }
                      className="mt-2"
                    />
                  </div>

                  <div className="pt-4 mt-4 border-t">
                    <Button
                      id="download-button"
                      onClick={handleDownload}
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Image
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => {
                setImage(null);
                setOriginalImg(null);
                setOriginalWidth(0);
                setOriginalHeight(0);
                setSettings({
                  margin: 32,
                  borderRadius: 12,
                  shadow: true,
                  shadowBlur: 20,
                  shadowColor: "#000000",
                  shadowOpacity: 25,
                  backgroundColor: "gradient",
                  gradientFrom: "#4f46e5",
                  gradientTo: "#e879f9",
                  solidColor: "#ffffff",
                  width: 100,
                });
              }}
            >
              Upload a different image
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
