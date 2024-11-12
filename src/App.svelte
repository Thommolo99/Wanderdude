<script lang="ts">
    import Post from "./Post.svelte";
    import { userStore } from "./loginStore";
    import LoginForm from "./LoginForm.svelte";
    import Profile from "./Profile.svelte"
    import { posts, userProfileToShow, showViewMode ,getProfile} from "./store";
    import Newprofile from "./NewProfile.svelte";

</script>

<style>
    .container { 
        display: flex; 
        float: right;
        width: 100%;
        height: 100%;
        flex-direction: column;
        align-items: center;
        min-width: 900px;   
        flex-grow: 1;  
    }
</style>

<main>
    <div class="container">
        {#if $userStore}
            {#if $showViewMode == 1}   
                {#if $userProfileToShow}
                    <Profile user={$userProfileToShow} />
                {/if}
            {:else if $showViewMode == 2}
                    <Newprofile/>
            {:else if $showViewMode == 0}
                {#each $posts as post}
                    <Post {post} />
                {/each}
            {:else}
                <p>not working</p>
            {/if}
        {:else}
            <LoginForm/>  
        {/if}
    </div> 
</main>
