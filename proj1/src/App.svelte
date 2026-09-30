<script>
  let temp = $state(18);
  let position = $state('flat');
  let sleepmode = $state(false);
  let showInfo = $state(false);
</script>

<div class="layout">
  <section id="testing-ui">
    <h1>Smart Bed</h1>
    <p>Shivam Sinay Kharangate</p>
    <h2>Where this UI would sit</h2>
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
    <p>Display on the headboard, controls would be near the foot of the bed.</p>

    <h2>Testing UI</h2>
    <button onclick={() => (showInfo = !showInfo)}>Info</button>
    {#if showInfo}
      <p>
        These buttons would do a simulation of real use. They would change the Device UI the way sensors would do, like someone getting in bed, getting up, or the room cooling.
      </p>
    {/if}

    <p>
      <button
        onclick={() => {
          sleepmode = true;
          position = 'flat';
        }}
      >
        Person lying down
      </button>
      <button
        onclick={() => {
          sleepmode = false;
          position = 'raised';
        }}
      >
        Person getting up
      </button>
      <button onclick={() => (temp = Math.max(10, temp - 2))}>Room cooling overnight</button>
    </p>
  </section>

  <section id="device-ui">
    <h2>Device UI</h2>

    <p>Temperature:</p>
    <input type="number" bind:value={temp} />
    <p>Temperature is {temp}</p>

    <p>Position:</p>
    <button onclick={() => (position = 'flat')}>Flat</button>
    <button onclick={() => (position = 'raised')}>Raised</button>
    <p>Position is {position}</p>

    <p>Sleep Mode:</p>
    <input type="checkbox" bind:checked={sleepmode} />
    <p>Sleep mode is {sleepmode}</p>
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

  p {
    margin: 8px 0;
  }

  button {
    margin: 4px 4px 4px 0;
  }
</style>
