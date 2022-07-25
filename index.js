const dropZone= document.querySelector('.drop-zone');
const fileInput=document.querySelector('.inputFile');
const browseBtn=document.querySelector('.browseBtn');
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

    const file=fileInput.files[0];
    // xhr.setRequestHeader( "Content-Type","multipart/form-data")
    xhr.onreadystatechange=()=>{
        if(xhr.readyState===XMLHttpRequest.DONE){
            console.log(xhr.response)
        }
    }
    const formData=new FormData();
    formData.append('myfile',file);
    xhr.open("POST",url,true)
    xhr.upload.onprogress=updateProgress
    xhr.send(formData)
}
const updateProgress=(e)=>{
    const percent= Math.round((e.loaded/e.total)*100)
    console.log(percent)
}