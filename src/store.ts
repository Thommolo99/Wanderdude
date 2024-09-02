import { app } from "./firebaseConf";
import { addDoc, collection, deleteDoc, doc, getDocs, initializeFirestore, onSnapshot, orderBy, persistentLocalCache, persistentMultipleTabManager, query, updateDoc } from 'firebase/firestore';
import { writable } from "svelte/store";
import { getStorage, ref } from "firebase/storage";
import { sendNotification } from "./main";

export const storage = getStorage();
export const storageRef = ref(storage);    
export const postsRef = ref(storage, 'posts'); 


export interface Post {
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
}

export interface PostRequest {
    user: string;
    bio: string;
    prezzo: string;  
    dove: string;
    photoURL1: string;
    photoURL2: string;
    photoURL3: string;
    prenotazioni: number;
    prenotati: string[];
}


const db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});


function createFirebaseStore() {
    const { subscribe, set, update } = writable<Post[]>([]);
    
    const allQuery = query(collection(db, 'posts'),orderBy("date"));
    
    const unsubscribe = onSnapshot(allQuery, (querySnapshot) => {
        const newData = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Post));
        set(newData);
    });

    const bookPost = async (post: Post, user:string) => {
        if (post.prenotati.includes(user)) {
            sendNotification("Utente già prenotato");
            console.log("L'utente ha già prenotato.");
            return;
        }
        post.prenotazioni += 1; // Incrementa il numero di prenotazioni
        post.prenotati.push(user); 
        try {
            await updatePost(post); // Aggiorna il post nel database
        } catch (e) {
            console.error('Errore durante l\'aggiornamento della prenotazione:', e);
        }
    };
    
    const getPosts = async () => {
        const res = await getDocs(allQuery);
        set(res.docs.map((d) => ({ id: d.id, ...d.data() } as Post)));
    }
    
    const addPost = async (user:string, bio: string, dove: string, prezzo: string, photoURL1: string,photoURL2: string,photoURL3: string) => {
        const postRequest: PostRequest & { date: Date } = {
            photoURL1,
            photoURL2,
            photoURL3,
            user,
            bio,
            prezzo,
            dove,
            date: new Date(),
            prenotazioni:0,
            prenotati: [],
        };
        try {
            await addDoc(collection(db, 'posts'),  postRequest);
        } catch (e) {
            console.error(`Error adding ${postRequest}`, e);
        }
    }
    
    const updatePost = async (p: Post) => {
        const { id, ...pr } = p;
        try {
            await updateDoc(doc(db, 'posts', id), pr);
        } catch (e) {
            console.error(`Errore durante l'aggiornamento del post ${p.id}`, e);
        }
    }
    
    const deletePost = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'posts', id));
        } catch (e) {
            console.error(`error deleting ${id}`);
        }
    }
    
    return {
        subscribe,
        set,
        update,
        addPost,
        updatePost,
        deletePost,
        getPosts,
        bookPost, 
    }
}

export const posts = createFirebaseStore();
