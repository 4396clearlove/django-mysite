function CropAvatar($element) {
    this.$bmapPopImg;
    this.$container = $element;

    this.$avatarView = this.$container.find('.avatar-view');
    this.$avatar = this.$avatarView.find('img');
    this.$avatarModal = this.$container.find('#avatar-modal');
    this.$loading = this.$container.find('.loading');

    this.$avatarForm = this.$avatarModal.find('.avatar-form');
    this.$avatarUpload = this.$avatarForm.find('.avatar-upload');
    this.$avatarSrc = this.$avatarForm.find('.avatar-src');
    this.$avatarData = this.$avatarForm.find('.avatar-data');
    this.$avatarInput = this.$avatarForm.find('.avatar-input');
    this.$avatarSave = this.$avatarForm.find('.avatar-save');
    this.$avatarBtns = this.$avatarForm.find('.avatar-btns');

    this.$avatarWrapper = this.$avatarModal.find('.avatar-wrapper');
    this.$avatarPreview = this.$avatarModal.find('.avatar-preview');
    this.$uploadBtn = this.$container.find('#uploadBtn');

    this.init();
}

CropAvatar.prototype = {
    constructor: CropAvatar,

    support: {
        fileList: !!$('<input type="file">').prop('files'),
        blobURLs: !!window.URL && URL.createObjectURL,
        formData: !!window.FormData
    },

    init: function() {
        this.support.datauri = this.support.fileList && this.support.blobURLs;

        if (!this.support.formData) {
            this.initIframe();
        }

        this.initTooltip();
        this.initModal();
        this.addListener();
        this.initInput();
    },

    addListener: function() {
        this.$avatarView.on('click', $.proxy(this.click, this));
        this.$avatarInput.on('change', $.proxy(this.change, this));
        this.$avatarForm.on('submit', $.proxy(this.submit, this));  //提交事件
        this.$avatarBtns.on('click', $.proxy(this.rotate, this));
        this.$uploadBtn.on('click', $.proxy(this.submit, this));
    },

    initInput: function() {
        this.$avatarInput[0].value = '';    //每次打开裁剪框，把文本上传框置空
    },

    initTooltip: function() {
        this.$avatarView.tooltip({
            placement: 'bottom'
        });
    },

    initModal: function() {
        this.$avatarModal.modal('hide');
    },

    initPreview: function() {
        var url = this.$avatar.attr('src');

        this.$avatarPreview.html('<img src="' + url + '">');
    },

    initIframe: function() {
        var target = 'upload-iframe-' + (new Date()).getTime();
        var $iframe = $('<iframe>').attr({
            name: target,
            src: ''
        });
        var _this = this;

        // Ready ifrmae
        $iframe.one('load', function() {

            // respond response
            $iframe.on('load', function() {
                var data;

                try {
                    data = $(this).contents().find('body').text();
                } catch (e) {
                    console.log(e.message);
                }

                if (data) {
                    try {
                        data = $.parseJSON(data);
                    } catch (e) {
                        console.log(e.message);
                    }

                    _this.submitDone(data);
                } else {
                    _this.submitFail('Image upload failed!');
                }

                _this.submitEnd();

            });
        });

        this.$iframe = $iframe;
        this.$avatarForm.attr('target', target).after($iframe.hide());
    },

    click: function() {
        this.$avatarModal.modal('show');
        this.initPreview();
    },

    change: function() {    //点击选择图片后触发的事件1
        var files;
        var file;

        if (this.support.datauri) {
            files = this.$avatarInput.prop('files');

            if (files.length > 0) {
                file = files[0];

                if (this.isImageFile(file)) {
                    if (this.url) {
                        URL.revokeObjectURL(this.url); // Revoke the old one
                    }

                    this.url = URL.createObjectURL(file);
                    this.startCropper();    //点击选择图片后触发的事件2
                }
            }
        } else {
            file = this.$avatarInput.val();

            if (this.isImageFile(file)) {
                this.syncUpload();
            }
        }   
    },

    submit: function() {
        // if (!this.$avatarSrc.val() && !this.$avatarInput.val()) {
        //     return false;
        // }

        // if (this.support.formData) {
        //     this.ajaxUpload();
        //     return false;
        // }
        var getCanvas = $(".avatar-wrapper>img").cropper('getCroppedCanvas', {width:323});   //这里的data是一个canvas标签对象
        var imageURI = getCanvas.toDataURL("image/png",1.0);  //这里转成base64 image，img的src可直接使用
        //$(".pano_thumnail_img").attr('src', imageURI);
        this.$bmapPopImg.setAttribute('src', imageURI);
        

        var base64 = imageURI.split(',')[1];
        var binary = window.atob(base64);
        var ia = new Uint8Array(binary.length);
        for (var i=0; i<binary.length; i++) {
            ia[i] = binary.charCodeAt(i);
        };
        var blob = new Blob([ia], {type:"image/png"});

        var fd = new FormData();
        fd.append('file', blob);
        $.ajax({
            url:'/bmap/optical_cable/upload/',
            type:'POST',
            data:fd,
            processData:false,  //必须告诉jQuery不要去处理发送的数据
            contentType:false,  //告诉jQuery不要去设置Content-Type头
            success:function(){
                alert('success');
            }
        });

        this.initModal()    //点击上传后隐藏bootstrap的Modal框


        return false;   //一定得false才不会刷新页面
    },

    rotate: function(e) {
        var data;

        if (this.active) {
            data = $(e.target).data();

            if (data.method) {
                this.$img.cropper(data.method, data.option);
            }
        }
    },

    isImageFile: function(file) {
        if (file.type) {
            return /^image\/\w+$/.test(file.type);
        } else {
            return /\.(jpg|jpeg|png|gif)$/.test(file);
        }
    },

    startCropper: function() {  //点击选择图片后触发的事件2
        var _this = this;

        if (this.active) {
            this.$img.cropper('replace', this.url);
        } else {
            this.$img = $('<img src="' + this.url + '">');
            this.$avatarWrapper.empty().html(this.$img);
            this.$img.cropper({
                aspectRatio: 323/101, //选择框的比例
                preview: this.$avatarPreview.selector,  //右边的预览框,selector表示返回jquery的选择路径
                crop: function(e) {
                    var json = [
                        '{"x":' + e.x,
                        '"y":' + e.y,
                        '"height":' + e.height,
                        '"width":' + e.width,
                        '"rotate":' + e.rotate + '}'
                    ].join();

                    _this.$avatarData.val(json);
                }
            });

            this.active = true;
        }

        this.$avatarModal.one('hidden.bs.modal', function() {
            _this.$avatarPreview.empty();
            _this.stopCropper();
        });
    },

    stopCropper: function() {
        if (this.active) {
            this.$img.cropper('destroy');
            this.$img.remove();
            this.active = false;
        }
    },

    ajaxUpload: function() {
        var url = this.$avatarForm.attr('action');
        var data = new FormData(this.$avatarForm[0]);
        var _this = this;

        $.ajax(url, {
            type: 'post',
            data: data,
            dataType: 'json',
            processData: false,
            contentType: false,

            beforeSend: function() {
                _this.submitStart();
            },

            success: function(data) {
                _this.submitDone(data);
            },

            error: function(XMLHttpRequest, textStatus, errorThrown) {
                _this.submitFail(textStatus || errorThrown);
            },

            complete: function() {
                _this.submitEnd();
            }
        });
    },

    syncUpload: function() {
        this.$avatarSave.click();
    },

    submitStart: function() {
        this.$loading.fadeIn();
    },

    submitDone: function(data) {
        console.log(data);

        if ($.isPlainObject(data) && data.state === 200) {
            if (data.result) {
                this.url = data.result;

                if (this.support.datauri || this.uploaded) {
                    this.uploaded = false;
                    this.cropDone();
                } else {
                    this.uploaded = true;
                    this.$avatarSrc.val(this.url);
                    this.startCropper();
                }

                this.$avatarInput.val('');
            } else if (data.message) {
                this.alert(data.message);
            }
        } else {
            this.alert('Failed to response');
        }
    },

    submitFail: function(msg) {
        this.alert(msg);
    },

    submitEnd: function() {
        this.$loading.fadeOut();
    },

    cropDone: function() {
        this.$avatarForm.get(0).reset();
        this.$avatar.attr('src', this.url);
        this.stopCropper();
        this.$avatarModal.modal('hide');
    },

    alert: function(msg) {
        var $alert = [
            '<div class="alert alert-danger avatar-alert alert-dismissable">',
            '<button type="button" class="close" data-dismiss="alert">&times;</button>',
            msg,
            '</div>'
        ].join('');

        this.$avatarUpload.after($alert);
    }
};

var CropObj = new CropAvatar($('#crop-avatar'));  //触发CropAvatar的init()，注册事件。