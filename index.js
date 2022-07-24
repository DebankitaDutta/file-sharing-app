const dropZone= document.querySelector('.drop-zone');
const fileInput=document.querySelector('.inputFile');
const browseBtn=document.querySelector('.browseBtn');
const xhr=new XMLHttpRequest();

// const host= "http://127.0.0.1:4000";
// const uploadUrl= `${host}/api/files`
// const uploadUrl=`https://jsonplaceholder.typicode.com/users`
const url="http://localhost:4000/api/files"
dropZone.addEventListener('dragover',(e)=>{
    e.preventDefault()
    if(!dropZone.classList.contains('dragged')){
        dropZone.classList.add('dragged')
    }
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
    uploadFile()
})

browseBtn.addEventListener('click',()=>{
    fileInput.click()
})

// const uploadFile=()=>{

//     const file=fileInput.files[0];
//     const formData=new FormData();
//     formData.append('myfile',file);
    
//     xhr.onreadystatechange=()=>{
//         if(xhr.readyState===XMLHttpRequest.DONE){
//             console.log(xhr.response)
//         }
//     }
//     xhr.open("POST",url)
//     xhr.setRequestHeader("Content-Type", "multipart/form-data")
//     for (const value of formData.values()) {
//         console.log('*****',value);
//     }
//     xhr.send(formData)

// }
const uploadFile=()=>{

    // body={
    //     name:'Deb',
    //     role:'backend dev',
    //     salary:'50 rs'
    // }

    const file=fileInput.files[0];
    
    console.log(file)
    // axios.post(url,formData,{
        //     Headers:{
            //         "Content-Type": "multipart/form-data"
            //     }
            // }).then(res=>{
                //     console.log('***************res = ',res)
                // }).catch(err=>{
                    //     console.log(err)
                    // })
                    xhr.open("POST",url,true)
                    xhr.setRequestHeader( "Content-Type","multipart/form-data")
                    xhr.onreadystatechange=()=>{
                        if(xhr.readyState===XMLHttpRequest.DONE){
                            console.log(xhr.response)
                        }
                    }
                    const formData=new FormData();
                    formData.append('file',file);
                    xhr.send(formData)
                    // xhr.setRequestHeader("Content-Type", "application/json")

}