<script lang="ts">
    import { userStore } from './loginStore';

    let email = "";
    let pwd = "";

</script>

<style>
    body {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
    }

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
       
    }
  
    .logo {
        max-width: 30%;
        height: 50px;
        margin-bottom: 20px;
    }
</style>

<html>
    <head>
    </head>
    <body>
        <div class=container>
            <form on:submit|preventDefault>
                <label for="username">Username:</label>
                <input id="username" bind:value={email} type="text" />
                <br />
                <label for="pwd">Password:</label>
                <input id="pwd" bind:value={pwd} type="password" />
                <br />
                <button on:click={() => userStore.register(email, pwd)}> Register</button>
                <button on:click={() => userStore.login(email, pwd)}> Login </button>
                <button on:click={userStore.googleLogin}>Google</button>
            </form>
        </div>
    </body>
</html>


