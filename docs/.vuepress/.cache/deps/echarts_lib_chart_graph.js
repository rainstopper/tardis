import {
  SeriesData_default,
  createSeriesData_default,
  prepareSeriesDataSchema
} from "./chunk-5O5Q4FH2.js";
import "./chunk-KP2TSVU6.js";
import {
  BezierCurve_default,
  BoundingRect_default,
  Chart_default,
  CoordinateSystem_default,
  Eventful_default,
  Group_default,
  Image_default,
  Line_default,
  Model_default,
  Path_default,
  SPECIAL_STATES,
  Series_default,
  Transformable_default,
  __extends,
  applyTransform,
  assert,
  bind,
  clone,
  clone2,
  convertOptionIdName,
  copy,
  copy2,
  create,
  create2,
  createHashMap,
  createSymbol,
  createTooltipMarkup,
  curry,
  defaultEmphasis,
  defaultSeriesFormatTooltip,
  defaults,
  distSquare,
  each,
  enterEmphasis,
  extend,
  fromPoints,
  getECData,
  getLabelStatesModels,
  getLayoutRect,
  indexOf,
  initProps,
  invert,
  isArray,
  isMiddleOrRightButtonOnMouseUpDown,
  isNumber,
  isObject,
  isString,
  keys,
  leaveEmphasis,
  len,
  linearMap,
  makeInner,
  map,
  mixin,
  noop,
  normalize,
  normalizeSymbolOffset,
  normalizeSymbolSize,
  parsePercent2 as parsePercent,
  quadraticAt,
  quadraticSubdivide,
  registerAction,
  removeElement,
  retrieve,
  retrieve3,
  retrieveRawValue,
  round,
  saveOldStyle,
  scale,
  scaleAndAdd,
  set,
  setLabelStyle,
  stop,
  sub,
  toggleHoverEmphasis,
  traverseElements,
  updateProps,
  use
} from "./chunk-D7JLP2QZ.js";
import "./chunk-PZ5AY32C.js";

// node_modules/echarts/lib/chart/graph/categoryFilter.js
function categoryFilter(ecModel) {
  var legendModels = ecModel.findComponents({
    mainType: "legend"
  });
  if (!legendModels || !legendModels.length) {
    return;
  }
  ecModel.eachSeriesByType("graph", function(graphSeries) {
    var categoriesData = graphSeries.getCategoriesData();
    var graph = graphSeries.getGraph();
    var data = graph.data;
    var categoryNames = categoriesData.mapArray(categoriesData.getName);
    data.filterSelf(function(idx) {
      var model = data.getItemModel(idx);
      var category = model.getShallow("category");
      if (category != null) {
        if (isNumber(category)) {
          category = categoryNames[category];
        }
        for (var i = 0; i < legendModels.length; i++) {
          if (!legendModels[i].isSelected(category)) {
            return false;
          }
        }
      }
      return true;
    });
  });
}

// node_modules/echarts/lib/chart/graph/categoryVisual.js
function categoryVisual(ecModel) {
  var paletteScope = {};
  ecModel.eachSeriesByType("graph", function(seriesModel) {
    var categoriesData = seriesModel.getCategoriesData();
    var data = seriesModel.getData();
    var categoryNameIdxMap = {};
    categoriesData.each(function(idx) {
      var name = categoriesData.getName(idx);
      categoryNameIdxMap["ec-" + name] = idx;
      var itemModel = categoriesData.getItemModel(idx);
      var style = itemModel.getModel("itemStyle").getItemStyle();
      if (!style.fill) {
        style.fill = seriesModel.getColorFromPalette(name, paletteScope);
      }
      categoriesData.setItemVisual(idx, "style", style);
      var symbolVisualList = ["symbol", "symbolSize", "symbolKeepAspect"];
      for (var i = 0; i < symbolVisualList.length; i++) {
        var symbolVisual = itemModel.getShallow(symbolVisualList[i], true);
        if (symbolVisual != null) {
          categoriesData.setItemVisual(idx, symbolVisualList[i], symbolVisual);
        }
      }
    });
    if (categoriesData.count()) {
      data.each(function(idx) {
        var model = data.getItemModel(idx);
        var categoryIdx = model.getShallow("category");
        if (categoryIdx != null) {
          if (isString(categoryIdx)) {
            categoryIdx = categoryNameIdxMap["ec-" + categoryIdx];
          }
          var categoryStyle = categoriesData.getItemVisual(categoryIdx, "style");
          var style = data.ensureUniqueItemVisual(idx, "style");
          extend(style, categoryStyle);
          var visualList = ["symbol", "symbolSize", "symbolKeepAspect"];
          for (var i = 0; i < visualList.length; i++) {
            data.setItemVisual(idx, visualList[i], categoriesData.getItemVisual(categoryIdx, visualList[i]));
          }
        }
      });
    }
  });
}

// node_modules/echarts/lib/chart/graph/edgeVisual.js
function normalize2(a) {
  if (!(a instanceof Array)) {
    a = [a, a];
  }
  return a;
}
function graphEdgeVisual(ecModel) {
  ecModel.eachSeriesByType("graph", function(seriesModel) {
    var graph = seriesModel.getGraph();
    var edgeData = seriesModel.getEdgeData();
    var symbolType = normalize2(seriesModel.get("edgeSymbol"));
    var symbolSize = normalize2(seriesModel.get("edgeSymbolSize"));
    edgeData.setVisual("fromSymbol", symbolType && symbolType[0]);
    edgeData.setVisual("toSymbol", symbolType && symbolType[1]);
    edgeData.setVisual("fromSymbolSize", symbolSize && symbolSize[0]);
    edgeData.setVisual("toSymbolSize", symbolSize && symbolSize[1]);
    edgeData.setVisual("style", seriesModel.getModel("lineStyle").getLineStyle());
    edgeData.each(function(idx) {
      var itemModel = edgeData.getItemModel(idx);
      var edge = graph.getEdgeByIndex(idx);
      var symbolType2 = normalize2(itemModel.getShallow("symbol", true));
      var symbolSize2 = normalize2(itemModel.getShallow("symbolSize", true));
      var style = itemModel.getModel("lineStyle").getLineStyle();
      var existsStyle = edgeData.ensureUniqueItemVisual(idx, "style");
      extend(existsStyle, style);
      switch (existsStyle.stroke) {
        case "source": {
          var nodeStyle = edge.node1.getVisual("style");
          existsStyle.stroke = nodeStyle && nodeStyle.fill;
          break;
        }
        case "target": {
          var nodeStyle = edge.node2.getVisual("style");
          existsStyle.stroke = nodeStyle && nodeStyle.fill;
          break;
        }
      }
      symbolType2[0] && edge.setVisual("fromSymbol", symbolType2[0]);
      symbolType2[1] && edge.setVisual("toSymbol", symbolType2[1]);
      symbolSize2[0] && edge.setVisual("fromSymbolSize", symbolSize2[0]);
      symbolSize2[1] && edge.setVisual("toSymbolSize", symbolSize2[1]);
    });
  });
}

// node_modules/echarts/lib/chart/helper/multipleGraphEdgeHelper.js
var KEY_DELIMITER = "-->";
var getAutoCurvenessParams = function(seriesModel) {
  return seriesModel.get("autoCurveness") || null;
};
var createCurveness = function(seriesModel, appendLength) {
  var autoCurvenessParmas = getAutoCurvenessParams(seriesModel);
  var length = 20;
  var curvenessList = [];
  if (isNumber(autoCurvenessParmas)) {
    length = autoCurvenessParmas;
  } else if (isArray(autoCurvenessParmas)) {
    seriesModel.__curvenessList = autoCurvenessParmas;
    return;
  }
  if (appendLength > length) {
    length = appendLength;
  }
  var len2 = length % 2 ? length + 2 : length + 3;
  curvenessList = [];
  for (var i = 0; i < len2; i++) {
    curvenessList.push((i % 2 ? i + 1 : i) / 10 * (i % 2 ? -1 : 1));
  }
  seriesModel.__curvenessList = curvenessList;
};
var getKeyOfEdges = function(n1, n2, seriesModel) {
  var source = [n1.id, n1.dataIndex].join(".");
  var target = [n2.id, n2.dataIndex].join(".");
  return [seriesModel.uid, source, target].join(KEY_DELIMITER);
};
var getOppositeKey = function(key) {
  var keys2 = key.split(KEY_DELIMITER);
  return [keys2[0], keys2[2], keys2[1]].join(KEY_DELIMITER);
};
var getEdgeFromMap = function(edge, seriesModel) {
  var key = getKeyOfEdges(edge.node1, edge.node2, seriesModel);
  return seriesModel.__edgeMap[key];
};
var getTotalLengthBetweenNodes = function(edge, seriesModel) {
  var len2 = getEdgeMapLengthWithKey(getKeyOfEdges(edge.node1, edge.node2, seriesModel), seriesModel);
  var lenV = getEdgeMapLengthWithKey(getKeyOfEdges(edge.node2, edge.node1, seriesModel), seriesModel);
  return len2 + lenV;
};
var getEdgeMapLengthWithKey = function(key, seriesModel) {
  var edgeMap = seriesModel.__edgeMap;
  return edgeMap[key] ? edgeMap[key].length : 0;
};
function initCurvenessList(seriesModel) {
  if (!getAutoCurvenessParams(seriesModel)) {
    return;
  }
  seriesModel.__curvenessList = [];
  seriesModel.__edgeMap = {};
  createCurveness(seriesModel);
}
function createEdgeMapForCurveness(n1, n2, seriesModel, index) {
  if (!getAutoCurvenessParams(seriesModel)) {
    return;
  }
  var key = getKeyOfEdges(n1, n2, seriesModel);
  var edgeMap = seriesModel.__edgeMap;
  var oppositeEdges = edgeMap[getOppositeKey(key)];
  if (edgeMap[key] && !oppositeEdges) {
    edgeMap[key].isForward = true;
  } else if (oppositeEdges && edgeMap[key]) {
    oppositeEdges.isForward = true;
    edgeMap[key].isForward = false;
  }
  edgeMap[key] = edgeMap[key] || [];
  edgeMap[key].push(index);
}
function getCurvenessForEdge(edge, seriesModel, index, needReverse) {
  var autoCurvenessParams = getAutoCurvenessParams(seriesModel);
  var isArrayParam = isArray(autoCurvenessParams);
  if (!autoCurvenessParams) {
    return null;
  }
  var edgeArray = getEdgeFromMap(edge, seriesModel);
  if (!edgeArray) {
    return null;
  }
  var edgeIndex = -1;
  for (var i = 0; i < edgeArray.length; i++) {
    if (edgeArray[i] === index) {
      edgeIndex = i;
      break;
    }
  }
  var totalLen = getTotalLengthBetweenNodes(edge, seriesModel);
  createCurveness(seriesModel, totalLen);
  edge.lineStyle = edge.lineStyle || {};
  var curKey = getKeyOfEdges(edge.node1, edge.node2, seriesModel);
  var curvenessList = seriesModel.__curvenessList;
  var parityCorrection = isArrayParam ? 0 : totalLen % 2 ? 0 : 1;
  if (!edgeArray.isForward) {
    var oppositeKey = getOppositeKey(curKey);
    var len2 = getEdgeMapLengthWithKey(oppositeKey, seriesModel);
    var resValue = curvenessList[edgeIndex + len2 + parityCorrection];
    if (needReverse) {
      if (isArrayParam) {
        if (autoCurvenessParams && autoCurvenessParams[0] === 0) {
          return (len2 + parityCorrection) % 2 ? resValue : -resValue;
        } else {
          return ((len2 % 2 ? 0 : 1) + parityCorrection) % 2 ? resValue : -resValue;
        }
      } else {
        return (len2 + parityCorrection) % 2 ? resValue : -resValue;
      }
    } else {
      return curvenessList[edgeIndex + len2 + parityCorrection];
    }
  } else {
    return curvenessList[parityCorrection + edgeIndex];
  }
}

// node_modules/echarts/lib/chart/graph/simpleLayoutHelper.js
function simpleLayout(seriesModel) {
  var coordSys = seriesModel.coordinateSystem;
  if (coordSys && coordSys.type !== "view") {
    return;
  }
  var graph = seriesModel.getGraph();
  graph.eachNode(function(node) {
    var model = node.getModel();
    node.setLayout([+model.get("x"), +model.get("y")]);
  });
  simpleLayoutEdge(graph, seriesModel);
}
function simpleLayoutEdge(graph, seriesModel) {
  graph.eachEdge(function(edge, index) {
    var curveness = retrieve3(edge.getModel().get(["lineStyle", "curveness"]), -getCurvenessForEdge(edge, seriesModel, index, true), 0);
    var p1 = clone2(edge.node1.getLayout());
    var p2 = clone2(edge.node2.getLayout());
    var points = [p1, p2];
    if (+curveness) {
      points.push([(p1[0] + p2[0]) / 2 - (p1[1] - p2[1]) * curveness, (p1[1] + p2[1]) / 2 - (p2[0] - p1[0]) * curveness]);
    }
    edge.setLayout(points);
  });
}

// node_modules/echarts/lib/chart/graph/simpleLayout.js
function graphSimpleLayout(ecModel, api) {
  ecModel.eachSeriesByType("graph", function(seriesModel) {
    var layout = seriesModel.get("layout");
    var coordSys = seriesModel.coordinateSystem;
    if (coordSys && coordSys.type !== "view") {
      var data_1 = seriesModel.getData();
      var dimensions_1 = [];
      each(coordSys.dimensions, function(coordDim) {
        dimensions_1 = dimensions_1.concat(data_1.mapDimensionsAll(coordDim));
      });
      for (var dataIndex = 0; dataIndex < data_1.count(); dataIndex++) {
        var value = [];
        var hasValue = false;
        for (var i = 0; i < dimensions_1.length; i++) {
          var val = data_1.get(dimensions_1[i], dataIndex);
          if (!isNaN(val)) {
            hasValue = true;
          }
          value.push(val);
        }
        if (hasValue) {
          data_1.setItemLayout(dataIndex, coordSys.dataToPoint(value));
        } else {
          data_1.setItemLayout(dataIndex, [NaN, NaN]);
        }
      }
      simpleLayoutEdge(data_1.graph, seriesModel);
    } else if (!layout || layout === "none") {
      simpleLayout(seriesModel);
    }
  });
}

// node_modules/echarts/lib/chart/graph/graphHelper.js
function getNodeGlobalScale(seriesModel) {
  var coordSys = seriesModel.coordinateSystem;
  if (coordSys.type !== "view") {
    return 1;
  }
  var nodeScaleRatio = seriesModel.option.nodeScaleRatio;
  var groupZoom = coordSys.scaleX;
  var roamZoom = coordSys.getZoom();
  var nodeScale = (roamZoom - 1) * nodeScaleRatio + 1;
  return nodeScale / groupZoom;
}
function getSymbolSize(node) {
  var symbolSize = node.getVisual("symbolSize");
  if (symbolSize instanceof Array) {
    symbolSize = (symbolSize[0] + symbolSize[1]) / 2;
  }
  return +symbolSize;
}

// node_modules/echarts/lib/chart/graph/circularLayoutHelper.js
var PI = Math.PI;
var _symbolRadiansHalf = [];
function circularLayout(seriesModel, basedOn, draggingNode, pointer) {
  var coordSys = seriesModel.coordinateSystem;
  if (coordSys && coordSys.type !== "view") {
    return;
  }
  var rect = coordSys.getBoundingRect();
  var nodeData = seriesModel.getData();
  var graph = nodeData.graph;
  var cx = rect.width / 2 + rect.x;
  var cy = rect.height / 2 + rect.y;
  var r = Math.min(rect.width, rect.height) / 2;
  var count = nodeData.count();
  nodeData.setLayout({
    cx,
    cy
  });
  if (!count) {
    return;
  }
  if (draggingNode) {
    var _a = coordSys.pointToData(pointer), tempX = _a[0], tempY = _a[1];
    var v = [tempX - cx, tempY - cy];
    normalize(v, v);
    scale(v, v, r);
    draggingNode.setLayout([cx + v[0], cy + v[1]], true);
    var circularRotateLabel = seriesModel.get(["circular", "rotateLabel"]);
    rotateNodeLabel(draggingNode, circularRotateLabel, cx, cy);
  }
  _layoutNodesBasedOn[basedOn](seriesModel, graph, nodeData, r, cx, cy, count);
  graph.eachEdge(function(edge, index) {
    var curveness = retrieve3(edge.getModel().get(["lineStyle", "curveness"]), getCurvenessForEdge(edge, seriesModel, index), 0);
    var p1 = clone2(edge.node1.getLayout());
    var p2 = clone2(edge.node2.getLayout());
    var cp1;
    var x12 = (p1[0] + p2[0]) / 2;
    var y12 = (p1[1] + p2[1]) / 2;
    if (+curveness) {
      curveness *= 3;
      cp1 = [cx * curveness + x12 * (1 - curveness), cy * curveness + y12 * (1 - curveness)];
    }
    edge.setLayout([p1, p2, cp1]);
  });
}
var _layoutNodesBasedOn = {
  value: function(seriesModel, graph, nodeData, r, cx, cy, count) {
    var angle = 0;
    var sum = nodeData.getSum("value");
    var unitAngle = Math.PI * 2 / (sum || count);
    graph.eachNode(function(node) {
      var value = node.getValue("value");
      var radianHalf = unitAngle * (sum ? value : 1) / 2;
      angle += radianHalf;
      node.setLayout([r * Math.cos(angle) + cx, r * Math.sin(angle) + cy]);
      angle += radianHalf;
    });
  },
  symbolSize: function(seriesModel, graph, nodeData, r, cx, cy, count) {
    var sumRadian = 0;
    _symbolRadiansHalf.length = count;
    var nodeScale = getNodeGlobalScale(seriesModel);
    graph.eachNode(function(node) {
      var symbolSize = getSymbolSize(node);
      isNaN(symbolSize) && (symbolSize = 2);
      symbolSize < 0 && (symbolSize = 0);
      symbolSize *= nodeScale;
      var symbolRadianHalf = Math.asin(symbolSize / 2 / r);
      isNaN(symbolRadianHalf) && (symbolRadianHalf = PI / 2);
      _symbolRadiansHalf[node.dataIndex] = symbolRadianHalf;
      sumRadian += symbolRadianHalf * 2;
    });
    var halfRemainRadian = (2 * PI - sumRadian) / count / 2;
    var angle = 0;
    graph.eachNode(function(node) {
      var radianHalf = halfRemainRadian + _symbolRadiansHalf[node.dataIndex];
      angle += radianHalf;
      (!node.getLayout() || !node.getLayout().fixed) && node.setLayout([r * Math.cos(angle) + cx, r * Math.sin(angle) + cy]);
      angle += radianHalf;
    });
  }
};
function rotateNodeLabel(node, circularRotateLabel, cx, cy) {
  var el = node.getGraphicEl();
  if (!el) {
    return;
  }
  var nodeModel = node.getModel();
  var labelRotate = nodeModel.get(["label", "rotate"]) || 0;
  var symbolPath = el.getSymbolPath();
  if (circularRotateLabel) {
    var pos = node.getLayout();
    var rad = Math.atan2(pos[1] - cy, pos[0] - cx);
    if (rad < 0) {
      rad = Math.PI * 2 + rad;
    }
    var isLeft = pos[0] < cx;
    if (isLeft) {
      rad = rad - Math.PI;
    }
    var textPosition = isLeft ? "left" : "right";
    symbolPath.setTextConfig({
      rotation: -rad,
      position: textPosition,
      origin: "center"
    });
    var emphasisState = symbolPath.ensureState("emphasis");
    extend(emphasisState.textConfig || (emphasisState.textConfig = {}), {
      position: textPosition
    });
  } else {
    symbolPath.setTextConfig({
      rotation: labelRotate *= Math.PI / 180
    });
  }
}

// node_modules/echarts/lib/chart/graph/circularLayout.js
function graphCircularLayout(ecModel) {
  ecModel.eachSeriesByType("graph", function(seriesModel) {
    if (seriesModel.get("layout") === "circular") {
      circularLayout(seriesModel, "symbolSize");
    }
  });
}

// node_modules/echarts/lib/chart/graph/forceHelper.js
var scaleAndAdd2 = scaleAndAdd;
function forceLayout(inNodes, inEdges, opts) {
  var nodes = inNodes;
  var edges = inEdges;
  var rect = opts.rect;
  var width = rect.width;
  var height = rect.height;
  var center = [rect.x + width / 2, rect.y + height / 2];
  var gravity = opts.gravity == null ? 0.1 : opts.gravity;
  for (var i = 0; i < nodes.length; i++) {
    var n = nodes[i];
    if (!n.p) {
      n.p = create(width * (Math.random() - 0.5) + center[0], height * (Math.random() - 0.5) + center[1]);
    }
    n.pp = clone2(n.p);
    n.edges = null;
  }
  var initialFriction = opts.friction == null ? 0.6 : opts.friction;
  var friction = initialFriction;
  var beforeStepCallback;
  var afterStepCallback;
  return {
    warmUp: function() {
      friction = initialFriction * 0.8;
    },
    setFixed: function(idx) {
      nodes[idx].fixed = true;
    },
    setUnfixed: function(idx) {
      nodes[idx].fixed = false;
    },
    /**
     * Before step hook
     */
    beforeStep: function(cb) {
      beforeStepCallback = cb;
    },
    /**
     * After step hook
     */
    afterStep: function(cb) {
      afterStepCallback = cb;
    },
    /**
     * Some formulas were originally copied from "d3.js"
     * https://github.com/d3/d3/blob/b516d77fb8566b576088e73410437494717ada26/src/layout/force.js
     * with some modifications made for this project.
     * See the license statement at the head of this file.
     */
    step: function(cb) {
      beforeStepCallback && beforeStepCallback(nodes, edges);
      var v12 = [];
      var nLen = nodes.length;
      for (var i2 = 0; i2 < edges.length; i2++) {
        var e = edges[i2];
        if (e.ignoreForceLayout) {
          continue;
        }
        var n1 = e.n1;
        var n2 = e.n2;
        sub(v12, n2.p, n1.p);
        var d = len(v12) - e.d;
        var w = n2.w / (n1.w + n2.w);
        if (isNaN(w)) {
          w = 0;
        }
        normalize(v12, v12);
        !n1.fixed && scaleAndAdd2(n1.p, n1.p, v12, w * d * friction);
        !n2.fixed && scaleAndAdd2(n2.p, n2.p, v12, -(1 - w) * d * friction);
      }
      for (var i2 = 0; i2 < nLen; i2++) {
        var n3 = nodes[i2];
        if (!n3.fixed) {
          sub(v12, center, n3.p);
          scaleAndAdd2(n3.p, n3.p, v12, gravity * friction);
        }
      }
      for (var i2 = 0; i2 < nLen; i2++) {
        var n1 = nodes[i2];
        for (var j = i2 + 1; j < nLen; j++) {
          var n2 = nodes[j];
          sub(v12, n2.p, n1.p);
          var d = len(v12);
          if (d === 0) {
            set(v12, Math.random() - 0.5, Math.random() - 0.5);
            d = 1;
          }
          var repFact = (n1.rep + n2.rep) / d / d;
          !n1.fixed && scaleAndAdd2(n1.pp, n1.pp, v12, repFact);
          !n2.fixed && scaleAndAdd2(n2.pp, n2.pp, v12, -repFact);
        }
      }
      var v = [];
      for (var i2 = 0; i2 < nLen; i2++) {
        var n3 = nodes[i2];
        if (!n3.fixed) {
          sub(v, n3.p, n3.pp);
          scaleAndAdd2(n3.p, n3.p, v, friction);
          copy(n3.pp, n3.p);
        }
      }
      friction = friction * 0.992;
      var finished = friction < 0.01;
      afterStepCallback && afterStepCallback(nodes, edges, finished);
      cb && cb(finished);
    }
  };
}

// node_modules/echarts/lib/chart/graph/forceLayout.js
function graphForceLayout(ecModel) {
  ecModel.eachSeriesByType("graph", function(graphSeries) {
    var coordSys = graphSeries.coordinateSystem;
    if (coordSys && coordSys.type !== "view") {
      return;
    }
    if (graphSeries.get("layout") === "force") {
      var preservedPoints_1 = graphSeries.preservedPoints || {};
      var graph_1 = graphSeries.getGraph();
      var nodeData_1 = graph_1.data;
      var edgeData = graph_1.edgeData;
      var forceModel = graphSeries.getModel("force");
      var initLayout = forceModel.get("initLayout");
      if (graphSeries.preservedPoints) {
        nodeData_1.each(function(idx) {
          var id = nodeData_1.getId(idx);
          nodeData_1.setItemLayout(idx, preservedPoints_1[id] || [NaN, NaN]);
        });
      } else if (!initLayout || initLayout === "none") {
        simpleLayout(graphSeries);
      } else if (initLayout === "circular") {
        circularLayout(graphSeries, "value");
      }
      var nodeDataExtent_1 = nodeData_1.getDataExtent("value");
      var edgeDataExtent_1 = edgeData.getDataExtent("value");
      var repulsion = forceModel.get("repulsion");
      var edgeLength = forceModel.get("edgeLength");
      var repulsionArr_1 = isArray(repulsion) ? repulsion : [repulsion, repulsion];
      var edgeLengthArr_1 = isArray(edgeLength) ? edgeLength : [edgeLength, edgeLength];
      edgeLengthArr_1 = [edgeLengthArr_1[1], edgeLengthArr_1[0]];
      var nodes_1 = nodeData_1.mapArray("value", function(value, idx) {
        var point = nodeData_1.getItemLayout(idx);
        var rep = linearMap(value, nodeDataExtent_1, repulsionArr_1);
        if (isNaN(rep)) {
          rep = (repulsionArr_1[0] + repulsionArr_1[1]) / 2;
        }
        return {
          w: rep,
          rep,
          fixed: nodeData_1.getItemModel(idx).get("fixed"),
          p: !point || isNaN(point[0]) || isNaN(point[1]) ? null : point
        };
      });
      var edges = edgeData.mapArray("value", function(value, idx) {
        var edge = graph_1.getEdgeByIndex(idx);
        var d = linearMap(value, edgeDataExtent_1, edgeLengthArr_1);
        if (isNaN(d)) {
          d = (edgeLengthArr_1[0] + edgeLengthArr_1[1]) / 2;
        }
        var edgeModel = edge.getModel();
        var curveness = retrieve3(edge.getModel().get(["lineStyle", "curveness"]), -getCurvenessForEdge(edge, graphSeries, idx, true), 0);
        return {
          n1: nodes_1[edge.node1.dataIndex],
          n2: nodes_1[edge.node2.dataIndex],
          d,
          curveness,
          ignoreForceLayout: edgeModel.get("ignoreForceLayout")
        };
      });
      var rect = coordSys.getBoundingRect();
      var forceInstance = forceLayout(nodes_1, edges, {
        rect,
        gravity: forceModel.get("gravity"),
        friction: forceModel.get("friction")
      });
      forceInstance.beforeStep(function(nodes, edges2) {
        for (var i = 0, l = nodes.length; i < l; i++) {
          if (nodes[i].fixed) {
            copy(nodes[i].p, graph_1.getNodeByIndex(i).getLayout());
          }
        }
      });
      forceInstance.afterStep(function(nodes, edges2, stopped) {
        for (var i = 0, l = nodes.length; i < l; i++) {
          if (!nodes[i].fixed) {
            graph_1.getNodeByIndex(i).setLayout(nodes[i].p);
          }
          preservedPoints_1[nodeData_1.getId(i)] = nodes[i].p;
        }
        for (var i = 0, l = edges2.length; i < l; i++) {
          var e = edges2[i];
          var edge = graph_1.getEdgeByIndex(i);
          var p1 = e.n1.p;
          var p2 = e.n2.p;
          var points = edge.getLayout();
          points = points ? points.slice() : [];
          points[0] = points[0] || [];
          points[1] = points[1] || [];
          copy(points[0], p1);
          copy(points[1], p2);
          if (+e.curveness) {
            points[2] = [(p1[0] + p2[0]) / 2 - (p1[1] - p2[1]) * e.curveness, (p1[1] + p2[1]) / 2 - (p2[0] - p1[0]) * e.curveness];
          }
          edge.setLayout(points);
        }
      });
      graphSeries.forceLayout = forceInstance;
      graphSeries.preservedPoints = preservedPoints_1;
      forceInstance.step();
    } else {
      graphSeries.forceLayout = null;
    }
  });
}

// node_modules/echarts/lib/coord/View.js
var v2ApplyTransform = applyTransform;
var View = (
  /** @class */
  function(_super) {
    __extends(View2, _super);
    function View2(name) {
      var _this = _super.call(this) || this;
      _this.type = "view";
      _this.dimensions = ["x", "y"];
      _this._roamTransformable = new Transformable_default();
      _this._rawTransformable = new Transformable_default();
      _this.name = name;
      return _this;
    }
    View2.prototype.setBoundingRect = function(x, y, width, height) {
      this._rect = new BoundingRect_default(x, y, width, height);
      return this._rect;
    };
    View2.prototype.getBoundingRect = function() {
      return this._rect;
    };
    View2.prototype.setViewRect = function(x, y, width, height) {
      this._transformTo(x, y, width, height);
      this._viewRect = new BoundingRect_default(x, y, width, height);
    };
    View2.prototype._transformTo = function(x, y, width, height) {
      var rect = this.getBoundingRect();
      var rawTransform = this._rawTransformable;
      rawTransform.transform = rect.calculateTransform(new BoundingRect_default(x, y, width, height));
      var rawParent = rawTransform.parent;
      rawTransform.parent = null;
      rawTransform.decomposeTransform();
      rawTransform.parent = rawParent;
      this._updateTransform();
    };
    View2.prototype.setCenter = function(centerCoord, api) {
      if (!centerCoord) {
        return;
      }
      this._center = [parsePercent(centerCoord[0], api.getWidth()), parsePercent(centerCoord[1], api.getHeight())];
      this._updateCenterAndZoom();
    };
    View2.prototype.setZoom = function(zoom) {
      zoom = zoom || 1;
      var zoomLimit = this.zoomLimit;
      if (zoomLimit) {
        if (zoomLimit.max != null) {
          zoom = Math.min(zoomLimit.max, zoom);
        }
        if (zoomLimit.min != null) {
          zoom = Math.max(zoomLimit.min, zoom);
        }
      }
      this._zoom = zoom;
      this._updateCenterAndZoom();
    };
    View2.prototype.getDefaultCenter = function() {
      var rawRect = this.getBoundingRect();
      var cx = rawRect.x + rawRect.width / 2;
      var cy = rawRect.y + rawRect.height / 2;
      return [cx, cy];
    };
    View2.prototype.getCenter = function() {
      return this._center || this.getDefaultCenter();
    };
    View2.prototype.getZoom = function() {
      return this._zoom || 1;
    };
    View2.prototype.getRoamTransform = function() {
      return this._roamTransformable.getLocalTransform();
    };
    View2.prototype._updateCenterAndZoom = function() {
      var rawTransformMatrix = this._rawTransformable.getLocalTransform();
      var roamTransform = this._roamTransformable;
      var defaultCenter = this.getDefaultCenter();
      var center = this.getCenter();
      var zoom = this.getZoom();
      center = applyTransform([], center, rawTransformMatrix);
      defaultCenter = applyTransform([], defaultCenter, rawTransformMatrix);
      roamTransform.originX = center[0];
      roamTransform.originY = center[1];
      roamTransform.x = defaultCenter[0] - center[0];
      roamTransform.y = defaultCenter[1] - center[1];
      roamTransform.scaleX = roamTransform.scaleY = zoom;
      this._updateTransform();
    };
    View2.prototype._updateTransform = function() {
      var roamTransformable = this._roamTransformable;
      var rawTransformable = this._rawTransformable;
      rawTransformable.parent = roamTransformable;
      roamTransformable.updateTransform();
      rawTransformable.updateTransform();
      copy2(this.transform || (this.transform = []), rawTransformable.transform || create2());
      this._rawTransform = rawTransformable.getLocalTransform();
      this.invTransform = this.invTransform || [];
      invert(this.invTransform, this.transform);
      this.decomposeTransform();
    };
    View2.prototype.getTransformInfo = function() {
      var rawTransformable = this._rawTransformable;
      var roamTransformable = this._roamTransformable;
      var dummyTransformable = new Transformable_default();
      dummyTransformable.transform = roamTransformable.transform;
      dummyTransformable.decomposeTransform();
      return {
        roam: {
          x: dummyTransformable.x,
          y: dummyTransformable.y,
          scaleX: dummyTransformable.scaleX,
          scaleY: dummyTransformable.scaleY
        },
        raw: {
          x: rawTransformable.x,
          y: rawTransformable.y,
          scaleX: rawTransformable.scaleX,
          scaleY: rawTransformable.scaleY
        }
      };
    };
    View2.prototype.getViewRect = function() {
      return this._viewRect;
    };
    View2.prototype.getViewRectAfterRoam = function() {
      var rect = this.getBoundingRect().clone();
      rect.applyTransform(this.transform);
      return rect;
    };
    View2.prototype.dataToPoint = function(data, noRoam, out) {
      var transform = noRoam ? this._rawTransform : this.transform;
      out = out || [];
      return transform ? v2ApplyTransform(out, data, transform) : copy(out, data);
    };
    View2.prototype.pointToData = function(point) {
      var invTransform = this.invTransform;
      return invTransform ? v2ApplyTransform([], point, invTransform) : [point[0], point[1]];
    };
    View2.prototype.convertToPixel = function(ecModel, finder, value) {
      var coordSys = getCoordSys(finder);
      return coordSys === this ? coordSys.dataToPoint(value) : null;
    };
    View2.prototype.convertFromPixel = function(ecModel, finder, pixel) {
      var coordSys = getCoordSys(finder);
      return coordSys === this ? coordSys.pointToData(pixel) : null;
    };
    View2.prototype.containPoint = function(point) {
      return this.getViewRectAfterRoam().contain(point[0], point[1]);
    };
    View2.dimensions = ["x", "y"];
    return View2;
  }(Transformable_default)
);
function getCoordSys(finder) {
  var seriesModel = finder.seriesModel;
  return seriesModel ? seriesModel.coordinateSystem : null;
}
var View_default = View;

// node_modules/echarts/lib/chart/graph/createView.js
function getViewRect(seriesModel, api, aspect) {
  var option = extend(seriesModel.getBoxLayoutParams(), {
    aspect
  });
  return getLayoutRect(option, {
    width: api.getWidth(),
    height: api.getHeight()
  });
}
function createViewCoordSys(ecModel, api) {
  var viewList = [];
  ecModel.eachSeriesByType("graph", function(seriesModel) {
    var coordSysType = seriesModel.get("coordinateSystem");
    if (!coordSysType || coordSysType === "view") {
      var data_1 = seriesModel.getData();
      var positions = data_1.mapArray(function(idx) {
        var itemModel = data_1.getItemModel(idx);
        return [+itemModel.get("x"), +itemModel.get("y")];
      });
      var min = [];
      var max = [];
      fromPoints(positions, min, max);
      if (max[0] - min[0] === 0) {
        max[0] += 1;
        min[0] -= 1;
      }
      if (max[1] - min[1] === 0) {
        max[1] += 1;
        min[1] -= 1;
      }
      var aspect = (max[0] - min[0]) / (max[1] - min[1]);
      var viewRect = getViewRect(seriesModel, api, aspect);
      if (isNaN(aspect)) {
        min = [viewRect.x, viewRect.y];
        max = [viewRect.x + viewRect.width, viewRect.y + viewRect.height];
      }
      var bbWidth = max[0] - min[0];
      var bbHeight = max[1] - min[1];
      var viewWidth = viewRect.width;
      var viewHeight = viewRect.height;
      var viewCoordSys = seriesModel.coordinateSystem = new View_default();
      viewCoordSys.zoomLimit = seriesModel.get("scaleLimit");
      viewCoordSys.setBoundingRect(min[0], min[1], bbWidth, bbHeight);
      viewCoordSys.setViewRect(viewRect.x, viewRect.y, viewWidth, viewHeight);
      viewCoordSys.setCenter(seriesModel.get("center"), api);
      viewCoordSys.setZoom(seriesModel.get("zoom"));
      viewList.push(viewCoordSys);
    }
  });
  return viewList;
}

// node_modules/echarts/lib/chart/helper/labelHelper.js
function getDefaultLabel(data, dataIndex) {
  var labelDims = data.mapDimensionsAll("defaultedLabel");
  var len2 = labelDims.length;
  if (len2 === 1) {
    var rawVal = retrieveRawValue(data, dataIndex, labelDims[0]);
    return rawVal != null ? rawVal + "" : null;
  } else if (len2) {
    var vals = [];
    for (var i = 0; i < labelDims.length; i++) {
      vals.push(retrieveRawValue(data, dataIndex, labelDims[i]));
    }
    return vals.join(" ");
  }
}

// node_modules/echarts/lib/chart/helper/Symbol.js
var Symbol = (
  /** @class */
  function(_super) {
    __extends(Symbol2, _super);
    function Symbol2(data, idx, seriesScope, opts) {
      var _this = _super.call(this) || this;
      _this.updateData(data, idx, seriesScope, opts);
      return _this;
    }
    Symbol2.prototype._createSymbol = function(symbolType, data, idx, symbolSize, keepAspect) {
      this.removeAll();
      var symbolPath = createSymbol(symbolType, -1, -1, 2, 2, null, keepAspect);
      symbolPath.attr({
        z2: 100,
        culling: true,
        scaleX: symbolSize[0] / 2,
        scaleY: symbolSize[1] / 2
      });
      symbolPath.drift = driftSymbol;
      this._symbolType = symbolType;
      this.add(symbolPath);
    };
    Symbol2.prototype.stopSymbolAnimation = function(toLastFrame) {
      this.childAt(0).stopAnimation(null, toLastFrame);
    };
    Symbol2.prototype.getSymbolType = function() {
      return this._symbolType;
    };
    Symbol2.prototype.getSymbolPath = function() {
      return this.childAt(0);
    };
    Symbol2.prototype.highlight = function() {
      enterEmphasis(this.childAt(0));
    };
    Symbol2.prototype.downplay = function() {
      leaveEmphasis(this.childAt(0));
    };
    Symbol2.prototype.setZ = function(zlevel, z) {
      var symbolPath = this.childAt(0);
      symbolPath.zlevel = zlevel;
      symbolPath.z = z;
    };
    Symbol2.prototype.setDraggable = function(draggable, hasCursorOption) {
      var symbolPath = this.childAt(0);
      symbolPath.draggable = draggable;
      symbolPath.cursor = !hasCursorOption && draggable ? "move" : symbolPath.cursor;
    };
    Symbol2.prototype.updateData = function(data, idx, seriesScope, opts) {
      this.silent = false;
      var symbolType = data.getItemVisual(idx, "symbol") || "circle";
      var seriesModel = data.hostModel;
      var symbolSize = Symbol2.getSymbolSize(data, idx);
      var isInit = symbolType !== this._symbolType;
      var disableAnimation = opts && opts.disableAnimation;
      if (isInit) {
        var keepAspect = data.getItemVisual(idx, "symbolKeepAspect");
        this._createSymbol(symbolType, data, idx, symbolSize, keepAspect);
      } else {
        var symbolPath = this.childAt(0);
        symbolPath.silent = false;
        var target = {
          scaleX: symbolSize[0] / 2,
          scaleY: symbolSize[1] / 2
        };
        disableAnimation ? symbolPath.attr(target) : updateProps(symbolPath, target, seriesModel, idx);
        saveOldStyle(symbolPath);
      }
      this._updateCommon(data, idx, symbolSize, seriesScope, opts);
      if (isInit) {
        var symbolPath = this.childAt(0);
        if (!disableAnimation) {
          var target = {
            scaleX: this._sizeX,
            scaleY: this._sizeY,
            style: {
              // Always fadeIn. Because it has fadeOut animation when symbol is removed..
              opacity: symbolPath.style.opacity
            }
          };
          symbolPath.scaleX = symbolPath.scaleY = 0;
          symbolPath.style.opacity = 0;
          initProps(symbolPath, target, seriesModel, idx);
        }
      }
      if (disableAnimation) {
        this.childAt(0).stopAnimation("leave");
      }
    };
    Symbol2.prototype._updateCommon = function(data, idx, symbolSize, seriesScope, opts) {
      var symbolPath = this.childAt(0);
      var seriesModel = data.hostModel;
      var emphasisItemStyle;
      var blurItemStyle;
      var selectItemStyle;
      var focus;
      var blurScope;
      var emphasisDisabled;
      var labelStatesModels;
      var hoverScale;
      var cursorStyle;
      if (seriesScope) {
        emphasisItemStyle = seriesScope.emphasisItemStyle;
        blurItemStyle = seriesScope.blurItemStyle;
        selectItemStyle = seriesScope.selectItemStyle;
        focus = seriesScope.focus;
        blurScope = seriesScope.blurScope;
        labelStatesModels = seriesScope.labelStatesModels;
        hoverScale = seriesScope.hoverScale;
        cursorStyle = seriesScope.cursorStyle;
        emphasisDisabled = seriesScope.emphasisDisabled;
      }
      if (!seriesScope || data.hasItemOption) {
        var itemModel = seriesScope && seriesScope.itemModel ? seriesScope.itemModel : data.getItemModel(idx);
        var emphasisModel = itemModel.getModel("emphasis");
        emphasisItemStyle = emphasisModel.getModel("itemStyle").getItemStyle();
        selectItemStyle = itemModel.getModel(["select", "itemStyle"]).getItemStyle();
        blurItemStyle = itemModel.getModel(["blur", "itemStyle"]).getItemStyle();
        focus = emphasisModel.get("focus");
        blurScope = emphasisModel.get("blurScope");
        emphasisDisabled = emphasisModel.get("disabled");
        labelStatesModels = getLabelStatesModels(itemModel);
        hoverScale = emphasisModel.getShallow("scale");
        cursorStyle = itemModel.getShallow("cursor");
      }
      var symbolRotate = data.getItemVisual(idx, "symbolRotate");
      symbolPath.attr("rotation", (symbolRotate || 0) * Math.PI / 180 || 0);
      var symbolOffset = normalizeSymbolOffset(data.getItemVisual(idx, "symbolOffset"), symbolSize);
      if (symbolOffset) {
        symbolPath.x = symbolOffset[0];
        symbolPath.y = symbolOffset[1];
      }
      cursorStyle && symbolPath.attr("cursor", cursorStyle);
      var symbolStyle = data.getItemVisual(idx, "style");
      var visualColor = symbolStyle.fill;
      if (symbolPath instanceof Image_default) {
        var pathStyle = symbolPath.style;
        symbolPath.useStyle(extend({
          // TODO other properties like x, y ?
          image: pathStyle.image,
          x: pathStyle.x,
          y: pathStyle.y,
          width: pathStyle.width,
          height: pathStyle.height
        }, symbolStyle));
      } else {
        if (symbolPath.__isEmptyBrush) {
          symbolPath.useStyle(extend({}, symbolStyle));
        } else {
          symbolPath.useStyle(symbolStyle);
        }
        symbolPath.style.decal = null;
        symbolPath.setColor(visualColor, opts && opts.symbolInnerColor);
        symbolPath.style.strokeNoScale = true;
      }
      var liftZ = data.getItemVisual(idx, "liftZ");
      var z2Origin = this._z2;
      if (liftZ != null) {
        if (z2Origin == null) {
          this._z2 = symbolPath.z2;
          symbolPath.z2 += liftZ;
        }
      } else if (z2Origin != null) {
        symbolPath.z2 = z2Origin;
        this._z2 = null;
      }
      var useNameLabel = opts && opts.useNameLabel;
      setLabelStyle(symbolPath, labelStatesModels, {
        labelFetcher: seriesModel,
        labelDataIndex: idx,
        defaultText: getLabelDefaultText,
        inheritColor: visualColor,
        defaultOpacity: symbolStyle.opacity
      });
      function getLabelDefaultText(idx2) {
        return useNameLabel ? data.getName(idx2) : getDefaultLabel(data, idx2);
      }
      this._sizeX = symbolSize[0] / 2;
      this._sizeY = symbolSize[1] / 2;
      var emphasisState = symbolPath.ensureState("emphasis");
      emphasisState.style = emphasisItemStyle;
      symbolPath.ensureState("select").style = selectItemStyle;
      symbolPath.ensureState("blur").style = blurItemStyle;
      var scaleRatio = hoverScale == null || hoverScale === true ? Math.max(1.1, 3 / this._sizeY) : isFinite(hoverScale) && hoverScale > 0 ? +hoverScale : 1;
      emphasisState.scaleX = this._sizeX * scaleRatio;
      emphasisState.scaleY = this._sizeY * scaleRatio;
      this.setSymbolScale(1);
      toggleHoverEmphasis(this, focus, blurScope, emphasisDisabled);
    };
    Symbol2.prototype.setSymbolScale = function(scale2) {
      this.scaleX = this.scaleY = scale2;
    };
    Symbol2.prototype.fadeOut = function(cb, seriesModel, opt) {
      var symbolPath = this.childAt(0);
      var dataIndex = getECData(this).dataIndex;
      var animationOpt = opt && opt.animation;
      this.silent = symbolPath.silent = true;
      if (opt && opt.fadeLabel) {
        var textContent = symbolPath.getTextContent();
        if (textContent) {
          removeElement(textContent, {
            style: {
              opacity: 0
            }
          }, seriesModel, {
            dataIndex,
            removeOpt: animationOpt,
            cb: function() {
              symbolPath.removeTextContent();
            }
          });
        }
      } else {
        symbolPath.removeTextContent();
      }
      removeElement(symbolPath, {
        style: {
          opacity: 0
        },
        scaleX: 0,
        scaleY: 0
      }, seriesModel, {
        dataIndex,
        cb,
        removeOpt: animationOpt
      });
    };
    Symbol2.getSymbolSize = function(data, idx) {
      return normalizeSymbolSize(data.getItemVisual(idx, "symbolSize"));
    };
    return Symbol2;
  }(Group_default)
);
function driftSymbol(dx, dy) {
  this.parent.drift(dx, dy);
}
var Symbol_default = Symbol;

// node_modules/echarts/lib/chart/helper/SymbolDraw.js
function symbolNeedsDraw(data, point, idx, opt) {
  return point && !isNaN(point[0]) && !isNaN(point[1]) && !(opt.isIgnore && opt.isIgnore(idx)) && !(opt.clipShape && !opt.clipShape.contain(point[0], point[1])) && data.getItemVisual(idx, "symbol") !== "none";
}
function normalizeUpdateOpt(opt) {
  if (opt != null && !isObject(opt)) {
    opt = {
      isIgnore: opt
    };
  }
  return opt || {};
}
function makeSeriesScope(data) {
  var seriesModel = data.hostModel;
  var emphasisModel = seriesModel.getModel("emphasis");
  return {
    emphasisItemStyle: emphasisModel.getModel("itemStyle").getItemStyle(),
    blurItemStyle: seriesModel.getModel(["blur", "itemStyle"]).getItemStyle(),
    selectItemStyle: seriesModel.getModel(["select", "itemStyle"]).getItemStyle(),
    focus: emphasisModel.get("focus"),
    blurScope: emphasisModel.get("blurScope"),
    emphasisDisabled: emphasisModel.get("disabled"),
    hoverScale: emphasisModel.get("scale"),
    labelStatesModels: getLabelStatesModels(seriesModel),
    cursorStyle: seriesModel.get("cursor")
  };
}
var SymbolDraw = (
  /** @class */
  function() {
    function SymbolDraw2(SymbolCtor) {
      this.group = new Group_default();
      this._SymbolCtor = SymbolCtor || Symbol_default;
    }
    SymbolDraw2.prototype.updateData = function(data, opt) {
      this._progressiveEls = null;
      opt = normalizeUpdateOpt(opt);
      var group = this.group;
      var seriesModel = data.hostModel;
      var oldData = this._data;
      var SymbolCtor = this._SymbolCtor;
      var disableAnimation = opt.disableAnimation;
      var seriesScope = makeSeriesScope(data);
      var symbolUpdateOpt = {
        disableAnimation
      };
      var getSymbolPoint = opt.getSymbolPoint || function(idx) {
        return data.getItemLayout(idx);
      };
      if (!oldData) {
        group.removeAll();
      }
      data.diff(oldData).add(function(newIdx) {
        var point = getSymbolPoint(newIdx);
        if (symbolNeedsDraw(data, point, newIdx, opt)) {
          var symbolEl = new SymbolCtor(data, newIdx, seriesScope, symbolUpdateOpt);
          symbolEl.setPosition(point);
          data.setItemGraphicEl(newIdx, symbolEl);
          group.add(symbolEl);
        }
      }).update(function(newIdx, oldIdx) {
        var symbolEl = oldData.getItemGraphicEl(oldIdx);
        var point = getSymbolPoint(newIdx);
        if (!symbolNeedsDraw(data, point, newIdx, opt)) {
          group.remove(symbolEl);
          return;
        }
        var newSymbolType = data.getItemVisual(newIdx, "symbol") || "circle";
        var oldSymbolType = symbolEl && symbolEl.getSymbolType && symbolEl.getSymbolType();
        if (!symbolEl || oldSymbolType && oldSymbolType !== newSymbolType) {
          group.remove(symbolEl);
          symbolEl = new SymbolCtor(data, newIdx, seriesScope, symbolUpdateOpt);
          symbolEl.setPosition(point);
        } else {
          symbolEl.updateData(data, newIdx, seriesScope, symbolUpdateOpt);
          var target = {
            x: point[0],
            y: point[1]
          };
          disableAnimation ? symbolEl.attr(target) : updateProps(symbolEl, target, seriesModel);
        }
        group.add(symbolEl);
        data.setItemGraphicEl(newIdx, symbolEl);
      }).remove(function(oldIdx) {
        var el = oldData.getItemGraphicEl(oldIdx);
        el && el.fadeOut(function() {
          group.remove(el);
        }, seriesModel);
      }).execute();
      this._getSymbolPoint = getSymbolPoint;
      this._data = data;
    };
    ;
    SymbolDraw2.prototype.updateLayout = function() {
      var _this = this;
      var data = this._data;
      if (data) {
        data.eachItemGraphicEl(function(el, idx) {
          var point = _this._getSymbolPoint(idx);
          el.setPosition(point);
          el.markRedraw();
        });
      }
    };
    ;
    SymbolDraw2.prototype.incrementalPrepareUpdate = function(data) {
      this._seriesScope = makeSeriesScope(data);
      this._data = null;
      this.group.removeAll();
    };
    ;
    SymbolDraw2.prototype.incrementalUpdate = function(taskParams, data, opt) {
      this._progressiveEls = [];
      opt = normalizeUpdateOpt(opt);
      function updateIncrementalAndHover(el2) {
        if (!el2.isGroup) {
          el2.incremental = true;
          el2.ensureState("emphasis").hoverLayer = true;
        }
      }
      for (var idx = taskParams.start; idx < taskParams.end; idx++) {
        var point = data.getItemLayout(idx);
        if (symbolNeedsDraw(data, point, idx, opt)) {
          var el = new this._SymbolCtor(data, idx, this._seriesScope);
          el.traverse(updateIncrementalAndHover);
          el.setPosition(point);
          this.group.add(el);
          data.setItemGraphicEl(idx, el);
          this._progressiveEls.push(el);
        }
      }
    };
    ;
    SymbolDraw2.prototype.eachRendered = function(cb) {
      traverseElements(this._progressiveEls || this.group, cb);
    };
    SymbolDraw2.prototype.remove = function(enableAnimation) {
      var group = this.group;
      var data = this._data;
      if (data && enableAnimation) {
        data.eachItemGraphicEl(function(el) {
          el.fadeOut(function() {
            group.remove(el);
          }, data.hostModel);
        });
      } else {
        group.removeAll();
      }
    };
    ;
    return SymbolDraw2;
  }()
);
var SymbolDraw_default = SymbolDraw;

// node_modules/echarts/lib/chart/helper/LinePath.js
var straightLineProto = Line_default.prototype;
var bezierCurveProto = BezierCurve_default.prototype;
var StraightLineShape = (
  /** @class */
  /* @__PURE__ */ function() {
    function StraightLineShape2() {
      this.x1 = 0;
      this.y1 = 0;
      this.x2 = 0;
      this.y2 = 0;
      this.percent = 1;
    }
    return StraightLineShape2;
  }()
);
var CurveShape = (
  /** @class */
  function(_super) {
    __extends(CurveShape2, _super);
    function CurveShape2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    return CurveShape2;
  }(StraightLineShape)
);
function isStraightLine(shape) {
  return isNaN(+shape.cpx1) || isNaN(+shape.cpy1);
}
var ECLinePath = (
  /** @class */
  function(_super) {
    __extends(ECLinePath2, _super);
    function ECLinePath2(opts) {
      var _this = _super.call(this, opts) || this;
      _this.type = "ec-line";
      return _this;
    }
    ECLinePath2.prototype.getDefaultStyle = function() {
      return {
        stroke: "#000",
        fill: null
      };
    };
    ECLinePath2.prototype.getDefaultShape = function() {
      return new StraightLineShape();
    };
    ECLinePath2.prototype.buildPath = function(ctx, shape) {
      if (isStraightLine(shape)) {
        straightLineProto.buildPath.call(this, ctx, shape);
      } else {
        bezierCurveProto.buildPath.call(this, ctx, shape);
      }
    };
    ECLinePath2.prototype.pointAt = function(t) {
      if (isStraightLine(this.shape)) {
        return straightLineProto.pointAt.call(this, t);
      } else {
        return bezierCurveProto.pointAt.call(this, t);
      }
    };
    ECLinePath2.prototype.tangentAt = function(t) {
      var shape = this.shape;
      var p = isStraightLine(shape) ? [shape.x2 - shape.x1, shape.y2 - shape.y1] : bezierCurveProto.tangentAt.call(this, t);
      return normalize(p, p);
    };
    return ECLinePath2;
  }(Path_default)
);
var LinePath_default = ECLinePath;

// node_modules/echarts/lib/chart/helper/Line.js
var SYMBOL_CATEGORIES = ["fromSymbol", "toSymbol"];
function makeSymbolTypeKey(symbolCategory) {
  return "_" + symbolCategory + "Type";
}
function makeSymbolTypeValue(name, lineData, idx) {
  var symbolType = lineData.getItemVisual(idx, name);
  if (!symbolType || symbolType === "none") {
    return symbolType;
  }
  var symbolSize = lineData.getItemVisual(idx, name + "Size");
  var symbolRotate = lineData.getItemVisual(idx, name + "Rotate");
  var symbolOffset = lineData.getItemVisual(idx, name + "Offset");
  var symbolKeepAspect = lineData.getItemVisual(idx, name + "KeepAspect");
  var symbolSizeArr = normalizeSymbolSize(symbolSize);
  var symbolOffsetArr = normalizeSymbolOffset(symbolOffset || 0, symbolSizeArr);
  return symbolType + symbolSizeArr + symbolOffsetArr + (symbolRotate || "") + (symbolKeepAspect || "");
}
function createSymbol2(name, lineData, idx) {
  var symbolType = lineData.getItemVisual(idx, name);
  if (!symbolType || symbolType === "none") {
    return;
  }
  var symbolSize = lineData.getItemVisual(idx, name + "Size");
  var symbolRotate = lineData.getItemVisual(idx, name + "Rotate");
  var symbolOffset = lineData.getItemVisual(idx, name + "Offset");
  var symbolKeepAspect = lineData.getItemVisual(idx, name + "KeepAspect");
  var symbolSizeArr = normalizeSymbolSize(symbolSize);
  var symbolOffsetArr = normalizeSymbolOffset(symbolOffset || 0, symbolSizeArr);
  var symbolPath = createSymbol(symbolType, -symbolSizeArr[0] / 2 + symbolOffsetArr[0], -symbolSizeArr[1] / 2 + symbolOffsetArr[1], symbolSizeArr[0], symbolSizeArr[1], null, symbolKeepAspect);
  symbolPath.__specifiedRotation = symbolRotate == null || isNaN(symbolRotate) ? void 0 : +symbolRotate * Math.PI / 180 || 0;
  symbolPath.name = name;
  return symbolPath;
}
function createLine(points) {
  var line = new LinePath_default({
    name: "line",
    subPixelOptimize: true
  });
  setLinePoints(line.shape, points);
  return line;
}
function setLinePoints(targetShape, points) {
  targetShape.x1 = points[0][0];
  targetShape.y1 = points[0][1];
  targetShape.x2 = points[1][0];
  targetShape.y2 = points[1][1];
  targetShape.percent = 1;
  var cp1 = points[2];
  if (cp1) {
    targetShape.cpx1 = cp1[0];
    targetShape.cpy1 = cp1[1];
  } else {
    targetShape.cpx1 = NaN;
    targetShape.cpy1 = NaN;
  }
}
var Line = (
  /** @class */
  function(_super) {
    __extends(Line2, _super);
    function Line2(lineData, idx, seriesScope) {
      var _this = _super.call(this) || this;
      _this._createLine(lineData, idx, seriesScope);
      return _this;
    }
    Line2.prototype._createLine = function(lineData, idx, seriesScope) {
      var seriesModel = lineData.hostModel;
      var linePoints = lineData.getItemLayout(idx);
      var line = createLine(linePoints);
      line.shape.percent = 0;
      initProps(line, {
        shape: {
          percent: 1
        }
      }, seriesModel, idx);
      this.add(line);
      each(SYMBOL_CATEGORIES, function(symbolCategory) {
        var symbol = createSymbol2(symbolCategory, lineData, idx);
        this.add(symbol);
        this[makeSymbolTypeKey(symbolCategory)] = makeSymbolTypeValue(symbolCategory, lineData, idx);
      }, this);
      this._updateCommonStl(lineData, idx, seriesScope);
    };
    Line2.prototype.updateData = function(lineData, idx, seriesScope) {
      var seriesModel = lineData.hostModel;
      var line = this.childOfName("line");
      var linePoints = lineData.getItemLayout(idx);
      var target = {
        shape: {}
      };
      setLinePoints(target.shape, linePoints);
      updateProps(line, target, seriesModel, idx);
      each(SYMBOL_CATEGORIES, function(symbolCategory) {
        var symbolType = makeSymbolTypeValue(symbolCategory, lineData, idx);
        var key = makeSymbolTypeKey(symbolCategory);
        if (this[key] !== symbolType) {
          this.remove(this.childOfName(symbolCategory));
          var symbol = createSymbol2(symbolCategory, lineData, idx);
          this.add(symbol);
        }
        this[key] = symbolType;
      }, this);
      this._updateCommonStl(lineData, idx, seriesScope);
    };
    ;
    Line2.prototype.getLinePath = function() {
      return this.childAt(0);
    };
    Line2.prototype._updateCommonStl = function(lineData, idx, seriesScope) {
      var seriesModel = lineData.hostModel;
      var line = this.childOfName("line");
      var emphasisLineStyle = seriesScope && seriesScope.emphasisLineStyle;
      var blurLineStyle = seriesScope && seriesScope.blurLineStyle;
      var selectLineStyle = seriesScope && seriesScope.selectLineStyle;
      var labelStatesModels = seriesScope && seriesScope.labelStatesModels;
      var emphasisDisabled = seriesScope && seriesScope.emphasisDisabled;
      var focus = seriesScope && seriesScope.focus;
      var blurScope = seriesScope && seriesScope.blurScope;
      if (!seriesScope || lineData.hasItemOption) {
        var itemModel = lineData.getItemModel(idx);
        var emphasisModel = itemModel.getModel("emphasis");
        emphasisLineStyle = emphasisModel.getModel("lineStyle").getLineStyle();
        blurLineStyle = itemModel.getModel(["blur", "lineStyle"]).getLineStyle();
        selectLineStyle = itemModel.getModel(["select", "lineStyle"]).getLineStyle();
        emphasisDisabled = emphasisModel.get("disabled");
        focus = emphasisModel.get("focus");
        blurScope = emphasisModel.get("blurScope");
        labelStatesModels = getLabelStatesModels(itemModel);
      }
      var lineStyle = lineData.getItemVisual(idx, "style");
      var visualColor = lineStyle.stroke;
      line.useStyle(lineStyle);
      line.style.fill = null;
      line.style.strokeNoScale = true;
      line.ensureState("emphasis").style = emphasisLineStyle;
      line.ensureState("blur").style = blurLineStyle;
      line.ensureState("select").style = selectLineStyle;
      each(SYMBOL_CATEGORIES, function(symbolCategory) {
        var symbol = this.childOfName(symbolCategory);
        if (symbol) {
          symbol.setColor(visualColor);
          symbol.style.opacity = lineStyle.opacity;
          for (var i = 0; i < SPECIAL_STATES.length; i++) {
            var stateName = SPECIAL_STATES[i];
            var lineState = line.getState(stateName);
            if (lineState) {
              var lineStateStyle = lineState.style || {};
              var state = symbol.ensureState(stateName);
              var stateStyle = state.style || (state.style = {});
              if (lineStateStyle.stroke != null) {
                stateStyle[symbol.__isEmptyBrush ? "stroke" : "fill"] = lineStateStyle.stroke;
              }
              if (lineStateStyle.opacity != null) {
                stateStyle.opacity = lineStateStyle.opacity;
              }
            }
          }
          symbol.markRedraw();
        }
      }, this);
      var rawVal = seriesModel.getRawValue(idx);
      setLabelStyle(this, labelStatesModels, {
        labelDataIndex: idx,
        labelFetcher: {
          getFormattedLabel: function(dataIndex, stateName) {
            return seriesModel.getFormattedLabel(dataIndex, stateName, lineData.dataType);
          }
        },
        inheritColor: visualColor || "#000",
        defaultOpacity: lineStyle.opacity,
        defaultText: (rawVal == null ? lineData.getName(idx) : isFinite(rawVal) ? round(rawVal) : rawVal) + ""
      });
      var label = this.getTextContent();
      if (label) {
        var labelNormalModel = labelStatesModels.normal;
        label.__align = label.style.align;
        label.__verticalAlign = label.style.verticalAlign;
        label.__position = labelNormalModel.get("position") || "middle";
        var distance = labelNormalModel.get("distance");
        if (!isArray(distance)) {
          distance = [distance, distance];
        }
        label.__labelDistance = distance;
      }
      this.setTextConfig({
        position: null,
        local: true,
        inside: false
        // Can't be inside for stroke element.
      });
      toggleHoverEmphasis(this, focus, blurScope, emphasisDisabled);
    };
    Line2.prototype.highlight = function() {
      enterEmphasis(this);
    };
    Line2.prototype.downplay = function() {
      leaveEmphasis(this);
    };
    Line2.prototype.updateLayout = function(lineData, idx) {
      this.setLinePoints(lineData.getItemLayout(idx));
    };
    Line2.prototype.setLinePoints = function(points) {
      var linePath = this.childOfName("line");
      setLinePoints(linePath.shape, points);
      linePath.dirty();
    };
    Line2.prototype.beforeUpdate = function() {
      var lineGroup = this;
      var symbolFrom = lineGroup.childOfName("fromSymbol");
      var symbolTo = lineGroup.childOfName("toSymbol");
      var label = lineGroup.getTextContent();
      if (!symbolFrom && !symbolTo && (!label || label.ignore)) {
        return;
      }
      var invScale = 1;
      var parentNode = this.parent;
      while (parentNode) {
        if (parentNode.scaleX) {
          invScale /= parentNode.scaleX;
        }
        parentNode = parentNode.parent;
      }
      var line = lineGroup.childOfName("line");
      if (!this.__dirty && !line.__dirty) {
        return;
      }
      var percent = line.shape.percent;
      var fromPos = line.pointAt(0);
      var toPos = line.pointAt(percent);
      var d = sub([], toPos, fromPos);
      normalize(d, d);
      function setSymbolRotation(symbol, percent2) {
        var specifiedRotation = symbol.__specifiedRotation;
        if (specifiedRotation == null) {
          var tangent2 = line.tangentAt(percent2);
          symbol.attr("rotation", (percent2 === 1 ? -1 : 1) * Math.PI / 2 - Math.atan2(tangent2[1], tangent2[0]));
        } else {
          symbol.attr("rotation", specifiedRotation);
        }
      }
      if (symbolFrom) {
        symbolFrom.setPosition(fromPos);
        setSymbolRotation(symbolFrom, 0);
        symbolFrom.scaleX = symbolFrom.scaleY = invScale * percent;
        symbolFrom.markRedraw();
      }
      if (symbolTo) {
        symbolTo.setPosition(toPos);
        setSymbolRotation(symbolTo, 1);
        symbolTo.scaleX = symbolTo.scaleY = invScale * percent;
        symbolTo.markRedraw();
      }
      if (label && !label.ignore) {
        label.x = label.y = 0;
        label.originX = label.originY = 0;
        var textAlign = void 0;
        var textVerticalAlign = void 0;
        var distance = label.__labelDistance;
        var distanceX = distance[0] * invScale;
        var distanceY = distance[1] * invScale;
        var halfPercent = percent / 2;
        var tangent = line.tangentAt(halfPercent);
        var n = [tangent[1], -tangent[0]];
        var cp = line.pointAt(halfPercent);
        if (n[1] > 0) {
          n[0] = -n[0];
          n[1] = -n[1];
        }
        var dir = tangent[0] < 0 ? -1 : 1;
        if (label.__position !== "start" && label.__position !== "end") {
          var rotation = -Math.atan2(tangent[1], tangent[0]);
          if (toPos[0] < fromPos[0]) {
            rotation = Math.PI + rotation;
          }
          label.rotation = rotation;
        }
        var dy = void 0;
        switch (label.__position) {
          case "insideStartTop":
          case "insideMiddleTop":
          case "insideEndTop":
          case "middle":
            dy = -distanceY;
            textVerticalAlign = "bottom";
            break;
          case "insideStartBottom":
          case "insideMiddleBottom":
          case "insideEndBottom":
            dy = distanceY;
            textVerticalAlign = "top";
            break;
          default:
            dy = 0;
            textVerticalAlign = "middle";
        }
        switch (label.__position) {
          case "end":
            label.x = d[0] * distanceX + toPos[0];
            label.y = d[1] * distanceY + toPos[1];
            textAlign = d[0] > 0.8 ? "left" : d[0] < -0.8 ? "right" : "center";
            textVerticalAlign = d[1] > 0.8 ? "top" : d[1] < -0.8 ? "bottom" : "middle";
            break;
          case "start":
            label.x = -d[0] * distanceX + fromPos[0];
            label.y = -d[1] * distanceY + fromPos[1];
            textAlign = d[0] > 0.8 ? "right" : d[0] < -0.8 ? "left" : "center";
            textVerticalAlign = d[1] > 0.8 ? "bottom" : d[1] < -0.8 ? "top" : "middle";
            break;
          case "insideStartTop":
          case "insideStart":
          case "insideStartBottom":
            label.x = distanceX * dir + fromPos[0];
            label.y = fromPos[1] + dy;
            textAlign = tangent[0] < 0 ? "right" : "left";
            label.originX = -distanceX * dir;
            label.originY = -dy;
            break;
          case "insideMiddleTop":
          case "insideMiddle":
          case "insideMiddleBottom":
          case "middle":
            label.x = cp[0];
            label.y = cp[1] + dy;
            textAlign = "center";
            label.originY = -dy;
            break;
          case "insideEndTop":
          case "insideEnd":
          case "insideEndBottom":
            label.x = -distanceX * dir + toPos[0];
            label.y = toPos[1] + dy;
            textAlign = tangent[0] >= 0 ? "right" : "left";
            label.originX = distanceX * dir;
            label.originY = -dy;
            break;
        }
        label.scaleX = label.scaleY = invScale;
        label.setStyle({
          // Use the user specified text align and baseline first
          verticalAlign: label.__verticalAlign || textVerticalAlign,
          align: label.__align || textAlign
        });
      }
    };
    return Line2;
  }(Group_default)
);
var Line_default2 = Line;

// node_modules/echarts/lib/chart/helper/LineDraw.js
var LineDraw = (
  /** @class */
  function() {
    function LineDraw2(LineCtor) {
      this.group = new Group_default();
      this._LineCtor = LineCtor || Line_default2;
    }
    LineDraw2.prototype.updateData = function(lineData) {
      var _this = this;
      this._progressiveEls = null;
      var lineDraw = this;
      var group = lineDraw.group;
      var oldLineData = lineDraw._lineData;
      lineDraw._lineData = lineData;
      if (!oldLineData) {
        group.removeAll();
      }
      var seriesScope = makeSeriesScope2(lineData);
      lineData.diff(oldLineData).add(function(idx) {
        _this._doAdd(lineData, idx, seriesScope);
      }).update(function(newIdx, oldIdx) {
        _this._doUpdate(oldLineData, lineData, oldIdx, newIdx, seriesScope);
      }).remove(function(idx) {
        group.remove(oldLineData.getItemGraphicEl(idx));
      }).execute();
    };
    ;
    LineDraw2.prototype.updateLayout = function() {
      var lineData = this._lineData;
      if (!lineData) {
        return;
      }
      lineData.eachItemGraphicEl(function(el, idx) {
        el.updateLayout(lineData, idx);
      }, this);
    };
    ;
    LineDraw2.prototype.incrementalPrepareUpdate = function(lineData) {
      this._seriesScope = makeSeriesScope2(lineData);
      this._lineData = null;
      this.group.removeAll();
    };
    ;
    LineDraw2.prototype.incrementalUpdate = function(taskParams, lineData) {
      this._progressiveEls = [];
      function updateIncrementalAndHover(el2) {
        if (!el2.isGroup && !isEffectObject(el2)) {
          el2.incremental = true;
          el2.ensureState("emphasis").hoverLayer = true;
        }
      }
      for (var idx = taskParams.start; idx < taskParams.end; idx++) {
        var itemLayout = lineData.getItemLayout(idx);
        if (lineNeedsDraw(itemLayout)) {
          var el = new this._LineCtor(lineData, idx, this._seriesScope);
          el.traverse(updateIncrementalAndHover);
          this.group.add(el);
          lineData.setItemGraphicEl(idx, el);
          this._progressiveEls.push(el);
        }
      }
    };
    ;
    LineDraw2.prototype.remove = function() {
      this.group.removeAll();
    };
    ;
    LineDraw2.prototype.eachRendered = function(cb) {
      traverseElements(this._progressiveEls || this.group, cb);
    };
    LineDraw2.prototype._doAdd = function(lineData, idx, seriesScope) {
      var itemLayout = lineData.getItemLayout(idx);
      if (!lineNeedsDraw(itemLayout)) {
        return;
      }
      var el = new this._LineCtor(lineData, idx, seriesScope);
      lineData.setItemGraphicEl(idx, el);
      this.group.add(el);
    };
    LineDraw2.prototype._doUpdate = function(oldLineData, newLineData, oldIdx, newIdx, seriesScope) {
      var itemEl = oldLineData.getItemGraphicEl(oldIdx);
      if (!lineNeedsDraw(newLineData.getItemLayout(newIdx))) {
        this.group.remove(itemEl);
        return;
      }
      if (!itemEl) {
        itemEl = new this._LineCtor(newLineData, newIdx, seriesScope);
      } else {
        itemEl.updateData(newLineData, newIdx, seriesScope);
      }
      newLineData.setItemGraphicEl(newIdx, itemEl);
      this.group.add(itemEl);
    };
    return LineDraw2;
  }()
);
function isEffectObject(el) {
  return el.animators && el.animators.length > 0;
}
function makeSeriesScope2(lineData) {
  var hostModel = lineData.hostModel;
  var emphasisModel = hostModel.getModel("emphasis");
  return {
    lineStyle: hostModel.getModel("lineStyle").getLineStyle(),
    emphasisLineStyle: emphasisModel.getModel(["lineStyle"]).getLineStyle(),
    blurLineStyle: hostModel.getModel(["blur", "lineStyle"]).getLineStyle(),
    selectLineStyle: hostModel.getModel(["select", "lineStyle"]).getLineStyle(),
    emphasisDisabled: emphasisModel.get("disabled"),
    blurScope: emphasisModel.get("blurScope"),
    focus: emphasisModel.get("focus"),
    labelStatesModels: getLabelStatesModels(hostModel)
  };
}
function isPointNaN(pt) {
  return isNaN(pt[0]) || isNaN(pt[1]);
}
function lineNeedsDraw(pts) {
  return pts && !isPointNaN(pts[0]) && !isPointNaN(pts[1]);
}
var LineDraw_default = LineDraw;

// node_modules/echarts/lib/component/helper/interactionMutex.js
var ATTR = "\0_ec_interaction_mutex";
function isTaken(zr, resourceKey) {
  return !!getStore(zr)[resourceKey];
}
function getStore(zr) {
  return zr[ATTR] || (zr[ATTR] = {});
}
registerAction({
  type: "takeGlobalCursor",
  event: "globalCursorTaken",
  update: "update"
}, noop);

// node_modules/echarts/lib/component/helper/RoamController.js
var RoamController = (
  /** @class */
  function(_super) {
    __extends(RoamController2, _super);
    function RoamController2(zr) {
      var _this = _super.call(this) || this;
      _this._zr = zr;
      var mousedownHandler = bind(_this._mousedownHandler, _this);
      var mousemoveHandler = bind(_this._mousemoveHandler, _this);
      var mouseupHandler = bind(_this._mouseupHandler, _this);
      var mousewheelHandler = bind(_this._mousewheelHandler, _this);
      var pinchHandler = bind(_this._pinchHandler, _this);
      _this.enable = function(controlType, opt) {
        this.disable();
        this._opt = defaults(clone(opt) || {}, {
          zoomOnMouseWheel: true,
          moveOnMouseMove: true,
          // By default, wheel do not trigger move.
          moveOnMouseWheel: false,
          preventDefaultMouseMove: true
        });
        if (controlType == null) {
          controlType = true;
        }
        if (controlType === true || controlType === "move" || controlType === "pan") {
          zr.on("mousedown", mousedownHandler);
          zr.on("mousemove", mousemoveHandler);
          zr.on("mouseup", mouseupHandler);
        }
        if (controlType === true || controlType === "scale" || controlType === "zoom") {
          zr.on("mousewheel", mousewheelHandler);
          zr.on("pinch", pinchHandler);
        }
      };
      _this.disable = function() {
        zr.off("mousedown", mousedownHandler);
        zr.off("mousemove", mousemoveHandler);
        zr.off("mouseup", mouseupHandler);
        zr.off("mousewheel", mousewheelHandler);
        zr.off("pinch", pinchHandler);
      };
      return _this;
    }
    RoamController2.prototype.isDragging = function() {
      return this._dragging;
    };
    RoamController2.prototype.isPinching = function() {
      return this._pinching;
    };
    RoamController2.prototype.setPointerChecker = function(pointerChecker) {
      this.pointerChecker = pointerChecker;
    };
    RoamController2.prototype.dispose = function() {
      this.disable();
    };
    RoamController2.prototype._mousedownHandler = function(e) {
      if (isMiddleOrRightButtonOnMouseUpDown(e)) {
        return;
      }
      var el = e.target;
      while (el) {
        if (el.draggable) {
          return;
        }
        el = el.__hostTarget || el.parent;
      }
      var x = e.offsetX;
      var y = e.offsetY;
      if (this.pointerChecker && this.pointerChecker(e, x, y)) {
        this._x = x;
        this._y = y;
        this._dragging = true;
      }
    };
    RoamController2.prototype._mousemoveHandler = function(e) {
      if (!this._dragging || !isAvailableBehavior("moveOnMouseMove", e, this._opt) || e.gestureEvent === "pinch" || isTaken(this._zr, "globalPan")) {
        return;
      }
      var x = e.offsetX;
      var y = e.offsetY;
      var oldX = this._x;
      var oldY = this._y;
      var dx = x - oldX;
      var dy = y - oldY;
      this._x = x;
      this._y = y;
      this._opt.preventDefaultMouseMove && stop(e.event);
      trigger(this, "pan", "moveOnMouseMove", e, {
        dx,
        dy,
        oldX,
        oldY,
        newX: x,
        newY: y,
        isAvailableBehavior: null
      });
    };
    RoamController2.prototype._mouseupHandler = function(e) {
      if (!isMiddleOrRightButtonOnMouseUpDown(e)) {
        this._dragging = false;
      }
    };
    RoamController2.prototype._mousewheelHandler = function(e) {
      var shouldZoom = isAvailableBehavior("zoomOnMouseWheel", e, this._opt);
      var shouldMove = isAvailableBehavior("moveOnMouseWheel", e, this._opt);
      var wheelDelta = e.wheelDelta;
      var absWheelDeltaDelta = Math.abs(wheelDelta);
      var originX = e.offsetX;
      var originY = e.offsetY;
      if (wheelDelta === 0 || !shouldZoom && !shouldMove) {
        return;
      }
      if (shouldZoom) {
        var factor = absWheelDeltaDelta > 3 ? 1.4 : absWheelDeltaDelta > 1 ? 1.2 : 1.1;
        var scale2 = wheelDelta > 0 ? factor : 1 / factor;
        checkPointerAndTrigger(this, "zoom", "zoomOnMouseWheel", e, {
          scale: scale2,
          originX,
          originY,
          isAvailableBehavior: null
        });
      }
      if (shouldMove) {
        var absDelta = Math.abs(wheelDelta);
        var scrollDelta = (wheelDelta > 0 ? 1 : -1) * (absDelta > 3 ? 0.4 : absDelta > 1 ? 0.15 : 0.05);
        checkPointerAndTrigger(this, "scrollMove", "moveOnMouseWheel", e, {
          scrollDelta,
          originX,
          originY,
          isAvailableBehavior: null
        });
      }
    };
    RoamController2.prototype._pinchHandler = function(e) {
      if (isTaken(this._zr, "globalPan")) {
        return;
      }
      var scale2 = e.pinchScale > 1 ? 1.1 : 1 / 1.1;
      checkPointerAndTrigger(this, "zoom", null, e, {
        scale: scale2,
        originX: e.pinchX,
        originY: e.pinchY,
        isAvailableBehavior: null
      });
    };
    return RoamController2;
  }(Eventful_default)
);
function checkPointerAndTrigger(controller, eventName, behaviorToCheck, e, contollerEvent) {
  if (controller.pointerChecker && controller.pointerChecker(e, contollerEvent.originX, contollerEvent.originY)) {
    stop(e.event);
    trigger(controller, eventName, behaviorToCheck, e, contollerEvent);
  }
}
function trigger(controller, eventName, behaviorToCheck, e, contollerEvent) {
  contollerEvent.isAvailableBehavior = bind(isAvailableBehavior, null, behaviorToCheck, e);
  controller.trigger(eventName, contollerEvent);
}
function isAvailableBehavior(behaviorToCheck, e, settings) {
  var setting = settings[behaviorToCheck];
  return !behaviorToCheck || setting && (!isString(setting) || e.event[setting + "Key"]);
}
var RoamController_default = RoamController;

// node_modules/echarts/lib/component/helper/roamHelper.js
function updateViewOnPan(controllerHost, dx, dy) {
  var target = controllerHost.target;
  target.x += dx;
  target.y += dy;
  target.dirty();
}
function updateViewOnZoom(controllerHost, zoomDelta, zoomX, zoomY) {
  var target = controllerHost.target;
  var zoomLimit = controllerHost.zoomLimit;
  var newZoom = controllerHost.zoom = controllerHost.zoom || 1;
  newZoom *= zoomDelta;
  if (zoomLimit) {
    var zoomMin = zoomLimit.min || 0;
    var zoomMax = zoomLimit.max || Infinity;
    newZoom = Math.max(Math.min(zoomMax, newZoom), zoomMin);
  }
  var zoomScale = newZoom / controllerHost.zoom;
  controllerHost.zoom = newZoom;
  target.x -= (zoomX - target.x) * (zoomScale - 1);
  target.y -= (zoomY - target.y) * (zoomScale - 1);
  target.scaleX *= zoomScale;
  target.scaleY *= zoomScale;
  target.dirty();
}

// node_modules/echarts/lib/component/helper/cursorHelper.js
var IRRELEVANT_EXCLUDES = {
  "axisPointer": 1,
  "tooltip": 1,
  "brush": 1
};
function onIrrelevantElement(e, api, targetCoordSysModel) {
  var model = api.getComponentByElement(e.topTarget);
  var coordSys = model && model.coordinateSystem;
  return model && model !== targetCoordSysModel && !IRRELEVANT_EXCLUDES.hasOwnProperty(model.mainType) && coordSys && coordSys.model !== targetCoordSysModel;
}

// node_modules/echarts/lib/chart/graph/adjustEdge.js
var v1 = [];
var v2 = [];
var v3 = [];
var quadraticAt2 = quadraticAt;
var v2DistSquare = distSquare;
var mathAbs = Math.abs;
function intersectCurveCircle(curvePoints, center, radius) {
  var p0 = curvePoints[0];
  var p1 = curvePoints[1];
  var p2 = curvePoints[2];
  var d = Infinity;
  var t;
  var radiusSquare = radius * radius;
  var interval = 0.1;
  for (var _t = 0.1; _t <= 0.9; _t += 0.1) {
    v1[0] = quadraticAt2(p0[0], p1[0], p2[0], _t);
    v1[1] = quadraticAt2(p0[1], p1[1], p2[1], _t);
    var diff = mathAbs(v2DistSquare(v1, center) - radiusSquare);
    if (diff < d) {
      d = diff;
      t = _t;
    }
  }
  for (var i = 0; i < 32; i++) {
    var next = t + interval;
    v2[0] = quadraticAt2(p0[0], p1[0], p2[0], t);
    v2[1] = quadraticAt2(p0[1], p1[1], p2[1], t);
    v3[0] = quadraticAt2(p0[0], p1[0], p2[0], next);
    v3[1] = quadraticAt2(p0[1], p1[1], p2[1], next);
    var diff = v2DistSquare(v2, center) - radiusSquare;
    if (mathAbs(diff) < 0.01) {
      break;
    }
    var nextDiff = v2DistSquare(v3, center) - radiusSquare;
    interval /= 2;
    if (diff < 0) {
      if (nextDiff >= 0) {
        t = t + interval;
      } else {
        t = t - interval;
      }
    } else {
      if (nextDiff >= 0) {
        t = t - interval;
      } else {
        t = t + interval;
      }
    }
  }
  return t;
}
function adjustEdge(graph, scale2) {
  var tmp0 = [];
  var quadraticSubdivide2 = quadraticSubdivide;
  var pts = [[], [], []];
  var pts2 = [[], []];
  var v = [];
  scale2 /= 2;
  graph.eachEdge(function(edge, idx) {
    var linePoints = edge.getLayout();
    var fromSymbol = edge.getVisual("fromSymbol");
    var toSymbol = edge.getVisual("toSymbol");
    if (!linePoints.__original) {
      linePoints.__original = [clone2(linePoints[0]), clone2(linePoints[1])];
      if (linePoints[2]) {
        linePoints.__original.push(clone2(linePoints[2]));
      }
    }
    var originalPoints = linePoints.__original;
    if (linePoints[2] != null) {
      copy(pts[0], originalPoints[0]);
      copy(pts[1], originalPoints[2]);
      copy(pts[2], originalPoints[1]);
      if (fromSymbol && fromSymbol !== "none") {
        var symbolSize = getSymbolSize(edge.node1);
        var t = intersectCurveCircle(pts, originalPoints[0], symbolSize * scale2);
        quadraticSubdivide2(pts[0][0], pts[1][0], pts[2][0], t, tmp0);
        pts[0][0] = tmp0[3];
        pts[1][0] = tmp0[4];
        quadraticSubdivide2(pts[0][1], pts[1][1], pts[2][1], t, tmp0);
        pts[0][1] = tmp0[3];
        pts[1][1] = tmp0[4];
      }
      if (toSymbol && toSymbol !== "none") {
        var symbolSize = getSymbolSize(edge.node2);
        var t = intersectCurveCircle(pts, originalPoints[1], symbolSize * scale2);
        quadraticSubdivide2(pts[0][0], pts[1][0], pts[2][0], t, tmp0);
        pts[1][0] = tmp0[1];
        pts[2][0] = tmp0[2];
        quadraticSubdivide2(pts[0][1], pts[1][1], pts[2][1], t, tmp0);
        pts[1][1] = tmp0[1];
        pts[2][1] = tmp0[2];
      }
      copy(linePoints[0], pts[0]);
      copy(linePoints[1], pts[2]);
      copy(linePoints[2], pts[1]);
    } else {
      copy(pts2[0], originalPoints[0]);
      copy(pts2[1], originalPoints[1]);
      sub(v, pts2[1], pts2[0]);
      normalize(v, v);
      if (fromSymbol && fromSymbol !== "none") {
        var symbolSize = getSymbolSize(edge.node1);
        scaleAndAdd(pts2[0], pts2[0], v, symbolSize * scale2);
      }
      if (toSymbol && toSymbol !== "none") {
        var symbolSize = getSymbolSize(edge.node2);
        scaleAndAdd(pts2[1], pts2[1], v, -symbolSize * scale2);
      }
      copy(linePoints[0], pts2[0]);
      copy(linePoints[1], pts2[1]);
    }
  });
}

// node_modules/echarts/lib/chart/graph/GraphView.js
function isViewCoordSys(coordSys) {
  return coordSys.type === "view";
}
var GraphView = (
  /** @class */
  function(_super) {
    __extends(GraphView2, _super);
    function GraphView2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = GraphView2.type;
      return _this;
    }
    GraphView2.prototype.init = function(ecModel, api) {
      var symbolDraw = new SymbolDraw_default();
      var lineDraw = new LineDraw_default();
      var group = this.group;
      this._controller = new RoamController_default(api.getZr());
      this._controllerHost = {
        target: group
      };
      group.add(symbolDraw.group);
      group.add(lineDraw.group);
      this._symbolDraw = symbolDraw;
      this._lineDraw = lineDraw;
      this._firstRender = true;
    };
    GraphView2.prototype.render = function(seriesModel, ecModel, api) {
      var _this = this;
      var coordSys = seriesModel.coordinateSystem;
      this._model = seriesModel;
      var symbolDraw = this._symbolDraw;
      var lineDraw = this._lineDraw;
      var group = this.group;
      if (isViewCoordSys(coordSys)) {
        var groupNewProp = {
          x: coordSys.x,
          y: coordSys.y,
          scaleX: coordSys.scaleX,
          scaleY: coordSys.scaleY
        };
        if (this._firstRender) {
          group.attr(groupNewProp);
        } else {
          updateProps(group, groupNewProp, seriesModel);
        }
      }
      adjustEdge(seriesModel.getGraph(), getNodeGlobalScale(seriesModel));
      var data = seriesModel.getData();
      symbolDraw.updateData(data);
      var edgeData = seriesModel.getEdgeData();
      lineDraw.updateData(edgeData);
      this._updateNodeAndLinkScale();
      this._updateController(seriesModel, ecModel, api);
      clearTimeout(this._layoutTimeout);
      var forceLayout2 = seriesModel.forceLayout;
      var layoutAnimation = seriesModel.get(["force", "layoutAnimation"]);
      if (forceLayout2) {
        this._startForceLayoutIteration(forceLayout2, layoutAnimation);
      }
      var layout = seriesModel.get("layout");
      data.graph.eachNode(function(node) {
        var idx = node.dataIndex;
        var el = node.getGraphicEl();
        var itemModel = node.getModel();
        if (!el) {
          return;
        }
        el.off("drag").off("dragend");
        var draggable = itemModel.get("draggable");
        if (draggable) {
          el.on("drag", function(e) {
            switch (layout) {
              case "force":
                forceLayout2.warmUp();
                !_this._layouting && _this._startForceLayoutIteration(forceLayout2, layoutAnimation);
                forceLayout2.setFixed(idx);
                data.setItemLayout(idx, [el.x, el.y]);
                break;
              case "circular":
                data.setItemLayout(idx, [el.x, el.y]);
                node.setLayout({
                  fixed: true
                }, true);
                circularLayout(seriesModel, "symbolSize", node, [e.offsetX, e.offsetY]);
                _this.updateLayout(seriesModel);
                break;
              case "none":
              default:
                data.setItemLayout(idx, [el.x, el.y]);
                simpleLayoutEdge(seriesModel.getGraph(), seriesModel);
                _this.updateLayout(seriesModel);
                break;
            }
          }).on("dragend", function() {
            if (forceLayout2) {
              forceLayout2.setUnfixed(idx);
            }
          });
        }
        el.setDraggable(draggable, !!itemModel.get("cursor"));
        var focus = itemModel.get(["emphasis", "focus"]);
        if (focus === "adjacency") {
          getECData(el).focus = node.getAdjacentDataIndices();
        }
      });
      data.graph.eachEdge(function(edge) {
        var el = edge.getGraphicEl();
        var focus = edge.getModel().get(["emphasis", "focus"]);
        if (!el) {
          return;
        }
        if (focus === "adjacency") {
          getECData(el).focus = {
            edge: [edge.dataIndex],
            node: [edge.node1.dataIndex, edge.node2.dataIndex]
          };
        }
      });
      var circularRotateLabel = seriesModel.get("layout") === "circular" && seriesModel.get(["circular", "rotateLabel"]);
      var cx = data.getLayout("cx");
      var cy = data.getLayout("cy");
      data.graph.eachNode(function(node) {
        rotateNodeLabel(node, circularRotateLabel, cx, cy);
      });
      this._firstRender = false;
    };
    GraphView2.prototype.dispose = function() {
      this.remove();
      this._controller && this._controller.dispose();
      this._controllerHost = null;
    };
    GraphView2.prototype._startForceLayoutIteration = function(forceLayout2, layoutAnimation) {
      var self = this;
      (function step() {
        forceLayout2.step(function(stopped) {
          self.updateLayout(self._model);
          (self._layouting = !stopped) && (layoutAnimation ? self._layoutTimeout = setTimeout(step, 16) : step());
        });
      })();
    };
    GraphView2.prototype._updateController = function(seriesModel, ecModel, api) {
      var _this = this;
      var controller = this._controller;
      var controllerHost = this._controllerHost;
      var group = this.group;
      controller.setPointerChecker(function(e, x, y) {
        var rect = group.getBoundingRect();
        rect.applyTransform(group.transform);
        return rect.contain(x, y) && !onIrrelevantElement(e, api, seriesModel);
      });
      if (!isViewCoordSys(seriesModel.coordinateSystem)) {
        controller.disable();
        return;
      }
      controller.enable(seriesModel.get("roam"));
      controllerHost.zoomLimit = seriesModel.get("scaleLimit");
      controllerHost.zoom = seriesModel.coordinateSystem.getZoom();
      controller.off("pan").off("zoom").on("pan", function(e) {
        updateViewOnPan(controllerHost, e.dx, e.dy);
        api.dispatchAction({
          seriesId: seriesModel.id,
          type: "graphRoam",
          dx: e.dx,
          dy: e.dy
        });
      }).on("zoom", function(e) {
        updateViewOnZoom(controllerHost, e.scale, e.originX, e.originY);
        api.dispatchAction({
          seriesId: seriesModel.id,
          type: "graphRoam",
          zoom: e.scale,
          originX: e.originX,
          originY: e.originY
        });
        _this._updateNodeAndLinkScale();
        adjustEdge(seriesModel.getGraph(), getNodeGlobalScale(seriesModel));
        _this._lineDraw.updateLayout();
        api.updateLabelLayout();
      });
    };
    GraphView2.prototype._updateNodeAndLinkScale = function() {
      var seriesModel = this._model;
      var data = seriesModel.getData();
      var nodeScale = getNodeGlobalScale(seriesModel);
      data.eachItemGraphicEl(function(el, idx) {
        el && el.setSymbolScale(nodeScale);
      });
    };
    GraphView2.prototype.updateLayout = function(seriesModel) {
      adjustEdge(seriesModel.getGraph(), getNodeGlobalScale(seriesModel));
      this._symbolDraw.updateLayout();
      this._lineDraw.updateLayout();
    };
    GraphView2.prototype.remove = function() {
      clearTimeout(this._layoutTimeout);
      this._layouting = false;
      this._layoutTimeout = null;
      this._symbolDraw && this._symbolDraw.remove();
      this._lineDraw && this._lineDraw.remove();
    };
    GraphView2.type = "graph";
    return GraphView2;
  }(Chart_default)
);
var GraphView_default = GraphView;

// node_modules/echarts/lib/data/Graph.js
function generateNodeKey(id) {
  return "_EC_" + id;
}
var Graph = (
  /** @class */
  function() {
    function Graph2(directed) {
      this.type = "graph";
      this.nodes = [];
      this.edges = [];
      this._nodesMap = {};
      this._edgesMap = {};
      this._directed = directed || false;
    }
    Graph2.prototype.isDirected = function() {
      return this._directed;
    };
    ;
    Graph2.prototype.addNode = function(id, dataIndex) {
      id = id == null ? "" + dataIndex : "" + id;
      var nodesMap = this._nodesMap;
      if (nodesMap[generateNodeKey(id)]) {
        if (true) {
          console.error("Graph nodes have duplicate name or id");
        }
        return;
      }
      var node = new GraphNode(id, dataIndex);
      node.hostGraph = this;
      this.nodes.push(node);
      nodesMap[generateNodeKey(id)] = node;
      return node;
    };
    ;
    Graph2.prototype.getNodeByIndex = function(dataIndex) {
      var rawIdx = this.data.getRawIndex(dataIndex);
      return this.nodes[rawIdx];
    };
    ;
    Graph2.prototype.getNodeById = function(id) {
      return this._nodesMap[generateNodeKey(id)];
    };
    ;
    Graph2.prototype.addEdge = function(n1, n2, dataIndex) {
      var nodesMap = this._nodesMap;
      var edgesMap = this._edgesMap;
      if (isNumber(n1)) {
        n1 = this.nodes[n1];
      }
      if (isNumber(n2)) {
        n2 = this.nodes[n2];
      }
      if (!(n1 instanceof GraphNode)) {
        n1 = nodesMap[generateNodeKey(n1)];
      }
      if (!(n2 instanceof GraphNode)) {
        n2 = nodesMap[generateNodeKey(n2)];
      }
      if (!n1 || !n2) {
        return;
      }
      var key = n1.id + "-" + n2.id;
      var edge = new GraphEdge(n1, n2, dataIndex);
      edge.hostGraph = this;
      if (this._directed) {
        n1.outEdges.push(edge);
        n2.inEdges.push(edge);
      }
      n1.edges.push(edge);
      if (n1 !== n2) {
        n2.edges.push(edge);
      }
      this.edges.push(edge);
      edgesMap[key] = edge;
      return edge;
    };
    ;
    Graph2.prototype.getEdgeByIndex = function(dataIndex) {
      var rawIdx = this.edgeData.getRawIndex(dataIndex);
      return this.edges[rawIdx];
    };
    ;
    Graph2.prototype.getEdge = function(n1, n2) {
      if (n1 instanceof GraphNode) {
        n1 = n1.id;
      }
      if (n2 instanceof GraphNode) {
        n2 = n2.id;
      }
      var edgesMap = this._edgesMap;
      if (this._directed) {
        return edgesMap[n1 + "-" + n2];
      } else {
        return edgesMap[n1 + "-" + n2] || edgesMap[n2 + "-" + n1];
      }
    };
    ;
    Graph2.prototype.eachNode = function(cb, context) {
      var nodes = this.nodes;
      var len2 = nodes.length;
      for (var i = 0; i < len2; i++) {
        if (nodes[i].dataIndex >= 0) {
          cb.call(context, nodes[i], i);
        }
      }
    };
    ;
    Graph2.prototype.eachEdge = function(cb, context) {
      var edges = this.edges;
      var len2 = edges.length;
      for (var i = 0; i < len2; i++) {
        if (edges[i].dataIndex >= 0 && edges[i].node1.dataIndex >= 0 && edges[i].node2.dataIndex >= 0) {
          cb.call(context, edges[i], i);
        }
      }
    };
    ;
    Graph2.prototype.breadthFirstTraverse = function(cb, startNode, direction, context) {
      if (!(startNode instanceof GraphNode)) {
        startNode = this._nodesMap[generateNodeKey(startNode)];
      }
      if (!startNode) {
        return;
      }
      var edgeType = direction === "out" ? "outEdges" : direction === "in" ? "inEdges" : "edges";
      for (var i = 0; i < this.nodes.length; i++) {
        this.nodes[i].__visited = false;
      }
      if (cb.call(context, startNode, null)) {
        return;
      }
      var queue = [startNode];
      while (queue.length) {
        var currentNode = queue.shift();
        var edges = currentNode[edgeType];
        for (var i = 0; i < edges.length; i++) {
          var e = edges[i];
          var otherNode = e.node1 === currentNode ? e.node2 : e.node1;
          if (!otherNode.__visited) {
            if (cb.call(context, otherNode, currentNode)) {
              return;
            }
            queue.push(otherNode);
            otherNode.__visited = true;
          }
        }
      }
    };
    ;
    Graph2.prototype.update = function() {
      var data = this.data;
      var edgeData = this.edgeData;
      var nodes = this.nodes;
      var edges = this.edges;
      for (var i = 0, len2 = nodes.length; i < len2; i++) {
        nodes[i].dataIndex = -1;
      }
      for (var i = 0, len2 = data.count(); i < len2; i++) {
        nodes[data.getRawIndex(i)].dataIndex = i;
      }
      edgeData.filterSelf(function(idx) {
        var edge = edges[edgeData.getRawIndex(idx)];
        return edge.node1.dataIndex >= 0 && edge.node2.dataIndex >= 0;
      });
      for (var i = 0, len2 = edges.length; i < len2; i++) {
        edges[i].dataIndex = -1;
      }
      for (var i = 0, len2 = edgeData.count(); i < len2; i++) {
        edges[edgeData.getRawIndex(i)].dataIndex = i;
      }
    };
    ;
    Graph2.prototype.clone = function() {
      var graph = new Graph2(this._directed);
      var nodes = this.nodes;
      var edges = this.edges;
      for (var i = 0; i < nodes.length; i++) {
        graph.addNode(nodes[i].id, nodes[i].dataIndex);
      }
      for (var i = 0; i < edges.length; i++) {
        var e = edges[i];
        graph.addEdge(e.node1.id, e.node2.id, e.dataIndex);
      }
      return graph;
    };
    ;
    return Graph2;
  }()
);
var GraphNode = (
  /** @class */
  function() {
    function GraphNode2(id, dataIndex) {
      this.inEdges = [];
      this.outEdges = [];
      this.edges = [];
      this.dataIndex = -1;
      this.id = id == null ? "" : id;
      this.dataIndex = dataIndex == null ? -1 : dataIndex;
    }
    GraphNode2.prototype.degree = function() {
      return this.edges.length;
    };
    GraphNode2.prototype.inDegree = function() {
      return this.inEdges.length;
    };
    GraphNode2.prototype.outDegree = function() {
      return this.outEdges.length;
    };
    GraphNode2.prototype.getModel = function(path) {
      if (this.dataIndex < 0) {
        return;
      }
      var graph = this.hostGraph;
      var itemModel = graph.data.getItemModel(this.dataIndex);
      return itemModel.getModel(path);
    };
    GraphNode2.prototype.getAdjacentDataIndices = function() {
      var dataIndices = {
        edge: [],
        node: []
      };
      for (var i = 0; i < this.edges.length; i++) {
        var adjacentEdge = this.edges[i];
        if (adjacentEdge.dataIndex < 0) {
          continue;
        }
        dataIndices.edge.push(adjacentEdge.dataIndex);
        dataIndices.node.push(adjacentEdge.node1.dataIndex, adjacentEdge.node2.dataIndex);
      }
      return dataIndices;
    };
    GraphNode2.prototype.getTrajectoryDataIndices = function() {
      var connectedEdgesMap = createHashMap();
      var connectedNodesMap = createHashMap();
      for (var i = 0; i < this.edges.length; i++) {
        var adjacentEdge = this.edges[i];
        if (adjacentEdge.dataIndex < 0) {
          continue;
        }
        connectedEdgesMap.set(adjacentEdge.dataIndex, true);
        var sourceNodesQueue = [adjacentEdge.node1];
        var targetNodesQueue = [adjacentEdge.node2];
        var nodeIteratorIndex = 0;
        while (nodeIteratorIndex < sourceNodesQueue.length) {
          var sourceNode = sourceNodesQueue[nodeIteratorIndex];
          nodeIteratorIndex++;
          connectedNodesMap.set(sourceNode.dataIndex, true);
          for (var j = 0; j < sourceNode.inEdges.length; j++) {
            connectedEdgesMap.set(sourceNode.inEdges[j].dataIndex, true);
            sourceNodesQueue.push(sourceNode.inEdges[j].node1);
          }
        }
        nodeIteratorIndex = 0;
        while (nodeIteratorIndex < targetNodesQueue.length) {
          var targetNode = targetNodesQueue[nodeIteratorIndex];
          nodeIteratorIndex++;
          connectedNodesMap.set(targetNode.dataIndex, true);
          for (var j = 0; j < targetNode.outEdges.length; j++) {
            connectedEdgesMap.set(targetNode.outEdges[j].dataIndex, true);
            targetNodesQueue.push(targetNode.outEdges[j].node2);
          }
        }
      }
      return {
        edge: connectedEdgesMap.keys(),
        node: connectedNodesMap.keys()
      };
    };
    return GraphNode2;
  }()
);
var GraphEdge = (
  /** @class */
  function() {
    function GraphEdge2(n1, n2, dataIndex) {
      this.dataIndex = -1;
      this.node1 = n1;
      this.node2 = n2;
      this.dataIndex = dataIndex == null ? -1 : dataIndex;
    }
    GraphEdge2.prototype.getModel = function(path) {
      if (this.dataIndex < 0) {
        return;
      }
      var graph = this.hostGraph;
      var itemModel = graph.edgeData.getItemModel(this.dataIndex);
      return itemModel.getModel(path);
    };
    GraphEdge2.prototype.getAdjacentDataIndices = function() {
      return {
        edge: [this.dataIndex],
        node: [this.node1.dataIndex, this.node2.dataIndex]
      };
    };
    GraphEdge2.prototype.getTrajectoryDataIndices = function() {
      var connectedEdgesMap = createHashMap();
      var connectedNodesMap = createHashMap();
      connectedEdgesMap.set(this.dataIndex, true);
      var sourceNodes = [this.node1];
      var targetNodes = [this.node2];
      var nodeIteratorIndex = 0;
      while (nodeIteratorIndex < sourceNodes.length) {
        var sourceNode = sourceNodes[nodeIteratorIndex];
        nodeIteratorIndex++;
        connectedNodesMap.set(sourceNode.dataIndex, true);
        for (var j = 0; j < sourceNode.inEdges.length; j++) {
          connectedEdgesMap.set(sourceNode.inEdges[j].dataIndex, true);
          sourceNodes.push(sourceNode.inEdges[j].node1);
        }
      }
      nodeIteratorIndex = 0;
      while (nodeIteratorIndex < targetNodes.length) {
        var targetNode = targetNodes[nodeIteratorIndex];
        nodeIteratorIndex++;
        connectedNodesMap.set(targetNode.dataIndex, true);
        for (var j = 0; j < targetNode.outEdges.length; j++) {
          connectedEdgesMap.set(targetNode.outEdges[j].dataIndex, true);
          targetNodes.push(targetNode.outEdges[j].node2);
        }
      }
      return {
        edge: connectedEdgesMap.keys(),
        node: connectedNodesMap.keys()
      };
    };
    return GraphEdge2;
  }()
);
function createGraphDataProxyMixin(hostName, dataName) {
  return {
    /**
     * @param Default 'value'. can be 'a', 'b', 'c', 'd', 'e'.
     */
    getValue: function(dimension) {
      var data = this[hostName][dataName];
      return data.getStore().get(data.getDimensionIndex(dimension || "value"), this.dataIndex);
    },
    // TODO: TYPE stricter type.
    setVisual: function(key, value) {
      this.dataIndex >= 0 && this[hostName][dataName].setItemVisual(this.dataIndex, key, value);
    },
    getVisual: function(key) {
      return this[hostName][dataName].getItemVisual(this.dataIndex, key);
    },
    setLayout: function(layout, merge) {
      this.dataIndex >= 0 && this[hostName][dataName].setItemLayout(this.dataIndex, layout, merge);
    },
    getLayout: function() {
      return this[hostName][dataName].getItemLayout(this.dataIndex);
    },
    getGraphicEl: function() {
      return this[hostName][dataName].getItemGraphicEl(this.dataIndex);
    },
    getRawIndex: function() {
      return this[hostName][dataName].getRawIndex(this.dataIndex);
    }
  };
}
mixin(GraphNode, createGraphDataProxyMixin("hostGraph", "data"));
mixin(GraphEdge, createGraphDataProxyMixin("hostGraph", "edgeData"));
var Graph_default = Graph;

// node_modules/echarts/lib/data/helper/linkSeriesData.js
var inner = makeInner();
function linkSeriesData(opt) {
  var mainData = opt.mainData;
  var datas = opt.datas;
  if (!datas) {
    datas = {
      main: mainData
    };
    opt.datasAttr = {
      main: "data"
    };
  }
  opt.datas = opt.mainData = null;
  linkAll(mainData, datas, opt);
  each(datas, function(data) {
    each(mainData.TRANSFERABLE_METHODS, function(methodName) {
      data.wrapMethod(methodName, curry(transferInjection, opt));
    });
  });
  mainData.wrapMethod("cloneShallow", curry(cloneShallowInjection, opt));
  each(mainData.CHANGABLE_METHODS, function(methodName) {
    mainData.wrapMethod(methodName, curry(changeInjection, opt));
  });
  assert(datas[mainData.dataType] === mainData);
}
function transferInjection(opt, res) {
  if (isMainData(this)) {
    var datas = extend({}, inner(this).datas);
    datas[this.dataType] = res;
    linkAll(res, datas, opt);
  } else {
    linkSingle(res, this.dataType, inner(this).mainData, opt);
  }
  return res;
}
function changeInjection(opt, res) {
  opt.struct && opt.struct.update();
  return res;
}
function cloneShallowInjection(opt, res) {
  each(inner(res).datas, function(data, dataType) {
    data !== res && linkSingle(data.cloneShallow(), dataType, res, opt);
  });
  return res;
}
function getLinkedData(dataType) {
  var mainData = inner(this).mainData;
  return dataType == null || mainData == null ? mainData : inner(mainData).datas[dataType];
}
function getLinkedDataAll() {
  var mainData = inner(this).mainData;
  return mainData == null ? [{
    data: mainData
  }] : map(keys(inner(mainData).datas), function(type) {
    return {
      type,
      data: inner(mainData).datas[type]
    };
  });
}
function isMainData(data) {
  return inner(data).mainData === data;
}
function linkAll(mainData, datas, opt) {
  inner(mainData).datas = {};
  each(datas, function(data, dataType) {
    linkSingle(data, dataType, mainData, opt);
  });
}
function linkSingle(data, dataType, mainData, opt) {
  inner(mainData).datas[dataType] = data;
  inner(data).mainData = mainData;
  data.dataType = dataType;
  if (opt.struct) {
    data[opt.structAttr] = opt.struct;
    opt.struct[opt.datasAttr[dataType]] = data;
  }
  data.getLinkedData = getLinkedData;
  data.getLinkedDataAll = getLinkedDataAll;
}
var linkSeriesData_default = linkSeriesData;

// node_modules/echarts/lib/chart/helper/createGraphFromNodeEdge.js
function createGraphFromNodeEdge(nodes, edges, seriesModel, directed, beforeLink) {
  var graph = new Graph_default(directed);
  for (var i = 0; i < nodes.length; i++) {
    graph.addNode(retrieve(
      // Id, name, dataIndex
      nodes[i].id,
      nodes[i].name,
      i
    ), i);
  }
  var linkNameList = [];
  var validEdges = [];
  var linkCount = 0;
  for (var i = 0; i < edges.length; i++) {
    var link = edges[i];
    var source = link.source;
    var target = link.target;
    if (graph.addEdge(source, target, linkCount)) {
      validEdges.push(link);
      linkNameList.push(retrieve(convertOptionIdName(link.id, null), source + " > " + target));
      linkCount++;
    }
  }
  var coordSys = seriesModel.get("coordinateSystem");
  var nodeData;
  if (coordSys === "cartesian2d" || coordSys === "polar") {
    nodeData = createSeriesData_default(nodes, seriesModel);
  } else {
    var coordSysCtor = CoordinateSystem_default.get(coordSys);
    var coordDimensions = coordSysCtor ? coordSysCtor.dimensions || [] : [];
    if (indexOf(coordDimensions, "value") < 0) {
      coordDimensions.concat(["value"]);
    }
    var dimensions = prepareSeriesDataSchema(nodes, {
      coordDimensions,
      encodeDefine: seriesModel.getEncode()
    }).dimensions;
    nodeData = new SeriesData_default(dimensions, seriesModel);
    nodeData.initData(nodes);
  }
  var edgeData = new SeriesData_default(["value"], seriesModel);
  edgeData.initData(validEdges, linkNameList);
  beforeLink && beforeLink(nodeData, edgeData);
  linkSeriesData_default({
    mainData: nodeData,
    struct: graph,
    structAttr: "graph",
    datas: {
      node: nodeData,
      edge: edgeData
    },
    datasAttr: {
      node: "data",
      edge: "edgeData"
    }
  });
  graph.update();
  return graph;
}

// node_modules/echarts/lib/visual/LegendVisualProvider.js
var LegendVisualProvider = (
  /** @class */
  function() {
    function LegendVisualProvider2(getDataWithEncodedVisual, getRawData) {
      this._getDataWithEncodedVisual = getDataWithEncodedVisual;
      this._getRawData = getRawData;
    }
    LegendVisualProvider2.prototype.getAllNames = function() {
      var rawData = this._getRawData();
      return rawData.mapArray(rawData.getName);
    };
    LegendVisualProvider2.prototype.containName = function(name) {
      var rawData = this._getRawData();
      return rawData.indexOfName(name) >= 0;
    };
    LegendVisualProvider2.prototype.indexOfName = function(name) {
      var dataWithEncodedVisual = this._getDataWithEncodedVisual();
      return dataWithEncodedVisual.indexOfName(name);
    };
    LegendVisualProvider2.prototype.getItemVisual = function(dataIndex, key) {
      var dataWithEncodedVisual = this._getDataWithEncodedVisual();
      return dataWithEncodedVisual.getItemVisual(dataIndex, key);
    };
    return LegendVisualProvider2;
  }()
);
var LegendVisualProvider_default = LegendVisualProvider;

// node_modules/echarts/lib/chart/graph/GraphSeries.js
var GraphSeriesModel = (
  /** @class */
  function(_super) {
    __extends(GraphSeriesModel2, _super);
    function GraphSeriesModel2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = GraphSeriesModel2.type;
      _this.hasSymbolVisual = true;
      return _this;
    }
    GraphSeriesModel2.prototype.init = function(option) {
      _super.prototype.init.apply(this, arguments);
      var self = this;
      function getCategoriesData() {
        return self._categoriesData;
      }
      this.legendVisualProvider = new LegendVisualProvider_default(getCategoriesData, getCategoriesData);
      this.fillDataTextStyle(option.edges || option.links);
      this._updateCategoriesData();
    };
    GraphSeriesModel2.prototype.mergeOption = function(option) {
      _super.prototype.mergeOption.apply(this, arguments);
      this.fillDataTextStyle(option.edges || option.links);
      this._updateCategoriesData();
    };
    GraphSeriesModel2.prototype.mergeDefaultAndTheme = function(option) {
      _super.prototype.mergeDefaultAndTheme.apply(this, arguments);
      defaultEmphasis(option, "edgeLabel", ["show"]);
    };
    GraphSeriesModel2.prototype.getInitialData = function(option, ecModel) {
      var edges = option.edges || option.links || [];
      var nodes = option.data || option.nodes || [];
      var self = this;
      if (nodes && edges) {
        initCurvenessList(this);
        var graph = createGraphFromNodeEdge(nodes, edges, this, true, beforeLink);
        each(graph.edges, function(edge) {
          createEdgeMapForCurveness(edge.node1, edge.node2, this, edge.dataIndex);
        }, this);
        return graph.data;
      }
      function beforeLink(nodeData, edgeData) {
        nodeData.wrapMethod("getItemModel", function(model) {
          var categoriesModels = self._categoriesModels;
          var categoryIdx = model.getShallow("category");
          var categoryModel = categoriesModels[categoryIdx];
          if (categoryModel) {
            categoryModel.parentModel = model.parentModel;
            model.parentModel = categoryModel;
          }
          return model;
        });
        var oldGetModel = Model_default.prototype.getModel;
        function newGetModel(path, parentModel) {
          var model = oldGetModel.call(this, path, parentModel);
          model.resolveParentPath = resolveParentPath;
          return model;
        }
        edgeData.wrapMethod("getItemModel", function(model) {
          model.resolveParentPath = resolveParentPath;
          model.getModel = newGetModel;
          return model;
        });
        function resolveParentPath(pathArr) {
          if (pathArr && (pathArr[0] === "label" || pathArr[1] === "label")) {
            var newPathArr = pathArr.slice();
            if (pathArr[0] === "label") {
              newPathArr[0] = "edgeLabel";
            } else if (pathArr[1] === "label") {
              newPathArr[1] = "edgeLabel";
            }
            return newPathArr;
          }
          return pathArr;
        }
      }
    };
    GraphSeriesModel2.prototype.getGraph = function() {
      return this.getData().graph;
    };
    GraphSeriesModel2.prototype.getEdgeData = function() {
      return this.getGraph().edgeData;
    };
    GraphSeriesModel2.prototype.getCategoriesData = function() {
      return this._categoriesData;
    };
    GraphSeriesModel2.prototype.formatTooltip = function(dataIndex, multipleSeries, dataType) {
      if (dataType === "edge") {
        var nodeData = this.getData();
        var params = this.getDataParams(dataIndex, dataType);
        var edge = nodeData.graph.getEdgeByIndex(dataIndex);
        var sourceName = nodeData.getName(edge.node1.dataIndex);
        var targetName = nodeData.getName(edge.node2.dataIndex);
        var nameArr = [];
        sourceName != null && nameArr.push(sourceName);
        targetName != null && nameArr.push(targetName);
        return createTooltipMarkup("nameValue", {
          name: nameArr.join(" > "),
          value: params.value,
          noValue: params.value == null
        });
      }
      var nodeMarkup = defaultSeriesFormatTooltip({
        series: this,
        dataIndex,
        multipleSeries
      });
      return nodeMarkup;
    };
    GraphSeriesModel2.prototype._updateCategoriesData = function() {
      var categories = map(this.option.categories || [], function(category) {
        return category.value != null ? category : extend({
          value: 0
        }, category);
      });
      var categoriesData = new SeriesData_default(["value"], this);
      categoriesData.initData(categories);
      this._categoriesData = categoriesData;
      this._categoriesModels = categoriesData.mapArray(function(idx) {
        return categoriesData.getItemModel(idx);
      });
    };
    GraphSeriesModel2.prototype.setZoom = function(zoom) {
      this.option.zoom = zoom;
    };
    GraphSeriesModel2.prototype.setCenter = function(center) {
      this.option.center = center;
    };
    GraphSeriesModel2.prototype.isAnimationEnabled = function() {
      return _super.prototype.isAnimationEnabled.call(this) && !(this.get("layout") === "force" && this.get(["force", "layoutAnimation"]));
    };
    GraphSeriesModel2.type = "series.graph";
    GraphSeriesModel2.dependencies = ["grid", "polar", "geo", "singleAxis", "calendar"];
    GraphSeriesModel2.defaultOption = {
      // zlevel: 0,
      z: 2,
      coordinateSystem: "view",
      // Default option for all coordinate systems
      // xAxisIndex: 0,
      // yAxisIndex: 0,
      // polarIndex: 0,
      // geoIndex: 0,
      legendHoverLink: true,
      layout: null,
      // Configuration of circular layout
      circular: {
        rotateLabel: false
      },
      // Configuration of force directed layout
      force: {
        initLayout: null,
        // Node repulsion. Can be an array to represent range.
        repulsion: [0, 50],
        gravity: 0.1,
        // Initial friction
        friction: 0.6,
        // Edge length. Can be an array to represent range.
        edgeLength: 30,
        layoutAnimation: true
      },
      left: "center",
      top: "center",
      // right: null,
      // bottom: null,
      // width: '80%',
      // height: '80%',
      symbol: "circle",
      symbolSize: 10,
      edgeSymbol: ["none", "none"],
      edgeSymbolSize: 10,
      edgeLabel: {
        position: "middle",
        distance: 5
      },
      draggable: false,
      roam: false,
      // Default on center of graph
      center: null,
      zoom: 1,
      // Symbol size scale ratio in roam
      nodeScaleRatio: 0.6,
      // cursor: null,
      // categories: [],
      // data: []
      // Or
      // nodes: []
      //
      // links: []
      // Or
      // edges: []
      label: {
        show: false,
        formatter: "{b}"
      },
      itemStyle: {},
      lineStyle: {
        color: "#aaa",
        width: 1,
        opacity: 0.5
      },
      emphasis: {
        scale: true,
        label: {
          show: true
        }
      },
      select: {
        itemStyle: {
          borderColor: "#212121"
        }
      }
    };
    return GraphSeriesModel2;
  }(Series_default)
);
var GraphSeries_default = GraphSeriesModel;

// node_modules/echarts/lib/action/roamHelper.js
function getCenterCoord(view, point) {
  return view.pointToProjected ? view.pointToProjected(point) : view.pointToData(point);
}
function updateCenterAndZoom(view, payload, zoomLimit, api) {
  var previousZoom = view.getZoom();
  var center = view.getCenter();
  var zoom = payload.zoom;
  var point = view.projectedToPoint ? view.projectedToPoint(center) : view.dataToPoint(center);
  if (payload.dx != null && payload.dy != null) {
    point[0] -= payload.dx;
    point[1] -= payload.dy;
    view.setCenter(getCenterCoord(view, point), api);
  }
  if (zoom != null) {
    if (zoomLimit) {
      var zoomMin = zoomLimit.min || 0;
      var zoomMax = zoomLimit.max || Infinity;
      zoom = Math.max(Math.min(previousZoom * zoom, zoomMax), zoomMin) / previousZoom;
    }
    view.scaleX *= zoom;
    view.scaleY *= zoom;
    var fixX = (payload.originX - view.x) * (zoom - 1);
    var fixY = (payload.originY - view.y) * (zoom - 1);
    view.x -= fixX;
    view.y -= fixY;
    view.updateTransform();
    view.setCenter(getCenterCoord(view, point), api);
    view.setZoom(zoom * previousZoom);
  }
  return {
    center: view.getCenter(),
    zoom: view.getZoom()
  };
}

// node_modules/echarts/lib/chart/graph/install.js
var actionInfo = {
  type: "graphRoam",
  event: "graphRoam",
  update: "none"
};
function install(registers) {
  registers.registerChartView(GraphView_default);
  registers.registerSeriesModel(GraphSeries_default);
  registers.registerProcessor(categoryFilter);
  registers.registerVisual(categoryVisual);
  registers.registerVisual(graphEdgeVisual);
  registers.registerLayout(graphSimpleLayout);
  registers.registerLayout(registers.PRIORITY.VISUAL.POST_CHART_LAYOUT, graphCircularLayout);
  registers.registerLayout(graphForceLayout);
  registers.registerCoordinateSystem("graphView", {
    dimensions: View_default.dimensions,
    create: createViewCoordSys
  });
  registers.registerAction({
    type: "focusNodeAdjacency",
    event: "focusNodeAdjacency",
    update: "series:focusNodeAdjacency"
  }, noop);
  registers.registerAction({
    type: "unfocusNodeAdjacency",
    event: "unfocusNodeAdjacency",
    update: "series:unfocusNodeAdjacency"
  }, noop);
  registers.registerAction(actionInfo, function(payload, ecModel, api) {
    ecModel.eachComponent({
      mainType: "series",
      query: payload
    }, function(seriesModel) {
      var coordSys = seriesModel.coordinateSystem;
      var res = updateCenterAndZoom(coordSys, payload, void 0, api);
      seriesModel.setCenter && seriesModel.setCenter(res.center);
      seriesModel.setZoom && seriesModel.setZoom(res.zoom);
    });
  });
}

// node_modules/echarts/lib/chart/graph.js
use(install);
//# sourceMappingURL=echarts_lib_chart_graph.js.map
