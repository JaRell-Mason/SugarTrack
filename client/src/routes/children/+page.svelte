<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let children: any[] = [];
  let loading = true;
  let error = '';

  onMount(async () => {
    try {
      const res = await fetch('/api/children');
      if (res.ok) {
        children = await res.json();
      } else {
        error = 'Failed to load children';
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
    <h1>My Children</h1>
    <button on:click={() => goto('/children/new')}>+ Add Child</button>
  </header>
  <header class="top-nav">
    <button on:click={() => goto('/')} class="home-btn"> 🏠 Home </button>
    <button on:click={logout} class="logout-btn"> Logout </button>
  </header>
  {#if loading}
    <p>Loading children...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else if children.length === 0}
    <p>No children added yet.</p>
    <button on:click={() => goto('/children/new')}>Add Your First Child</button>
  {:else}
    <div class="children-list">
      {#each children as child}
        <div class="child-card">
          <div>
            <h3>{child.name}</h3>
            <p>Born: {child.dateOfBirth}</p>
          </div>

          <div class="actions">
            <button on:click={() => goto(`/children/${child.childId}`)}> ✏️ Edit </button>
            <button on:click={() => goto(`/children/${child.childId}/intake`)}> 📜 History </button>
            <button
              on:click={() => goto(`/children/${child.childId}/caregivers/new`)}
              style="background: #10b981;"
            >
              👥 Add Caregiver
            </button>
          </div>
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

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  .children-list {
    display: grid;
    gap: 16px;
  }

  .child-card {
    background: #2a2a2a;
    padding: 20px;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .actions button {
    padding: 10px 16px;
    background: #0066cc;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  .actions button:hover {
    background: #0055aa;
  }

  .error {
    color: #f87171;
  }
  .actions {
    display: flex;
    gap: 8px;
  }

  .actions button {
    padding: 8px 14px;
    font-size: 0.95em;
  }
  .top-nav {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 15px 30px;
    background: #1a1a1a;
    border-bottom: 1px solid #333;
  }

  .home-btn,
  .logout-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
  }

  .home-btn {
    background: #4b5563;
    color: white;
  }

  .logout-btn {
    background: #ef4444;
    color: white;
  }
</style>
