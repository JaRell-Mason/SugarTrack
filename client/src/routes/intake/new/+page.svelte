<script lang="ts">
  import { onMount } from 'svelte';

  let children: any[] = [];
  let selectedChildId = '';
  let foodItem = '';
  let amount = '';
  let unit = 'grams'; // or servings, etc.
  let notes = '';
  let message = '';
  let isError = false;

  onMount(async () => {
    const res = await fetch('/api/children');
    if (res.ok) children = await res.json();
  });

  async function handleRecordIntake() {
    if (!selectedChildId) {
      message = 'Please select a child';
      isError = true;
      return;
    }

    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: selectedChildId,
          foodItem,
          amount: Number(amount),
          unit,
          notes,
        }),
      });

      if (res.ok) {
        message = `✅ Recorded ${foodItem} for the child!`;
        isError = false;
        // Reset form
        foodItem = '';
        amount = '';
        notes = '';
      } else {
        message = 'Failed to record intake';
        isError = true;
      }
    } catch (err) {
      message = 'Network error';
      isError = true;
    }
  }
</script>

<div class="form-container">
  <h1>Record Food/Drink Intake</h1>

  {#if message}
    <p class={isError ? 'error' : 'success'}>{message}</p>
  {/if}

  <form on:submit|preventDefault={handleRecordIntake}>
    <label
      >Child
      <select bind:value={selectedChildId} required>
        <option value="">Select a child</option>
        {#each children as child}
          <option value={child.childId}>{child.name}</option>
        {/each}
      </select>
    </label>

    <label
      >Food / Drink Item
      <input bind:value={foodItem} placeholder="e.g. Apple slices, Soda, Candy" required />
    </label>

    <label
      >Amount
      <input type="number" bind:value={amount} placeholder="e.g. 150" required />
    </label>

    <label
      >Unit
      <select bind:value={unit}>
        <option value="grams">grams</option>
        <option value="ml">ml</option>
        <option value="servings">servings</option>
        <option value="pieces">pieces</option>
      </select>
    </label>

    <label
      >Notes (optional)
      <textarea bind:value={notes} placeholder="Any extra notes..."></textarea>
    </label>

    <button type="submit">Record Intake</button>
  </form>

  <p><a href="/children">← Back to Children</a></p>
</div>

<style>
  /* Reuse similar styles from previous forms */
  .form-container {
    max-width: 500px;
    margin: 40px auto;
    padding: 30px;
  }
  input,
  select,
  textarea {
    width: 100%;
    padding: 12px;
    margin: 8px 0 20px;
    background: #2a2a2a;
    border: 1px solid #555;
    color: white;
    border-radius: 6px;
  }
  button {
    width: 100%;
    padding: 14px;
    background: #0066cc;
    color: white;
    border: none;
    border-radius: 6px;
  }
  .success {
    color: #4ade80;
  }
  .error {
    color: #f87171;
  }
</style>
