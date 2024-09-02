<script lang="ts">
	import Post from "./Post.svelte";
  	import { userStore } from "./loginStore";
	import { posts } from "./store";
	import AddForm from "./AddForm.svelte"; 
	
	let email = "";
	let pwd = "";
	export let showAddPostForm = false; 

	function toggleAddPostForm (){
		showAddPostForm = !showAddPostForm;
	}

</script>
<style>
	.container { 
		display: flex; 
		float:right;
        width: 100%;
		height: 100%;
	}
 
	.sezione_fissa {    
	   height: 100vh; 
	   padding: 1rem;
       background-color: #1c849ebf;
	   box-shadow: 5px 4px 8px rgba(0, 234, 246, 0.656);
       display: flex;
       flex-direction: column;
       align-items: center;
	   min-width: 150px;
    }
 
	.sezione_scrollabile {
	   flex-grow: 1;  
	   width: 85%; 
	   min-width: 900px;    
       padding: 1rem;
       display: flex;
       flex-direction: column;
       align-items: center;
	}

    .logo {
   	   position: fixed;  
       top: 50px;       
       left: 28px;      
       width: 140px;
       height: 200px;
       z-index: 100;   
    }

	.buttons_out {
	   position: fixed;  
       top: 300px;       
       left: 42px;
       z-index: 100; 
	}
	.buttons_in {
	   position: fixed;  
       top: 230px;
	   left: 37px;
	}

	.addForm {
	   position: fixed;  
       top: 400px;
	   left: 15px;

	}

	h1 {
        color: #1c849e; 
        font-size: 2.5rem; 
        text-align: center; 
        margin-bottom: 1rem; 
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2); 
    }

    h2 {
        color: #5ce0db; 
        font-size: 2rem; 
        text-align: center; 
        margin-bottom: 1.5rem; 
        font-weight: normal; 
        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.311);
    }


</style>
<main>
	<div class="container">
		<div class="sezione_fissa">
			<img class="logo" src="WADE_logo.gif" alt="Logo del sito">
				{#if $userStore}
				    <div class="buttons_in">
					<button on:click={() => userStore.logout()}> Logout </button>
					<br />
					<button on:click={toggleAddPostForm}>Add Post</button> 
				    </div>
				    {#if showAddPostForm}
				 	<div class="addForm">
						<AddForm />  
					</div>  
                    {/if}
				{:else}
				<div class="buttons_out">
					<form on:submit|preventDefault>
					<input id="username" bind:value={email} type="text" placeholder="e-mail"/>
					<br />
					<input id="pwd" bind:value={pwd} type="password" placeholder="password"/>
					<br />
					<button on:click={() => userStore.register(email, pwd)}> Register</button>
					<br />
					<button on:click={() => userStore.login(email, pwd)}> Login </button>
					<br />
					<button on:click={userStore.googleLogin}>Google</button>
				    </form>
				</div>  
  			    {/if}
		</div>
	    <div class="sezione_scrollabile">
			{#if $userStore}
			    {#each $posts as post }
                     <Post {post} />
                {/each}
			{:else}
			    <h1>Welcome! Please log in or register.</h1>
				<h2>Ready to go?</h2>
			{/if}
		</div> 
	 </div>
</main>
