/**
 * Dialog (PopUp) for CKencryptionPlugin
 * When the user presses the lock icon in the CKeditor toolbar this dialog pops up. Here he can
 * enable or disable encryption for an editor instance.
 */
CKEDITOR.dialog.add('encryptionDialog', function(editor) {
    
    //----- return a definition for the dialog UI
    return {
        title:          'Encryption',
        resizable:      CKEDITOR.DIALOG_RESIZE_BOTH,
        minWidth:       400,
        minHeight:      200,
        contents: [
            {
                id:         'info',
                label:      'Encryption Lable',
                title:      'Encryption Title',
                //accessKey:  'Q',
                elements: [
                    {
                        type      : 'checkbox',
                        id        : 'enableEncryption',
                        label     : 'Enable encryption for this section.',
                        'default' : 'checked'
                        
                        /* could be used to set initial value
                        setup: function( data ) {
                            console.log("encryptionDialog checkbox.setup("+data+")");
                            // this = CKEDITOR.ui.dialog.checkbox
                            this.setValue(editor.config.enableEncryption);
                        }
                        */
                    }
                ]
            }
        ],
    
        onShow: function() {
            console.log("encryptionDialog.onShow()");
            this.setValueOf('info', 'enableEncryption', true);
        },
        
        onOk : function() {
            var dialog = this;
            var enableEncryption = dialog.getValueOf('info', 'enableEncryption');
            editor.element.setAttribute("cke-data-encrypted", enableEncryption);
            console.log("encryptionDialog.onOK() enableEncryption = "+enableEncryption);
        }
    };
}); 