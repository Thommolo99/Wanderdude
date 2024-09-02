import type { User } from 'firebase/auth';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword, signOut ,createUserWithEmailAndPassword} from "firebase/auth";
import { writable } from "svelte/store";
import { app } from './firebaseConf';
import { sendNotification } from "./main";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function createUserStore() {
    const { subscribe, set, update } = writable<User>();

    async function login(email: string, pwd: string) {
        try {
            await signInWithEmailAndPassword(auth, email, pwd)
        } catch (err) {
            sendNotification("Login error"); 
        }
    }
    async function register(email: string, pwd: string) {
        try {
            await createUserWithEmailAndPassword(auth, email, pwd)
        } catch (err) {
            sendNotification("Register error"); 
        }
    }

    function googleLogin() {
        signInWithPopup(auth, provider);
    }

    async function logout() {
        await signOut(auth);
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            userStore.set(user);
        } else {
            userStore.set(undefined);
        }
    });

    return {
        subscribe, set, update, login, googleLogin, logout, register, onAuthStateChanged
    };
}

export const userStore = createUserStore(); 