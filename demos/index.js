import { IDs } from "./core/model.js";
import { Routes } from "./core/routes.js";
import * as THREE from "three";

window.onload = () => {
  const routeKeys = Object.keys(Routes);

  // 生成菜单栏 buttons
  const routesElement = document.getElementById(IDs.ROUTES);
  const buttons = [];
  routeKeys.forEach((key, index) => {
    const button = document.createElement("button");
    button.innerHTML = `${index + 1}-${key}`;
    button.onclick = () => onMenuChange(key, index);
    buttons.push(button);
  });
  routesElement.append(...buttons);

  // 默认显示最后一个菜单
  onMenuChange(routeKeys[routeKeys.length - 1], routeKeys.length - 1);

  // 菜单栏展开收起
  const menuShowElement = document.getElementById(IDs.MENU_SHOW);
  menuShowElement.onclick = onMenuShow;
};

let beforeSwitchFn, beforeSwitchScene, beforeSwitchRenderer;
const onMenuChange = (key, index) => {
  const containerElement = document.getElementById(IDs.CONTAINER);
  const routesElement = document.getElementById(IDs.ROUTES);

  // 清空容器内容
  containerElement.innerHTML = "";

  // 切换前，触发一下 beforeSwitchFn（如果有）
  if (beforeSwitchFn) beforeSwitchFn();
  // 销毁上一页面内容
  destroyView();

  // 执行切换函数
  const returnObj = Routes[key]();
  if (!!returnObj && !!returnObj.beforeDestroy) {
    // 获取页面切换前需要执行的 fn
    beforeSwitchFn = returnObj.beforeDestroy;
    // 当前页面的 scene
    beforeSwitchScene = returnObj.scene;
    // 当前页面的 renderer
    beforeSwitchRenderer = returnObj.renderer;
  } else {
    beforeSwitchFn = null;
    beforeSwitchScene = null;
    beforeSwitchRenderer = null;
  }

  // 设置点击的 button 样式
  const buttons = routesElement.getElementsByTagName("button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].style =
      i === index
        ? "background-color: #8d8d8d; color: #ffffff"
        : "background-color: #ffffff; color: #000000";
  }
};

// 销毁上一页面的 scene renderer
const destroyView = () => {
  if (beforeSwitchScene) {
    // 释放 GPU
    beforeSwitchScene.traverse((obj) => {
      if (obj.isMesh) {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
        obj.clear();
      }
    });

    // 清理场景
    beforeSwitchScene.clear();
  }
  if (beforeSwitchRenderer) {
    // 释放 WebGLRenderer GPU 资源
    beforeSwitchRenderer.dispose();
    beforeSwitchRenderer.forceContextLoss();
  }
  THREE.Cache.clear();
};

// 显示 / 隐藏菜单栏
const onMenuShow = () => {
  const routeContainerElement = document.getElementById(IDs.ROUTE_CONTAINER);
  const menuShowElement = document.getElementById(IDs.MENU_SHOW);

  const width = !!routeContainerElement.style.width
    ? Number(routeContainerElement.style.width.slice(0, -2))
    : undefined;

  if (!width || width > 50) {
    routeContainerElement.style.width = `38.5px`;
    menuShowElement.style.transform = "rotateY(180deg)";
  } else {
    routeContainerElement.style.width = `100vw`;
    menuShowElement.style.transform = "rotateY(0)";
  }
};
