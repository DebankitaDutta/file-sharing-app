
// import { Auth } from 'firebase-admin/lib/auth/auth';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js'
import { getAuth, GoogleAuthProvider, signInWithPopup,GithubAuthProvider,FacebookAuthProvider, signOut, fetchSignInMethodsForEmail,signInWithEmailAndPassword,linkWithCredential,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/9.9.2/firebase-auth.js'
import { getFirestore,addDoc,collection } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-firestore.js";
import { emit } from 'nodemon';
const firebaseConfig = {
            apiKey: "AIzaSyDVlZTg2wX60Dln4N123bjQCSho-I_DuNU",
            authDomain: "filesharingauth.firebaseapp.com",
            projectId: "filesharingauth",
            storageBucket: "filesharingauth.appspot.com",
            messagingSenderId: "386241019134",
            appId: "1:386241019134:web:83feff5acf1ebf48b179af",
            measurementId: "G-3FK09SE0X2"
        };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth=getAuth();
    const db = getFirestore();

    const xhr=new XMLHttpRequest();
    const loginUrl='http://localhost:4000/auth/login'
    // const signupUrl='http://localhost:4000/auth/signup'

    const login=document.querySelector('.login')
    const google=document.querySelector('.google')
    const github=document.querySelector('.github')
    const facebook=document.querySelector('.facebook')

    const google1=document.querySelector('.google1')
    const github1=document.querySelector('.github1')
    const facebook1=document.querySelector('.facebook1')


const sign_in_btn= document.querySelector('#sign-in-button');
const sign_up_btn= document.querySelector('#sign-up-button');
const sign_in_form=document.querySelector('.sign-in-form');
const sign_up_form=document.querySelector('.sign-up-form');
const container=document.querySelector('.container')
const toast=document.querySelector('.toast')

sign_up_btn.addEventListener('click',()=>{
    container.classList.add('sign-up-mode')
    container.classList.remove('sign-in-mode')
})
sign_in_btn.addEventListener('click',()=>{
    container.classList.remove('sign-up-mode')
    container.classList.add('sign-in-mode')
})

google.addEventListener('click',GoogleLogin)
google1.addEventListener('click',GoogleLogin)

let provider=new GoogleAuthProvider()


//login with google 
 async function GoogleLogin(){
    console.log('g-login called')
    await signInWithPopup(auth,provider).then(async(res)=>{

        console.log('succedeed',res.user)
        const newGoogleUser={
            uid:res.user.uid,
            email:res.user.email,
            accessToken:res.user.accessToken,
            displayName: res.user.displayName
        }
        var collectionRef=collection(db,"GoogleUsers")
        const docRef=await addDoc(collectionRef,newGoogleUser) //storing data into firebase
        console.log('google user stored into the db')
        checkUserStatus();
    }).catch(error=>{
        if (error.code === 'auth/account-exists-with-different-credential') {
            HandlingAccWithSameEmailError(error,GoogleAuthProvider)
                console.log('google loggedin successfully')
        }
        else{
            console.log('errMsg: ',error)
        }
    })
}

github.addEventListener('click',GithubLogin)
github1.addEventListener('click',GithubLogin)

let githubProvider= new GithubAuthProvider()

//login with github
async function GithubLogin(){
    await signInWithPopup(auth,githubProvider).then(async(res)=>{
        console.log('succeeded ',res.user)
        const newGithubUser={
            uid:res.user.uid,
            email:res.user.email,
            accessToken:res.user.accessToken
        }
        var collectionRef= collection(db,'GithubUsers');
        const docRef=await addDoc(collectionRef,newGithubUser)
        console.log('github user stored into the db')
        checkUserStatus();
    }).catch(error=>{
        if (error.code === 'auth/account-exists-with-different-credential') {
            HandlingAccWithSameEmailError(error,GithubAuthProvider)
                console.log('github loggedin successfully')
        }
        else{
            console.log('errMsg: ',error)
        }
    })
}

facebook.addEventListener('click',FacebookLogin)
facebook1.addEventListener('click',FacebookLogin)

let FacebookProvider= new FacebookAuthProvider()

//login with facebook
async function FacebookLogin(){
    console.log('fb clicked')
    signInWithPopup(auth,FacebookProvider).then(async(res)=>{
        console.log('succeeded ',res.user)
        const newFacebookUser={
            uid:res.user.uid,
            email:res.user.email,
            accessToken:res.user.accessToken
        }
        var collectionRef= collection(db,'FacebookUser');
        const docRef=await addDoc(collectionRef,newFacebookUser)
        console.log('facebook user stored into the db')
        await checkUserStatus();
    }).catch(error=>{
        console.log('error.code=  ',error.code)
        if (error.code === 'auth/account-exists-with-different-credential') {
            HandlingAccWithSameEmailError(error,FacebookAuthProvider)
                console.log('fb loggedin successfully')
        }
        else{
            console.log('errMsg: ',error)
        }
    })
}


//handing the (error.code === 'auth/account-exists-with-different-credential') issue if already an user account exists with given email id

 function HandlingAccWithSameEmailError(error,newProvider){
    var pendingCred=newProvider.credentialFromError(error);
    // console.log('pendingCred= ',pendingCred)
    var email=error.customData.email;
    fetchSignInMethodsForEmail(auth,email).then(async(methods)=>{
        console.log('methods[0]= ',methods[0])
        var existingProvider= await getProviderForProviderId(methods[0])
        // console.log('existingProvider= ',existingProvider)
        signInWithPopup(auth,existingProvider).then(result=>{
            console.log('result.user= ',result.user)
            linkWithCredential(auth.currentUser,pendingCred).then(function(usercred) {
                return
                });
        }).catch(err=>{
            console.log('not able to do signInWithPopup errMsg: ',err)
        })
    }).catch(err=>{
        console.log('not able to find signin method', err)
    })
}

//to return the provider object for each provider id
function getProviderForProviderId(method){
    if(method=='github.com')
        return new GithubAuthProvider
    if(method=='facebook.com')
        return new FacebookAuthProvider
    if(method=='google.com')
        return new GoogleAuthProvider
    
}

//checking current status of the user

async function checkUserStatus(){
   await onAuthStateChanged(auth,(user)=>{
        if(user){
            console.log('user loggedin, uid= ',user.uid)
            location.replace("/public/fileUpload.html");
        }
        else{
            console.log('user loggedout')
        }
        return
    })
}

sign_in_form.addEventListener('submit',LoginWithEmail);

//user login with email and password
async function LoginWithEmail(e){
    e.preventDefault();
    const email=document.getElementById('loginEmail').value;
    const password=document.getElementById('loginPassword').value;
    const loginCred={
        email,
        password
    }
    console.log('loginCred= ',JSON.stringify(loginCred))
    xhr.open('POST',loginUrl,true)
    xhr.setRequestHeader('Content-Type','application/json')
    xhr.send(JSON.stringify(loginCred))
    xhr.onreadystatechange=()=>{
        if(xhr.readyState===XMLHttpRequest.DONE){
            showToast((JSON.parse(xhr.response)).msg)
        }
    }
    sign_in_form.reset();
}

let toastTimer;

var showToast=(msg)=>{
    toast.innerText=msg;
    toast.style.transform="translate(-100%,13px)";
    toast.style.transition="transform 0.5s ease-out";
    if(xhr.status!=200){
        toast.style.background='#de4c6cb3';
    }
    else{
        toast.style.background='#43ec77cf'
        window.location.href="/public/fileUpload.html";
    }
    clearTimeout(toastTimer)
    toastTimer=setTimeout(()=>{
    toast.style.transform="translate(4%,13px)"
    },2000)
}

// sign_up_form.addEventListener('submit',Signup)
// const signup=document.querySelector('.signup');
// signup.addEventListener('click',Signup)

// async function Signup(e){
//     console.log('signup clicked')
//     e.preventDefault();
//     const email=document.querySelector('#email').value;
//     // console.log('email= ',email)
//     const username=document.querySelector('#username').value;
//     const password=document.querySelector('#password').value;
//     const confirmPassword=document.querySelector('#confirmPassword').value;
//     const phomeNumber=document.querySelector('#phomeNumber').value;

//     const newUser={
//         email,
//         username,
//         password,
//         confirmPassword,
//         phomeNumber
//     }
//     console.log(JSON.stringify(newUser))
//      xhr.open('POST',signupUrl,true);
//      xhr.setRequestHeader('Content-Type','application/json')
//      xhr.onreadystatechange=()=>{
//         if(xhr.readyState===XMLHttpRequest.DONE){
//             console.log((JSON.parse(xhr.response)).msg)
//         }
//      }
//      xhr.send(JSON.stringify(newUser))
     
// }
