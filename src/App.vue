<template>
    <!--dom结构部分-->
    <div id="nr-os-webuploader" class="webuploader-image-box">
        <!--用来存放item-->
        <ul id="fileList" class="uploader-list">
            <!-- <img v-if='addImage' src="" alt="添加图片"/> -->
            <div id="webuploader-filePicker">
                <span class="iconfont icon-_Ttianjiabiaoge" title="添加图片" :style='plusStyle'></span>
            </div>
        </ul>
        <div class="webuploader-image-box-status-bar">
            <div id='webuploader-filePicker2'></div>
        </div>
    </div>
</template>

<script>
import webuploaderMixins from './webuploadermixins'
export default {
    mixins: [ webuploaderMixins ],
    props: {
        uploaderConfig:{
            type: Object,
            default: function(){
                return {
                    // 选完文件后，是否自动上传。
                    auto: true,

                    // swf文件路径
                    swf:  + '/assets/Uploader.swf',

                    // 文件接收服务端。
                    server: 'http://webuploader.duapp.com/server/fileupload.php',

                    // 选择文件的按钮。可选。
                    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                    pick: '#webuploader-filePicker',

                    // 只允许选择图片文件。
                    accept: {
                        title: 'Images',
                        extensions: 'gif,jpg,jpeg,bmp,png',
                        mimeTypes: 'image/*'
                    },
                    // 是否允许重复（文档解释为去重，不准确）
                    duplicate: true, 
                    // 是否要分片处理大文件上传
                    chunked: true,
                    // 如果要分片，分多大一片？ 默认大小为1M
                    chunkSize: 1048576,
                    // 如果某个分片由于网络问题出错，允许自动重传多少次？
                    chunkRetry: 2,
                    // 文件上传请求的参数表，每次发送都会发送此对象中的参数
                    formData: {},
                    // 是否已二进制的流的方式发送文件
                    sendAsBinary: false,
                    // 验证文件总大小是否超出限制, 超出则不允许加入队列
                    // fileSizeLimit: true,
                    // 验证单个文件大小是否超出限制, 超出则不允许加入队列
                    fileSingleSizeLimit: 1048576, 
                }
            }
        },
        customStyle: {
            type: Object,
            default: function() {
                return {
                    plusFontSize: 60
                }
            }
        },
        addImage: {
            default: ''
        },
        fileSingleSizeLimit: {
            type: [Number, undefined],
            default: undefined
        },
        thumb: {
            type: Object,
            default: function() {
                return {
                    width: 1600,
                    height: 1600,
                    // 图片质量，只有type为`image/jpeg`的时候才有效。
                    quality: 90,
                    // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                    allowMagnify: false,
                    // 是否允许裁剪。
                    crop: false,
                    // 是否保留头部meta信息。
                    preserveHeaders: true,
                    // 如果发现压缩后文件大小比原来还大，则使用原来图片
                    // 此属性可能会影响图片自动纠正功能
                    noCompressIfLarger: false,
                    // 单位字节，如果图片大小小于此值，不会采用压缩。
                    compressSize: 0
                }
            }
        },
    },
    data() {
        return {
            // uploader: null,
        }
    },
    computed:{
        plusStyle(){
            return {
                fontSize: this.customStyle.plusFontSize + 'px'
            }
        }
    },
    mounted() {
    const list = $('#fileList')
    const uploaderParent = $('#nr-os-webuploader')
    const uploadBtn = uploaderParent.find('#webuploader-uploadBtn')
    const btn2div = uploaderParent.find('.webuploader-image-box-status-bar')
    // 初始化Web Uploader
    var uploader = WebUploader.create(this.uploaderConfig)

    //抛出错误信息
    uploader.on('error', (type) => {
        let errorTxt = ''
        if (type === 'Q_TYPE_DENIED') {
            errorTxt = '请检查上传文件类型'
        } else if (this.uploaderConfig.fileSingleSizeLimit && type === 'Q_EXCEED_SIZE_LIMIT') {
            errorTxt = `上传文件总大小超过限制:${this.uploaderConfig.fileSingleSizeLimit/1024}KB`
        }
        this.$emit('on-error', errorTxt)
    })
    // 当有文件添加进来的时候
    uploader.on( 'fileQueued', file => {
        var $li = $(
                '<div id="' + file.id + '" class="file-item thumbnail">' +
                    '<img>' +
                    '<div class="info">' + file.name + '</div>' +
                '</div>'
                ),
            $img = $li.find('img');


        //先清空再添加
        list.empty()
        list.append( $li );

        if(btn2div.css('zIndex') !== 999){
            this.setBtn2Css(btn2div, uploaderParent)
        }
        // 创建缩略图
        // 如果为非图片文件，可以不用调用此方法。
        // thumbnailWidth x thumbnailHeight 为 100 x 100
        uploader.makeThumb( file, function( error, src ) {
            if ( error ) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }

            $img.attr( 'src', src );
        }, this.thumb.width, this.thumb.height );
    });

    // 添加“添加文件”的按钮，
    uploader.addButton({
        id: `#webuploader-filePicker2`,
        innerHTML: '重新选择'
    });

    // 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {
        var $li = $( '#'+file.id ),
            $percent = $li.find('.progress span');

        // 避免重复创建
        if ( !$percent.length ) {
            $percent = $('<p class="progress"><span></span></p>')
                    .appendTo( $li )
                    .find('span');
        }

        $percent.css( 'width', percentage * 100 + '%' );
    });

    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on( 'uploadSuccess', file => {
        $( '#'+file.id ).addClass('upload-state-done');
        this.$emit('on-upload-success')
    });

    // 文件上传失败，显示上传出错。
    uploader.on( 'uploadError', function( file ) {
        var $li = $( '#'+file.id ),
            $error = $li.find('div.error');

        // 避免重复创建
        if ( !$error.length ) {
            $error = $('<div class="error"></div>').appendTo( $li );
        }

        $error.text('上传失败');
        this.$emit('on-upload-error')
    });

    // 完成上传完了，成功或者失败，先删除进度条。
    uploader.on( 'uploadComplete', function( file ) {
        $( '#'+file.id ).find('.progress').remove();
    });
    }
}
</script>

<style>
</style>

