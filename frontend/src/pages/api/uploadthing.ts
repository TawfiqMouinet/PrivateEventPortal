import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import { apiurl } from "@/context/apiURL";

export const UploadDropZone = generateUploadDropzone({
  url: `${apiurl}/api/uploadthing`,
});
