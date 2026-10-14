const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { test } = require('node:test');
function load(file, imports = {}, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { exports, require: name => imports[name], performance, AbortController, setTimeout, clearTimeout, ...globals }, { filename: file });
  return exports;
}
const timing = load('lib/feedbackTiming.ts');
function fixture({ cold = false, resumeFails = false } = {}) {
  let resolveLoad;
  const loading = new Promise(resolve => { resolveLoad = resolve; });
  const sources = [], gains = [];
  const context = {
    currentTime: 3, state: 'running', baseLatency: .01, outputLatency: .02, destination: {},
    resume: () => resumeFails ? Promise.reject(new Error('blocked')) : Promise.resolve(),
    close: () => Promise.resolve(), decodeAudioData: () => Promise.resolve({}),
    getOutputTimestamp: () => ({ contextTime: 3, performanceTime: 800 }),
    createBufferSource() {
      const source = { connect() {}, disconnect() { this.disconnected = true; }, start(time) { this.started = time; }, stop() { this.stopped = true; } };
      sources.push(source); return source;
    },
    createGain() { const gain = { gain: {}, connect() {}, disconnect() { this.disconnected = true; } }; gains.push(gain); return gain; },
  };
  const audio = load('lib/feedbackAudio.ts', { './feedbackTiming': timing }, { fetch: async () => { if (cold) await loading; return { ok: true, arrayBuffer: async () => new ArrayBuffer(8) }; } });
  const urls = Object.fromEntries(['tap', 'correct', 'retry', 'complete', 'combo', 'combo10', 'fly'].map(name => [name, '/sound.wav']));
  return { engine: audio.createFeedbackAudio(context, urls), context, sources, gains, resolveLoad };
}
test('sound and reaction share the audio presentation deadline; retries replace previous audio', async () => {
  const f = fixture(); let first, second;
  await f.engine.play('correct', true, cue => first = cue);
  assert.equal(f.sources[0].started, 3.04);
  assert.ok(Math.abs(first.startsAt - 840) < .0001);
  await f.engine.play('retry', true, cue => second = cue);
  assert.ok(second.id > first.id);
  assert.equal(f.sources[0].stopped, true);
  assert.equal(f.gains[0].disconnected, true);
  assert.equal(f.gains[1].gain.value, .58);
  f.engine.dispose();
});
test('late visual commits catch up; future cues wait; reduced motion can use final state', () => {
  const delayed = timing.reactionPosition(1000, 1200);
  assert.equal(delayed.delay, 0); assert.equal(delayed.remaining, 320);
  assert.equal(delayed.progress, 200 / 520);
  const future = timing.reactionPosition(1000, 960);
  assert.equal(future.delay, 40); assert.equal(future.progress, 0);
  assert.equal(timing.reactionPosition(1000, 1700).progress, 1);
});
test('muted feedback still publishes a reaction without audio', async () => {
  const f = fixture(); let cue;
  await f.engine.play('correct', false, value => cue = value);
  assert.ok(cue); assert.equal(f.sources.length, 0);
  f.engine.dispose();
});
test('muting while loading resolves grading silently rather than leaving it locked', async () => {
  const f = fixture({ cold: true }); let cue;
  const pending = f.engine.play('retry', true, value => cue = value);
  f.engine.setMuted(true); f.resolveLoad(); await pending;
  assert.ok(cue); assert.equal(f.sources.length, 0);
  f.engine.dispose();
});
test('navigation cancels a pending decoded cue and its callback', async () => {
  const f = fixture({ cold: true }); let callbacks = 0;
  const pending = f.engine.play('correct', true, () => callbacks++);
  f.engine.dispose(); f.resolveLoad(); await pending;
  assert.equal(callbacks, 0); assert.equal(f.sources.length, 0);
});
test('cold or blocked audio cannot stall grading beyond the bounded load wait', async () => {
  const f = fixture({ cold: true }); let cue;
  await f.engine.play('correct', true, value => cue = value);
  assert.ok(cue); assert.equal(f.sources.length, 0);
  f.engine.dispose(); f.resolveLoad();
});
test('fallback audio clock accounts for output latency when timestamps are unavailable', async () => {
  const f = fixture(); delete f.context.getOutputTimestamp; let cue;
  const before = performance.now();
  await f.engine.play('correct', true, value => cue = value);
  assert.ok(cue.startsAt >= before + 70);
  f.engine.stop(); assert.equal(f.sources[0].stopped, true);
  f.engine.dispose();
});
function nativeFixture({ delayed = false, sounds = true } = {}) {
  const effects = [], players = []; let releaseSeek;
  const seek = new Promise(resolve => { releaseSeek = resolve; });
  const module = load('hooks/useFeedback.ts', {
    react: { useRef: current => ({ current }), useEffect: callback => effects.push(callback()) },
    'expo-audio': { useAudioPlayer: () => { const player = { isLoaded: true, pause() {}, seekTo: () => delayed ? seek : Promise.resolve(), play() { this.played = performance.now(); } }; players.push(player); return player; } },
    'expo-haptics': { NotificationFeedbackType: { Warning: 'warning', Success: 'success' }, selectionAsync: async () => {}, notificationAsync: async () => {} },
    'react-native': { Platform: { OS: 'ios' } },
    '@/store/mathStore': { useMathStore: select => select({ sounds, haptics: false }) },
    '@/lib/feedbackTiming': timing,
  });
  return { feedback: module.useFeedback(), players, releaseSeek, cleanup: () => effects.forEach(effect => effect?.()) };
}
test('native seek completes before publishing the visual deadline, then plays on that timer', async () => {
  const f = nativeFixture({ delayed: true }); let cue;
  f.feedback('correct', value => cue = value);
  assert.equal(cue, undefined); f.releaseSeek();
  await new Promise(resolve => setTimeout(resolve, 2));
  assert.ok(cue); assert.equal(f.players[1].played, undefined);
  await new Promise(resolve => setTimeout(resolve, 55));
  assert.ok(Math.abs(f.players[1].played - cue.startsAt) < 30);
  f.cleanup();
});
test('native stop cancels a pending seek and callback', async () => {
  const f = nativeFixture({ delayed: true }); let called = false;
  f.feedback('retry', () => called = true); f.feedback.stop(); f.releaseSeek();
  await new Promise(resolve => setTimeout(resolve, 55));
  assert.equal(called, false); assert.equal(f.players[2].played, undefined);
  f.cleanup();
});
test('native muted feedback retains its visual event and never plays audio', async () => {
  const f = nativeFixture({ sounds: false }); let cue;
  f.feedback('retry', value => cue = value); assert.ok(cue);
  await new Promise(resolve => setTimeout(resolve, 55));
  assert.ok(f.players.every(player => player.played === undefined));
  f.cleanup();
});
