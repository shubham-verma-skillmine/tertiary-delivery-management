import { X } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../../../components/ui/dialog";
import type { UploadedPhoto } from "@/schemas/uploadPhotoSchema";

type PhotoPreviewDialogProps = {
  photoDetails: UploadedPhoto;
  dialogOpen: boolean;
  closeDialog: () => void;
  removePhoto: (id: string) => void;
};

const PhotoPreviewDialog = ({
  photoDetails,
  dialogOpen,
  closeDialog,
  removePhoto,
}: PhotoPreviewDialogProps) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={closeDialog}>
      <DialogContent className="max-w-sm p-0 overflow-hidden">
        <DialogTitle className="sr-only">Photo preview</DialogTitle>
        <div className="relative">
          <img
            src={photoDetails.documentUrl}
            alt="Preview"
            className="w-full object-contain max-h-[75vh]"
          />
          <button
            onClick={closeDialog}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <X size={16} className="text-white" />
          </button>
        </div>
        <div className="p-4 flex items-center justify-between border-t border-border bg-card">
          <p className="text-[12px] text-muted-foreground truncate max-w-[60%]">
            {photoDetails.documentName}
          </p>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              removePhoto(photoDetails.documentId);
              closeDialog();
            }}
          >
            <X size={14} className="mr-1" />
            Remove
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoPreviewDialog;
