### nuerons sorce code 

- app为开发目录， wwww为编译后的目录及静态资源存储， dist为驱动引擎和硬件引擎，分别是elctron和cordova

- 项目用webpack1+react+flux+react-router来搭建

- app文件夹下的webpack.config.js为启动文件

- flux的dispatcher在disppatcher文件夹，单个实例. action在在actions/UIActions, store存储了逻辑实现及部分dispatch的regsiter，有些组件也写在各自组件的componentDidMount生命周期里來註冊

- app下的constants和languages为常量目录，constants主要为UI行为， languages为语言字典
