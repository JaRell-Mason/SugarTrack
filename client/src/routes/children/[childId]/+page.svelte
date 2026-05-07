<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let child: any = null;
  let name = '';
  let dateOfBirth = '';
  let loading = true;
  let saving = false;
  let message = '';

  const childId = $page.params.childId;

  onMount(async () => {
    try {
      const res = await fetch(`/api/children/${childId}`);
      if (res.ok) {
        child = await res.json();
        name = child.name;
        dateOfBirth = child.dateOfBirth;
      }
    } catch (e) {
      message = 'Failed to load child';
    } finally {
      loading = false;
    }
  });

  async function handleUpdate() {
    saving = true;
    try {
      const res = await fetch(`/api/children/${childId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, dateOfBirth }),
      });

      if (res.ok) {
        message = '✅ Child updated successfully!';
        setTimeout(() => goto('/children'), 1200);
      } else {
        message = 'Failed to update child';
      }
    } catch (e) {
      message = 'Network error';
    } finally {
      saving = false;
    }
  }
</script>

<div class="form-container">
  <h1>Edit Child</h1>
  <header class="top-nav">
    <button on:click={() => goto('/')} class="home-btn"> 🏠 Home </button>
    <button on:click={logout} class="logout-btn"> Logout </button>
  </header>
  {#if message}
    <p>{message}</p>
  {/if}

  {#if loading}
    <p>Loading...</p>
  {:else}
    <form on:submit|preventDefault={handleUpdate}>
      <label>Full Name <input bind:value={name} required /></label>
      <label>Date of Birth <input type="date" bind:value={dateOfBirth} required /></label>
      <button type="submit" disabled={saving}>
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
      <button
        type="button"
        on:click={async () => {
          if (confirm('Delete this child and all their data? This cannot be undone.')) {
            const res = await fetch(`/api/children/${childId}`, {
              method: 'DELETE',
            });

            if (res.ok) {
              alert('Child deleted successfully');
              goto('/children');
            } else {
              alert('Failed to delete child');
            }
          }
        }}
        class="delete-btn"
      >
        🗑️ Delete Child
      </button>
    </form>
  {/if}

  <p><a href="/children">← Back to Children</a></p>
</div>

<style>
  /* Same styles as add child form */
  .delete-btn {
    background: #dc2626;
    margin-top: 20px;
  }

  .delete-btn:hover {
    background: #b91c1c;
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
