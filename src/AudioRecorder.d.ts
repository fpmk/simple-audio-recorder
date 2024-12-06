// AudioRecorder.d.ts

import WorkerEncoder from "./mp3worker/WorkerEncoder.js";
import Timer from "./Timer.js";

declare type AudioRecorderOptions = {
  recordingGain?: number;
  encoderBitRate?: number;
  streaming?: boolean;
  streamBufferSize?: number;
  forceScriptProcessor?: boolean;
  constraints?: {
    channelCount?: number;
    autoGainControl?: boolean;
    echoCancellation?: boolean;
    noiseSuppression?: boolean;
  };
};

declare type AudioRecorderState =
  | "STOPPED"
  | "RECORDING"
  | "PAUSED"
  | "STARTING"
  | "STOPPING";

declare class AudioRecorder {
  constructor(options?: AudioRecorderOptions);

  static isRecordingSupported(): boolean;
  static preload(workerUrl: string): void;

  readonly options: AudioRecorderOptions;
  readonly state: AudioRecorderState;
  readonly audioContext: AudioContext | null;
  readonly sourceNode: MediaStreamAudioSourceNode | null;
  readonly encoder: WorkerEncoder | null;
  readonly encodedData: Blob[] | null;
  readonly timer: Timer;
  readonly time: number;

  ondataavailable?: (data: Blob) => void;
  onstart?: () => void;
  onstop?: (data: Blob | undefined) => void;
  onerror?: (error: Error) => void;

  start(paused?: boolean): Promise<void>;
  stop(): Promise<Blob | undefined>;
  pause(): void;
  resume(): void;

  setRecordingGain(gain: number): void;
  getEncodingQueueSize(): number;

  private useAudioWorklet(): boolean;
  private createAndStartEncoder(numberOfChannels: number): void;
  private createOutputNode(numberOfChannels: number): void;
  private createAudioNodes(numberOfChannels: number): void;
  private cleanupAudioNodes(): void;
  private __start(paused: boolean): Promise<void>;
  private __stop(): Promise<Blob | undefined>;
  private stoppingCheck(): void;
}

export default AudioRecorder;
