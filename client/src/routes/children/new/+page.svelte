<script lang="ts">
  import { goto } from '$app/navigation';

  let name = '';
  let dateOfBirth = '';
  let message = '';
  let isError = false;
  let loading = false;

  async function handleAddChild() {
    loading = true;
    message = '';

    try {
      const res = await fetch('/api/children', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          dateOfBirth, // format: YYYY-MM-DD
        }),
      });

      const result = await res.json();

      if (res.ok) {
        message = `✅ Child "${name}" added successfully!`;
        isError = false;
        setTimeout(() => goto('/children'), 1500); // go to list page (we'll make this next)
      } else {
        message = result.message || 'Failed to add child';
        isError = true;
      }
    } catch (err) {
      message = 'Network error';
      isError = true;
    } finally {
      loading = false;
    }
  }
</script>

<div class="form-container">
  <h1>Add New Child</h1>
  <header class="top-nav">
    <button on:click={() => goto('/')} class="home-btn"> 🏠 Home </button>
    <button on:click={logout} class="logout-btn"> Logout </button>
  </header>
  {#if message}
    <p class={isError ? 'error' : 'success'}>{message}</p>
  {/if}

  <form on:submit|preventDefault={handleAddChild}>
    <label>
      Child's Full Name
      <input type="text" bind:value={name} required placeholder="e.g. Emma Johnson" />
    </label>

    <label>
      Date of Birth
      <input type="date" bind:value={dateOfBirth} required />
    </label>

    <button type="submit" disabled={loading}>
      {loading ? 'Adding...' : 'Add Child'}
    </button>
  </form>

  <p><a href="/children">← Back to Children List</a></p>
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
    border-radius: 6px;
    border: 1px solid #555;
    background: #2a2a2a;
    color: white;
  }
  button {
    width: 100%;
    padding: 14px;
    background: #0066cc;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
  }
  .success {
    color: #4ade80;
  }
  .error {
    color: #f87171;
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
