<script lang="ts">
    import { addProfile, setUserProfileToShow, } from './store';
    import { userStore } from "./loginStore";
    import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
    import { storage } from "./firebaseConf";
    import { onDestroy } from 'svelte';
    import { sendNotification } from "./main";
    import { setProfileView ,toggleJustCreated} from "./store";
    
    
    let nome = "";
    let cognome = "";
    let bio = "";
    let nazionalità = "";
    let fileInput1: HTMLInputElement;
    let loading = false; 


    onDestroy(() => {
        nome = "";
        cognome = "";
        bio = "";
        nazionalità = "";
        if(fileInput1)fileInput1.value = "";
        loading = false; 
    });

    const submitProfile = async () => {
        if (nome == "" ||  cognome == "" || bio == "" || nazionalità == "" || fileInput1.files == null || (fileInput1.files != null && fileInput1.files.length != 1) ) {
            sendNotification("All fields are required");
        } else {
            loading = true; 
            const file1 = fileInput1.files[0];
            const photoURL1 = await uploadProfileImage(file1);
            if ($userStore && $userStore.email != null){
                await addProfile($userStore.email, nome, cognome, bio, nazionalità, photoURL1);
                sendNotification("Profile Uploaded");
                toggleJustCreated();
                setUserProfileToShow($userStore.email)
                setProfileView(1);
                return;
            } 
            sendNotification("Error: not uploaded");
        }
    };

    const uploadProfileImage = async (file: File) => {
        const storageRef = ref(storage, `propics/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise<string>((resolve, reject) => {
            uploadTask.on(
                "state_changed",
                snapshot => {
                },
                error => {
                    console.error("Error uploading file", error);
                    reject(error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                }
            );
        });
    };
</script>

<style>
    .profile-form {
        display: flex;
        flex-direction: column;
        align-items: center; 
        width: 100%;
        max-width: 400px;
        margin: auto;
        margin-top: 3rem;
    }

    label, input {
        width: 100%; 
        margin: 10px 0;
    }

    .loading-message{
       color: #EEE0D7;
    }
</style>

<div class="profile-form">
    {#if !loading}
    <h2>New Profile</h2>
    <label id="nome">Name</label>
    <input id="nome" bind:value={nome} type="text" placeholder="Nome" />

    <label id="cognome">Surname</label>
    <input id="cognome" bind:value={cognome} type="text" placeholder="Cognome" />

    <label id="bio">Bio</label>
    <input id="bio" bind:value={bio} type="text" placeholder="Biografia" />

    <label id="nazionalità">Nationality</label>
    <input id="nazionalità" bind:value={nazionalità} type="text" placeholder="Nazionalità" />

    <label id="propic">Profile picture</label>
    <input id="propic"type="file" bind:this={fileInput1} accept="image/*" required />

    <button on:click={submitProfile}>Save</button>
    {:else}
    <div class="loading-message">Uploading your profile, please wait here...</div>
    {/if}
   
</div>
