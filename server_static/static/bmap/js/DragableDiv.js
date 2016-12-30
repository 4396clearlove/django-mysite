$(document).ready(function() {
	//设置标题栏
	//document.title = "0.0 WINDOW";
	//窗口的拖动
	var bool = false;
	var offsetX = 0;
	var offsetY = 0;
	$("#main").mousedown(function() {
			bool = true;
			offsetX = event.offsetX;
			offsetY = event.offsetY;
			$("#ten").css('cursor', 'move');
		})
		.mouseup(function() {
			bool = false;
		})
	$(document).mousemove(function(e) {
			if (!bool)
				return;
			var x = event.clientX - offsetX;
			var y = event.clientY - offsetY;
			$("#main").css("left", x);
			$("#main").css("top", y);
		})
		//窗口的关闭
	$("#img").click(function() {
		$("#main").removeClass("show");
		$("#main").addClass("none");
		$("#open").addClass("show");
	});
	$("#open").click(function() {
		$("#main").removeClass("none");
		$("#main").addClass("show");
		$("#open").removeClass("show");
		$("#open").addClass("none");
	});
});

$(".infoOverlay").mousedown(function() {
			bool = true;
			offsetX = event.offsetX;
			offsetY = event.offsetY;
			$("#ten").css('cursor', 'move');
		})
		.mouseup(function() {
			bool = false;
		})