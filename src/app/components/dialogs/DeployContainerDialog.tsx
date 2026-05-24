import { useState, useEffect } from "react";
import { X, Package, Check } from "lucide-react";

interface DeployContainerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const containerImages = [
  { id: "nginx", name: "nginx:latest", description: "An engine called Nginx" },
  { id: "node", name: "node:20-alpine", description: "Node.js runtime"},
  { id: "mongo", name: "mongo:7", description: "A fruit" },
  { id: "alpine", name: "alpine:latest", description: "Lightweight and versatile" },
  { id: "kafka", name: "kafka:latest", description: "Famous writer" },
  { id: "python", name: "python:3.11", description: "A nice pet for you" },
  { id: "prometheus", name: "prometheus:latest", description: "Discover the fire" },
];

export function DeployContainerDialog({ isOpen, onClose }: DeployContainerDialogProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePhotos, setImagePhotos] = useState<Record<string, string>>({});
  const [containerConfig, setContainerConfig] = useState({
    name: "",
    ports: "",
    env: "",
  });

  useEffect(() => {
    if (isOpen) {
      const photos: Record<string, string> = {
        nginx: "/nginx.png",
        node: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop",
        alpine: "/alpine.png",
        redis: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
        kafka: "/kafka.png",
        mongo: "/mango.png",
        python: "/python.png",
        prometheus: "/prometeus.png",
      };
      setImagePhotos(photos);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDeploy = () => {
    console.log("Deploying container:", { selectedImage, ...containerConfig });
    onClose();
  };

  const selectedImageData = containerImages.find((img) => img.id === selectedImage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111827] border border-[#38BDF8]/30 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1f2937]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Deploy Container</h2>
              <p className="text-sm text-[#9CA3AF]">Select an image and configure deployment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1f2937] rounded-lg transition-colors text-[#9CA3AF] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image Selection */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">Select Container Image</label>
            <div className="grid grid-cols-3 gap-4">
              {containerImages.map((image) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(image.id)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === image.id
                      ? "border-[#38BDF8] ring-2 ring-[#38BDF8]/30"
                      : "border-[#1f2937] hover:border-[#38BDF8]/50"
                  }`}
                >
                  {/* Image */}
                  <div className="h-32 overflow-hidden relative">
                    <img
                      src={imagePhotos[image.id]}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute"></div>
                  </div>

                  {/* Info */}
                  <div className="p-3 bg-[#0B0F17]">
                    <div className="flex items-start justify-between mb-1">
                      <div className="mono text-sm font-semibold text-white truncate">{image.name}</div>
                      {selectedImage === image.id && (
                        <div className="w-5 h-5 rounded-full bg-[#38BDF8] flex items-center justify-center flex-shrink-0 ml-2">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-[#9CA3AF]">{image.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration */}
          {selectedImage && (
            <div className="space-y-4 p-4 bg-[#0B0F17] border border-[#1f2937] rounded-lg">
              <div className="text-sm font-semibold text-white mb-3">Container Configuration</div>

              <div>
                <label className="block text-sm text-[#9CA3AF] mb-2">Container Name</label>
                <input
                  type="text"
                  value={containerConfig.name}
                  onChange={(e) => setContainerConfig({ ...containerConfig, name: e.target.value })}
                  placeholder={`cnt-${selectedImage}-01`}
                  className="w-full px-4 py-2.5 bg-[#111827] border border-[#1f2937] rounded-lg text-white placeholder-[#9CA3AF] focus:border-[#38BDF8] focus:outline-none transition-colors mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-[#9CA3AF] mb-2">Port Mapping</label>
                <input
                  type="text"
                  value={containerConfig.ports}
                  onChange={(e) => setContainerConfig({ ...containerConfig, ports: e.target.value })}
                  placeholder="8080:80, 8443:443"
                  className="w-full px-4 py-2.5 bg-[#111827] border border-[#1f2937] rounded-lg text-white placeholder-[#9CA3AF] focus:border-[#38BDF8] focus:outline-none transition-colors mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-[#9CA3AF] mb-2">Environment Variables</label>
                <textarea
                  value={containerConfig.env}
                  onChange={(e) => setContainerConfig({ ...containerConfig, env: e.target.value })}
                  placeholder="NODE_ENV=production&#10;API_KEY=your-key"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-[#111827] border border-[#1f2937] rounded-lg text-white placeholder-[#9CA3AF] focus:border-[#38BDF8] focus:outline-none transition-colors mono text-sm resize-none"
                />
              </div>
            </div>
          )}

          {/* Selected Image Info */}
          {selectedImageData && (
            <div className="p-4 bg-[#38BDF8]/5 border border-[#38BDF8]/30 rounded-lg">
              <div className="text-sm font-semibold text-white mb-2">Selected Image</div>
              <div className="text-sm text-[#9CA3AF]">
                <span className="mono text-[#38BDF8]">{selectedImageData.name}</span> - {selectedImageData.description}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#1f2937]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1f2937] hover:bg-[#1a2332] text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDeploy}
            disabled={!selectedImage}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedImage
                ? "bg-[#38BDF8] hover:bg-[#0EA5E9] text-white"
                : "bg-[#1f2937] text-[#9CA3AF] cursor-not-allowed"
            }`}
          >
            Deploy Container
          </button>
        </div>
      </div>
    </div>
  );
}