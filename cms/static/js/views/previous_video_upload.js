define(
    ['underscore', 'gettext', 'js/utils/date_utils', 'js/views/baseview', 'common/js/components/views/feedback_prompt',
     'common/js/components/views/feedback_notification'],
    function(_, gettext, DateUtils, BaseView, PromptView, NotificationView) {
        'use strict';

        var PreviousVideoUploadView = BaseView.extend({
            tagName: 'tr',

            events: {
                'click .remove-video-button.action-button': 'removeVideo'
            },

            initialize: function(options) {
                this.template = this.loadTemplate('previous-video-upload');
                this.videoHandlerUrl = options.videoHandlerUrl;
            },

            renderDuration: function(seconds) {
                var minutes = Math.floor(seconds / 60);
                var seconds = Math.floor(seconds - minutes * 60);

                return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
            },

            render: function() {
                var duration = this.model.get('duration');
                var renderedAttributes = {
                    // Translators: This is listed as the duration for a video
                    // that has not yet reached the point in its processing by
                    // the servers where its duration is determined.
                    duration: duration > 0 ? this.renderDuration(duration) : gettext('Pending'),
                    created: DateUtils.renderDate(this.model.get('created')),
                    status: this.model.get('status')
                };
                this.$el.html(
                    this.template(_.extend({}, this.model.attributes, renderedAttributes))
                );
                return this;
            },

            removeVideo: function(e) {
                // debugger;
                var video = this.model,
                    // removing,
                    videoView = this;
                if (e && e.preventDefault) { e.preventDefault(); }
                new PromptView.Warning({
                    title: gettext('Delete Video Confirmation'),
                    message: gettext('Are you sure you wish to delete this video. It cannot be reversed! Also any content that links/refers to this video will no longer work.'),
                    actions: {
                        primary: {
                            text: gettext('Delete'),
                            click: function(view) {
                                view.hide();
                                $.ajax({
                                    url: videoView.videoHandlerUrl + '/' + video.get('edx_video_id'),
                                    type: 'DELETE',
                                    // beforeSend: function() {
                                    //     removing = new NotificationView.Mini({
                                    //         title: gettext('Removing')
                                    //     }).show();
                                    // }
                                }).done(function() {
                                    videoView.remove();
                                    // removing.hide();
                                    new NotificationView.Confirmation({
                                        title: gettext('Your video has been removed.'),
                                        closeIcon: false,
                                        maxShown: 2000
                                    }).show();
                                });
                            }
                        },
                        secondary: {
                            text: gettext('Cancel'),
                            click: function(view) {
                                view.hide();
                            }
                        }
                    }
                }).show();
            }
        });

        return PreviousVideoUploadView;
    }
);
