/**
 * CKEditor encryption plugin
 * @author  encryption@doogie.de
 * @date    May 2014
 * 
 * This file must be named "plugin.js"
 */

//console.log('adding CKencryptionPlugin');

CKEDITOR.plugins.add( 'CKencryptionPlugin', {  // name of plugin must be the same as the folder!
    icons: 'encryption',
    init: function( editor ) {
        
        console.log("CKencryptionPlugin.init()");
        
        editor.addCommand( 'encryption', new CKEDITOR.dialogCommand( 'encryptionDialog' ) );
        
       /*
        editor.addCommand( 'encryption', {
            exec: function( editor ) {
                alert( 'encryptionCmd.exec() "' + editor.name + '"!' );
            }
        });
        */
       
        editor.ui.addButton( 'encryption', {
            label: 'Encryption',
            command: 'encryption',
            toolbar: 'insert'
        });
        
        CKEDITOR.dialog.add( 'encryptionDialog', this.path + 'dialogs/encryptionDialog.js' );
        
        // ----- CKEditor events      
        
        /**
         * when anyone wants to getData() from CKEditor, then encrypt the
         * editors content and return the encrypted string only.
         */
        editor.on('getData', function( evt ) {
            console.log('getData enter');
            if (evt == null || evt.data == null || evt.data.dataValue == null) return;
            var plainText = evt.data.dataValue;
            var encrypted = CryptoJS.AES.encrypt(plainText, "Secret Passphrase");
            evt.data.dataValue = encrypted;
            console.log("getData encrypted=\n#############\n"+encrypted+"\n###############");
        });
        
        editor.on('setData', function( evt ) { 
            console.log('setData enter');
            if (evt == null || evt.data == null || evt.data.dataValue == null) return;
            var encrypted = evt.data.dataValue;
            var plainText = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase");
            
            plainText = "This is my plaintext";  //TODO: for debugging only
            
            evt.data.dataValue = plainText;
            console.log("setData plainText=\n#############\n"+plainText+"\n###############");
        });
        
       
        editor.on('getSnapshot', function( evt ) {
           //console.log('getSnapshot: '+evt); 
        });
        
        editor.on('toHTML', function( evt ) {
           console.log('toHTML: '+evt.data.dataValue); 
        });
        
        
    }
    
      //another alternative would be: editor.dataProcessor = new encryptingDataProcesser();
});
