var finalZip = new JSZip();

$(document).ready(function(){
    document.querySelector('input').addEventListener('change', function() {
        var fileInput = document.getElementById('fileInput');
        var file = fileInput.files[0];
        var reader = new FileReader();
        alert("Ready to start uploading?")
        
        reader.onload = function(e) {
          var arrayBuffer = reader.result;
            var remove_path = "model";
            var path = "";
                JSZip.loadAsync(arrayBuffer).then(function (data) {
                    var file_count = 0;

                    //Code snippet from @jkcgs :3
                    Object.keys(data.files).forEach(function(key){
                        var file = data.files[key];
                        var file_name = file.name;
                        if(remove_path != ""){var file_name = (file_name).replace(remove_path + "/","");};
                        if (file.dir) {
                            file_count++;
                            return;
                        }

                        file.async("arraybuffer").then(function(content) {
                            file_count++;
                            addFile(content, path, file_name, "buffer");

                            if(file_count == Object.keys(data.files).length){
                                alert("Finished");
                                downloadZip();
                                
                            }

                        });
                    });               
                })
        }
        reader.readAsArrayBuffer(file);

    }, false);
})



function addFile(name,path,filename,origin){
    //origin either "list" or "buffer"
    var buffer;
    switch(origin){
        case "list":
            buffer = bufferList[name];
            break;
        case "buffer":
            buffer = name;
            break;
    }
    
    if(buffer == undefined){
        setTimeout(function(){ addFile(name,path,filename,origin);},500);
    }else{                
        if(path == ""){
            finalZip.file(filename,buffer);
        }else{
            finalZip.folder(path).file(filename,buffer);
        }
        
        if(origin == "list"){
            //progress_finish(name, name + ": Added to zip file");
        }
    }
}


function downloadZip(){
        finalZip.generateAsync({type:"blob"})
        .then(function (blob) {            
            saveAs(blob, "unpacked.zip");
        });
}
