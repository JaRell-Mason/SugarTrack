<script lang="ts">
  import { goto } from '$app/navigation';

  // Simple check - no blocking fetch
  async function checkIfLoggedIn() {
    try {
      const res = await fetch('/api/me');
      if (res.ok) {
        const data = await res.json();
        if (data.isLoggedIn) {
          goto('/children'); // or wherever your main dashboard is
        }
      }
    } catch (e) {
      // User is not logged in → show landing page
    }
  }

  // Run check when page loads
  checkIfLoggedIn();
</script>

<div class="landing">
  <header>
    <div class="logo">🍎 SugarTrack</div>
  </header>

  <main>
    <h1>Track Your Child's Sugar Intake with Confidence</h1>

    <p class="subtitle">
      Simple, private tool for parents and caregivers.<br />
      Log food & drink, set sugar thresholds, and share access safely.
    </p>

    <div class="buttons">
      <button on:click={() => goto('/register')} class="primary"> Register Free </button>
      <button on:click={() => goto('/login')} class="secondary"> Login </button>
    </div>

    <div class="features">
      <div>✅ Child Profiles</div>
      <div>✅ Food & Drink Logging</div>
      <div>✅ Daily Sugar Thresholds</div>
      <div>✅ Caregiver Access</div>
      <div>✅ Intake History</div>
    </div>
  </main>
</div>

<style>
  .landing {
    min-height: 100vh;
    background: linear-gradient(135deg, #0f172a, #1e2937);
    color: white;
    text-align: center;
    padding: 80px 20px 60px;
  }

  .logo {
    font-size: 3.8rem;
    font-weight: bold;
    margin-bottom: 60px;
  }

  h1 {
    font-size: 2.8rem;
    line-height: 1.1;
    margin-bottom: 24px;
  }

  .subtitle {
    font-size: 1.35rem;
    max-width: 620px;
    margin: 0 auto 50px;
    opacity: 0.9;
  }

  .buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
    margin-bottom: 70px;
    flex-wrap: wrap;
  }

  button {
    padding: 16px 36px;
    font-size: 1.25rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
  }

  .primary {
    background: #3b82f6;
    color: white;
    border: none;
  }

  .secondary {
    background: transparent;
    color: white;
    border: 2px solid #64748b;
  }

  .features {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 24px;
    max-width: 700px;
    margin: 0 auto;
    font-size: 1.15rem;
  }
</style>
