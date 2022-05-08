import { createNote } from '../../components';
import { defineScript } from '../../core/define.script';
import { onComplete, onInteractive, resetPanelPosition } from '../../core/utils';

const supports = ['*'];

export const CommonScript = defineScript({
  name: '默认脚本',
  routes: [

    {
      name: '禁止弹窗脚本',
      url: supports,
      start() {
        try {
          console.log('禁止弹窗脚本启动');
          // @ts-ignore
          if (typeof unsafeWindow !== 'undefined') {
            // @ts-ignore
            // eslint-disable-next-line no-undef
            unsafeWindow.alert = console.log;
          }
          window.alert = self.alert = console.log;
        } catch (e) {
          // @ts-ignore
          console.error('禁止弹窗脚本错误', e.message);
        }
      }
    },
    {
      name: '开启页面右键复制粘贴功能',
      url: supports,
      start() {
        function enableCopy() {
          console.log('开启页面右键复制粘贴功能');
          try {
            const d = document;
            const b = document.body;
            d.onselectstart = d.oncopy = d.onpaste = d.onkeydown = d.oncontextmenu = () => true;
            b.onselectstart = b.oncopy = b.onpaste = b.onkeydown = b.oncontextmenu = () => true;
          } catch (err) {
            console.error('页面右键复制粘贴功能开启失败', err);
          }
        }
        onInteractive(() => enableCopy());
        onComplete(() => {
          enableCopy();
          setTimeout(() => enableCopy(), 3000);
        });
      }
    },
    {
      name: 'OCS样式切换,位置定位脚本',
      url: supports,
      onload() {
        const target = ['o', 'c', 's'];
        let stack: string[] = [];

        onkeydown = (e) => {
          if (target.includes(e.key)) {
            stack.push(e.key);
            const contains = stack.join('').includes(target.join(''));

            if (contains) {
              resetPanelPosition();
              stack = [];
            }
          } else {
            stack = [];
          }
        };
      }
    }
  ],
  panels: [
    {
      name: 'OCS助手',
      priority: 100,
      default: true,
      url: supports,
      el: () =>
        createNote(
          '提示： 手动点击进入视频，作业，考试页面，即可自动运行',
          '注意！ 请将浏览器页面保持最大化，或者缩小，但是不能最小化，可能导致视频播放错误！',
          '拖动上方标题栏可以进行拖拽'
        )
    }
  ]
});
