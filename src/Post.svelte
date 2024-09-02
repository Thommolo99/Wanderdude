<script lang="ts">
    import { posts } from './store'; 
    import { userStore } from "./loginStore";

    $: currentUser = $userStore ? $userStore.email : "";

    export let post: {
        id: string;
        user: string;
        bio: string;
        prezzo: string;  
        dove: string;
        photoURL1: string;
        photoURL2: string;
        photoURL3: string;
        prenotazioni: number;
        prenotati: string[];
  };

  const prenota = () => {
        posts.bookPost(post,currentUser);
  };
 

</script>

<style>
    .photo-container {
       display: flex;
       justify-content: center; 
       align-items: center; 
       gap: 10px; 
       padding-top: 10px;
       padding-right: 10px;
       padding-left: 10px;
       padding-bottom: 20px;
    }

    .photo-container img {
        flex: 1;
        width: 220px;
        height: 180px;
        object-fit: cover; 
        border-radius: 15px; 
    }

    .polaroid {
        display: block;
        flex-direction: column; 
        align-items: center; 
        width: 100%; 
        max-width: 1000px;
        margin: 20px auto; 
        background-color: #fbfdfebf;
        box-shadow: 5px 4px 8px rgba(0, 234, 246, 0.656);
        border-radius: 15px;
        overflow: hidden; 
    }

    .info {
        display: flex;
        flex-wrap: wrap;  
        gap: 10px;       
        justify-content: center;  
        align-items: center;       
    }

    .info p {
        margin: 5px 0;
        font-size: 16px;
        flex: 1 1 auto;   
        min-width: 150px; 
        text-align: center;  
    }

    .info p strong {
        color: #1c849ebf;
    }

    button{
        width: 120px; 
    }

</style>

<div class="polaroid">
    {#if post.photoURL1 &&  post.photoURL2 &&  post.photoURL3}
            <div class="photo-container">
                <img src={post.photoURL1} alt="Post Image1" />
                <img src={post.photoURL2} alt="Post Image2" />
                <img src={post.photoURL3} alt="Post Image3" />
            </div>
    {/if}
    <div class="info">
        <p><strong>User:</strong> {post.user}</p>
        <p><strong>Bio:</strong> {post.bio}</p>
        <p><strong>Prezzo:</strong> {post.prezzo} €</p>
        <p><strong>Dove:</strong> {post.dove}</p>
        <br/>
        <p><button class="book-button" on:click={prenota}>Interessed! ({post.prenotazioni})</button></p>
    </div>
   
</div>
