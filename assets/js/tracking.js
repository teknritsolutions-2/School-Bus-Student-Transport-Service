// Playback is an isolated in-memory demonstration, never a historical record writer.
export function createPlayback({ onChange, onEvent, interval = 500 }) {
  let progress = 0,
    timer = null,
    emitted = new Set(),
    route = null,
    direction = "Morning pickup";
  const update = () => {
    onChange({ progress, route, direction, running: !!timer });
    if (route)
      route.stops.forEach((_, i) => {
        if (
          progress >= (i / (route.stops.length - 1)) * 100 &&
          !emitted.has(i)
        ) {
          emitted.add(i);
          const list =
            direction === "Afternoon return"
              ? [...route.stops].reverse()
              : route.stops;
          onEvent({ label: `Playback: ${list[i].name}`, progress });
        }
      });
  };
  const pause = () => {
    clearInterval(timer);
    timer = null;
    onChange({ progress, route, direction, running: false });
  };
  const reset = () => {
    clearInterval(timer);
    timer = null;
    progress = 0;
    emitted.clear();
    onChange({ progress, route, direction, running: false });
  };
  return {
    select(next, nextDirection = "Morning pickup") {
      route = next;
      direction = nextDirection;
      reset();
    },
    start() {
      if (timer || progress >= 100 || !route) return;
      timer = setInterval(() => {
        progress = Math.min(100, progress + 2.5);
        update();
        if (progress === 100) pause();
      }, interval);
      update();
    },
    pause,
    reset,
    state: () => ({ progress, route, direction, running: !!timer }),
  };
}
