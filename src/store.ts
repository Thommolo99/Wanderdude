import { app } from "./firebaseConf";
import { addDoc, collection, deleteDoc, doc, getDocs, initializeFirestore, onSnapshot, orderBy, persistentLocalCache, persistentMultipleTabManager, query, updateDoc,where } from 'firebase/firestore';
import { writable, get} from "svelte/store";
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

export interface Profile {
    id: string;
    photoURL: string;
    user: string;
    nome: string;
    bio: string;        
    cognome: string;  
    nazionalità: string;
}

export interface ProfileRequest {
    photoURL: string;
    user: string;
    nome: string;
    bio: string;        
    cognome: string;  
    nazionalità: string;
}



const db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});


function createFirebaseStore() {
    const { subscribe, set, update } = writable<Post[]>([]);
    
    const allPosts= query(collection(db, 'posts'),orderBy("date"));
    
    const unsubscribePosts = onSnapshot(allPosts, (querySnapshot) => {
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

    const getPostCountByUser = async (user: string): Promise<number> => {
        const postsCollection = collection(db, 'posts');
        const userPostsQuery = query(postsCollection, where("user", "==", user));
        const querySnapshot = await getDocs(userPostsQuery);
        return querySnapshot.size; 
    };
   


    const getPosts = async () => {
        const res = await getDocs(allPosts);
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
        getPostCountByUser,
    }
}

export const posts = createFirebaseStore();

export const profile = writable<Profile | null>(null);

export const getProfile = async (user: string): Promise<Profile | null> => {
    const profilesCollection = collection(db, 'profiles');
    const profileQuery = query(profilesCollection, where("user", "==", user));
    const querySnapshot = await getDocs(profileQuery);

    if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const profileData = doc.data() as Profile;
        return { ...profileData, id: doc.id };
    }
    return null;
};

export async function loadProfile(user: string) {
    const profileData = await getProfile(user);
    profile.set(profileData);
}


export const addProfile = async (user: string,nome: string, cognome: string, bio: string, nazionalità: string, photoURL: string) => {
    const profile: ProfileRequest  = {
        photoURL,
        user,
        nome,
        bio,
        cognome,
        nazionalità,
    }
    try {
        await addDoc(collection(db, 'profiles'), profile);
        console.log("Profilo aggiunto con successo:", profile);
    } catch (e) {
        console.error("Errore durante l'aggiunta del profilo:", e);
    }
};

export const userProfileToShow = writable<string | null>(null);

export const showViewMode = writable<number>(0);
//0 se App deve mostrare posts
//1 se App deve mostrare profilo già creato
//2 se App deve mostrare profilo da creare


export function setProfileView(val:number) {
  showViewMode.set(val);
}

export function setUserProfileToShow(userEmail: string) {
    userProfileToShow.set(userEmail);
}

export function getShowViewMode() {
    return get(showViewMode);
}

export const justCreated = writable<boolean>(false);
//serve per sincronizzare bottone "create profile" della toolbar quando utente fa submit del profilo

export function toggleJustCreated() {
    justCreated.set(true);
  }