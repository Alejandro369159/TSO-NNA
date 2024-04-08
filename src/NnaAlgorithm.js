"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
// Global state
var trip = [];
var totalCost = 0;
function resetGlobalState() {
    trip = [];
    totalCost = 0;
}
// Refactored functions
function getTxtRawData(filePath) {
    return new Promise(function (resolve, reject) {
        (0, fs_1.readFile)(filePath, "utf8", function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
}
function parseDataFromTxt(data) {
    return data
        .split("\n")
        .map(function (row) {
        var _a = row.split(" "), id = _a[0], x = _a[1], y = _a[2];
        return { id: id, x: parseInt(x), y: parseInt(y) };
    })
        .filter(function (node) { return node.x && node.y && node.id; });
}
function createDistancesMatrix(nodes) {
    return nodes.map(function (fromNode) {
        return __assign(__assign({}, fromNode), { relations: nodes
                .map(function (toNode) { return ({
                toId: toNode.id,
                distance: Math.hypot(fromNode.x - toNode.x, fromNode.y - toNode.y),
            }); })
                .filter(function (relation) { return relation.toId !== fromNode.id; }) });
    });
}
function insertFirstNodeRelation(matrix, testNumber) {
    var firstPath = { from: matrix[0].id, to: matrix[0].relations[0].toId };
    var leastDistance = matrix[0].relations[0].distance;
    var selectedNode = matrix[0];
    var closestRelation = matrix[0].relations[0];
    for (var _i = 0, matrix_1 = matrix; _i < matrix_1.length; _i++) {
        var node = matrix_1[_i];
        for (var _a = 0, _b = node.relations; _a < _b.length; _a++) {
            var relation = _b[_a];
            if (relation.distance < leastDistance) {
                leastDistance = relation.distance;
                closestRelation = relation;
                selectedNode = node;
            }
        }
    }
    totalCost += closestRelation.distance;
    firstPath =
        testNumber === "firstTest"
            ? { from: selectedNode.id, to: closestRelation.toId }
            : { from: closestRelation.toId, to: selectedNode.id };
    trip.push.apply(trip, [firstPath.from, firstPath.to]);
}
function selectRestOfNearestNeighboors(matrix) {
    while (trip.length < matrix.length) {
        var lastNodeInTrip = matrix.find(function (node) { return node.id === trip[trip.length - 1]; });
        if (!lastNodeInTrip)
            break;
        var options = lastNodeInTrip.relations.filter(function (relation) { return !trip.includes(relation.toId); });
        var closestNeighboor = options[0];
        if (options.length === 1) {
            trip.push(closestNeighboor.toId);
            totalCost += closestNeighboor.distance;
            break;
        }
        if (!closestNeighboor)
            throw new Error();
        for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
            var relation = options_1[_i];
            if (relation.distance < closestNeighboor.distance &&
                !trip.includes(relation.toId)) {
                closestNeighboor = relation;
            }
        }
        trip.push(closestNeighboor.toId);
        totalCost += closestNeighboor.distance;
    }
}
// Process for calculating a trip with its cost
function calculateTrip(testNumber) {
    return __awaiter(this, void 0, void 0, function () {
        var txtRawData, error_1, nodes, matrix;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    txtRawData = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, getTxtRawData("../references/48nodes.txt")];
                case 2:
                    txtRawData = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [2 /*return*/, "Error"];
                case 4:
                    // We parse/format the information
                    if (!txtRawData)
                        return [2 /*return*/, "Error"];
                    nodes = parseDataFromTxt(txtRawData);
                    matrix = createDistancesMatrix(nodes);
                    // We grab the cheapest relation of two nodes
                    insertFirstNodeRelation(matrix, testNumber);
                    // We iterate over the rest of nodes to place them by nearest neightboor
                    selectRestOfNearestNeighboors(matrix);
                    // Result
                    return [2 /*return*/, { trip: trip, cost: totalCost }];
            }
        });
    });
}
// Main function that does two trip calculations, it starts with the cheapest cost relation but
// it swaps the order of those two to see which one gives a better result
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var firstTestTrip, secondTestTrip, bestResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, calculateTrip("firstTest")];
                case 1:
                    firstTestTrip = _a.sent();
                    resetGlobalState();
                    return [4 /*yield*/, calculateTrip("secondTest")];
                case 2:
                    secondTestTrip = _a.sent();
                    if (firstTestTrip === "Error" || secondTestTrip === "Error")
                        return [2 /*return*/];
                    console.log("===========", "\n First Test Trip", firstTestTrip, "===========");
                    console.log("===========", "\n Second Test Trip", secondTestTrip, "===========");
                    bestResult = firstTestTrip.cost < secondTestTrip.cost ? firstTestTrip : secondTestTrip;
                    console.log("=============", "\n FINAL RESULT: ", "\n Trip:", bestResult.trip, "\nCost: ", bestResult.cost);
                    return [2 /*return*/];
            }
        });
    });
}
main();
