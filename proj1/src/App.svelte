<script>
  import { onDestroy } from 'svelte';

  let temp = $state(18);
  let position = $state('flat');
  let sleepmode = $state(false);
  let occupied = $state(false);
  let showInfo = $state(false);
  let sessionsToday = $state(0);
  let lastAction = $state('None yet');

  // usage stats shown on the device UI, profiles load these
  let activeProfile = $state('None');
  let hoursInBed = $state(0);
  let timesGotUp = $state(0);
  let avgTemp = $state(18);
  let percentFlat = $state(0);

  // an example of a overnight simulation
  let nightRunning = $state(false);
  let nightClock = $state('--:--');
  let nightStepIndex = 0;
  let nightTimer = null;

  // simple preset schedule for one night, having a mix of timeline and auto steps added
  const nightSteps = [
    {
      clock: '11:00 PM',
      occupied: true,
      sleepmode: true,
      position: 'flat',
      temp: 20,
      action: 'Night: person lies down'
    },
    {
      clock: '12:30 AM',
      occupied: true,
      sleepmode: true,
      position: 'flat',
      temp: 18,
      action: 'Night: room cools'
    },
    {
      clock: '2:00 AM',
      occupied: true,
      sleepmode: true,
      position: 'flat',
      temp: 16,
      action: 'Night: cooler still'
    },
    {
      clock: '3:30 AM',
      occupied: true,
      sleepmode: true,
      position: 'raised',
      temp: 16,
      action: 'Night: brief sit-up'
    },
    {
      clock: '3:45 AM',
      occupied: true,
      sleepmode: true,
      position: 'flat',
      temp: 16,
      action: 'Night: back to sleep'
    },
    {
      clock: '6:30 AM',
      occupied: true,
      sleepmode: true,
      position: 'flat',
      temp: 17,
      action: 'Night: morning warm-up'
    },
    {
      clock: '7:00 AM',
      occupied: false,
      sleepmode: false,
      position: 'raised',
      temp: 18,
      action: 'Night: person gets up'
    }
  ];

  // four profiles
  const profiles = [
    {
      id: 'john',
      name: 'John',
      type: 'Light sleeper',
      hoursInBed: 6.5,
      timesGotUp: 2,
      avgTemp: 20,
      percentFlat: 70,
      temp: 20,
      position: 'raised',
      sleepmode: false,
      occupied: false
    },
    {
      id: 'luke',
      name: 'Luke',
      type: 'Deep sleeper',
      hoursInBed: 8.5,
      timesGotUp: 0,
      avgTemp: 18,
      percentFlat: 95,
      temp: 18,
      position: 'flat',
      sleepmode: true,
      occupied: true
    },
    {
      id: 'mary',
      name: 'Mary',
      type: 'Restless',
      hoursInBed: 5,
      timesGotUp: 5,
      avgTemp: 19,
      percentFlat: 40,
      temp: 19,
      position: 'raised',
      sleepmode: false,
      occupied: true
    },
    {
      id: 'stark',
      name: 'Stark',
      type: 'Cool-room sleeper',
      hoursInBed: 7.5,
      timesGotUp: 1,
      avgTemp: 15,
      percentFlat: 85,
      temp: 15,
      position: 'flat',
      sleepmode: true,
      occupied: true
    }
  ];

  function setPosition(next) {
    position = next;
    lastAction = `Position set to ${next}`;
  }

  function toggleSleepMode() {
    sleepmode = !sleepmode;
    if (sleepmode) {
      sessionsToday += 1;
      lastAction = 'Sleep mode turned on';
    } else {
      lastAction = 'Sleep mode turned off';
    }
  }

  function personLiesDown() {
    occupied = true;
    sleepmode = true;
    position = 'flat';
    sessionsToday += 1;
    lastAction = 'Person lied down (sensors)';
  }

  function personGetsUp() {
    occupied = false;
    sleepmode = false;
    position = 'raised';
    lastAction = 'Person got up (sensors)';
  }

  function roomCools() {
    temp = Math.max(10, temp - 2);
    lastAction = `Room cooled, temp now ${temp}°C`;
  }

  // loading profile stats into Device UI and syncing bed state
  function selectProfile(id) {
    const profile = profiles.find((p) => p.id === id);
    if (!profile) return;

    activeProfile = `${profile.name} (${profile.type})`;
    hoursInBed = profile.hoursInBed;
    timesGotUp = profile.timesGotUp;
    avgTemp = profile.avgTemp;
    percentFlat = profile.percentFlat;

    temp = profile.temp;
    position = profile.position;
    sleepmode = profile.sleepmode;
    occupied = profile.occupied;

    lastAction = `Loaded profile: ${profile.name}`;
  }

  function applyNightStep(step) {
    nightClock = step.clock;
    occupied = step.occupied;
    sleepmode = step.sleepmode;
    position = step.position;
    temp = step.temp;
    lastAction = step.action;
  }

  function stopNight() {
    nightRunning = false;
    if (nightTimer) {
      clearInterval(nightTimer);
      nightTimer = null;
    }
  }

  // running or stopping the overnight simulation from the testing UI
  function toggleNight() {
    if (nightRunning) {
      stopNight();
      lastAction = 'Night simulation stopped';
      return;
    }

    nightRunning = true;
    nightStepIndex = 0;
    sessionsToday += 1;
    applyNightStep(nightSteps[0]);

    nightTimer = setInterval(() => {
      nightStepIndex += 1;
      if (nightStepIndex >= nightSteps.length) {
        stopNight();
        lastAction = 'Night simulation finished';
        return;
      }
      applyNightStep(nightSteps[nightStepIndex]);
    }, 1000);
  }

  onDestroy(stopNight);
</script>

<div class="layout">
  <!--LEVEL 0-->
  <section id="testing-ui">
    <h1>Smart Bed</h1>
    <p>Shivam Sinay Kharangate</p>
    <p>
      <a
        href="https://example.com/your-project-writeup" // gotta add the documentation link here later
        target="_blank"
        rel="noopener noreferrer"
      >
        Project write-up
      </a>
    </p>
    <p>Project 1: Smart Bed</p>
    <h2>Where this UI is located</h2>
    <svg
      viewBox="0 0 280 140"
      width="280"
      height="140"
      role="img"
      aria-label="Bed diagram with headboard display and footboard controls"
    >
      <rect x="50" y="30" width="180" height="90" fill="var(--code-bg)" stroke="var(--border)" />
      <rect x="90" y="8" width="100" height="28" fill="var(--accent-bg)" stroke="var(--accent)" />
      <text x="140" y="26" text-anchor="middle" font-size="11" fill="var(--text-h)">
        Headboard display
      </text>
      <rect x="90" y="112" width="100" height="22" fill="var(--accent-bg)" stroke="var(--accent)" />
      <text x="140" y="127" text-anchor="middle" font-size="11" fill="var(--text-h)">
        Footboard controls
      </text>
    </svg>
    <p>Display on the headboard, controls near the foot of the bed.</p>

    <h2>Testing UI</h2>
    <button type="button" onclick={() => (showInfo = !showInfo)}>Info</button>
    {#if showInfo}
      <p>
        Simulation buttons fake sensors. <strong>Person lying down</strong> marks the bed
        occupied, turns sleep mode on, and flattens. <strong>Person getting up</strong> clears
        occupancy, turns sleep mode off, and raises. <strong>Room cooling overnight</strong>
        lowers temperature by 2 degrees. Use a <strong>profile</strong> button to load that person's
        example usage data into the Device UI. <strong>Run night</strong> plays a short preset
        schedule from evening to morning; press again to stop.
      </p>
    {/if}

    <p>
      <button type="button" onclick={personLiesDown}>Person lying down</button>
      <button type="button" onclick={personGetsUp}>Person getting up</button>
      <button type="button" onclick={roomCools}>Room cooling overnight</button>
    </p>

    <h3>Overnight simulation</h3>
    <p>
      <button type="button" onclick={toggleNight}>
        {nightRunning ? 'Stop night' : 'Run night'}
      </button>
    </p>
    <p>Night clock: <strong>{nightClock}</strong></p>

    <h3>Load example user profile</h3>
    <p>
      {#each profiles as profile (profile.id)}
        <button type="button" onclick={() => selectProfile(profile.id)}>
          {profile.name}, the {profile.type}
        </button>
      {/each}
    </p>
  </section>

  <!--LEVEL 1-->
  <section id="device-ui">
    <h2>Device UI</h2>

    <!-- indicators for the headboard display -->
    <div class="display">
      <h3>Headboard display</h3>
      <p>Night clock: <strong>{nightClock}</strong></p>
      <p>Occupancy: <strong>{occupied ? 'occupied' : 'empty'}</strong></p>
      <p>Temperature: <strong>{temp}°C</strong></p>
      <p>Position: <strong>{position}</strong></p>
      <p>Sleep mode: <strong>{sleepmode ? 'on' : 'off'}</strong></p>
      <p>Sleep sessions today: <strong>{sessionsToday}</strong></p>
      <p>Last action: <strong>{lastAction}</strong></p>
    </div>

    <!-- usage / sensor stats and some simple SVG visuals added for better depth-->
    <div class="stats">
      <h3>Tonight's usage</h3>
      <p>Profile: <strong>{activeProfile}</strong></p>

      <div class="stat-row">
        <p>Hours in bed: <strong>{hoursInBed}</strong> / 10</p>
        <svg class="bar-chart" viewBox="0 0 200 14" aria-hidden="true">
          <rect x="0" y="0" width="200" height="14" rx="4" class="bar-track" />
          <rect
            x="0"
            y="0"
            width={Math.min(200, (hoursInBed / 10) * 200)}
            height="14"
            rx="4"
            class="bar-fill"
          />
        </svg>
      </div>

      <div class="stat-row">
        <p>Times got up: <strong>{timesGotUp}</strong></p>
        <svg class="wakeup-chart" viewBox="0 0 200 18" aria-hidden="true">
          {#each Array(6) as _, i (i)}
            <circle
              cx={12 + i * 28}
              cy="9"
              r="7"
              class={i < timesGotUp ? 'dot-on' : 'dot-off'}
            />
          {/each}
        </svg>
      </div>

      <div class="stat-row">
        <p>Average temp: <strong>{avgTemp}°C</strong></p>
        <svg class="bar-chart" viewBox="0 0 200 14" aria-hidden="true">
          <rect x="0" y="0" width="200" height="14" rx="4" class="bar-track" />
          <rect
            x="0"
            y="0"
            width={Math.min(200, Math.max(0, ((avgTemp - 10) / 20) * 200))}
            height="14"
            rx="4"
            class="bar-fill temp"
          />
        </svg>
      </div>

      <div class="stat-row">
        <p>Time flat: <strong>{percentFlat}%</strong></p>
        <svg class="bar-chart" viewBox="0 0 200 14" aria-hidden="true">
          <rect x="0" y="0" width="200" height="14" rx="4" class="bar-track" />
          <rect
            x="0"
            y="0"
            width={Math.min(200, (percentFlat / 100) * 200)}
            height="14"
            rx="4"
            class="bar-fill"
          />
        </svg>
      </div>
    </div>

    <!-- controls for the footboard, powered by activity -->
    <div class="controls">
      <h3>Footboard controls</h3>

      <div class="cluster">
        <p><strong>Comfort</strong> for setting the bed/room temperature</p>
        <input
          type="number"
          bind:value={temp}
          min="10"
          max="30"
          onchange={() => (lastAction = `Temperature set to ${temp}°C`)}
        />
      </div>

      <div class="cluster">
        <p><strong>Position</strong> for setting the bed position for sleep or reading</p>
        <button type="button" onclick={() => setPosition('flat')}>Flat</button>
        <button type="button" onclick={() => setPosition('raised')}>Raised</button>
      </div>

      <div class="cluster">
        <p><strong>Sleep</strong> to start or end sleep mode</p>
        <button type="button" onclick={toggleSleepMode}>
          {sleepmode ? 'Turn sleep mode off' : 'Turn sleep mode on'}
        </button>
      </div>
    </div>

  </section>
</div>

<style>
  .layout {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 24px 20px 40px;
    text-align: left;
  }

  #testing-ui,
  #device-ui {
    flex: 1 1 320px;
    background: var(--bg-panel);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 0 0 1px rgba(180, 74, 255, 0.08);
  }

  #testing-ui {
    border-top: 3px solid var(--accent);
  }

  #device-ui {
    border-top: 3px solid var(--accent-bright);
    background: linear-gradient(180deg, #14141e 0%, var(--bg-panel) 40%);
  }

  #testing-ui h1 {
    font-size: 1.75rem;
    margin: 0 0 6px;
    letter-spacing: -0.02em;
    color: var(--accent-bright);
    text-shadow: 0 0 24px var(--accent-glow);
  }

  #testing-ui h2,
  #device-ui h2 {
    margin-top: 22px;
    margin-bottom: 10px;
    font-size: 1.1rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--accent-bright);
  }

  h3 {
    margin: 14px 0 8px;
    font-size: 0.95rem;
    color: var(--text-h);
  }

  p {
    margin: 8px 0;
    color: var(--text);
  }

  strong {
    color: var(--accent-bright);
    font-weight: 600;
  }

  svg {
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--bg-raised);
    display: block;
    max-width: 100%;
    height: auto;
  }

  button {
    margin: 4px 6px 4px 0;
    padding: 8px 12px;
    cursor: pointer;
    font: inherit;
    font-size: 0.9rem;
    color: var(--text-h);
    background: var(--bg-raised);
    border: 1px solid var(--accent-border);
    border-radius: 8px;
    transition:
      background 0.15s ease,
      border-color 0.15s ease,
      box-shadow 0.15s ease,
      transform 0.1s ease;
  }

  button:hover {
    background: var(--accent-dim);
    border-color: var(--accent-bright);
    box-shadow: 0 0 12px var(--accent-glow);
  }

  button:active {
    transform: scale(0.97);
  }

  .display,
  .stats,
  .controls {
    margin-bottom: 14px;
    padding: 14px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: var(--bg-raised);
  }

  .display {
    border-color: rgba(180, 74, 255, 0.35);
    box-shadow: inset 0 0 24px rgba(180, 74, 255, 0.06);
  }

  .stats {
    border-color: rgba(180, 74, 255, 0.25);
  }

  .stat-row {
    margin-bottom: 12px;
  }

  .stat-row p {
    margin-bottom: 4px;
  }

  .bar-chart,
  .wakeup-chart {
    width: 100%;
    max-width: 280px;
    height: auto;
    display: block;
    border: none;
    background: transparent;
    border-radius: 0;
  }

  .bar-track {
    fill: #0a0a0f;
    stroke: var(--border);
  }

  .bar-fill {
    fill: var(--accent);
  }

  .bar-fill.temp {
    fill: var(--accent-bright);
  }

  .dot-on {
    fill: var(--accent-bright);
    stroke: var(--accent);
  }

  .dot-off {
    fill: #0a0a0f;
    stroke: var(--border);
  }

  .cluster {
    margin-bottom: 14px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border);
  }

  .cluster:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  input[type='number'] {
    width: 5.5rem;
    padding: 8px 10px;
    font: inherit;
    color: var(--text-h);
    background: #0a0a0f;
    border: 1px solid var(--accent-border);
    border-radius: 8px;
  }

  input[type='number']:focus {
    outline: none;
    border-color: var(--accent-bright);
    box-shadow: 0 0 0 2px var(--accent-dim);
  }
</style>
