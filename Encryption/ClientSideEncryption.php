<?php

defined('is_running') or die('Not an entry point...');


/**
 * gpEasy.com plugin for strong client side encryption
 */
class ClientSideEncryption{

    //unique key for an "encrypted section" (used e.g. as $section_data['type'])
    const contentKey = "EncryptedSection";

    /**
     * [SectionTypes] hook: add new type for "encrypted section"
     */
    function SectionTypes($section_types){
        $section_types[self::contentKey] = array();
        $section_types[self::contentKey]['label'] = 'Encrypted Section';
        return $section_types;
    }

    /**
     * Explanatory default content shown to the end user.
     */
    function GetDefaultContent($default_content,$type){
        if( $type == self::contentKey ){
            return 'Everything you write into this section will be encrypted.';
        }
        return $default_content;
    }

    /**
     * [SectionToContent] hook: render encrypted section
     * 
     * We do the same as SectionContent::SectionToContent does for a text section.
     */
    function SectionToContent($section_data){
        global $dataDir;
        //msg('SectionToContent type='.$section_data['type']);
        if( $section_data['type'] != self::contentKey ){
            return $section_data;
        }
        
        $section_data['content'] = section_content::TextContent($section_data['content']);
        
        msg("Encrypted Section Content=<pre>".$section_data['content'].'</pre>');
        return $section_data;
    }

    /**
     * [SaveSection] hook: Save the content of an encrypted section.
     * 
     * The $content was already encrypted in the client's browser!
     * Here we only add a field to the file_sections[] array
     */
    function SaveSection($return,$section,$type){
        global $page;
        //msg('SaveSection type='.$section_data['type']);
        if( $type == self::contentKey ){
            $content =& $_POST['gpcontent'];
            $page->file_sections[$section]['encryptedSection'] = "true";  // this line is the whole reason for this class. gpEasy we need to talk about your architecture! :-(
            $page->file_sections[$section]['content'] = $content;
            msg('SaveSection '.$section.': <pre>'.$page->file_sections[$section]['content'].'</pre>');
            return true;
        }
        return $return;
    }

    /**
     * load the same scripts for inline editing as for normal text sections.
     */
    function InlineEdit_Scripts($scripts,$type){
        global $addonRelativeCode;
        if( $type != self::contentKey ){
            return $scripts;
        }
        // same as in ajax.php    static function InlineEdit($section_data){ ...
        $scripts = gpAjax::InlineEdit_Text($scripts);
        return $scripts;
    }




    //TODO: only do this when editing via [InlineEdit_Scripts]
    /**
     * load javascript AES library in header
     */
    function loadAESLibrary(){
        global $page, $addonRelativeCode;
        $page->head_js[] = $addonRelativeCode.'/aes.js';
        msg('AES JS lib loaded.');
    }
    

    
    /**
     * Add CKeditor plugin for encryption and decryption
     */
    function CKEditorPlugins($plugins){
        //global $addonRelativeCode;
        //msg('hook: CKEditorioPlugins');
        // //trigger_error('ckeditor plugins');
        //$plugins['CKencryptionPlugin'] = $addonRelativeCode.'/CKencryptionPlugin/';
        return $plugins;
    }





    /*
     * This way you could also extend CKeditor's configuration. But not needed here.
    function CKEditorConfig($options){
        $options['toolbar'][] = array('Encrypt', 'Decrypt');
        msg('CKEditorConfig');
        return $options;
    }
    */    
}
