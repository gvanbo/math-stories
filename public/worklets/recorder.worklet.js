class RecorderWorklet extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (input.length > 0) {
      const channelData = input[0];
      // Convert Float32Array to Int16Array
      const int16Buffer = new Int16Array(channelData.length);
      for (let i = 0; i < channelData.length; i++) {
        let s = Math.max(-1, Math.min(1, channelData[i]));
        int16Buffer[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
      this.port.postMessage(int16Buffer);
    }
    return true;
  }
}

registerProcessor("recorder-worklet", RecorderWorklet);
