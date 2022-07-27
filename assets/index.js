const dropZone= document.querySelector('.drop-zone');
const fileInput=document.querySelector('.inputFile');
const browseBtn=document.querySelector('.browseBtn');
const bgProgress=document.querySelector('.bg-progress');
const percentDiv=document.querySelector('#percent')
const progressBar=document.querySelector('.progress-bar')
const progressContainer=document.querySelector('.progress-container')
const xhr=new XMLHttpRequest();

// const host= "http://127.0.0.1:4000";
// const uploadUrl= `${host}/api/files`
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
        progressContainer.style.display='none'
 }