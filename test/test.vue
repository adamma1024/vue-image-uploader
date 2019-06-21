<template>
  <div style="width:70px;height:70px">
    <img-select :custom-style='customStyle' :thumb="thumb" :uploader-config='uploaderConfig'></img-select>
  </div>
</template>

<script>
import imgSelect from '../src'
export default {
  data(){
    return {
      uploaderConfig: {
        // 选完文件后，是否自动上传。
        auto: true,

        // swf文件路径
        swf:  + '/assets/Uploader.swf',

        // 文件接收服务端。
        server: 'http://www.baidu.com',

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
      },
      customStyle: {
        plusFontSize: 85
      },
      thumb: {
        width: 70,
        height: 70,
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
  components: { imgSelect }
}
</script>

