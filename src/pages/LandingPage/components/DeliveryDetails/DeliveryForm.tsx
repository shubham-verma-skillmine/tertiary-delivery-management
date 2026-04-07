import { useRef, useState } from "react";
import { Camera, Eye, ImagePlus, Upload, X } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Button } from "../../../../components/ui/button";
import PhotoInputButton from "./PhotoInputButton";
import type { UploadedPhoto } from "@/schemas/uploadPhotoSchema";
import PhotoPreviewDialog from "./PhotoPreviewDialog";

const MAX_PHOTOS = 3;
const MIN_PHOTOS = 1;

type DeliveryFormProps = {
  openHomePage: () => void;
  openDeliverySubmitResponseView: () => void;
};

const DeliveryForm = ({
  openHomePage,
  openDeliverySubmitResponseView,
}: DeliveryFormProps) => {
  const [receiverName, setReceiverName] = useState("");
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [previewPhoto, setPreviewPhoto] = useState<UploadedPhoto | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nameValid = receiverName.trim().length > 1;
  const photoValid = photos.length >= MIN_PHOTOS;
  const canSubmit = nameValid && photoValid;
  const canAddMorePhotos = photos.length < MAX_PHOTOS;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const remaining = MAX_PHOTOS - photos.length;
    const toAdd = files.slice(0, remaining);

    const newPhotos: UploadedPhoto[] = toAdd.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);
    e.target.value = "";
  }

  function removePhoto(id: string) {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === id);
      if (photo) URL.revokeObjectURL(photo.preview);
      return prev.filter((p) => p.id !== id);
    });
  }

  function handleSubmit() {
    if (!canSubmit) return;
    openDeliverySubmitResponseView();
  }

  return (
    <>
      <div className="flex flex-col min-h-full h-full">
        <div className="my-5">
          <Label className="text-[13px] font-semibold text-muted-foreground">
            Receiver's name <span className="text-destructive">*</span>
          </Label>
          <Input
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            placeholder="Name of person who received"
            className="h-12 text-[15px] focus-visible:ring-[#FFC107] focus-visible:ring-1 focus-visible:border-[#FFC107] bg-card"
          />
        </div>
        <div className="my-5">
          <div>
            <Label className="text-[13px] font-semibold text-muted-foreground">
              Photos <span className="text-destructive">*</span>
            </Label>
            <p className="text-[12px] text-muted-foreground mt-1">
              Minimum 1, maximum 3 images.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <PhotoInputButton
              onClick={() => cameraInputRef.current?.click()}
              disabled={!canAddMorePhotos}
            >
              <Camera size={20} />
              Take photo
            </PhotoInputButton>

            <PhotoInputButton
              onClick={() => fileInputRef.current?.click()}
              disabled={!canAddMorePhotos}
            >
              <Upload size={20} />
              Upload file
            </PhotoInputButton>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[12px] text-muted-foreground">
              {photos.length} / {MAX_PHOTOS} added
            </p>
            {!canAddMorePhotos && (
              <p
                className="text-[12px] font-medium"
                style={{ color: "#FFC107" }}
              >
                Maximum reached
              </p>
            )}
          </div>

          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="aspect-square relative rounded-lg overflow-hidden border border-[#FFC107] group"
                >
                  <img
                    src={photo.preview}
                    alt="Uploaded"
                    className="w-full h-full object-cover"
                  />

                  {/* Hover overlay with preview + remove (desktop) */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPreviewPhoto(photo)}
                      className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <Eye size={15} className="text-gray-800" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <X size={15} className="text-red-600" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPreviewPhoto(photo)}
                    className="absolute bottom-1 left-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center group-hover:hidden"
                  >
                    <Eye size={11} className="text-white" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center group-hover:hidden"
                  >
                    <X size={11} className="text-white" />
                  </button>
                </div>
              ))}

              {canAddMorePhotos && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-[#FFC107] hover:text-amber-600 transition-all duration-150"
                >
                  <ImagePlus size={20} />
                  <span className="text-[10px]">Add</span>
                </button>
              )}
            </div>
          )}

          {photos.length === 0 && (
            <p className="text-[12px] text-destructive">
              At least 1 photo is required
            </p>
          )}
        </div>

        <div className="flex-shrink-0 mt-auto mb-20 md:mb-0 bg-card border-t border-border px-4 py-4 space-y-2">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full text-base font-semibold text-black disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: canSubmit ? "#FFC107" : undefined,
              height: "52px",
            }}
          >
            Submit delivery
          </Button>
          <Button
            variant="ghost"
            onClick={openHomePage}
            className="w-full h-11 text-sm text-muted-foreground border border-border"
          >
            Skip this dealer
          </Button>
        </div>

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        {previewPhoto && (
          <PhotoPreviewDialog
            photoDetails={previewPhoto}
            dialogOpen={!!previewPhoto}
            closeDialog={() => setPreviewPhoto(null)}
            removePhoto={removePhoto}
          />
        )}
      </div>
    </>
  );
};

export default DeliveryForm;
