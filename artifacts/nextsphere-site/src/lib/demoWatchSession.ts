export type DemoStartMode = 'auto' | 'manual';
export type DemoWatch = 'initial' | 'replay';
export type DemoFormat = 'landscape' | 'portrait';
export type DemoVideoEvent = 'demo_video_start' | 'demo_video_complete';
export type DemoVideoProperties = {
  mode: DemoStartMode;
  watch: DemoWatch;
  format: DemoFormat;
};
type Emit = (event: DemoVideoEvent, properties: DemoVideoProperties) => boolean;

/**
 * One in-memory viewing session per actual run, not per play/playing event.
 * No identifiers, storage, or retrospectively queued consent-denied events.
 */
export class DemoWatchSession {
  private everStarted = false;
  private started = false;
  private recordedStart = false;
  private completed = false;
  private properties: DemoVideoProperties | null = null;

  restart() {
    this.started = false;
    this.recordedStart = false;
    this.completed = false;
    this.properties = null;
  }

  playing(mode: DemoStartMode, format: DemoFormat, emit: Emit) {
    if (this.started) return; // pause/resume, buffering, repeated playing events
    this.properties = { mode, format, watch: this.everStarted ? 'replay' : 'initial' };
    this.started = true;
    this.everStarted = true;
    this.recordedStart = emit('demo_video_start', this.properties);
  }

  ended(emit: Emit) {
    if (!this.started || this.completed || !this.properties) return;
    this.completed = true;
    // Never emit an orphan completion for a run started without consent.
    if (this.recordedStart) emit('demo_video_complete', this.properties);
  }
}