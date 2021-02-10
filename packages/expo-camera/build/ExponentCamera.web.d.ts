import * as React from 'react';
import { CameraCapturedPicture, CameraNativeProps, CameraPictureOptions } from './Camera.types';
export interface ExponentCameraRef {
    getAvailablePictureSizes: (ratio: string) => Promise<string[]>;
    takePicture: (options: CameraPictureOptions) => Promise<CameraCapturedPicture>;
    resumePreview: () => Promise<void>;
    pausePreview: () => Promise<void>;
}
declare const ExponentCamera: React.ForwardRefExoticComponent<Pick<CameraNativeProps, "type" | "flashMode" | "autoFocus" | "whiteBalance" | "barCodeScannerSettings" | "pointerEvents" | "style" | "zoom" | "ratio" | "focusDepth" | "onCameraReady" | "useCamera2Api" | "pictureSize" | "onMountError" | "onBarCodeScanned" | "faceDetectorSettings" | "onFacesDetected" | "poster" | "onFaceDetectionError" | "onPictureSaved" | "barCodeScannerEnabled" | "faceDetectorEnabled"> & React.RefAttributes<ExponentCameraRef>>;
export default ExponentCamera;
