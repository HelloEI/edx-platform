define(
    ['jquery', 'underscore', 'backbone', 'js/views/baseview', 'js/views/previous_video_upload'],
    function($, _, Backbone, BaseView, PreviousVideoUploadView) {
        'use strict';
        var PreviousVideoUploadListView = BaseView.extend({
            tagName: 'section',
            className: 'wrapper-assets',

            initialize: function(options) {
                this.template = this.loadTemplate('previous-video-upload-list');
                this.encodingsDownloadUrl = options.encodingsDownloadUrl;
                this.itemViews = this.collection.map(function(model) {
                    return new PreviousVideoUploadView({
                        videoHandlerUrl: options.videoHandlerUrl,
                        model: model
                    });
                });
                // this.listenTo(this.collection, 'change', this.render);
            },

            render: function() {
                var $el = this.$el,
                    $tabBody;
                $el.html(this.template({encodingsDownloadUrl: this.encodingsDownloadUrl}));
                $tabBody = $el.find('.js-table-body');
                _.each(this.itemViews, function(view) {
                    $tabBody.append(view.render().$el);
                });
                return this;
            }
        });

        return PreviousVideoUploadListView;
    }
);
