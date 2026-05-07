<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let childName = '';
  let maxDailyGrams = 50;
  let description = '';
  let message = '';
  let isError = false;
  let saving = false;

  const childId = $page.params.childId;

  onMount(async () => {
    const res = await fetch(`/api/children/${childId}`);
    if (res.ok) {
      const child = await res.json();
      childName = child.name;
    }
  });

  async function handleCreateThreshold() {
    saving = true;
    try {
      const res = await fetch(`/api/children/${childId}/thresholds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maxDailyGrams,
          description,
        }),
      });

      if (res.ok) {
        message = `✅ ${maxDailyGrams}g daily threshold set for ${childName}`;
        isError = false;
        setTimeout(() => goto(`/children/${childId}`), 1500);
      } else {
        message = 'Failed to create threshold';
        isError = true;
      }
    } catch (err) {
      message = 'Network error';
      isError = true;
    } finally {
      saving = false;
    }
  }
</script>

<div class="form-container">
  <h1>Sugar Threshold — {childName}</h1>

  {#if message}
    <p class={isError ? 'error' : 'success'}>{message}</p>
  {/if}

  <form on:submit|preventDefault={handleCreateThreshold}>
    <label
      >Max Daily Sugar (grams)
      <input type="number" bind:value={maxDailyGrams} min="0" required />
    </label>

    <label
      >Description (optional)
      <input bind:value={description} placeholder="e.g. For diabetes management" />
    </label>

    <button type="submit" disabled={saving}>
      {saving ? 'Saving...' : 'Set Threshold'}
    </button>
  </form>

  <p><a href={`/children/${childId}`}>← Back to Child</a></p>
</div>

<style>
  .form-container {
    max-width: 500px;
    margin: 40px auto;
    padding: 30px;
  }
  input {
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
