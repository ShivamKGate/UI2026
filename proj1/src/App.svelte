<script>
  let temp = $state(18);
  let position = $state('flat');
  let sleepmode = $state(false);
  let occupied = $state(false);
  let showInfo = $state(false);
  let sessionsToday = $state(0);
  let lastAction = $state('None yet');

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
</script>

<div class="layout">
  <!--LEVEL 0-->
  <section id="testing-ui">
    <h1>Smart Bed</h1>
    <p>Shivam Sinay Kharangate</p>
    <p>
      <a
        href="https://example.com/your-project-writeup"
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
        lowers temperature by 2°C.
      </p>
    {/if}

    <p>
      <button type="button" onclick={personLiesDown}>Person lying down</button>
      <button type="button" onclick={personGetsUp}>Person getting up</button>
      <button type="button" onclick={roomCools}>Room cooling overnight</button>
    </p>
  </section>

  <!--LEVEL 1-->
  <section id="device-ui">
    <h2>Device UI</h2>

    <!-- indicators for the headboard display -->
    <div class="display">
      <h3>Headboard display</h3>
      <p>Occupancy: <strong>{occupied ? 'occupied' : 'empty'}</strong></p>
      <p>Temperature: <strong>{temp}°C</strong></p>
      <p>Position: <strong>{position}</strong></p>
      <p>Sleep mode: <strong>{sleepmode ? 'on' : 'off'}</strong></p>
      <p>Sleep sessions today: <strong>{sessionsToday}</strong></p>
      <p>Last action: <strong>{lastAction}</strong></p>
    </div>

    <!-- controls for the footboard, clustered by activity -->
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
    gap: 24px;
    padding: 24px;
    text-align: left;
    flex-grow: 1;
  }

  #testing-ui,
  #device-ui {
    flex: 1;
    border: 1px solid var(--border);
    padding: 16px;
  }

  #testing-ui h1 {
    font-size: 32px;
    margin: 0 0 8px;
  }

  #testing-ui h2,
  #device-ui h2 {
    margin-top: 20px;
  }

  h3 {
    margin: 12px 0 8px;
    color: var(--text-h);
  }

  p {
    margin: 8px 0;
  }

  button {
    margin: 4px 4px 4px 0;
  }

  .display,
  .controls,
  .cluster {
    margin-bottom: 12px;
  }

  input[type='number'] {
    width: 5rem;
    padding: 4px;
  }
</style>
