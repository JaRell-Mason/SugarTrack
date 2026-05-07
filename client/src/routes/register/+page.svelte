<script lang="ts">
  import { goto } from '$app/navigation';
  let displayName = '';
  let email = '';
  let password = '';
  let message = '';
  let isError = false;

  async function handleRegister() {
    const res = await fetch('/api/users', {   // Note: /api prefix from the template
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName, email, password })
    });

    const result = await res.json();

    if (res.ok) {
      message = 'Account created successfully!';
      isError = false;
      setTimeout(() => goto('/login'), 1500);
    } else {
      message = result.message || result.errors?.[0]?.message || 'Registration failed';
      isError = true;
    }
  }
</script>

<div class="container">
  <h1>Create Account</h1>

  {#if message}
    <p class={isError ? 'error' : 'success'}>{message}</p>
  {/if}

  <form on:submit|preventDefault={handleRegister}>
    <input type="text" bind:value={displayName} placeholder="Display Name" required />
    <input type="email" bind:value={email} placeholder="Email" required />
    <input type="password" bind:value={password} placeholder="Password" minlength="6" required />
    <button type="submit">Register</button>
  </form>

  <p>Already have an account? <a href="/login">Log in</a></p>
</div>

<style>
  .container { max-width: 400px; margin: 50px auto; padding: 20px; }
  input { width: 100%; padding: 10px; margin: 8px 0; }
  button { width: 100%; padding: 12px; background: #0066cc; color: white; border: none; }
  .success { color: green; }
  .error { color: red; }
</style>