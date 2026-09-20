<script>
  let temp = 18;
  let position = "flat";
  let sleepmode = false;
</script>

<h1>Smart Bed</h1>

<p>Temperature:</p>
<input type="number" bind:value={temp} />
<p>Temperature is {temp}</p>

<p>Position:</p>
<button onclick={() => (position = "flat")}>Flat</button>
<button onclick={() => (position = "raised")}>Raised</button>
<p>Position is {position}</p>

<p>Sleep Mode:</p>
<input type="checkbox" bind:checked={sleepmode} />
<p>Sleep mode is {sleepmode}</p>
