<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let entries: any[] = [];
  let childName = '';
  let loading = true;
  let error = '';

  const childId = $page.params.childId;

  onMount(async () => {
    try {
      const [childRes, entriesRes] = await Promise.all([
        fetch(`/api/children/${childId}`),
        fetch(`/api/children/${childId}/intake`),
      ]);

      if (childRes.ok) {
        const child = await childRes.json();
        childName = child.name;
      }

      if (entriesRes.ok) {
        entries = await entriesRes.json();
      } else {
        error = 'Failed to load intake history';
      }
    } catch (err) {
      error = 'Network error';
    } finally {
      loading = false;
    }
  });
</script>

<div class="container">
  <header>
    <h1>Intake History — {childName || 'Child'}</h1>
    <button on:click={() => goto(`/children/${childId}`)}>← Back to Child</button>
  </header>

  {#if loading}
    <p>Loading history...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else if entries.length === 0}
    <p>No intake recorded yet.</p>
  {:else}
    <div class="entries-list">
      {#each entries as entry}
        <div class="entry-card">
          <div>
            <strong>{entry.foodItem}</strong> — {entry.amount}
            {entry.unit}
          </div>
          <small>{new Date(entry.recordedAt).toLocaleString()}</small>
          {#if entry.notes}
            <p class="notes">{entry.notes}</p>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
  }
  .entry-card {
    background: #2a2a2a;
    padding: 18px;
    margin-bottom: 12px;
    border-radius: 12px;
  }
  .notes {
    margin-top: 8px;
    font-style: italic;
    color: #aaa;
  }
</style>
