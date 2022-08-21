const dropZone= document.querySelector('.drop-zone');
const fileInput=document.querySelector('.inputFile');
const browseBtn=document.querySelector('.browseBtn');
const bgProgress=document.querySelector('.bg-progress');
const percentDiv=document.querySelector('#percent')
const progressBar=document.querySelector('.progress-bar')
const progressContainer=document.querySelector('.progress-container')
const copyUrl=document.querySelector('#copyUrl')
const sharingContainer=document.querySelector('.sharing-container')
const copyBtn=document.querySelector('#copyBtn')
const emailContainer=document.querySelector('.email-container')
const emailForm=document.querySelector('#email-form')
const sender=document.querySelector('#sender')
const receiver=document.querySelector('#receiver')
const toast=document.querySelector('.toast')
const xhr=new XMLHttpRequest();

const emailSendUrl="http://34.118.204.74:3000/api/files/send"
const url="http://34.118.204.74:3000/api/files"

//firebase imports and configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js'
import { getAuth,signOut,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/9.9.2/firebase-auth.js'
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


const maxFileSize=100*1024*1024;

//to check if the user is authorized or not

// onAuthStateChanged(auth,(user)=>{
//     if(user){
//         console.log('welcome')
//     }
//     else{
//         console.log("user isn't authorized")
//         // window.location.href="/"
//         showToast('user isnt authorized')
//     }
// })


dropZone.addEventListener('dragover',(e)=>{
    e.preventDefault()
    if(!dropZone.classList.contains('dragged')){
        dropZone.classList.add('dragged')
    }
})
fileInput.addEventListener('change',()=>{
    uploadFile()
})

dropZone.addEventListener('dragleave',(e)=>{
    e.preventDefault()
    dropZone.classList.remove('dragged')
})

dropZone.addEventListener('drop',(e)=>{
    e.preventDefault();
    dropZone.classList.remove('dragged')
   let files=e.dataTransfer.files
    if(files.length){
        fileInput.files=files
    }
    uploadFile(e)
})

browseBtn.addEventListener('click',()=>{
    fileInput.click()
})
const uploadFile=()=>{
    if(fileInput.files.length>1){
        showToast('Please upload 1 file at a time 🤔')
        fileInput.value='';
        return;
    }
    const file=fileInput.files[0];
    if(file.size>maxFileSize){
        
        showToast("file size can't be more than 100 mb 😟")
        fileInput.value='';
        return;
    }
    progressContainer.style.display='Block'
    xhr.onreadystatechange=()=>{
        if(xhr.readyState===XMLHttpRequest.DONE){
            // console.log(xhr.response)
            showLink(JSON.parse(xhr.response))
        }
    }
    const formData=new FormData();
    formData.append('myfile',file);
    xhr.upload.onerror=()=>{
        showToast(`Error in upload: ${xhr.statusText}`)
        fileInput.value=""
    }
    xhr.open("POST",url,true)
    xhr.upload.onprogress=updateProgress
    xhr.send(formData)
}

//for updating progress bar
const updateProgress=(e)=>{
    const percent= Math.round((e.loaded/e.total)*100)
    bgProgress.style.width=`${percent}%`
    percentDiv.innerText=percent;
    progressBar.style.transform=`scaleX(${percent/100})`
}

//for showing the link once the file gets uploaded
 const showLink=({file})=>{
        // console.log(file)
        copyUrl.value=file
        progressContainer.style.display='none'
        sharingContainer.style.display='block'
        copyBtn.addEventListener('click',(e)=>{
           copyUrl.select()
           document.execCommand('copy')
           showToast('link copied')
        })
 }

 //to send the email

emailForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const  url= copyUrl.value;
    const uuid=url.split('/').splice(-1,1)[0];
    const formData={
        uuid,
        emailFrom:emailForm.elements['email-from'].value,
        emailTo:emailForm.elements['email-to'].value,
    };
    // console.table(formData)
   const body=JSON.stringify(formData)
    xhr.open('POST',emailSendUrl,true);
    xhr.setRequestHeader('content-type','application/json')
    xhr.onreadystatechange=()=>{
        if(xhr.readyState===XMLHttpRequest.DONE){
            if(JSON.parse(xhr.response).msg!='success'){
                showToast(JSON.parse(xhr.response).msg)
            }else{
                sender.value='';
                receiver.value='';
                fileInput.value=''
                showToast('Email Sent Successfully 😎')
                sharingContainer.style.display="none";
            }
        }
    }
    xhr.send(body)

})
let toastTimer

//foe showing the toast message
var showToast=(msg)=>{
    toast.innerText=msg;
    toast.style.transform="translate(-50%,0px)"
    clearTimeout(toastTimer)
    toastTimer=setTimeout(()=>{
    toast.style.transform="translate(-50%,85px)"
    },2000)
}

//for loggingOut
const logOut=document.querySelector('.logOut')
logOut.addEventListener('click',logout)

function logout(){
    signOut(auth).then(res=>{
        console.log('successfully loggedout')
        location.replace("/");
    }).catch(err=>{
        console.log('err: ',err)
    })
}

