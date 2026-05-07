<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let users: any[] = []; // potential caregivers (other users)
  let selectedUserId = '';
  let accessLevel = 'view';
  let message = '';
  let isError = false;

  const childId = $page.params.childId;

  onMount(async () => {
    // Load other users (for selection)
    const res = await fetch('/api/users'); // or a filtered endpoint
    if (res.ok) users = await res.json();
  });

  async function handleAddCaregiver() {
    try {
      const res = await fetch(`/api/children/${childId}/caregivers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUserId, accessLevel }),
      });

      if (res.ok) {
        message = '✅ Caregiver added successfully!';
        isError = false;
        setTimeout(() => goto(`/children/${childId}`), 1500);
      } else {
        message = 'Failed to add caregiver';
        isError = true;
      }
    } catch (err) {
      message = 'Network error';
      isError = true;
    }
  }
</script>

<div class="form-container">
  <h1>Add Caregiver</h1>
  <header class="top-nav">
    <button on:click={() => goto('/')} class="home-btn"> 🏠 Home </button>
    <button on:click={logout} class="logout-btn"> Logout </button>
  </header>
  {#if message}
    <p class={isError ? 'error' : 'success'}>{message}</p>
  {/if}

  <form on:submit|preventDefault={handleAddCaregiver}>
    <label
      >Select User
      <select bind:value={selectedUserId} required>
        <option value="">Select a user</option>
        {#each users as user}
          <option value={user.userId}>{user.displayName || user.email}</option>
        {/each}
      </select>
    </label>

    <label
      >Access Level
      <select bind:value={accessLevel}>
        <option value="view">View Only</option>
        <option value="edit">Edit</option>
        <option value="full">Full Access</option>
      </select>
    </label>

    <button type="submit">Add Caregiver</button>
  </form>

  <p><a href={`/children/${childId}`}>← Back to Child</a></p>
</div>

<style>
  .form-container {
    max-width: 500px;
    margin: 40px auto;
    padding: 30px;
  }
  select,
  button {
    width: 100%;
    padding: 12px;
    margin: 10px 0;
  }
  button {
    background: #0066cc;
    color: white;
    border: none;
    border-radius: 6px;
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
