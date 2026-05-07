<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let userName = 'User';

  onMount(async () => {
    try {
      const res = await fetch('/api/me');
      if (res.ok) {
        const data = await res.json();
        if (data.user?.displayName) userName = data.user.displayName;
      }
    } catch (e) {}
  });

  function logout() {
    fetch('/api/logout', { method: 'POST' }).then(() => goto('/login'));
  }
</script>

<div class="dashboard">
  <header class="top-nav">
    <h1>Welcome back, {userName}!</h1>
    <button on:click={logout} class="logout-btn">Logout</button>
  </header>

  <div class="cards">
    <!-- Children -->
    <div class="card">
      <div class="card-header">
        👨‍👩‍👧‍👦 <h2>Children</h2>
      </div>
      <p>Manage your children's profiles</p>
      <div class="actions">
        <button on:click={() => goto('/children')}>View Children</button>
        <button on:click={() => goto('/children/new')}>Add Child</button>
      </div>
    </div>

    <!-- Track Intake -->
    <div class="card">
      <div class="card-header">
        🍎 <h2>Track Intake</h2>
      </div>
      <p>Log food & drink for your children</p>
      <button on:click={() => goto('/intake/new')}>Record Entry</button>
    </div>

    <!-- Alerts & Thresholds -->
    <div class="card">
      <div class="card-header">
        ⚠️ <h2>Alerts & Thresholds</h2>
      </div>
      <p>Manage sugar rules and alerts</p>
      <button on:click={() => goto('/children')}>Manage Rules & Thresholds</button>
    </div>

    <!-- Caregivers -->
    <div class="card">
      <div class="card-header">
        👥 <h2>Caregivers</h2>
      </div>
      <p>Authorize family & babysitters</p>
      <button on:click={() => goto('/children')}>👥 Manage Caregivers</button>
    </div>
  </div>
</div>

<style>
  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .top-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
  }

  .top-nav h1 {
    margin: 0;
    font-size: 2.2rem;
  }

  .logout-btn {
    background: #ef4444;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 20px;
  }

  .card {
    background: #1f1f1f;
    padding: 24px;
    border-radius: 12px;
    border: 1px solid #333;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    font-size: 1.4rem;
  }

  .card h2 {
    margin: 0;
  }

  button {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 12px;
  }

  button:hover {
    background: #2563eb;
  }
</style>
