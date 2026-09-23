import { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  Eye,
  ImagePlus,
  Loader2,
  MapPin,
  Upload,
  X,
} from "lucide-react";
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

const MAX_PHOTOS = 5;
const MIN_PHOTOS = 1;
const MAX_FILE_SIZE_MB = 10;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_DIMENSION = 1600;
const LOCATION_TIMEOUT_MS = 8000;

type DeliveryFormProps = {
  dealer: Dealer;
  openHomePage: () => void;
  openDeliverySubmitResponseView: () => void;
};

type LocationStatus = "checking" | "granted" | "denied";
type LocationErrorReason = "unsupported" | "denied" | "timeout" | "unavailable";

type Coordinates = { latitude: string; longitude: string };

class LocationError extends Error {
  reason: LocationErrorReason;
  constructor(reason: LocationErrorReason, message: string) {
    super(message);
    this.reason = reason;
  }
}

const getCurrentCoordinates = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(
        new LocationError(
          "unsupported",
          "This browser doesn't support location access.",
        ),
      );
      return;
    }

    let settled = false;
    const timeoutId = setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new LocationError("timeout", "Location request timed out."));
    }, LOCATION_TIMEOUT_MS);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        resolve({
          latitude: pos.coords.latitude.toString(),
          longitude: pos.coords.longitude.toString(),
        });
      },
      (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        if (err.code === err.PERMISSION_DENIED) {
          reject(
            new LocationError("denied", "Location permission was denied."),
          );
        } else {
          reject(
            new LocationError(
              "unavailable",
              "Unable to determine your location.",
            ),
          );
        }
      },
      {
        timeout: LOCATION_TIMEOUT_MS - 500,
        maximumAge: 0,
        enableHighAccuracy: true,
      },
    );
  });
};

const compressImage = (
  file: File,
  maxDimension = MAX_IMAGE_DIMENSION,
  quality = 0.8,
): Promise<File> => {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      if (width <= maxDimension && height <= maxDimension) {
        resolve(file);
        return;
      }

      const scale = maxDimension / Math.max(width, height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          resolve(
            new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            }),
          );
        },
        file.type,
        quality,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file); // don't block the whole flow over a compression failure
    };

    img.src = objectUrl;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [locationStatus, setLocationStatus] =
    useState<LocationStatus>("checking");
  const [locationError, setLocationError] = useState<string | null>(null);

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
  const locationReady = locationStatus === "granted";
  const actionsDisabled = !canAddMorePhotos || isUploading || !locationReady;

  const requestLocation = useCallback(async () => {
    setLocationStatus("checking");
    setLocationError(null);
    try {
      await getCurrentCoordinates();
      setLocationStatus("granted");
    } catch (err) {
      const reason = err instanceof LocationError ? err.reason : "unavailable";
      setLocationStatus("denied");
      setLocationError(
        reason === "denied"
          ? "Location access was denied. Enable location permission for this site in your browser settings, then try again."
          : reason === "unsupported"
            ? "Your browser doesn't support location access, so delivery photos can't be verified here."
            : reason === "timeout"
              ? "Getting your location took too long. Check your GPS/network connection and try again."
              : "We couldn't determine your location. Check your GPS/network connection and try again.",
      );
    }
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const getNextDocumentId = (): string => {
    const usedIds = new Set(uploadedPhotos.map((p) => p.documentId));
    for (let i = 1; i <= MAX_PHOTOS; i++) {
      if (!usedIds.has(String(i))) return String(i);
    }
    return String(uploadedPhotos.length + 1);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) {
      toast.error("No file selected");
      return;
    }

    if (!tripId || !dealer?.Kunnr) {
      toast.error(
        "Missing trip or dealer information. Please go back and retry.",
      );
      return;
    }

    if (!canAddMorePhotos) {
      toast.error(`Maximum ${MAX_PHOTOS} photos allowed`);
      return;
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      toast.error("Only JPEG, PNG, or WEBP images are allowed");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`Image must be smaller than ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    let coordinates: Coordinates;
    try {
      coordinates = await getCurrentCoordinates();
      setLocationStatus("granted");
    } catch (err) {
      const reason = err instanceof LocationError ? err.reason : "unavailable";
      setLocationStatus("denied");
      setLocationError(
        reason === "denied"
          ? "Location access was denied. Enable location permission for this site and try again."
          : "We couldn't confirm your location. Check your GPS/network connection and try again.",
      );
      toast.error("Location is required to upload a delivery photo.");
      return;
    }

    const documentId = getNextDocumentId();

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const processedFile = await compressImage(file);
      const contentType = processedFile.type || file.type || "image/jpeg";

      getUploadUrl(
        {
          tripId,
          dealerCode: dealer.Kunnr,
          documentId,
          contentType,
          ...coordinates,
        },
        {
          onError: (error) => {
            console.error("Failed to get upload URL", error);
            toast.error("Failed to get upload URL");
            setIsUploading(false);
          },
          onSuccess: (uploadData) => {
            setUploadProgress(33);

            uploadToUrl(
              {
                apiUrl: uploadData.presignedUrl,
                binaryImage: processedFile,
                contentType,
              },
              {
                onError: (error) => {
                  console.error("Failed to upload photo", error);
                  toast.error("Failed to upload photo");
                  setIsUploading(false);
                },
                onSuccess: () => {
                  setUploadProgress(66);

                  getDownloadUrl(
                    { documentName: uploadData.documentName },
                    {
                      onError: (error) => {
                        console.log("Failed to retrieve uploaded photo", error);
                        toast.error("Failed to retrieve uploaded photo");
                        setIsUploading(false);
                      },
                      onSuccess: ({ presignedUrl }) => {
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
    } catch (error) {
      console.error("Error handling file change: ", error);
      toast.error("An unexpected error occurred");
      setIsUploading(false);
    }
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.documentId === id ? { ...p, documentUrl: "" } : p)),
    );
  };

  const handleSubmit = () => {
    if (!canSubmit || isSubmitting) return;

    if (!tripId || !dealer?.Kunnr) {
      toast.error(
        "Missing trip or dealer information. Please go back and retry.",
      );
      return;
    }

    if (!locationReady) {
      toast.error("Location is required to submit this delivery.");
      requestLocation();
      return;
    }

    setIsSubmitting(true);

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
          console.error("Mark complete error: ", error);
          toast.error("Failed to submit delivery");
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      },
    );
  };

  return (
    <>
      <div className="flex flex-col min-h-full h-full">
        <div className="my-5">
          {locationStatus !== "granted" && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-destructive" />
              <div className="flex-1">
                <p className="text-[13px] font-medium text-destructive">
                  {locationStatus === "checking"
                    ? "Getting your location..."
                    : "Location access required"}
                </p>
                {locationStatus === "denied" && (
                  <>
                    <p className="text-[12px] text-muted-foreground mt-1">
                      {locationError}
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="mt-2 h-7 text-[12px]"
                      onClick={requestLocation}
                    >
                      Try again
                    </Button>
                  </>
                )}
                {locationStatus === "checking" && (
                  <p className="text-[12px] text-muted-foreground mt-1">
                    Allow location access to continue with this delivery.
                  </p>
                )}
              </div>
            </div>
          )}

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
              disabled={actionsDisabled}
            >
              <Camera size={20} />
              Take photo
            </PhotoInputButton>

            <PhotoInputButton
              onClick={() => fileInputRef.current?.click()}
              disabled={actionsDisabled}
            >
              <Upload size={20} />
              Upload file
            </PhotoInputButton>
          </div>

          {/* Upload progress bar */}
          {isUploading && (
            <div className="mt-2">
              <div
                className="w-full bg-muted rounded-full h-1.5"
                role="progressbar"
                aria-valuenow={uploadProgress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
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
                    alt="Uploaded delivery"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      aria-label="Preview photo"
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
                    aria-label="Preview photo"
                    onClick={() => setPreviewPhoto(photo)}
                    className="absolute bottom-1 left-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center group-hover:hidden"
                  >
                    <Eye size={11} className="text-white" />
                  </button>
                  <button
                    type="button"
                    aria-label="Remove photo"
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
                  disabled={actionsDisabled}
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
            disabled={
              !canSubmit || isUploading || isSubmitting || !locationReady
            }
            className="w-full text-base font-semibold text-black disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: canSubmit ? "#FFC107" : undefined,
              height: "52px",
            }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                Submitting...
              </span>
            ) : (
              "Submit delivery"
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={openHomePage}
            disabled={isSubmitting}
            className="w-full h-11 text-sm text-muted-foreground border border-border"
          >
            SKIP THIS DEALER
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
