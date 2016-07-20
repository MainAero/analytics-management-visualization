angular.module('AnalyticsManagementVisualizationApp')

.controller("viewListCtrl", function ($scope, viewService, $rootScope) {

	// sidebar code
	$rootScope.isSidebarSmall ? angular.element("#page-wrapper").css('marginLeft', '40px') : angular.element("#page-wrapper").css('marginLeft', '250px');

	/*
		$scope.viewTreeData = [{
			label: "test",
			children: ["none"],
			classes: ["class"]
		}];
	*/

	$scope.viewTreeData = []; // init

	// once views are loaded create treeview
	$scope.views.$promise.then(function (data) {
		//console.log("data", data);
		$scope.viewTreeData = createTreeData(data);
		//console.log($scope.viewTreeData);
	});

	function createTreeData(views) {

		var tree = [];

		views.forEach(function (view) {

			// set name
			var ele = {};
			ele.label = view.name;
			ele.data = view;

			//view.status = "aggregated"; // test
			console.log(view.status);
			// not_aggregated, in_progess, aggregated are possible
			if (view.status == "not_aggregated") {
				ele.classes = ["notAggregated"];
				console.log("notAggregated");
			} else if (view.status == "in_progess") {
				ele.classes = ["inProgress"];
				console.log("inProgress");
			} else if (view.status == "aggregated") {
				ele.classes = ["aggregated"];
				console.log("aggregated");
			}

			// set children
			ele.children = [];
			view.children_arr.forEach(function (childID) {
				//ele.children.push(createTreeData());

				//console.log("childID", childID);
				var fullchield = null,
					childtree = null;

				//console.log("views", views);
				// find the child
				$scope.views.forEach(function (v) {
					if (v._id == childID) {
						fullchield = v;
						//console.log("found equal", v);
					}
				});


				if (fullchield !== null) {

					// build recursive tree if children exist
					if (fullchield.children_arr.length) {
						childtree = createTreeData([fullchield]);
					} else {
						childtree = [];
					}

					ele.children.push({ // only works with objects, not with plain strings
						label: fullchield.name,
						children: childtree,
						data: fullchield
					});

				} else {
					//console.log("childid not found for", childID);
					viewService.getView({
						id: childID
					}).$promise.then(function (data) {
						//console.log("found missing child", data);
					});
				}

			});

			// and add that to the tree
			tree.push(ele);
		});

		return tree;
	}

	$scope.selectHandler = function (branch) {
		console.log(branch.data);
		$scope.setview(branch.data);
	};
})

.directive('viewlist', ["viewService", function (viewService) {
	return {
		restrict: 'AE',
		scope: {
			views: "=",
			setview: "="
		}, // isolated scope, true for inherited parent scope
		controller: 'viewListCtrl',
		templateUrl: 'components/viewList/viewList.html',
		link: function ($scope, element, attrs) {

			$scope.updateSelectedView = function (v) {
				//console.log("updating selected view to " + v);
				$scope.setview(v);
			};

		},
		replace: true
	};
}]);