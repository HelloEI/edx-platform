class @NewPostInlineView extends Backbone.View

  initialize: () ->

    @topicId    = @$(".topic").first().data("discussion_id")

    @maxNameWidth = 100

    DiscussionUtil.makeWmdEditor @$el, $.proxy(@$, @), "new-post-body"
    @$(".new-post-tags").tagsInput DiscussionUtil.tagsInputOptions()

  events:
    "submit .new-post-form":            "createPost"

  # Because we want the behavior that when the body is clicked the menu is
  # closed, we need to ignore clicks in the search field and stop propagation.
  # Without this, clicking the search field would also close the menu.
  ignoreClick: (event) ->
    event.stopPropagation()

  createPost: (event) ->
    event.preventDefault()
    title   = @$(".new-post-title").val()
    body    = @$(".new-post-body").find(".wmd-input").val()
    tags    = @$(".new-post-tags").val()

    anonymous = false || @$("input.discussion-anonymous").is(":checked")
    follow    = false || @$("input.discussion-follow").is(":checked")

    url = DiscussionUtil.urlFor('create_thread', @topicId)

    DiscussionUtil.safeAjax
      $elem: $(event.target)
      $loading: $(event.target) if event
      url: url
      type: "POST"
      dataType: 'json'
      async: false # TODO when the rest of the stuff below is made to work properly..
      data:
        title: title
        body: body
        tags: tags
        anonymous: anonymous
        auto_subscribe: follow
      error: DiscussionUtil.formErrorHandler(@$(".new-post-form-errors"))
      success: (response, textStatus) =>
        # TODO: Move this out of the callback, this makes it feel sluggish
        thread = new Thread response['content']
        DiscussionUtil.clearFormErrors(@$(".new-post-form-errors"))
        @$el.hide()
        @$(".new-post-title").val("").attr("prev-text", "")
        @$(".new-post-body").val("").attr("prev-text", "")
        @$(".new-post-tags").val("")
        @$(".new-post-tags").importTags("")
        @collection.add thread
