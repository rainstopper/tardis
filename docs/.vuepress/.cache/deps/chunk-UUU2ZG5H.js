import {
  Component_default,
  Component_default2,
  Group_default,
  Model_default,
  Rect_default,
  Text_default,
  __extends,
  bind,
  box,
  clone,
  createHashMap,
  createIcon,
  createOrUpdatePatternFromDecal,
  createSymbol,
  createTextStyle,
  curry,
  defaults,
  each,
  enableHoverEmphasis,
  extend,
  filter,
  getECData,
  getLayoutParams,
  getLayoutRect,
  indexOf,
  inheritDefaultOption,
  isArray,
  isFunction,
  isNameSpecified,
  isNumber,
  isString,
  map,
  merge,
  mergeLayoutParam,
  normalizeCssArray,
  parse,
  retrieve2,
  setLabelStyle,
  setTooltipConfig,
  stringify,
  updateProps,
  use
} from "./chunk-D7JLP2QZ.js";

// node_modules/echarts/lib/component/legend/LegendModel.js
var getDefaultSelectorOptions = function(ecModel, type) {
  if (type === "all") {
    return {
      type: "all",
      title: ecModel.getLocaleModel().get(["legend", "selector", "all"])
    };
  } else if (type === "inverse") {
    return {
      type: "inverse",
      title: ecModel.getLocaleModel().get(["legend", "selector", "inverse"])
    };
  }
};
var LegendModel = (
  /** @class */
  function(_super) {
    __extends(LegendModel2, _super);
    function LegendModel2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = LegendModel2.type;
      _this.layoutMode = {
        type: "box",
        // legend.width/height are maxWidth/maxHeight actually,
        // whereas real width/height is calculated by its content.
        // (Setting {left: 10, right: 10} does not make sense).
        // So consider the case:
        // `setOption({legend: {left: 10});`
        // then `setOption({legend: {right: 10});`
        // The previous `left` should be cleared by setting `ignoreSize`.
        ignoreSize: true
      };
      return _this;
    }
    LegendModel2.prototype.init = function(option, parentModel, ecModel) {
      this.mergeDefaultAndTheme(option, ecModel);
      option.selected = option.selected || {};
      this._updateSelector(option);
    };
    LegendModel2.prototype.mergeOption = function(option, ecModel) {
      _super.prototype.mergeOption.call(this, option, ecModel);
      this._updateSelector(option);
    };
    LegendModel2.prototype._updateSelector = function(option) {
      var selector = option.selector;
      var ecModel = this.ecModel;
      if (selector === true) {
        selector = option.selector = ["all", "inverse"];
      }
      if (isArray(selector)) {
        each(selector, function(item, index) {
          isString(item) && (item = {
            type: item
          });
          selector[index] = merge(item, getDefaultSelectorOptions(ecModel, item.type));
        });
      }
    };
    LegendModel2.prototype.optionUpdated = function() {
      this._updateData(this.ecModel);
      var legendData = this._data;
      if (legendData[0] && this.get("selectedMode") === "single") {
        var hasSelected = false;
        for (var i = 0; i < legendData.length; i++) {
          var name_1 = legendData[i].get("name");
          if (this.isSelected(name_1)) {
            this.select(name_1);
            hasSelected = true;
            break;
          }
        }
        !hasSelected && this.select(legendData[0].get("name"));
      }
    };
    LegendModel2.prototype._updateData = function(ecModel) {
      var potentialData = [];
      var availableNames = [];
      ecModel.eachRawSeries(function(seriesModel) {
        var seriesName = seriesModel.name;
        availableNames.push(seriesName);
        var isPotential;
        if (seriesModel.legendVisualProvider) {
          var provider = seriesModel.legendVisualProvider;
          var names = provider.getAllNames();
          if (!ecModel.isSeriesFiltered(seriesModel)) {
            availableNames = availableNames.concat(names);
          }
          if (names.length) {
            potentialData = potentialData.concat(names);
          } else {
            isPotential = true;
          }
        } else {
          isPotential = true;
        }
        if (isPotential && isNameSpecified(seriesModel)) {
          potentialData.push(seriesModel.name);
        }
      });
      this._availableNames = availableNames;
      var rawData = this.get("data") || potentialData;
      var legendNameMap = createHashMap();
      var legendData = map(rawData, function(dataItem) {
        if (isString(dataItem) || isNumber(dataItem)) {
          dataItem = {
            name: dataItem
          };
        }
        if (legendNameMap.get(dataItem.name)) {
          return null;
        }
        legendNameMap.set(dataItem.name, true);
        return new Model_default(dataItem, this, this.ecModel);
      }, this);
      this._data = filter(legendData, function(item) {
        return !!item;
      });
    };
    LegendModel2.prototype.getData = function() {
      return this._data;
    };
    LegendModel2.prototype.select = function(name) {
      var selected = this.option.selected;
      var selectedMode = this.get("selectedMode");
      if (selectedMode === "single") {
        var data = this._data;
        each(data, function(dataItem) {
          selected[dataItem.get("name")] = false;
        });
      }
      selected[name] = true;
    };
    LegendModel2.prototype.unSelect = function(name) {
      if (this.get("selectedMode") !== "single") {
        this.option.selected[name] = false;
      }
    };
    LegendModel2.prototype.toggleSelected = function(name) {
      var selected = this.option.selected;
      if (!selected.hasOwnProperty(name)) {
        selected[name] = true;
      }
      this[selected[name] ? "unSelect" : "select"](name);
    };
    LegendModel2.prototype.allSelect = function() {
      var data = this._data;
      var selected = this.option.selected;
      each(data, function(dataItem) {
        selected[dataItem.get("name", true)] = true;
      });
    };
    LegendModel2.prototype.inverseSelect = function() {
      var data = this._data;
      var selected = this.option.selected;
      each(data, function(dataItem) {
        var name = dataItem.get("name", true);
        if (!selected.hasOwnProperty(name)) {
          selected[name] = true;
        }
        selected[name] = !selected[name];
      });
    };
    LegendModel2.prototype.isSelected = function(name) {
      var selected = this.option.selected;
      return !(selected.hasOwnProperty(name) && !selected[name]) && indexOf(this._availableNames, name) >= 0;
    };
    LegendModel2.prototype.getOrient = function() {
      return this.get("orient") === "vertical" ? {
        index: 1,
        name: "vertical"
      } : {
        index: 0,
        name: "horizontal"
      };
    };
    LegendModel2.type = "legend.plain";
    LegendModel2.dependencies = ["series"];
    LegendModel2.defaultOption = {
      // zlevel: 0,
      z: 4,
      show: true,
      orient: "horizontal",
      left: "center",
      // right: 'center',
      top: 0,
      // bottom: null,
      align: "auto",
      backgroundColor: "rgba(0,0,0,0)",
      borderColor: "#ccc",
      borderRadius: 0,
      borderWidth: 0,
      padding: 5,
      itemGap: 10,
      itemWidth: 25,
      itemHeight: 14,
      symbolRotate: "inherit",
      symbolKeepAspect: true,
      inactiveColor: "#ccc",
      inactiveBorderColor: "#ccc",
      inactiveBorderWidth: "auto",
      itemStyle: {
        color: "inherit",
        opacity: "inherit",
        borderColor: "inherit",
        borderWidth: "auto",
        borderCap: "inherit",
        borderJoin: "inherit",
        borderDashOffset: "inherit",
        borderMiterLimit: "inherit"
      },
      lineStyle: {
        width: "auto",
        color: "inherit",
        inactiveColor: "#ccc",
        inactiveWidth: 2,
        opacity: "inherit",
        type: "inherit",
        cap: "inherit",
        join: "inherit",
        dashOffset: "inherit",
        miterLimit: "inherit"
      },
      textStyle: {
        color: "#333"
      },
      selectedMode: true,
      selector: false,
      selectorLabel: {
        show: true,
        borderRadius: 10,
        padding: [3, 5, 3, 5],
        fontSize: 12,
        fontFamily: "sans-serif",
        color: "#666",
        borderWidth: 1,
        borderColor: "#666"
      },
      emphasis: {
        selectorLabel: {
          show: true,
          color: "#eee",
          backgroundColor: "#666"
        }
      },
      selectorPosition: "auto",
      selectorItemGap: 7,
      selectorButtonGap: 10,
      tooltip: {
        show: false
      }
    };
    return LegendModel2;
  }(Component_default)
);
var LegendModel_default = LegendModel;

// node_modules/echarts/lib/component/helper/listComponent.js
function makeBackground(rect, componentModel) {
  var padding = normalizeCssArray(componentModel.get("padding"));
  var style = componentModel.getItemStyle(["color", "opacity"]);
  style.fill = componentModel.get("backgroundColor");
  rect = new Rect_default({
    shape: {
      x: rect.x - padding[3],
      y: rect.y - padding[0],
      width: rect.width + padding[1] + padding[3],
      height: rect.height + padding[0] + padding[2],
      r: componentModel.get("borderRadius")
    },
    style,
    silent: true,
    z2: -1
  });
  return rect;
}

// node_modules/echarts/lib/component/legend/LegendView.js
var curry2 = curry;
var each2 = each;
var Group = Group_default;
var LegendView = (
  /** @class */
  function(_super) {
    __extends(LegendView2, _super);
    function LegendView2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = LegendView2.type;
      _this.newlineDisabled = false;
      return _this;
    }
    LegendView2.prototype.init = function() {
      this.group.add(this._contentGroup = new Group());
      this.group.add(this._selectorGroup = new Group());
      this._isFirstRender = true;
    };
    LegendView2.prototype.getContentGroup = function() {
      return this._contentGroup;
    };
    LegendView2.prototype.getSelectorGroup = function() {
      return this._selectorGroup;
    };
    LegendView2.prototype.render = function(legendModel, ecModel, api) {
      var isFirstRender = this._isFirstRender;
      this._isFirstRender = false;
      this.resetInner();
      if (!legendModel.get("show", true)) {
        return;
      }
      var itemAlign = legendModel.get("align");
      var orient = legendModel.get("orient");
      if (!itemAlign || itemAlign === "auto") {
        itemAlign = legendModel.get("left") === "right" && orient === "vertical" ? "right" : "left";
      }
      var selector = legendModel.get("selector", true);
      var selectorPosition = legendModel.get("selectorPosition", true);
      if (selector && (!selectorPosition || selectorPosition === "auto")) {
        selectorPosition = orient === "horizontal" ? "end" : "start";
      }
      this.renderInner(itemAlign, legendModel, ecModel, api, selector, orient, selectorPosition);
      var positionInfo = legendModel.getBoxLayoutParams();
      var viewportSize = {
        width: api.getWidth(),
        height: api.getHeight()
      };
      var padding = legendModel.get("padding");
      var maxSize = getLayoutRect(positionInfo, viewportSize, padding);
      var mainRect = this.layoutInner(legendModel, itemAlign, maxSize, isFirstRender, selector, selectorPosition);
      var layoutRect = getLayoutRect(defaults({
        width: mainRect.width,
        height: mainRect.height
      }, positionInfo), viewportSize, padding);
      this.group.x = layoutRect.x - mainRect.x;
      this.group.y = layoutRect.y - mainRect.y;
      this.group.markRedraw();
      this.group.add(this._backgroundEl = makeBackground(mainRect, legendModel));
    };
    LegendView2.prototype.resetInner = function() {
      this.getContentGroup().removeAll();
      this._backgroundEl && this.group.remove(this._backgroundEl);
      this.getSelectorGroup().removeAll();
    };
    LegendView2.prototype.renderInner = function(itemAlign, legendModel, ecModel, api, selector, orient, selectorPosition) {
      var contentGroup = this.getContentGroup();
      var legendDrawnMap = createHashMap();
      var selectMode = legendModel.get("selectedMode");
      var excludeSeriesId = [];
      ecModel.eachRawSeries(function(seriesModel) {
        !seriesModel.get("legendHoverLink") && excludeSeriesId.push(seriesModel.id);
      });
      each2(legendModel.getData(), function(legendItemModel, dataIndex) {
        var name = legendItemModel.get("name");
        if (!this.newlineDisabled && (name === "" || name === "\n")) {
          var g = new Group();
          g.newline = true;
          contentGroup.add(g);
          return;
        }
        var seriesModel = ecModel.getSeriesByName(name)[0];
        if (legendDrawnMap.get(name)) {
          return;
        }
        if (seriesModel) {
          var data = seriesModel.getData();
          var lineVisualStyle = data.getVisual("legendLineStyle") || {};
          var legendIcon = data.getVisual("legendIcon");
          var style = data.getVisual("style");
          var itemGroup = this._createItem(seriesModel, name, dataIndex, legendItemModel, legendModel, itemAlign, lineVisualStyle, style, legendIcon, selectMode, api);
          itemGroup.on("click", curry2(dispatchSelectAction, name, null, api, excludeSeriesId)).on("mouseover", curry2(dispatchHighlightAction, seriesModel.name, null, api, excludeSeriesId)).on("mouseout", curry2(dispatchDownplayAction, seriesModel.name, null, api, excludeSeriesId));
          if (ecModel.ssr) {
            itemGroup.eachChild(function(child) {
              var ecData = getECData(child);
              ecData.seriesIndex = seriesModel.seriesIndex;
              ecData.dataIndex = dataIndex;
              ecData.ssrType = "legend";
            });
          }
          legendDrawnMap.set(name, true);
        } else {
          ecModel.eachRawSeries(function(seriesModel2) {
            if (legendDrawnMap.get(name)) {
              return;
            }
            if (seriesModel2.legendVisualProvider) {
              var provider = seriesModel2.legendVisualProvider;
              if (!provider.containName(name)) {
                return;
              }
              var idx = provider.indexOfName(name);
              var style2 = provider.getItemVisual(idx, "style");
              var legendIcon2 = provider.getItemVisual(idx, "legendIcon");
              var colorArr = parse(style2.fill);
              if (colorArr && colorArr[3] === 0) {
                colorArr[3] = 0.2;
                style2 = extend(extend({}, style2), {
                  fill: stringify(colorArr, "rgba")
                });
              }
              var itemGroup2 = this._createItem(seriesModel2, name, dataIndex, legendItemModel, legendModel, itemAlign, {}, style2, legendIcon2, selectMode, api);
              itemGroup2.on("click", curry2(dispatchSelectAction, null, name, api, excludeSeriesId)).on("mouseover", curry2(dispatchHighlightAction, null, name, api, excludeSeriesId)).on("mouseout", curry2(dispatchDownplayAction, null, name, api, excludeSeriesId));
              if (ecModel.ssr) {
                itemGroup2.eachChild(function(child) {
                  var ecData = getECData(child);
                  ecData.seriesIndex = seriesModel2.seriesIndex;
                  ecData.dataIndex = dataIndex;
                  ecData.ssrType = "legend";
                });
              }
              legendDrawnMap.set(name, true);
            }
          }, this);
        }
        if (true) {
          if (!legendDrawnMap.get(name)) {
            console.warn(name + " series not exists. Legend data should be same with series name or data name.");
          }
        }
      }, this);
      if (selector) {
        this._createSelector(selector, legendModel, api, orient, selectorPosition);
      }
    };
    LegendView2.prototype._createSelector = function(selector, legendModel, api, orient, selectorPosition) {
      var selectorGroup = this.getSelectorGroup();
      each2(selector, function createSelectorButton(selectorItem) {
        var type = selectorItem.type;
        var labelText = new Text_default({
          style: {
            x: 0,
            y: 0,
            align: "center",
            verticalAlign: "middle"
          },
          onclick: function() {
            api.dispatchAction({
              type: type === "all" ? "legendAllSelect" : "legendInverseSelect"
            });
          }
        });
        selectorGroup.add(labelText);
        var labelModel = legendModel.getModel("selectorLabel");
        var emphasisLabelModel = legendModel.getModel(["emphasis", "selectorLabel"]);
        setLabelStyle(labelText, {
          normal: labelModel,
          emphasis: emphasisLabelModel
        }, {
          defaultText: selectorItem.title
        });
        enableHoverEmphasis(labelText);
      });
    };
    LegendView2.prototype._createItem = function(seriesModel, name, dataIndex, legendItemModel, legendModel, itemAlign, lineVisualStyle, itemVisualStyle, legendIcon, selectMode, api) {
      var drawType = seriesModel.visualDrawType;
      var itemWidth = legendModel.get("itemWidth");
      var itemHeight = legendModel.get("itemHeight");
      var isSelected = legendModel.isSelected(name);
      var iconRotate = legendItemModel.get("symbolRotate");
      var symbolKeepAspect = legendItemModel.get("symbolKeepAspect");
      var legendIconType = legendItemModel.get("icon");
      legendIcon = legendIconType || legendIcon || "roundRect";
      var style = getLegendStyle(legendIcon, legendItemModel, lineVisualStyle, itemVisualStyle, drawType, isSelected, api);
      var itemGroup = new Group();
      var textStyleModel = legendItemModel.getModel("textStyle");
      if (isFunction(seriesModel.getLegendIcon) && (!legendIconType || legendIconType === "inherit")) {
        itemGroup.add(seriesModel.getLegendIcon({
          itemWidth,
          itemHeight,
          icon: legendIcon,
          iconRotate,
          itemStyle: style.itemStyle,
          lineStyle: style.lineStyle,
          symbolKeepAspect
        }));
      } else {
        var rotate = legendIconType === "inherit" && seriesModel.getData().getVisual("symbol") ? iconRotate === "inherit" ? seriesModel.getData().getVisual("symbolRotate") : iconRotate : 0;
        itemGroup.add(getDefaultLegendIcon({
          itemWidth,
          itemHeight,
          icon: legendIcon,
          iconRotate: rotate,
          itemStyle: style.itemStyle,
          lineStyle: style.lineStyle,
          symbolKeepAspect
        }));
      }
      var textX = itemAlign === "left" ? itemWidth + 5 : -5;
      var textAlign = itemAlign;
      var formatter = legendModel.get("formatter");
      var content = name;
      if (isString(formatter) && formatter) {
        content = formatter.replace("{name}", name != null ? name : "");
      } else if (isFunction(formatter)) {
        content = formatter(name);
      }
      var textColor = isSelected ? textStyleModel.getTextColor() : legendItemModel.get("inactiveColor");
      itemGroup.add(new Text_default({
        style: createTextStyle(textStyleModel, {
          text: content,
          x: textX,
          y: itemHeight / 2,
          fill: textColor,
          align: textAlign,
          verticalAlign: "middle"
        }, {
          inheritColor: textColor
        })
      }));
      var hitRect = new Rect_default({
        shape: itemGroup.getBoundingRect(),
        style: {
          // Cannot use 'invisible' because SVG SSR will miss the node
          fill: "transparent"
        }
      });
      var tooltipModel = legendItemModel.getModel("tooltip");
      if (tooltipModel.get("show")) {
        setTooltipConfig({
          el: hitRect,
          componentModel: legendModel,
          itemName: name,
          itemTooltipOption: tooltipModel.option
        });
      }
      itemGroup.add(hitRect);
      itemGroup.eachChild(function(child) {
        child.silent = true;
      });
      hitRect.silent = !selectMode;
      this.getContentGroup().add(itemGroup);
      enableHoverEmphasis(itemGroup);
      itemGroup.__legendDataIndex = dataIndex;
      return itemGroup;
    };
    LegendView2.prototype.layoutInner = function(legendModel, itemAlign, maxSize, isFirstRender, selector, selectorPosition) {
      var contentGroup = this.getContentGroup();
      var selectorGroup = this.getSelectorGroup();
      box(legendModel.get("orient"), contentGroup, legendModel.get("itemGap"), maxSize.width, maxSize.height);
      var contentRect = contentGroup.getBoundingRect();
      var contentPos = [-contentRect.x, -contentRect.y];
      selectorGroup.markRedraw();
      contentGroup.markRedraw();
      if (selector) {
        box(
          // Buttons in selectorGroup always layout horizontally
          "horizontal",
          selectorGroup,
          legendModel.get("selectorItemGap", true)
        );
        var selectorRect = selectorGroup.getBoundingRect();
        var selectorPos = [-selectorRect.x, -selectorRect.y];
        var selectorButtonGap = legendModel.get("selectorButtonGap", true);
        var orientIdx = legendModel.getOrient().index;
        var wh = orientIdx === 0 ? "width" : "height";
        var hw = orientIdx === 0 ? "height" : "width";
        var yx = orientIdx === 0 ? "y" : "x";
        if (selectorPosition === "end") {
          selectorPos[orientIdx] += contentRect[wh] + selectorButtonGap;
        } else {
          contentPos[orientIdx] += selectorRect[wh] + selectorButtonGap;
        }
        selectorPos[1 - orientIdx] += contentRect[hw] / 2 - selectorRect[hw] / 2;
        selectorGroup.x = selectorPos[0];
        selectorGroup.y = selectorPos[1];
        contentGroup.x = contentPos[0];
        contentGroup.y = contentPos[1];
        var mainRect = {
          x: 0,
          y: 0
        };
        mainRect[wh] = contentRect[wh] + selectorButtonGap + selectorRect[wh];
        mainRect[hw] = Math.max(contentRect[hw], selectorRect[hw]);
        mainRect[yx] = Math.min(0, selectorRect[yx] + selectorPos[1 - orientIdx]);
        return mainRect;
      } else {
        contentGroup.x = contentPos[0];
        contentGroup.y = contentPos[1];
        return this.group.getBoundingRect();
      }
    };
    LegendView2.prototype.remove = function() {
      this.getContentGroup().removeAll();
      this._isFirstRender = true;
    };
    LegendView2.type = "legend.plain";
    return LegendView2;
  }(Component_default2)
);
function getLegendStyle(iconType, legendItemModel, lineVisualStyle, itemVisualStyle, drawType, isSelected, api) {
  function handleCommonProps(style, visualStyle) {
    if (style.lineWidth === "auto") {
      style.lineWidth = visualStyle.lineWidth > 0 ? 2 : 0;
    }
    each2(style, function(propVal, propName) {
      style[propName] === "inherit" && (style[propName] = visualStyle[propName]);
    });
  }
  var itemStyleModel = legendItemModel.getModel("itemStyle");
  var itemStyle = itemStyleModel.getItemStyle();
  var iconBrushType = iconType.lastIndexOf("empty", 0) === 0 ? "fill" : "stroke";
  var decalStyle = itemStyleModel.getShallow("decal");
  itemStyle.decal = !decalStyle || decalStyle === "inherit" ? itemVisualStyle.decal : createOrUpdatePatternFromDecal(decalStyle, api);
  if (itemStyle.fill === "inherit") {
    itemStyle.fill = itemVisualStyle[drawType];
  }
  if (itemStyle.stroke === "inherit") {
    itemStyle.stroke = itemVisualStyle[iconBrushType];
  }
  if (itemStyle.opacity === "inherit") {
    itemStyle.opacity = (drawType === "fill" ? itemVisualStyle : lineVisualStyle).opacity;
  }
  handleCommonProps(itemStyle, itemVisualStyle);
  var legendLineModel = legendItemModel.getModel("lineStyle");
  var lineStyle = legendLineModel.getLineStyle();
  handleCommonProps(lineStyle, lineVisualStyle);
  itemStyle.fill === "auto" && (itemStyle.fill = itemVisualStyle.fill);
  itemStyle.stroke === "auto" && (itemStyle.stroke = itemVisualStyle.fill);
  lineStyle.stroke === "auto" && (lineStyle.stroke = itemVisualStyle.fill);
  if (!isSelected) {
    var borderWidth = legendItemModel.get("inactiveBorderWidth");
    var visualHasBorder = itemStyle[iconBrushType];
    itemStyle.lineWidth = borderWidth === "auto" ? itemVisualStyle.lineWidth > 0 && visualHasBorder ? 2 : 0 : itemStyle.lineWidth;
    itemStyle.fill = legendItemModel.get("inactiveColor");
    itemStyle.stroke = legendItemModel.get("inactiveBorderColor");
    lineStyle.stroke = legendLineModel.get("inactiveColor");
    lineStyle.lineWidth = legendLineModel.get("inactiveWidth");
  }
  return {
    itemStyle,
    lineStyle
  };
}
function getDefaultLegendIcon(opt) {
  var symboType = opt.icon || "roundRect";
  var icon = createSymbol(symboType, 0, 0, opt.itemWidth, opt.itemHeight, opt.itemStyle.fill, opt.symbolKeepAspect);
  icon.setStyle(opt.itemStyle);
  icon.rotation = (opt.iconRotate || 0) * Math.PI / 180;
  icon.setOrigin([opt.itemWidth / 2, opt.itemHeight / 2]);
  if (symboType.indexOf("empty") > -1) {
    icon.style.stroke = icon.style.fill;
    icon.style.fill = "#fff";
    icon.style.lineWidth = 2;
  }
  return icon;
}
function dispatchSelectAction(seriesName, dataName, api, excludeSeriesId) {
  dispatchDownplayAction(seriesName, dataName, api, excludeSeriesId);
  api.dispatchAction({
    type: "legendToggleSelect",
    name: seriesName != null ? seriesName : dataName
  });
  dispatchHighlightAction(seriesName, dataName, api, excludeSeriesId);
}
function isUseHoverLayer(api) {
  var list = api.getZr().storage.getDisplayList();
  var emphasisState;
  var i = 0;
  var len = list.length;
  while (i < len && !(emphasisState = list[i].states.emphasis)) {
    i++;
  }
  return emphasisState && emphasisState.hoverLayer;
}
function dispatchHighlightAction(seriesName, dataName, api, excludeSeriesId) {
  if (!isUseHoverLayer(api)) {
    api.dispatchAction({
      type: "highlight",
      seriesName,
      name: dataName,
      excludeSeriesId
    });
  }
}
function dispatchDownplayAction(seriesName, dataName, api, excludeSeriesId) {
  if (!isUseHoverLayer(api)) {
    api.dispatchAction({
      type: "downplay",
      seriesName,
      name: dataName,
      excludeSeriesId
    });
  }
}
var LegendView_default = LegendView;

// node_modules/echarts/lib/component/legend/legendFilter.js
function legendFilter(ecModel) {
  var legendModels = ecModel.findComponents({
    mainType: "legend"
  });
  if (legendModels && legendModels.length) {
    ecModel.filterSeries(function(series) {
      for (var i = 0; i < legendModels.length; i++) {
        if (!legendModels[i].isSelected(series.name)) {
          return false;
        }
      }
      return true;
    });
  }
}

// node_modules/echarts/lib/component/legend/legendAction.js
function legendSelectActionHandler(methodName, payload, ecModel) {
  var selectedMap = {};
  var isToggleSelect = methodName === "toggleSelected";
  var isSelected;
  ecModel.eachComponent("legend", function(legendModel) {
    if (isToggleSelect && isSelected != null) {
      legendModel[isSelected ? "select" : "unSelect"](payload.name);
    } else if (methodName === "allSelect" || methodName === "inverseSelect") {
      legendModel[methodName]();
    } else {
      legendModel[methodName](payload.name);
      isSelected = legendModel.isSelected(payload.name);
    }
    var legendData = legendModel.getData();
    each(legendData, function(model) {
      var name = model.get("name");
      if (name === "\n" || name === "") {
        return;
      }
      var isItemSelected = legendModel.isSelected(name);
      if (selectedMap.hasOwnProperty(name)) {
        selectedMap[name] = selectedMap[name] && isItemSelected;
      } else {
        selectedMap[name] = isItemSelected;
      }
    });
  });
  return methodName === "allSelect" || methodName === "inverseSelect" ? {
    selected: selectedMap
  } : {
    name: payload.name,
    selected: selectedMap
  };
}
function installLegendAction(registers) {
  registers.registerAction("legendToggleSelect", "legendselectchanged", curry(legendSelectActionHandler, "toggleSelected"));
  registers.registerAction("legendAllSelect", "legendselectall", curry(legendSelectActionHandler, "allSelect"));
  registers.registerAction("legendInverseSelect", "legendinverseselect", curry(legendSelectActionHandler, "inverseSelect"));
  registers.registerAction("legendSelect", "legendselected", curry(legendSelectActionHandler, "select"));
  registers.registerAction("legendUnSelect", "legendunselected", curry(legendSelectActionHandler, "unSelect"));
}

// node_modules/echarts/lib/component/legend/installLegendPlain.js
function install(registers) {
  registers.registerComponentModel(LegendModel_default);
  registers.registerComponentView(LegendView_default);
  registers.registerProcessor(registers.PRIORITY.PROCESSOR.SERIES_FILTER, legendFilter);
  registers.registerSubTypeDefaulter("legend", function() {
    return "plain";
  });
  installLegendAction(registers);
}

// node_modules/echarts/lib/component/legend/ScrollableLegendModel.js
var ScrollableLegendModel = (
  /** @class */
  function(_super) {
    __extends(ScrollableLegendModel2, _super);
    function ScrollableLegendModel2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = ScrollableLegendModel2.type;
      return _this;
    }
    ScrollableLegendModel2.prototype.setScrollDataIndex = function(scrollDataIndex) {
      this.option.scrollDataIndex = scrollDataIndex;
    };
    ScrollableLegendModel2.prototype.init = function(option, parentModel, ecModel) {
      var inputPositionParams = getLayoutParams(option);
      _super.prototype.init.call(this, option, parentModel, ecModel);
      mergeAndNormalizeLayoutParams(this, option, inputPositionParams);
    };
    ScrollableLegendModel2.prototype.mergeOption = function(option, ecModel) {
      _super.prototype.mergeOption.call(this, option, ecModel);
      mergeAndNormalizeLayoutParams(this, this.option, option);
    };
    ScrollableLegendModel2.type = "legend.scroll";
    ScrollableLegendModel2.defaultOption = inheritDefaultOption(LegendModel_default.defaultOption, {
      scrollDataIndex: 0,
      pageButtonItemGap: 5,
      pageButtonGap: null,
      pageButtonPosition: "end",
      pageFormatter: "{current}/{total}",
      pageIcons: {
        horizontal: ["M0,0L12,-10L12,10z", "M0,0L-12,-10L-12,10z"],
        vertical: ["M0,0L20,0L10,-20z", "M0,0L20,0L10,20z"]
      },
      pageIconColor: "#2f4554",
      pageIconInactiveColor: "#aaa",
      pageIconSize: 15,
      pageTextStyle: {
        color: "#333"
      },
      animationDurationUpdate: 800
    });
    return ScrollableLegendModel2;
  }(LegendModel_default)
);
function mergeAndNormalizeLayoutParams(legendModel, target, raw) {
  var orient = legendModel.getOrient();
  var ignoreSize = [1, 1];
  ignoreSize[orient.index] = 0;
  mergeLayoutParam(target, raw, {
    type: "box",
    ignoreSize: !!ignoreSize
  });
}
var ScrollableLegendModel_default = ScrollableLegendModel;

// node_modules/echarts/lib/component/legend/ScrollableLegendView.js
var Group2 = Group_default;
var WH = ["width", "height"];
var XY = ["x", "y"];
var ScrollableLegendView = (
  /** @class */
  function(_super) {
    __extends(ScrollableLegendView2, _super);
    function ScrollableLegendView2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = ScrollableLegendView2.type;
      _this.newlineDisabled = true;
      _this._currentIndex = 0;
      return _this;
    }
    ScrollableLegendView2.prototype.init = function() {
      _super.prototype.init.call(this);
      this.group.add(this._containerGroup = new Group2());
      this._containerGroup.add(this.getContentGroup());
      this.group.add(this._controllerGroup = new Group2());
    };
    ScrollableLegendView2.prototype.resetInner = function() {
      _super.prototype.resetInner.call(this);
      this._controllerGroup.removeAll();
      this._containerGroup.removeClipPath();
      this._containerGroup.__rectSize = null;
    };
    ScrollableLegendView2.prototype.renderInner = function(itemAlign, legendModel, ecModel, api, selector, orient, selectorPosition) {
      var self = this;
      _super.prototype.renderInner.call(this, itemAlign, legendModel, ecModel, api, selector, orient, selectorPosition);
      var controllerGroup = this._controllerGroup;
      var pageIconSize = legendModel.get("pageIconSize", true);
      var pageIconSizeArr = isArray(pageIconSize) ? pageIconSize : [pageIconSize, pageIconSize];
      createPageButton("pagePrev", 0);
      var pageTextStyleModel = legendModel.getModel("pageTextStyle");
      controllerGroup.add(new Text_default({
        name: "pageText",
        style: {
          // Placeholder to calculate a proper layout.
          text: "xx/xx",
          fill: pageTextStyleModel.getTextColor(),
          font: pageTextStyleModel.getFont(),
          verticalAlign: "middle",
          align: "center"
        },
        silent: true
      }));
      createPageButton("pageNext", 1);
      function createPageButton(name, iconIdx) {
        var pageDataIndexName = name + "DataIndex";
        var icon = createIcon(legendModel.get("pageIcons", true)[legendModel.getOrient().name][iconIdx], {
          // Buttons will be created in each render, so we do not need
          // to worry about avoiding using legendModel kept in scope.
          onclick: bind(self._pageGo, self, pageDataIndexName, legendModel, api)
        }, {
          x: -pageIconSizeArr[0] / 2,
          y: -pageIconSizeArr[1] / 2,
          width: pageIconSizeArr[0],
          height: pageIconSizeArr[1]
        });
        icon.name = name;
        controllerGroup.add(icon);
      }
    };
    ScrollableLegendView2.prototype.layoutInner = function(legendModel, itemAlign, maxSize, isFirstRender, selector, selectorPosition) {
      var selectorGroup = this.getSelectorGroup();
      var orientIdx = legendModel.getOrient().index;
      var wh = WH[orientIdx];
      var xy = XY[orientIdx];
      var hw = WH[1 - orientIdx];
      var yx = XY[1 - orientIdx];
      selector && box(
        // Buttons in selectorGroup always layout horizontally
        "horizontal",
        selectorGroup,
        legendModel.get("selectorItemGap", true)
      );
      var selectorButtonGap = legendModel.get("selectorButtonGap", true);
      var selectorRect = selectorGroup.getBoundingRect();
      var selectorPos = [-selectorRect.x, -selectorRect.y];
      var processMaxSize = clone(maxSize);
      selector && (processMaxSize[wh] = maxSize[wh] - selectorRect[wh] - selectorButtonGap);
      var mainRect = this._layoutContentAndController(legendModel, isFirstRender, processMaxSize, orientIdx, wh, hw, yx, xy);
      if (selector) {
        if (selectorPosition === "end") {
          selectorPos[orientIdx] += mainRect[wh] + selectorButtonGap;
        } else {
          var offset = selectorRect[wh] + selectorButtonGap;
          selectorPos[orientIdx] -= offset;
          mainRect[xy] -= offset;
        }
        mainRect[wh] += selectorRect[wh] + selectorButtonGap;
        selectorPos[1 - orientIdx] += mainRect[yx] + mainRect[hw] / 2 - selectorRect[hw] / 2;
        mainRect[hw] = Math.max(mainRect[hw], selectorRect[hw]);
        mainRect[yx] = Math.min(mainRect[yx], selectorRect[yx] + selectorPos[1 - orientIdx]);
        selectorGroup.x = selectorPos[0];
        selectorGroup.y = selectorPos[1];
        selectorGroup.markRedraw();
      }
      return mainRect;
    };
    ScrollableLegendView2.prototype._layoutContentAndController = function(legendModel, isFirstRender, maxSize, orientIdx, wh, hw, yx, xy) {
      var contentGroup = this.getContentGroup();
      var containerGroup = this._containerGroup;
      var controllerGroup = this._controllerGroup;
      box(legendModel.get("orient"), contentGroup, legendModel.get("itemGap"), !orientIdx ? null : maxSize.width, orientIdx ? null : maxSize.height);
      box(
        // Buttons in controller are layout always horizontally.
        "horizontal",
        controllerGroup,
        legendModel.get("pageButtonItemGap", true)
      );
      var contentRect = contentGroup.getBoundingRect();
      var controllerRect = controllerGroup.getBoundingRect();
      var showController = this._showController = contentRect[wh] > maxSize[wh];
      var contentPos = [-contentRect.x, -contentRect.y];
      if (!isFirstRender) {
        contentPos[orientIdx] = contentGroup[xy];
      }
      var containerPos = [0, 0];
      var controllerPos = [-controllerRect.x, -controllerRect.y];
      var pageButtonGap = retrieve2(legendModel.get("pageButtonGap", true), legendModel.get("itemGap", true));
      if (showController) {
        var pageButtonPosition = legendModel.get("pageButtonPosition", true);
        if (pageButtonPosition === "end") {
          controllerPos[orientIdx] += maxSize[wh] - controllerRect[wh];
        } else {
          containerPos[orientIdx] += controllerRect[wh] + pageButtonGap;
        }
      }
      controllerPos[1 - orientIdx] += contentRect[hw] / 2 - controllerRect[hw] / 2;
      contentGroup.setPosition(contentPos);
      containerGroup.setPosition(containerPos);
      controllerGroup.setPosition(controllerPos);
      var mainRect = {
        x: 0,
        y: 0
      };
      mainRect[wh] = showController ? maxSize[wh] : contentRect[wh];
      mainRect[hw] = Math.max(contentRect[hw], controllerRect[hw]);
      mainRect[yx] = Math.min(0, controllerRect[yx] + controllerPos[1 - orientIdx]);
      containerGroup.__rectSize = maxSize[wh];
      if (showController) {
        var clipShape = {
          x: 0,
          y: 0
        };
        clipShape[wh] = Math.max(maxSize[wh] - controllerRect[wh] - pageButtonGap, 0);
        clipShape[hw] = mainRect[hw];
        containerGroup.setClipPath(new Rect_default({
          shape: clipShape
        }));
        containerGroup.__rectSize = clipShape[wh];
      } else {
        controllerGroup.eachChild(function(child) {
          child.attr({
            invisible: true,
            silent: true
          });
        });
      }
      var pageInfo = this._getPageInfo(legendModel);
      pageInfo.pageIndex != null && updateProps(
        contentGroup,
        {
          x: pageInfo.contentPosition[0],
          y: pageInfo.contentPosition[1]
        },
        // When switch from "show controller" to "not show controller", view should be
        // updated immediately without animation, otherwise causes weird effect.
        showController ? legendModel : null
      );
      this._updatePageInfoView(legendModel, pageInfo);
      return mainRect;
    };
    ScrollableLegendView2.prototype._pageGo = function(to, legendModel, api) {
      var scrollDataIndex = this._getPageInfo(legendModel)[to];
      scrollDataIndex != null && api.dispatchAction({
        type: "legendScroll",
        scrollDataIndex,
        legendId: legendModel.id
      });
    };
    ScrollableLegendView2.prototype._updatePageInfoView = function(legendModel, pageInfo) {
      var controllerGroup = this._controllerGroup;
      each(["pagePrev", "pageNext"], function(name) {
        var key = name + "DataIndex";
        var canJump = pageInfo[key] != null;
        var icon = controllerGroup.childOfName(name);
        if (icon) {
          icon.setStyle("fill", canJump ? legendModel.get("pageIconColor", true) : legendModel.get("pageIconInactiveColor", true));
          icon.cursor = canJump ? "pointer" : "default";
        }
      });
      var pageText = controllerGroup.childOfName("pageText");
      var pageFormatter = legendModel.get("pageFormatter");
      var pageIndex = pageInfo.pageIndex;
      var current = pageIndex != null ? pageIndex + 1 : 0;
      var total = pageInfo.pageCount;
      pageText && pageFormatter && pageText.setStyle("text", isString(pageFormatter) ? pageFormatter.replace("{current}", current == null ? "" : current + "").replace("{total}", total == null ? "" : total + "") : pageFormatter({
        current,
        total
      }));
    };
    ScrollableLegendView2.prototype._getPageInfo = function(legendModel) {
      var scrollDataIndex = legendModel.get("scrollDataIndex", true);
      var contentGroup = this.getContentGroup();
      var containerRectSize = this._containerGroup.__rectSize;
      var orientIdx = legendModel.getOrient().index;
      var wh = WH[orientIdx];
      var xy = XY[orientIdx];
      var targetItemIndex = this._findTargetItemIndex(scrollDataIndex);
      var children = contentGroup.children();
      var targetItem = children[targetItemIndex];
      var itemCount = children.length;
      var pCount = !itemCount ? 0 : 1;
      var result = {
        contentPosition: [contentGroup.x, contentGroup.y],
        pageCount: pCount,
        pageIndex: pCount - 1,
        pagePrevDataIndex: null,
        pageNextDataIndex: null
      };
      if (!targetItem) {
        return result;
      }
      var targetItemInfo = getItemInfo(targetItem);
      result.contentPosition[orientIdx] = -targetItemInfo.s;
      for (var i = targetItemIndex + 1, winStartItemInfo = targetItemInfo, winEndItemInfo = targetItemInfo, currItemInfo = null; i <= itemCount; ++i) {
        currItemInfo = getItemInfo(children[i]);
        if (
          // Half of the last item is out of the window.
          !currItemInfo && winEndItemInfo.e > winStartItemInfo.s + containerRectSize || currItemInfo && !intersect(currItemInfo, winStartItemInfo.s)
        ) {
          if (winEndItemInfo.i > winStartItemInfo.i) {
            winStartItemInfo = winEndItemInfo;
          } else {
            winStartItemInfo = currItemInfo;
          }
          if (winStartItemInfo) {
            if (result.pageNextDataIndex == null) {
              result.pageNextDataIndex = winStartItemInfo.i;
            }
            ++result.pageCount;
          }
        }
        winEndItemInfo = currItemInfo;
      }
      for (var i = targetItemIndex - 1, winStartItemInfo = targetItemInfo, winEndItemInfo = targetItemInfo, currItemInfo = null; i >= -1; --i) {
        currItemInfo = getItemInfo(children[i]);
        if (
          // If the the end item does not intersect with the window started
          // from the current item, a page can be settled.
          (!currItemInfo || !intersect(winEndItemInfo, currItemInfo.s)) && winStartItemInfo.i < winEndItemInfo.i
        ) {
          winEndItemInfo = winStartItemInfo;
          if (result.pagePrevDataIndex == null) {
            result.pagePrevDataIndex = winStartItemInfo.i;
          }
          ++result.pageCount;
          ++result.pageIndex;
        }
        winStartItemInfo = currItemInfo;
      }
      return result;
      function getItemInfo(el) {
        if (el) {
          var itemRect = el.getBoundingRect();
          var start = itemRect[xy] + el[xy];
          return {
            s: start,
            e: start + itemRect[wh],
            i: el.__legendDataIndex
          };
        }
      }
      function intersect(itemInfo, winStart) {
        return itemInfo.e >= winStart && itemInfo.s <= winStart + containerRectSize;
      }
    };
    ScrollableLegendView2.prototype._findTargetItemIndex = function(targetDataIndex) {
      if (!this._showController) {
        return 0;
      }
      var index;
      var contentGroup = this.getContentGroup();
      var defaultIndex;
      contentGroup.eachChild(function(child, idx) {
        var legendDataIdx = child.__legendDataIndex;
        if (defaultIndex == null && legendDataIdx != null) {
          defaultIndex = idx;
        }
        if (legendDataIdx === targetDataIndex) {
          index = idx;
        }
      });
      return index != null ? index : defaultIndex;
    };
    ScrollableLegendView2.type = "legend.scroll";
    return ScrollableLegendView2;
  }(LegendView_default)
);
var ScrollableLegendView_default = ScrollableLegendView;

// node_modules/echarts/lib/component/legend/scrollableLegendAction.js
function installScrollableLegendAction(registers) {
  registers.registerAction("legendScroll", "legendscroll", function(payload, ecModel) {
    var scrollDataIndex = payload.scrollDataIndex;
    scrollDataIndex != null && ecModel.eachComponent({
      mainType: "legend",
      subType: "scroll",
      query: payload
    }, function(legendModel) {
      legendModel.setScrollDataIndex(scrollDataIndex);
    });
  });
}

// node_modules/echarts/lib/component/legend/installLegendScroll.js
function install2(registers) {
  use(install);
  registers.registerComponentModel(ScrollableLegendModel_default);
  registers.registerComponentView(ScrollableLegendView_default);
  installScrollableLegendAction(registers);
}

export {
  install,
  install2
};
//# sourceMappingURL=chunk-UUU2ZG5H.js.map
