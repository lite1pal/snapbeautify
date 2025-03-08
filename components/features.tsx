import {
  Camera,
  Palette,
  Circle,
  Download,
  Layers,
  Sliders,
  Maximize,
} from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <Camera className="h-6 w-6" />,
      title: "Upload Instantly",
      description: "Drag and drop or upload any screenshot directly.",
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Beautiful Backgrounds",
      description: "Choose between gradient or solid color backgrounds.",
    },
    {
      icon: <Sliders className="h-6 w-6" />,
      title: "Simple Customization",
      description: "Adjust margins, border radius, and shadows with ease.",
    },
    {
      icon: <Maximize className="h-6 w-6" />,
      title: "Resize Freely",
      description: "Adjust the width of your image for perfect proportions.",
    },
    {
      icon: <Circle className="h-6 w-6" />,
      title: "Rounded Edges",
      description: "Apply border radius for a modern look.",
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Stunning Gradients",
      description: "Apply beautiful color gradients with customizable colors.",
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "One-Click Export",
      description: "Download your beautified screenshot instantly.",
    },
  ];

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Simple, fast, and beautiful</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          SnapBeautify focuses on doing one thing extremely well - making your
          screenshots look amazing with minimal effort.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 border rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-start">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
