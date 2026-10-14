import { FEEDBACK_LEAD_MS, feedbackNow, type FeedbackSound, type FeedbackStart } from './feedbackTiming';

/** Short, decoded UI sounds use the audio clock, rather than media-element startup. */
export function createFeedbackAudio(context: AudioContext, urls: Record<FeedbackSound, string>) {
  const buffers = new Map<FeedbackSound, AudioBuffer>();
  const active = new Map<AudioBufferSourceNode, GainNode>();
  const abort = new AbortController();
  let generation = 0;
  let disposed = false;
  let muted = false;
  const ready = new Map(Object.entries(urls).map(([name, url]) => {
    const loaded = fetch(url, { signal: abort.signal })
      .then(response => { if (!response.ok) throw new Error('Sound unavailable'); return response.arrayBuffer(); })
      .then(bytes => context.decodeAudioData(bytes))
      .then(buffer => { if (!disposed) buffers.set(name as FeedbackSound, buffer); })
      .catch(() => { /* Silent feedback is still usable if an asset cannot load. */ });
    return [name as FeedbackSound, loaded] as const;
  }));

  function silence() {
    for (const [source, gain] of active) { source.onended = null; source.stop(); source.disconnect(); gain.disconnect(); }
    active.clear();
  }
  function stop() { generation++; silence(); }

  return {
    stop,
    setMuted(value: boolean) { muted = value; if (value) silence(); },
    async play(name: FeedbackSound, enabled: boolean, onStart?: FeedbackStart) {
      if (disposed) return;
      if (name !== 'tap') stop();
      const ticket = generation;
      // Resume inside the user gesture. Cap cold decoding so grading never waits indefinitely.
      let timeout: ReturnType<typeof setTimeout> | undefined;
      if (enabled) {
        const preparation = Promise.all([context.resume().catch(() => {}), ready.get(name)]);
        await Promise.race([preparation, new Promise<void>(resolve => { timeout = setTimeout(resolve, 180); })]);
        clearTimeout(timeout);
      }
      if (disposed || generation !== ticket) return;
      const buffer = enabled && !muted && context.state === 'running' ? buffers.get(name) : undefined;
      let startsAt = feedbackNow() + FEEDBACK_LEAD_MS;
      if (buffer) {
        const audioTime = context.currentTime + FEEDBACK_LEAD_MS / 1000;
        // Map audio output to the presentation clock, including the device's output latency.
        const stamp = context.getOutputTimestamp?.();
        startsAt = stamp && stamp.performanceTime !== undefined && stamp.contextTime !== undefined && stamp.performanceTime > 0
          ? stamp.performanceTime + (audioTime - stamp.contextTime) * 1000
          : startsAt + ((context.baseLatency || 0) + (context.outputLatency || 0)) * 1000;
        const source = context.createBufferSource();
        const gain = context.createGain();
        source.buffer = buffer;
        gain.gain.value = name === 'tap' ? .42 : name === 'retry' ? .58 : .65;
        source.connect(gain); gain.connect(context.destination);
        active.set(source, gain);
        source.onended = () => { active.delete(source); source.disconnect(); gain.disconnect(); };
        source.start(audioTime);
      }
      onStart?.({ id: ticket, startsAt });
    },
    dispose() { disposed = true; abort.abort(); stop(); void context.close().catch(() => {}); },
  };
}
