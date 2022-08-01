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
const emailSendUrl="http://localhost:4000/api/files/send"
const url="http://localhost:4000/api/files"

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
    files=e.dataTransfer.files
    if(files.length){
        fileInput.files=files
    }
    uploadFile(e)
})

browseBtn.addEventListener('click',()=>{
    fileInput.click()
})
const uploadFile=()=>{
    progressContainer.style.display='Block'
    const file=fileInput.files[0];
    xhr.onreadystatechange=()=>{
        if(xhr.readyState===XMLHttpRequest.DONE){
            console.log(xhr.response)
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
        console.log(file)
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
    console.table(formData)
    fetch(emailSendUrl,{
        method:'POST',
        headers:{
            'content-type':'application/json'
        },
        body:JSON.stringify(formData)
        
    }).then((response)=>response.json())
    .then(({success})=>{
        if(success){
            sender.value='';
            receiver.value='';
            fileInput.value=''
            console.log('success!!')
            showToast('Email Sent Successfully')
            sharingContainer.style.display="none";
        }
    })
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