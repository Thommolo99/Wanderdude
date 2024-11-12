<script lang="ts">
    import { posts } from './store'; 
    import { userStore } from "./loginStore";
    import { setUserProfileToShow, setProfileView} from "./store";
    
    $: currentUser = $userStore ? $userStore.email : "";
    $: currentUserIsAuthor = currentUser === post.user;

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
        if (currentUser != null) posts.bookPost(post,currentUser); 
  };

  function viewProfile() {
        if (post.user != null) {
            setUserProfileToShow(post.user);
        }
        setProfileView(1);
    }
 

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
        background-color: #EEE0D7;
        box-shadow: 5px 4px 8px rgba(0, 100, 105, 0.715);
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
        color:  #04384B;
    }

    button{
        width: 120px; 
    }

    .clickable {
        cursor: pointer;
        text-decoration: underline;
    }

    .clickable:hover {
        color: #04384B;
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
        {#if currentUserIsAuthor}
            <p class="clickable" on:click={viewProfile}><strong>User: </strong> you </p>
        {:else}
            <p class="clickable" on:click={viewProfile}><strong>User: </strong> {post.user}</p>
        {/if}
        <p><strong>Bio: </strong> {post.bio}</p>
        <p><strong>Price: </strong> {post.prezzo} €</p>
        <p><strong>Where: </strong> {post.dove}</p>
        <br/>
        <p> {#if currentUserIsAuthor}
                {#if post.prenotazioni != 0}
                    <strong>Who like this post?</strong>
                {:else}
                    <strong>Currently no like</strong>
                {/if}
                {#each post.prenotati as user}
                    <p>{user}</p>
                {/each}
       
            {:else}
                 <button on:click={prenota}>
                     Likes ({post.prenotazioni})
                 </button>
            {/if}
        </p>
   </div>
</div>
