declare module "audiobuffer-to-wav" {
    function toWav(audioBuffer: AudioBuffer, options?: any): ArrayBuffer;
    export = toWav;
  }
  