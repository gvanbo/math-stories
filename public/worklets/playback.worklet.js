class PlaybackWorklet extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = [];
    this.port.onmessage = (e) => {
      // Incoming PCM 16-bit 24kHz data
      if (e.data.length > 0) {
        this.buffer.push(new Int16Array(e.data));
      }
    };
  }

  process(inputs, outputs) {
    const output = outputs[0];
    const channel = output[0];
    
    if (this.buffer.length === 0) {
      // Nothing to play, output silence
      return true;
    }

    // Simple playback logic
    let remaining = channel.length;
    let outOffset = 0;

    while (remaining > 0 && this.buffer.length > 0) {
      const currentChunk = this.buffer[0];
      const take = Math.min(remaining, currentChunk.length);

      for (let i = 0; i < take; i++) {
        // Convert Int16 (-32768 to 32767) to Float32 (-1.0 to 1.0)
        channel[outOffset + i] = currentChunk[i] / 32768.0;
      }

      if (take < currentChunk.length) {
        // Keep the rest of the chunk
        this.buffer[0] = currentChunk.subarray(take);
      } else {
        // Chunk consumed fully
        this.buffer.shift();
      }

      outOffset += take;
      remaining -= take;
    }

    return true;
  }
}

registerProcessor("playback-worklet", PlaybackWorklet);
