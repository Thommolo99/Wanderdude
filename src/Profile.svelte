<script lang="ts">   
    import Post from "./Post.svelte";
    import { onMount } from 'svelte';
    import { profile, loadProfile , posts, userProfileToShow} from './store';
    import { userStore } from "./loginStore";

    export let user: string;

    onMount(() => {
       loadProfile(user); 
    });


    let postCountPromise: Promise<number> | null = null;

    $: if ($profile) {
        postCountPromise = posts.getPostCountByUser($profile.user);
    }

</script>

<style>
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    text-decoration: none;
  }
  
  
  .profile-card{
    margin-top: 1rem;
    width: 98%;
    text-align: center;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0, 100, 105, 0.715);
  }
  
  
  .card-header{
    background: #04384B;
    padding: 60px 40px;
  }
  
 .pic{
    display: inline-block;
    padding: 8px;
    margin: auto;
    border-radius: 50%;
    background-size: 200% 200%;
    animation: animated-gradient 2s linear infinite;
  }
  
 
  .pic img{
    display: block;
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  
  .name{
    color: #EEE0D7;
    font-size: 28px;
    font-weight: 600;
    margin: 10px 0;
  }
  
  .bio{
    font-size: 18px;
    color: #ffbcd9;
  }
  
  
  .footer{
    background: #EEE0D7;
    padding: 60px 10px;
  }
  
  .info{
    display: flex;
    align-items: center;
  }
  
  .item{
    flex: 1;
    text-transform: uppercase;
    font-size: 13px;
    color: #a03e3e ;
    font-weight: 500;
  }
  
  .item span{
    text-transform: lowercase;
    display: block;
    color: #2c3a47;
    font-size: 20px;
  }
  
  .border{
    width: 2px;
    height: 30px;
    background: #a03e3e
  }
  


</style>


<div class="profile-card">
  <div class="card-header">
    <div class="pic">
      <img src={$profile ? $profile.photoURL : null} alt=""/>
    </div>
    <div class="name">{$profile ? $profile.nome : ($userStore ? ($userStore.email? ($userStore.email == $userProfileToShow? "You must create your account page" : "this user has not configured his profile" ): "Loading"): "Loading")} {$profile ? $profile.cognome : ""}</div>
    <div class="bio">{$profile ? $profile.bio : ""}</div>
    
  </div>
  <div class="footer">
    <div class="info">
      <div class="item">
        Posts
        <span>
              {#await postCountPromise}
                 <span>...</span>
              {:then postCount}
                 <span>{postCount}</span>
              {/await}
        </span>
      </div>
      <div class="border"></div>
       <div class="item">
        Mail
        <span>{$profile ? $profile.user : ""}</span>
      </div>
       <div class="border"></div>
      <div class="item">
        Nationality
        <span>{$profile ? $profile.nazionalità : ""}</span>
      </div>
    </div>
  </div>
</div>
{#if user != null}
   {#each $posts.filter(post => post.user === user) as post }
      <Post {post} />
   {/each}
{/if}



  
        
                
            
