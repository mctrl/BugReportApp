$('.viewIssueBtn').on('click', function() {
    console.log("view btn clicked");
    var projectId = $(this).data('project');
    var issueId = $(this).data('issue');
    $.get("/projects/"+projectId+"/issues/"+issueId, function(data) {
    	console.log(data)
    	var $modal = $('#showIssue')
    	$modal.modal('show');
    	$modal.find('#summary').text(data.summary);
    	$modal.find('#os').text(data.os);
    	$modal.find('#device').text(data.device);
    	$modal.find('#browser').text(data.browser);
    	$modal.find('#steps').text(data.steps);
    });
})