import { useRef, useState } from "react";
import { Camera, Eye, ImagePlus, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Label } from "../../../../components/ui/label";
import { Button } from "../../../../components/ui/button";
import PhotoInputButton from "./PhotoInputButton";
import type { UploadedPhoto } from "@/schemas/uploadPhotoSchema";
import PhotoPreviewDialog from "./PhotoPreviewDialog";
import {
  useDocumentDownloadPresignedUrlMutation,
  useDocumentUploadPresignedUrlMutation,
  useMarkDeliveryCompleteMutation,
  useUploadDocumentToPresignedUrlMutation,
} from "@/queries/tertiaryDeliveryMutations";
import type { Dealer } from "@/schemas/dealerSchema";
import { useTripDetail } from "@/contexts/tripDetail";

const MAX_PHOTOS = 3;
const MIN_PHOTOS = 1;

type DeliveryFormProps = {
  dealer: Dealer;
  openHomePage: () => void;
  openDeliverySubmitResponseView: () => void;
};

// Geolocation as a promise
const getCurrentCoordinates = (): Promise<{
  latitude: string;
  longitude: string;
}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude.toString(),
          longitude: pos.coords.longitude.toString(),
        }),
      () =>
        // Fallback to a default if user denies location
        resolve({ latitude: "28.6139", longitude: "77.2090" }),
    );
  });
};

const DeliveryForm = ({
  dealer,
  openHomePage,
  openDeliverySubmitResponseView,
}: DeliveryFormProps) => {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [previewPhoto, setPreviewPhoto] = useState<UploadedPhoto | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: getUploadUrl } = useDocumentUploadPresignedUrlMutation();
  const { mutate: uploadToUrl } = useUploadDocumentToPresignedUrlMutation();
  const { mutate: getDownloadUrl } = useDocumentDownloadPresignedUrlMutation();
  const { mutate: markDeliveryComplete } = useMarkDeliveryCompleteMutation();

  const { tripId } = useTripDetail();

  const uploadedPhotos = photos.filter((p) => !!p.documentUrl);
  const canSubmit = uploadedPhotos.length >= MIN_PHOTOS;
  const canAddMorePhotos = uploadedPhotos.length < MAX_PHOTOS;

  const getNextDocumentId = (): string => {
    for (let i = 0; i < MAX_PHOTOS; i++) {
      const slotTaken = photos.some(
        (p) => p.documentId === String(i + 1) && !!p.documentUrl,
      );
      if (!slotTaken) return String(i + 1);
    }
    return String(photos.length + 1);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) {
      toast.error("No file selected");
      return;
    }

    if (!canAddMorePhotos) {
      toast.error(`Maximum ${MAX_PHOTOS} photos allowed`);
      return;
    }

    const contentType = file.type || "image/jpeg";
    const documentId = getNextDocumentId();
    const coordinates = await getCurrentCoordinates();

    setIsUploading(true);
    setUploadProgress(0);

    getUploadUrl(
      {
        tripId,
        dealerCode: dealer.Kunnr,
        documentId,
        contentType,
        ...coordinates,
      },
      {
        onError: () => {
          toast.error("Failed to get upload URL");
          setIsUploading(false);
        },
        onSuccess: (uploadData) => {
          setUploadProgress(33);

          uploadToUrl(
            { apiUrl: uploadData.presignedUrl, binaryImage: file, contentType },
            {
              onError: () => {
                toast.error("Failed to upload photo");
                setIsUploading(false);
              },
              onSuccess: () => {
                setUploadProgress(66);

                getDownloadUrl(
                  { documentName: uploadData.documentName },
                  {
                    onError: (error) => {
                      console.log("Download URL error: ", error);
                      toast.error("Failed to retrieve uploaded photo");
                      setIsUploading(false);
                    },
                    onSuccess: ({ presignedUrl }) => {
                      console.log("Download URL: ", presignedUrl);
                      setUploadProgress(100);
                      setPhotos((prev) => {
                        const existingIndex = prev.findIndex(
                          (p) => p.documentId === documentId,
                        );
                        const newPhoto: UploadedPhoto = {
                          documentId,
                          documentName: uploadData.documentName,
                          documentUrl: presignedUrl,
                        };
                        if (existingIndex !== -1) {
                          // Replace existing slot
                          const updated = [...prev];
                          updated[existingIndex] = newPhoto;
                          return updated;
                        }
                        return [...prev, newPhoto];
                      });
                      setIsUploading(false);
                    },
                  },
                );
              },
            },
          );
        },
      },
    );
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.documentId === id ? { ...p, documentUrl: "" } : p)),
    );
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    markDeliveryComplete(
      {
        documents: uploadedPhotos.map((p) => p.documentName),
        tripId,
        dealerCode: dealer.Kunnr,
      },
      {
        onSuccess: () => {
          openDeliverySubmitResponseView();
        },
        onError: (error) => {
          console.log("Mark complete error: ", error);
          toast.error("Failed to submit delivery");
        },
      },
    );
  };

  return (
    <>
      <div className="flex flex-col min-h-full h-full">
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
              disabled={!canAddMorePhotos || isUploading}
            >
              <Camera size={20} />
              Take photo
            </PhotoInputButton>

            <PhotoInputButton
              onClick={() => fileInputRef.current?.click()}
              disabled={!canAddMorePhotos || isUploading}
            >
              <Upload size={20} />
              Upload file
            </PhotoInputButton>
          </div>

          {/* Upload progress bar */}
          {isUploading && (
            <div className="mt-2">
              <div className="w-full bg-muted rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full bg-amber-400 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-[12px] text-muted-foreground">
              {uploadedPhotos.length} / {MAX_PHOTOS} added
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

          {uploadedPhotos.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {uploadedPhotos.map((photo) => (
                <div
                  key={photo.documentId}
                  className="aspect-square relative rounded-lg overflow-hidden border border-[#FFC107] group"
                >
                  <img
                    src={photo.documentUrl}
                    alt="Uploaded"
                    className="w-full h-full object-cover"
                  />
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
                      onClick={() => removePhoto(photo.documentId)}
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
                    onClick={() => removePhoto(photo.documentId)}
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
                  disabled={isUploading}
                  className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-[#FFC107] hover:text-amber-600 transition-all duration-150 disabled:opacity-50"
                >
                  <ImagePlus size={20} />
                  <span className="text-[10px]">Add</span>
                </button>
              )}
            </div>
          )}

          {uploadedPhotos.length === 0 && !isUploading && (
            <p className="text-[12px] text-destructive">
              At least 1 photo is required
            </p>
          )}
        </div>

        <div className="flex-shrink-0 mt-auto mb-20 md:mb-0 bg-card border-t border-border px-4 py-4 space-y-2">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isUploading}
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
          className="hidden" // removed multiple — handle one at a time
          onChange={handleFileChange}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
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
