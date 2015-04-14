var fns=function(s){
console.log(s)
}
undefined
cc.getVideoCompress().then(fns,fns)

var fe=null;
var fns=function(s){
console.log(s)
fe=s;
}

services.getVideoService.getVideoCompress().then(fns,fns)
fe.file(function(file) {
		var s = "";
		s += "<b>name:</b> " + file.name + "<br/>";
		s += "<b>localURL:</b> " + file.localURL + "<br/>";
		s += "<b>type:</b> " + file.type + "<br/>";
		s += "<b>lastModifiedDate:</b> " + (new Date(file.lastModifiedDate)) + "<br/>";
		s += "<b>size:</b> " + file.size + "<br/>";
		
		
		console.dir(file, s);
	});
services.copyFileService.copyFile("file:///storage/emulated/0/VideoDieter/1427894558.mp4").then(fns,fns)
services.fileTransferService.fileUpload("file:///data/data/com.ajustev.b/files/new_1427894558.mp4").then(fns,fns,fns)

ngCordova.cordovaFile.checkFile(cordova.file.dataDirectory,'new_1427894558.mp4').then(fns,fns)

services.checkFileService.checkFile('content://media/external/video/media/1691').then(fns,fns)

///////////////////////////////////////////

INSERT INTO [idpropiedades] ([idinspeccion] ,[idsubproceso] ,[iditem],[idparentitem]  ,[nombre] ,[idopcion]  ,[seleccion]    
          ) VALUES (?,?,?,?,?,?,?)
           [[$scope.idinspeccion, 829, iditem, idParentItem,nombre,sl.value, sl.text],[]]




           /// tengo que añadir al sync en el zumeor manager las nuevas columnas que necesito, y no hay problema alguno, sync ok desde el dispositico, eso si se hacerla recomendacion de validar querys



           /// por FAVOR USAR NVARCHAR Y NO NCHAR en idvideos, ahi es mejor unprepare , y luego volver a preparar, es mas delicado que cambiar un nombre de columna o agregar una nueva.. y ahi si obtengo un sqlite error