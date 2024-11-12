<script lang="ts">
    import { userStore } from './loginStore';
    let email = "";
    let pwd = "";
</script>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        width: 100%;
    }

    .input-group,
    .button-group {
        display: flex;
        flex-direction: row; 
        gap: 0.5rem;
        width: 100%;
        max-width: 500px;
        justify-content: center;
        margin-bottom:1rem;
    }

    .input-group{
        margin-top:5rem;
    }
    

    input {
        padding: 0.5rem;
        font-size: 1rem;
        width: 100%;
        max-width: 150px;
    }

    
</style>

<div class="container">
    <form on:submit|preventDefault>
        <h1>Welcome! Please log in or register.</h1>
        <div class="input-group">
            <input id="email" bind:value={email} type="text" placeholder="e-mail"/>
            <input id="pwd" bind:value={pwd} type="password" placeholder="password"/>
        </div>
        <div class="button-group">
            <button on:click={() => userStore.login(email, pwd)}>Login</button>
            <button on:click={() => userStore.register(email, pwd)}>Register</button>
            <button on:click={userStore.googleLogin}>Google</button>
        </div>
    </form>
</div>
