angular.module('AnalyticsManagementVisualizationApp')

    .controller('svgImportCtrl', ['$scope', '$location', 'venueService', 'zoneService', '$rootScope', '$window', function ($scope, $location, venueService, zoneService, $rootScope, $window) {

        $rootScope.isSidebarSmall ? angular.element("#page-wrapper")[0].style.marginLeft = "40px" : angular.element("#page-wrapper")[0].style.marginLeft = "250px";

        $scope.listOfImportedZones = [];
        $scope.importDone = false;
        $scope.import = {
            neLat: '7.025994',
            neLng: '49.210503',
            swLat: '7.025792',
            swLng: '49.209094',
            filterID: 'id',
            filterValue: 'Department_EG'
        };

        $scope.svgFileChanged = function (event) {
            var file = event.target.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = $scope.onSvgLoadComplete;
                reader.readAsText(file);
            } else {
                alert("No valid svg file selected");
                $scope.importDone = false;
            }
        };

        $scope.onSvgLoadComplete = function (event) {

            var svgContents = event.target.result;
            //var polygons = $scope.getPolygons(svgContents, "class", "test", [13.3228322, 52.516104], [13.3240707, 52.5171337]); // MAR
            //var polygons = $scope.getPolygons(svgContents, "id", "15065", [13.3198253, 52.5127149], [13.320187, 52.5131979]); // working test values TEL
            //var polygons = $scope.getPolygons(svgContents, "id", "Department_EG", [7.025792, 49.209094], [7.025994, 49.210503]); // GLOBUS
            var polygons = $scope.getPolygons(svgContents, $scope.import.filterID, $scope.import.filterValue, [$scope.import.swLat, $scope.import.swLng], [$scope.import.neLat, $scope.import.neLng]);

            buildZones(polygons);
            $scope.importDone = true;
            $scope.$apply();
            console.log('import complete');
            console.log($scope.listOfImportedZones);
            $rootScope.listOfImportedZones = $scope.listOfImportedZones;
            $rootScope.$broadcast('zones-imported');
        };

        $scope.doImport = function () {
            console.log("doing import");

            var venueID = $window.sessionStorage.currentVenueID;
            console.log("venueID");
            console.log(venueID);


            // import all zones
            $scope.listOfImportedZones.forEach(function (importedZone) {

                zoneService.createZoneInVenue({
                    venueId: venueID
                }, importedZone);

            });

            $location.path("/viewZones");
        };

        $scope.setActiveZone = function (newZone) {
            $scope.activeZone = newZone;
        }

        $scope.cancelImport = function () {
            console.log("cancel import");
            $location.path("/viewZones");
        };

        function buildZones(data) {

            $scope.listOfImportedZones = []; // clear list

            data.forEach(function (ele) {
                var theNewView = {
                    name: "",
                    description: "imported View",
                    parents_arr: [],
                    attributes_arr: [],
                    areaName: "auto-generated area name",
                    location_description: "auto-generated area description"
                };

                theNewView.name = (ele.name || ele.id) || ele.class;
                theNewView.geometry = ele.points;

                $scope.listOfImportedZones.push(theNewView);
            });
        };

        // Returns all polygons in the svg string which are described in a <path> have
        // an attribute selectorAttr which contains the string selectorAttrValue.
        // All svg coordinates are maped to global coordinates. The points sw and ne
        // are the desired south west and north east points of the svg, respectively.
        $scope.getPolygons = function (svgContents, selectorAttr, selectorAttrValue, sw, ne) {
            var svg = (new DOMParser()).parseFromString(svgContents, "image/svg+xml");
            var paths;
            if (selectorAttr != undefined && selectorAttr != "" && selectorAttrValue != undefined && selectorAttrValue != "") {
                paths = $("path[" + selectorAttr + "*='" + selectorAttrValue + "']", svg);
            } else {
                // select all
                paths = $("path", svg);
            }

            // convert viewBox attribute into an array like [2, 3.23, 20, 32.3411]
            var viewBox = svg.documentElement.getAttribute("viewBox").split(' ').map(Number);

            var x = viewBox[0];
            var y = viewBox[1];
            var width = viewBox[2];
            var height = viewBox[3];
            var ll = [x, y];
            var ur = [x + width, y + height];

            var localToGlobalMatrix = $scope.getLocalToGlobalTransformationMatrix(ll, ur, sw, ne);
            var coordinateSystemCorrection = {
                a: 1,
                b: 0,
                c: 0,
                d: -1,
                e: 0,
                f: 2 * y + height
            };
            localToGlobalMatrix = $scope.multiplyMatrices(localToGlobalMatrix, coordinateSystemCorrection);

            var polygons = [];
            var index;
            for (index = 0; index < paths.length; index++) {
                var transformMatrix = $scope.getTotalMatrixTransformation(paths[index]);
                var completeTransformMatrix = $scope.multiplyMatrices(localToGlobalMatrix, transformMatrix);
                // parse points from 'the d' attribute of the path
                var d = paths[index].getAttribute('d');
                var parsedList = svgParser.parse(d);
                var pointsList = $scope.extractPolygonPoints(parsedList, completeTransformMatrix);
                // add polygon to our results if it's at least a triangle
                if (pointsList.length > 2) {
                    polygons.push({
                        id: paths[index].getAttribute('id'),
                        name: paths[index].getAttribute('name'),
                        class: paths[index].getAttribute('class'),
                        points: pointsList
                    });
                }
            }

            return polygons;
        }

        $scope.extractPolygonPoints = function (parsedList, transformMatrix) {
            var points = [];
            var currentX = 0.0;
            var currentY = 0.0;
            var firstPoint = true;
            var index;
            var current;
            for (index = 0; index < parsedList.length; index++) {
                current = parsedList[index];

                // only for the first line, we also have to add the starting point
                if (current.command != "moveto" && firstPoint == true) {
                    points.push($scope.transformPoint(currentX, currentY, transformMatrix));
                    firstPoint = false;
                }

                // move current position
                if (current.relative == true) {
                    currentX += current.x || 0;
                    currentY += current.y || 0;
                } else {
                    currentX = current.x || 0;
                    currentY = current.y || 0;
                }

                // add new point to polygon
                if (current.command != "moveto" && current.command != "closepath") {
                    points.push($scope.transformPoint(currentX, currentY, transformMatrix));
                }
            }
            return points;
        }

        $scope.transformPoint = function (x, y, m) {
            return [
                m.a * x + m.c * y + m.e, /* x coordinate */
                m.b * x + m.d * y + m.f /* y coordinate */
            ];
        }

        // returns a matrix which represents all matrix transformations applied to the element, either directly or to parent elements
        // returns undefined if there is no matrix transformation applied to the element
        $scope.getTotalMatrixTransformation = function (elem) {
            var totalMatrix = {
                a: 1,
                b: 0,
                c: 0,
                d: 1,
                e: 0,
                f: 0
            };
            /* identity matrix */
            var currentElem = elem;
            while (currentElem != undefined) {
                var currentMatrix = $scope.getMatrixTransformation(currentElem);
                if (currentMatrix != undefined) {
                    // multiply new matrix from the left to apply it before the other transformations
                    totalMatrix = $scope.multiplyMatrices(currentMatrix, totalMatrix);
                }
                currentElem = currentElem.parentElement;
            }
            return totalMatrix;
        }

        // returns the matrix of a matrix transformation of an element.
        // the returned value is undefined if there is no matrix transformation applied
        // to the element and a dictionary otherwise, e.g. {a: 4, b: 2, c: 0, d: 2, e: 1, f: 5}
        $scope.getMatrixTransformation = function (elem) {
            var transformationString = elem.getAttribute('transform');
            if (transformationString == undefined) {
                return undefined;
            }
            var transformationParsed = $scope.parseTransform(transformationString);
            if (transformationParsed.matrix == undefined || transformationParsed.matrix.length != 6) {
                return undefined;
            }
            var transformMatrix = {
                a: transformationParsed.matrix[0],
                b: transformationParsed.matrix[1],
                c: transformationParsed.matrix[2],
                d: transformationParsed.matrix[3],
                e: transformationParsed.matrix[4],
                f: transformationParsed.matrix[5]
            };
            return transformMatrix;
        }

        // parses a string "a(3,4,2),b(1,2,3,4)" into {a: [3,4,2], b: [1,2,3,4]}
        // copied from http://stackoverflow.com/a/17838403
        $scope.parseTransform = function (a) {
            var b = {};
            for (var i in a = a.match(/(\w+\((\-?\d+\.?\d*e?\-?\d*,?)+\))+/g)) {
                var c = a[i].match(/[\w\.\-]+/g);
                b[c.shift()] = c;
            }
            return b;
        }

        // calculates a matrix which transforms points from a local to
        // a global coordinate system, based on four points:
        // ll: lower left point in local coordinates which should match with sw
        // ur: upper right point in local coordinates which should match with ne
        // sw: south west point in global coordinates which should match with ll
        // ne: north east point in global coordinates which should match with ne
        $scope.getLocalToGlobalTransformationMatrix = function (ll, ur, sw, ne) {
            // calculate local and global span vectors
            var l = $scope.subtractVectors(ur, ll);
            var g = $scope.subtractVectors(ne, sw);

            var lLen = $scope.vectorLen(l);
            var gLen = $scope.vectorLen(g);

            var lNorm = $scope.scaleVector(l, 1.0 / lLen);
            var gNorm = $scope.scaleVector(g, 1.0 / gLen);

            var rotationCos = $scope.dotProduct(lNorm, gNorm);
            var rotationSin = Math.sqrt(1 - rotationCos * rotationCos);
            // comparing the _normalized_ y coordinates reveals if we need to rotate clockwise
            if (gNorm[1] < lNorm[1]) {
                rotationSin = -rotationSin;
            }
            var rotationMatrix = {
                a: rotationCos,
                b: rotationSin,
                c: -rotationSin,
                d: rotationCos,
                e: 0,
                f: 0
            };

            var scaling = gLen / lLen;
            var scalingMatrix = {
                a: scaling,
                b: 0,
                c: 0,
                d: scaling,
                e: 0,
                f: 0
            };

            var rotationScalingMatrix = $scope.multiplyMatrices(rotationMatrix, scalingMatrix);
            var llTransformed = $scope.transformPoint(ll[0], ll[1], rotationScalingMatrix);
            var translation = $scope.subtractVectors(sw, llTransformed);
            var translationMatrix = {
                a: 1,
                b: 0,
                c: 0,
                d: 1,
                e: translation[0],
                f: translation[1]
            };

            return $scope.multiplyMatrices(translationMatrix, rotationScalingMatrix);
        }

        $scope.addVectors = function (v1, v2) {
            return [
                v1[0] + v2[0],
                v1[1] + v2[1]
            ];
        }

        $scope.subtractVectors = function (v1, v2) {
            return [
                v1[0] - v2[0],
                v1[1] - v2[1]
            ];
        }

        $scope.scaleVector = function (v, s) {
            return [
                s * v[0],
                s * v[1]
            ];
        }

        $scope.vectorLen = function (v) {
            return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        }

        $scope.dotProduct = function (v1, v2) {
            return v1[0] * v2[0] + v1[1] * v2[1];
        }

        // calculates the matrix m1 * m2 where both matrices are given as a dictionary in the form
        //  like {a: 4, b: 2, c: 0, d: 2, e: 1, f: 5}
        $scope.multiplyMatrices = function (m1, m2) {
            return {
                a: m1.a * m2.a + m1.c * m2.b,
                b: m1.b * m2.a + m1.d * m2.b,
                c: m1.a * m2.c + m1.c * m2.d,
                d: m1.b * m2.c + m1.d * m2.d,
                e: m1.a * m2.e + m1.c * m2.f + m1.e,
                f: m1.b * m2.e + m1.d * m2.f + m1.f
            };
        }
    }]);
