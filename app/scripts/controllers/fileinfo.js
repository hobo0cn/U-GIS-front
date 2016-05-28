'use strict';

/**
 * @ngdoc function
 * @name uGisFrontApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the uGisFrontApp
 */
angular.module('uGisFrontApp')

  .controller('FileInfoCtrl', ['$scope', '$window', function ($scope, $window ) {

    if (!($window.FileReader)) {
      document.write('<strong>Sorry, your web browser does not support the FileReader API.</strong>');
      return;
    }
    var exifinfo = new Array();
    var filenum = 0;

    var isFinishLoadFiles = function(Files){
       if(Files.length == filenum)
       {
          console.log('exinfo:' + JSON.stringify(exifinfo));
          //TODO invoke anaylsis images API
       }
    };

   var handleFile = function (event) {
    var files, reader;

    files = event.target.files;
    //$scope.files = files;
    // We only need the start of the file for the Exif info.
    //reader.readAsArrayBuffer(files[0].slice(0, 128 * 1024));
    

    for (var i = files.length - 1; i >= 0; i--) {
      reader = new FileReader();
      reader.onload = function (event) {
        var exif, tags, tableBody, name, row;

        try {
          exif = new ExifReader();

          // Parse the Exif tags.
          exif.load(event.target.result);
          // Or, with jDataView you would use this:
          //exif.loadView(new jDataView(event.target.result));

          // The MakerNote tag can be really large. Remove it to lower memory usage.
          exif.deleteTag('MakerNote');

          // Output the tags on the page.
          tags = exif.getAllTags();
          exifinfo.push(tags);
          filenum++;
          isFinishLoadFiles(files);
          //console.log('tags:' + JSON.stringify(tags));
          // tableBody = document.getElementById('exif-table-body');
          // for (name in tags) {
          //   if (tags.hasOwnProperty(name)) {
          //     row = document.createElement('tr');
          //     row.innerHTML = '<td>' + name + '</td><td>' + tags[name].description + '</td>';
          //     tableBody.appendChild(row);
          //   }
          // }
        } catch (error) {
          alert(error);
        }
    
      };
      reader.readAsArrayBuffer(files[i].slice(0, 128 * 1024));
    };
  };
    
       
  

  $window.addEventListener('load', function () {
    document.getElementById('file').addEventListener('change', handleFile, false);
    
  }, false);


    
  }]);
