import type { User } from 'firebase/auth';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword, signOut ,createUserWithEmailAndPassword} from "firebase/auth";
import { writable } from "svelte/store";
import { app } from './firebaseConf';
import { FirebaseError } from 'firebase/app';
import { sendNotification } from "./main";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function createUserStore() {
    const { subscribe, set, update } = writable<User | undefined>();

    async function login(email: string, pwd: string) {
        try {
            await signInWithEmailAndPassword(auth, email, pwd);
        } catch (err) {
            if (err instanceof FirebaseError) {
                sendNotification("Login error"); 
                if (err.code === 'auth/invalid-email') {
                    sendNotification('Invalid email format.');
                } else if (err.code === 'auth/user-not-found') {
                    sendNotification('User not found.');
                } else if (err.code === 'auth/wrong-password') {
                    sendNotification('Wrong password.');
                }
            } else {
                sendNotification("Login error: " + err); 
            }
        }
    }
    
    async function register(email: string, pwd: string) {
        try {
            await createUserWithEmailAndPassword(auth, email, pwd)
        } catch (err) {
            sendNotification("Register error: " + err); 
        }
    }

    function googleLogin() {
        signInWithPopup(auth, provider);
    }

    async function logout() {
        try {
            await signOut(auth);
            console.log('Logout successful');
        } catch (err) {
            console.error('Logout error:', err);
        }
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