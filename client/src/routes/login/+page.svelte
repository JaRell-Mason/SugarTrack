<script lang="ts">
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let message = '';
  let isError = false;

  async function handleLogin() {
    console.log('🔵 Login button clicked with:', { email, password: '***' });

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('🔵 Response status:', res.status);

      const result = await res.json();
      console.log('🔵 Response body:', result);

      if (res.ok) {
        message = 'Login successful!';
        isError = false;
        setTimeout(() => goto('/'), 1000);
      } else {
        message = result.message || 'Invalid email or password';
        isError = true;
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      message = 'Network error — check the backend terminal';
      isError = true;
    }
  }
</script>

<div class="container">
  <h1>Login</h1>

  {#if message}
    <p class={isError ? 'error' : 'success'}>{message}</p>
  {/if}

  <form on:submit|preventDefault={handleLogin}>
    <input type="email" bind:value={email} placeholder="Email" required />
    <input type="password" bind:value={password} placeholder="Password" required />
    <button type="submit">Log In</button>
  </form>

  <p>No account yet? <a href="/register">Register</a></p>
</div>

<style>
  .container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
  }
  input {
    width: 100%;
    padding: 10px;
    margin: 8px 0;
    box-sizing: border-box;
  }
  button {
    width: 100%;
    padding: 12px;
    background: #0066cc;
    color: white;
    border: none;
    cursor: pointer;
  }
  button:hover {
    background: #0055aa;
  }
  .success {
    color: green;
  }
  .error {
    color: red;
  }
</style>
