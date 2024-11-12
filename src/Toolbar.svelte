<script lang="ts">
    import { userStore } from "./loginStore";
    import AddForm from "./AddForm.svelte"; 
    import { setUserProfileToShow, setProfileView ,getProfile,justCreated} from "./store";

    export let showAddPostForm = false;

    function toggleAddPostForm() {
        showAddPostForm = !showAddPostForm;
    }

    function viewProfile() {
        if ($userStore && $userStore.email != null) {
            setUserProfileToShow($userStore.email);
        }
        setProfileView(1);
    }

    function createProfileButton(){
        setProfileView(2); 
    }
</script>

<style>
    .logo {      
        width: 140px;
        height: 200px;
        z-index: 100;   
    }

    ul {
        list-style-type: none;
        margin-left: 0.5rem;
        padding: 0;
        position: fixed;
        height: 100%;
        overflow: auto;
        justify-content: center;
    }

    li {
        display: block;
    }
</style>

<ul>
    <li><img class="logo" src="WADE_logo.gif" alt="Logo del sito"></li>
    {#if $userStore}
        <li><button on:click={viewProfile}>My Profile</button></li>
        <br />      
        <li><button on:click={() => setProfileView(0)}>Home</button></li>  
        <br />
        <li><button on:click={() => userStore.logout()}>Logout</button></li>
        <br />
        {#if $userStore.email!=null} 
            {#await getProfile($userStore.email) then n}
                {#if n==null && $justCreated == false}     
                    <li><button on:click={createProfileButton}>Create Profile</button></li>
                    <br />
                {/if}
            {/await}
        {/if}
        <li><button on:click={toggleAddPostForm}>Add Post</button></li>
        {#if showAddPostForm}
            <li><AddForm /></li>
        {/if}
    {:else}
        <li><h2>Ready to go?</h2></li>
    {/if}   
</ul>
