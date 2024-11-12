<script lang="ts">
    import { posts } from "./store";
    import { userStore } from "./loginStore";
    import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
    import { storage } from "./firebaseConf";
    import { sendNotification } from "./main";

    let price = "";
    let bio ="";
    let dove ="";
    let fileInput: HTMLInputElement;

    $: currentUser = $userStore ? $userStore.email : "";

    const uploadPhoto = async (file: File) => {
        const storageRef = ref(storage, `photos/${file.name}`);
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

    
    
    const submitPost = async () => {
        if (fileInput.files!=null && fileInput.files.length === 3) {
            sendNotification("Uploading your post");
            const file1 = fileInput.files[0];
            const photoURL1 = await uploadPhoto(file1);
            const file2 = fileInput.files[1];
            const photoURL2 = await uploadPhoto(file2);
            const file3 = fileInput.files[2];
            const photoURL3 = await uploadPhoto(file3);
            if (currentUser!=null) await posts.addPost(currentUser, bio, dove, price, photoURL1, photoURL2, photoURL3);
            bio = "";
            fileInput.value = ""; 
            price = "";
            dove = "";
            sendNotification("Post Uploaded");
        } else {
            alert("Choose 3 photos.");
        }
    };
</script>

<style>
    .form-container {
        padding: 20px;
        border-radius: 10px;
        margin: 0 auto;
    }

    input{
        display: block;
        width: 95px;
        margin-bottom: 10px;
        padding: 10px;
        border: 1px;
    }
    
</style>

<div class="form-container">
    <form on:submit|preventDefault={submitPost}>
        <input type="text" bind:value={bio} placeholder="Bio" required />
        <input type="text" bind:value={price} placeholder="Price" required />
        <input type="text" bind:value={dove} placeholder="Wheree" required />
        <input type="file" bind:this={fileInput} accept="image/*" multiple required />
        <button type="submit">Submit</button>
    </form>
</div>

