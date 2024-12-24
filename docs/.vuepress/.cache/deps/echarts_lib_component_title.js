import {
  Component_default,
  Component_default2,
  Rect_default,
  Text_default,
  __extends,
  createTextStyle,
  getECData,
  getLayoutRect,
  retrieve2,
  use,
  windowOpen
} from "./chunk-D7JLP2QZ.js";
import "./chunk-PZ5AY32C.js";

// node_modules/echarts/lib/component/title/install.js
var TitleModel = (
  /** @class */
  function(_super) {
    __extends(TitleModel2, _super);
    function TitleModel2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = TitleModel2.type;
      _this.layoutMode = {
        type: "box",
        ignoreSize: true
      };
      return _this;
    }
    TitleModel2.type = "title";
    TitleModel2.defaultOption = {
      // zlevel: 0,
      z: 6,
      show: true,
      text: "",
      target: "blank",
      subtext: "",
      subtarget: "blank",
      left: 0,
      top: 0,
      backgroundColor: "rgba(0,0,0,0)",
      borderColor: "#ccc",
      borderWidth: 0,
      padding: 5,
      itemGap: 10,
      textStyle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#464646"
      },
      subtextStyle: {
        fontSize: 12,
        color: "#6E7079"
      }
    };
    return TitleModel2;
  }(Component_default)
);
var TitleView = (
  /** @class */
  function(_super) {
    __extends(TitleView2, _super);
    function TitleView2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = TitleView2.type;
      return _this;
    }
    TitleView2.prototype.render = function(titleModel, ecModel, api) {
      this.group.removeAll();
      if (!titleModel.get("show")) {
        return;
      }
      var group = this.group;
      var textStyleModel = titleModel.getModel("textStyle");
      var subtextStyleModel = titleModel.getModel("subtextStyle");
      var textAlign = titleModel.get("textAlign");
      var textVerticalAlign = retrieve2(titleModel.get("textBaseline"), titleModel.get("textVerticalAlign"));
      var textEl = new Text_default({
        style: createTextStyle(textStyleModel, {
          text: titleModel.get("text"),
          fill: textStyleModel.getTextColor()
        }, {
          disableBox: true
        }),
        z2: 10
      });
      var textRect = textEl.getBoundingRect();
      var subText = titleModel.get("subtext");
      var subTextEl = new Text_default({
        style: createTextStyle(subtextStyleModel, {
          text: subText,
          fill: subtextStyleModel.getTextColor(),
          y: textRect.height + titleModel.get("itemGap"),
          verticalAlign: "top"
        }, {
          disableBox: true
        }),
        z2: 10
      });
      var link = titleModel.get("link");
      var sublink = titleModel.get("sublink");
      var triggerEvent = titleModel.get("triggerEvent", true);
      textEl.silent = !link && !triggerEvent;
      subTextEl.silent = !sublink && !triggerEvent;
      if (link) {
        textEl.on("click", function() {
          windowOpen(link, "_" + titleModel.get("target"));
        });
      }
      if (sublink) {
        subTextEl.on("click", function() {
          windowOpen(sublink, "_" + titleModel.get("subtarget"));
        });
      }
      getECData(textEl).eventData = getECData(subTextEl).eventData = triggerEvent ? {
        componentType: "title",
        componentIndex: titleModel.componentIndex
      } : null;
      group.add(textEl);
      subText && group.add(subTextEl);
      var groupRect = group.getBoundingRect();
      var layoutOption = titleModel.getBoxLayoutParams();
      layoutOption.width = groupRect.width;
      layoutOption.height = groupRect.height;
      var layoutRect = getLayoutRect(layoutOption, {
        width: api.getWidth(),
        height: api.getHeight()
      }, titleModel.get("padding"));
      if (!textAlign) {
        textAlign = titleModel.get("left") || titleModel.get("right");
        if (textAlign === "middle") {
          textAlign = "center";
        }
        if (textAlign === "right") {
          layoutRect.x += layoutRect.width;
        } else if (textAlign === "center") {
          layoutRect.x += layoutRect.width / 2;
        }
      }
      if (!textVerticalAlign) {
        textVerticalAlign = titleModel.get("top") || titleModel.get("bottom");
        if (textVerticalAlign === "center") {
          textVerticalAlign = "middle";
        }
        if (textVerticalAlign === "bottom") {
          layoutRect.y += layoutRect.height;
        } else if (textVerticalAlign === "middle") {
          layoutRect.y += layoutRect.height / 2;
        }
        textVerticalAlign = textVerticalAlign || "top";
      }
      group.x = layoutRect.x;
      group.y = layoutRect.y;
      group.markRedraw();
      var alignStyle = {
        align: textAlign,
        verticalAlign: textVerticalAlign
      };
      textEl.setStyle(alignStyle);
      subTextEl.setStyle(alignStyle);
      groupRect = group.getBoundingRect();
      var padding = layoutRect.margin;
      var style = titleModel.getItemStyle(["color", "opacity"]);
      style.fill = titleModel.get("backgroundColor");
      var rect = new Rect_default({
        shape: {
          x: groupRect.x - padding[3],
          y: groupRect.y - padding[0],
          width: groupRect.width + padding[1] + padding[3],
          height: groupRect.height + padding[0] + padding[2],
          r: titleModel.get("borderRadius")
        },
        style,
        subPixelOptimize: true,
        silent: true
      });
      group.add(rect);
    };
    TitleView2.type = "title";
    return TitleView2;
  }(Component_default2)
);
function install(registers) {
  registers.registerComponentModel(TitleModel);
  registers.registerComponentView(TitleView);
}

// node_modules/echarts/lib/component/title.js
use(install);
//# sourceMappingURL=echarts_lib_component_title.js.map
