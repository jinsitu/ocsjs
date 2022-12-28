import { AnswererWrapper, defaultAnswerWrapperHandler } from '../core/worker/answer.wrapper.handler';
import { OCSWorker } from '../core/worker/worker';
import { MessageElement } from '../elements/message';
import { Config } from '../interfaces/config';
import { Project } from '../interfaces/project';
import { Script } from '../interfaces/script';
import { sleep } from '../utils/common';
import { $$el, $el, el } from '../utils/dom';
import { $createSelectOptions } from '../utils/script';
import { StringUtils } from '../utils/string';
import { addConfigChangeListener, getValue } from '../utils/tampermonkey';
import { $message, $model } from './init';

const volume: Config = {
	label: '音量调节',
	attrs: { type: 'range', step: '0.05', min: '0', max: '1' },
	defaultValue: 0,
	onload() {
		this.addEventListener('change', () => {
			this.setAttribute('data-title', (parseFloat(this.getAttribute('value') || '0') * 100).toFixed() + '%');
		});
		this.setAttribute('data-title', (parseFloat(this.getAttribute('value') || '0') * 100).toFixed() + '%');
	}
};
const restudy: Config = {
	label: '复习模式',
	attrs: { title: '已经完成的视频继续学习', type: 'checkbox' },
	defaultValue: false
};

const definition: Config = {
	label: '清晰度',
	tag: 'select',
	defaultValue: 'line1bq',
	onload() {
		this.append(
			...$createSelectOptions(this.getAttribute('value'), [
				['line1bq', '流畅'],
				['line1gq', '高清']
			])
		);
	}
};

const workConfigs: Record<'upload' | 'notes', Config> = {
	notes: {
		defaultValue:
			'- 答题前请在 “通用-全局设置” 中设置题库配置，才能开始自动答题。<br>- 可以搭配 “通用-在线搜题” 一起使用。'
	},
	upload: {
		label: '自动答题',
		tag: 'select',
		defaultValue: 'close',
		attrs: { title: '答题设置, 鼠标悬浮在选项上可以查看每个选项的具体解释。' },
		onload() {
			this.append(
				...$createSelectOptions(this.getAttribute('value'), [
					['close', '关闭自动答题', '关闭自动答题后, 脚本将忽略答题, 自动进入下一节。'],
					['save', '完成后自动保存', '完成后自动保存答案, 注意如果你开启了随机作答, 有可能分辨不出答案是否正确。'],
					[
						'nomove',
						'完成后不做任何动作',
						'完成后既不保存也不提交, 等待时间过后将会自动下一节, 适合在测试脚本时使用。'
					],
					['force', '强制自动提交', '不管答案是否正确直接强制自动提交，如需开启，请配合随机作答谨慎使用。'],
					...([10, 20, 30, 40, 50, 60, 70, 80, 90].map((rate) => [
						rate.toString(),
						`查到大于${rate}%的题目则自动提交`,
						`例如: 100题, 搜索到大于 ${rate} 的题, 则会自动提交答案。`
					]) as [any, string, string][]),
					['100', '每个题目都查到答案才自动提交']
				])
			);
		}
	}
};

// 是否暂停
let stop = false;
// 是否存在验证码
let hasCapture = false;

export const ZHSProject: Project = {
	name: '知道智慧树',
	level: 99,
	domains: ['zhihuishu.com'],
	scripts: [
		new Script({
			name: '课程学习脚本',
			url: [/studyvideoh5.zhihuishu.com/],
			level: 999,
			namespace: 'zhs.study',
			configs: {
				notes: {
					defaultValue: el('ul', [
						el('li', '章节测试请大家观看完视频后手动打开。'),
						el('li', [
							el('div', '请大家仔细打开视频上方的”学前必读“，查看成绩分布，'),
							el('div', '如果平时分占比多的话，请在下方的定时停止中选择时间，'),
							el('div', '最好每天看半小时才能获得平时分。')
						])
					]).outerHTML
				},
				stopTime: {
					label: '定时停止',
					tag: 'select',
					attrs: { title: '到时间后自动暂停脚本' },
					defaultValue: 0,
					onload() {
						this.append(
							...$createSelectOptions(this.getAttribute('value'), [
								[0, '关闭'],
								[0.5, '半小时后'],
								[1, '一小时后'],
								[2, '两小时后']
							])
						);
					}
				},
				restudy: restudy,
				volume: volume,
				definition: definition,
				playbackRate: {
					label: '视频倍速',
					tag: 'select',
					defaultValue: 1,
					onload() {
						this.append(
							...$createSelectOptions(
								this.getAttribute('value'),
								[1, 1.25, 1.5].map((rate) => [rate, rate + 'x'])
							)
						);
					}
				}
			},
			onactive() {
				// 重置时间
				this.cfg.stopTime = '0';
			},
			oncomplete() {
				const vue = $el('.video-study')?.__vue__;
				let stopInterval: any = 0;
				let stopMessage: MessageElement;
				// 监听定时停止
				this.onConfigChange('stopTime', () => {
					clearInterval(stopInterval);
					stopMessage?.remove();
					if (this.cfg.stopTime === '0') {
						$message('info', { content: '定时停止已关闭' });
					} else {
						let stopCount = parseFloat(this.cfg.stopTime) * 60 * 60;
						stopInterval = setInterval(() => {
							if (stopCount > 0 && hasCapture === false) {
								stopCount--;
							} else {
								clearInterval(stopInterval);
								stop = true;
								$el<HTMLVideoElement>('video').pause();
								$model('alert', { content: '脚本暂停，已获得今日平时分，如需继续观看，请刷新页面。' });
							}
						}, 1000);
						const val = [
							[0.5, '半小时后'],
							[1, '一小时后'],
							[2, '两小时后']
						].find((t) => t[0].toString() === this.cfg.stopTime)?.[0] as number;
						const date = new Date();
						date.setMinutes(date.getMinutes() + val * 60);
						stopMessage = $message('info', {
							duration: 0,
							content: `在 ${date.toLocaleTimeString()} 脚本将自动暂停`
						});
					}
				});

				// 监听音量
				this.onConfigChange('volume', (curr) => {
					$el<HTMLVideoElement>('video').volume = curr;
				});

				// 监听速度
				this.onConfigChange('playbackRate', (curr) => {
					switchPlaybackRate(parseFloat(curr));
				});

				// 监听清晰度
				this.onConfigChange('definition', (curr) => {
					switchLine(curr);
				});

				const hideDialog = () => {
					/** 隐藏通知弹窗 */
					$$el('.el-dialog__wrapper').forEach((dialog) => {
						dialog.remove();
					});
				};
				/** 关闭测验弹窗 */
				const closeTestDialog = async () => {
					const items = $$el('.topic-item');
					if (items.length !== 0) {
						// 选择A
						items[0].click();
						await sleep(1000);
						// 关闭弹窗
						vue.testDialog = false;
					}
				};

				const finish = () => {
					$model('alert', {
						content: '检测到当前视频全部播放完毕，如果还有未完成的视频请刷新重试，或者打开复习模式。'
					});
				};
				/** 固定视频进度 */
				const fixProcessBar = () => {
					const bar = $el('.controlsBar');
					bar.style.display = 'block';
				};

				let timeMessage: MessageElement;
				const calculateTime = () => {
					// 计算视频完成所需时间
					try {
						const vue = $el('.video-study')?.__vue__;
						const videos = (vue.videoList as any[])
							.map((v: any) => v.videoLessons)
							.flat()
							.map((l: any) => /** 章节或者章节中的小节 */ l?.videoSmallLessons || l)
							.flat()
							/** 排除已经学习过的 */
							.filter((v) => v.isStudiedLesson === 0);
						const allTime: number = videos.map((l) => l.videoSec || 0).reduce((pre, curr) => pre + curr, 0);
						if (timeMessage) {
							timeMessage.remove();
						}
						timeMessage = $message('info', {
							duration: 0,
							content: `当前还剩${videos.length - 1}个视频，观看需耗时：${(allTime / (60 * 60)).toFixed(2)}小时`
						});
					} catch {}
				};

				const interval = setInterval(async () => {
					// 等待视频加载完成
					if (vue.videoList.length) {
						clearInterval(interval);
						hack();
						hideDialog();
						setInterval(() => {
							closeTestDialog();
							fixProcessBar();
							// 删除遮罩层
							$$el('.v-modal,.mask').forEach((modal) => {
								modal.remove();
							});
						}, 3000);

						// 查找任务
						let list = $$el('li.clearfix.video');
						// 如果不是复习模式，则排除掉已经完成的任务
						if (!this.cfg.restudy) {
							list = list.filter((el) => el.querySelector('.time_icofinish') === null);
						}

						if (list.length === 0) {
							finish();
						} else {
							$message('info', { content: '3秒后开始学习', duration: 3 });
							const study = async () => {
								if (stop === false) {
									const item = list.shift();
									if (item) {
										await sleep(3000);
										item.click();
										await sleep(5000);
										watch(
											{ volume: this.cfg.volume, playbackRate: this.cfg.playbackRate, definition: this.cfg.definition },
											study
										);
										calculateTime();
									} else {
										finish();
									}
								} else {
									$message('warn', {
										content: '检测到当前视频全部播放完毕，如果还有未完成的视频请刷新重试，或者打开复习模式。'
									});
								}
							};
							study();
						}
					}
				}, 1000);
			}
		}),
		new Script({
			name: '学分共享课（翻转课）学习脚本',
			/** 学分共享课（翻转课） */
			url: [/zhihuishu.com\/aidedteaching\/sourceLearning/],
			namespace: 'zhs.source',
			configs: {
				notes: {
					defaultValue: el('ul', [el('li', '章节测试请大家观看完视频后手动打开。'), el('li', '此课程不能使用倍速。')])
						.outerHTML
				},
				restudy: restudy,
				volume: volume,
				definition: definition
			},
			oncomplete() {
				/** 查找任务 */
				let list = $$el('.file-item');

				/** 如果不是复习模式，则排除掉已经完成的任务 */
				if (!this.cfg.restudy) {
					list = list.filter((el) => el.querySelector('.icon-finish') === null);
				}

				const item = list[0];
				if (item) {
					if (item.classList.contains('active')) {
						watch({ volume: this.cfg.volume, playbackRate: 1, definition: this.cfg.definition }, () => {
							/** 下一章 */
							if (list[1]) list[1].click();
						});
					} else {
						item.click();
					}
				}
			}
		}),

		new Script({
			name: '共享课作业脚本',
			url: [
				/zhihuishu.com\/stuExamWeb.html#\/webExamList\/dohomework/,

				/** 在列表中也提供设置页面 */
				/zhihuishu.com\/stuExamWeb.html#\/webExamList\?/
			],
			namespace: 'zhs.work.gxk',
			level: 99,
			configs: workConfigs,
			oncomplete() {
				if (/zhihuishu.com\/stuExamWeb.html#\/webExamList\/dohomework/.test(location.href)) {
					this.onConfigChange('upload', () => {
						$message('info', {
							content: el('span', ['检测到设置更改，请刷新页面重新答题。'])
						});
					});

					const interval = setInterval(() => {
						const vue = $el('#app > div')?.__vue__;
						if (vue?.alllQuestionTest) {
							clearInterval(interval);
							// 识别文字
							recognize();
							// 开始作业
							workOrExam('work', {
								answererWrappers: getValue('common.settings.answererWrappers'),
								period: getValue('common.settings.period'),
								retry: getValue('common.settings.retry'),
								timeout: getValue('common.settings.timeout'),
								upload: this.cfg.upload
							});
						}
					}, 1000);
					//
				} else {
					//
				}
			}
		}),
		new Script({
			name: '共享课考试脚本',
			url: [
				/zhihuishu.com\/stuExamWeb.html#\/webExamList\/doexamination/,
				/** 在列表中也提供设置页面 */
				/zhihuishu.com\/stuExamWeb.html#\/webExamList\?/
			],
			namespace: 'zhs.work.gxk',
			level: 99,
			configs: {
				notes: {
					defaultValue:
						'- 答题前请在 “通用-全局设置” 中设置题库配置，才能开始自动答题。<br>- 可以搭配 “通用-在线搜题” 一起使用。<br>- 考试请在脚本自动答题完成后自行检查，自己点击提交，脚本不会自动提交。'
				},
				upload: {
					label: '自动答题',
					tag: 'select',
					defaultValue: 'close',
					attrs: { title: '答题设置, 鼠标悬浮在选项上可以查看每个选项的具体解释。' },
					onload() {
						this.append(
							...$createSelectOptions(this.getAttribute('value'), [
								['close', '关闭自动答题', '关闭自动答题后, 脚本将忽略答题, 自动进入下一节。'],
								['nomove', '开启自动答题']
							])
						);
					}
				}
			},
			oncomplete() {
				if (/zhihuishu.com\/stuExamWeb.html#\/webExamList\/doexamination/.test(location.href)) {
					this.onConfigChange('upload', () => {
						$message('info', {
							content: el('span', ['检测到设置更改，请刷新页面重新答题。'])
						});
					});

					const interval = setInterval(() => {
						const vue = $el('#app > div')?.__vue__;
						if (vue?.alllQuestionTest) {
							clearInterval(interval);
							// 识别文字
							recognize();
							// 开始考试
							workOrExam('exam', {
								answererWrappers: getValue('common.settings.answererWrappers'),
								period: getValue('common.settings.period'),
								retry: getValue('common.settings.retry'),
								timeout: getValue('common.settings.timeout'),
								upload: this.cfg.upload
							});
						}
					}, 1000);
					//
				} else {
					//
				}
			}
		}),
		new Script({
			name: '学分课作业考试脚本',
			url: [/zhihuishu.com\/atHomeworkExam\/stu\/homeworkQ\/exerciseList/],
			namespace: 'zhs.work.xfk',
			level: 99,
			configs: workConfigs,
			oncomplete() {
				this.onConfigChange('upload', () => {
					$message('info', { content: el('span', ['检测到设置更改，请刷新页面重新答题。']) });
				});
				// 开始作业
				creditWork({
					answererWrappers: getValue('common.settings.answererWrappers'),
					period: getValue('common.settings.period'),
					retry: getValue('common.settings.retry'),
					timeout: getValue('common.settings.timeout'),
					upload: this.cfg.upload
				});
			}
		}),

		new Script({
			name: '共享课作业考试提示',
			url: [/zhihuishu.com\/stuExamWeb.html#\/webExamList\?/],
			namespace: 'zhs.work.guide',
			level: 999,
			configs: {
				notes: {
					defaultValue:
						'作业点击进入即可使用<br>考试功能因为zhs频繁更新所以不稳定，大家预留好其他搜题方式。<br>在进行作业或者考试之前，请在”通用-全局设置“中设置好题库配置，否则将无法正常答题。'
				}
			}
		}),

		new Script({
			name: '使用提示',
			url: [/onlineweb.zhihuishu.com\/onlinestuh5/, /www.zhihuishu.com/],
			level: 1,
			namespace: 'zhs.guide',
			configs: {
				notes: {
					defaultValue: `请手动进入视频、作业、考试页面，脚本会自动运行。`
				}
			}
		}),
		new Script({
			name: '登录脚本',
			url: [/passport.zhihuishu.com\/login/],
			level: 9,
			namespace: 'zhs.login',
			configs: {
				notes: {
					defaultValue: el('ul', [
						el('li', '脚本会自动输入账号密码，但是需要手动填写验证码。'),
						el('li', '脚本用于辅助软件登录，如不想使用可直接关闭。')
					]).outerHTML
				},
				disable: {
					label: '关闭此脚本',
					defaultValue: false,
					attrs: { type: 'checkbox' }
				},
				type: {
					label: '登录类型',
					tag: 'select',
					defaultValue: 'phone',
					onload() {
						this.append(
							...$createSelectOptions(this.getAttribute('value') || '', [
								['phone', '手机号登录'],
								['id', '学号登录']
							])
						);
					}
				},
				phone: {
					label: '手机',
					defaultValue: '',
					onload() {
						const style = (type: string) =>
							(this.parentElement!.parentElement!.style.display = type === 'id' ? 'none' : 'table-row');
						style(getValue('zhs.login.type'));
						addConfigChangeListener('zhs.login.type', (pre, curr) => style(curr));
					}
				},
				school: {
					label: '学校',
					defaultValue: '',
					onload() {
						const style = (type: string) =>
							(this.parentElement!.parentElement!.style.display = type === 'id' ? 'table-row' : 'none');
						style(getValue('zhs.login.type'));
						addConfigChangeListener('zhs.login.type', (pre, curr) => style(curr));
					}
				},
				id: {
					label: '学号',
					defaultValue: '',
					onload() {
						const style = (type: string) =>
							(this.parentElement!.parentElement!.style.display = type === 'id' ? 'table-row' : 'none');
						style(getValue('zhs.login.type'));
						addConfigChangeListener('zhs.login.type', (pre, curr) => style(curr));
					}
				},
				password: {
					label: '密码',
					defaultValue: '',
					attrs: { type: 'password' }
				}
			},
			oncomplete() {
				if (!this.cfg.disable) {
					const id = setTimeout(async () => {
						const phoneLogin = $el('#qSignin');
						const idLogin = $el('#qStudentID');
						if (this.cfg.type === 'phone') {
							phoneLogin.click();
							$el('#lUsername').value = this.cfg.phone;
							$el('#lPassword').value = this.cfg.password;

							await sleep(2000);
						} else {
							idLogin.click();
							const search = $el('#quickSearch');
							search.onfocus?.(new FocusEvent('focus'));
							search.value = this.cfg.school;
							search.onclick?.(new MouseEvent('click'));

							await sleep(2000);

							$el('#schoolListCode > li').click();
							$el('#clCode').value = this.cfg.id;
							$el('#clPassword').value = this.cfg.password;
						}

						// 点击登录
						await sleep(1000);
						$el('#f_sign_up .wall-sub-btn').click();
					}, 3000);
					const close = el('a', '取消');
					const msg = $message('info', { content: el('span', ['3秒后自动登录。', close]) });
					close.href = '#';
					close.onclick = () => {
						clearTimeout(id);
						msg.remove();
					};
				}
			}
		})
	]
};

/**
 * 观看视频
 * @param setting
 * @returns
 */
async function watch(
	options: { volume: number; playbackRate: number; definition: 'line1bq' | 'line1gq' },
	onended: () => void
) {
	let video = $el<HTMLVideoElement>('video');

	const set = async () => {
		// 设置清晰度
		switchLine(options.definition);
		await sleep(1000);

		// 设置播放速度
		switchPlaybackRate(options.playbackRate);
		await sleep(500);

		// 上面操作会导致元素刷新，这里重新获取视频
		video = $el<HTMLVideoElement>('video');
		// 如果已经播放完了，则重置视频进度
		video.currentTime = 1;
		await sleep(500);

		// 音量
		video.volume = options.volume;
		await sleep(500);
	};

	await set();

	video.play().catch(() => {
		$model('alert', {
			content: '由于浏览器保护限制，如果要播放带有音量的视频，您必须先点击页面上的任意位置才能进行视频的播放。',
			onClose: async () => {
				video.play();
			}
		});
	});

	video.onpause = async () => {
		if (!video.ended && stop === false) {
			await waitForCaptcha();
			await sleep(1000);
			video.play();
		}
	};

	video.onended = onended;
}

/**
 * 切换视频清晰度
 * @param definition 清晰度的类名
 */
function switchLine(definition: 'line1bq' | 'line1gq' = 'line1bq') {
	$el(`.definiLines .${definition}`)?.click();
}

/**
 * 切换视频清晰度
 * @param playbackRate 播放速度
 */
function switchPlaybackRate(playbackRate: number) {
	$el(`.speedList [rate="${playbackRate === 1 ? '1.0' : playbackRate}"]`)?.click();
}

/**
 * 检测是否有验证码，并等待验证
 */

function waitForCaptcha(): void | Promise<void> {
	const popup = $el('.yidun_popup');
	if (popup) {
		$model('alert', { content: '当前检测到验证码，请输入后方可继续运行。' });
		return new Promise<void>((resolve, reject) => {
			const interval = setInterval(() => {
				const popup = $el('.yidun_popup');
				if (popup === null) {
					hasCapture = false;
					clearInterval(interval);
					resolve();
				} else {
					hasCapture = true;
				}
			}, 1000);
		});
	}
}

/**
 * 函数劫持
 */
function hack() {
	const vue = $el('.video-study')?.__vue__;
	const empty = () => {};
	vue.checkout = empty;
	vue.notTrustScript = empty;
	vue.checkoutNotTrustScript = empty;
	const _videoClick = vue.videoClick;
	vue.videoClick = function (...args: any[]) {
		args[args.length - 1] = { isTrusted: true };
		return _videoClick.apply(vue, args);
	};
}

/** 识别试卷文字 */
function recognize() {
	for (const div of $$el('.subject_describe > div')) {
		// @ts-ignore
		div.__vue__.$el.innerHTML = div.__vue__._data.shadowDom.textContent;
	}
}

async function workOrExam(
	type: 'work' | 'exam' = 'work',
	options: { period: number; timeout: number; retry: number; upload: string; answererWrappers: AnswererWrapper[] }
) {
	const { period, timeout, retry, upload, answererWrappers } = options;

	if (upload === 'close') {
		$message('warn', { content: '自动答题已被关闭！请在设置开启自动答题，并刷新页面！或者忽略此警告' });
	} else if (answererWrappers.length === 0) {
		$model('alert', { content: '题库配置为空，请设置。' });
	} else {
		$message('info', { content: '即将开始自动答题。' });
		const workResults = [];

		/** 新建答题器 */
		const worker = new OCSWorker({
			root: '.examPaper_subject',
			elements: {
				title: '.subject_describe,.smallStem_describe',
				options: '.subject_node .nodeLab'
			},
			/** 默认搜题方法构造器 */
			answerer: (elements, type, ctx) =>
				defaultAnswerWrapperHandler(answererWrappers, {
					type,
					title: elements.title[0].innerText,
					root: ctx.root
				}),
			work: {
				/** 自定义处理器 */
				handler(type, answer, option) {
					if (type === 'judgement' || type === 'single' || type === 'multiple') {
						if (!option.querySelector('input')?.checked) {
							option.click();
						}
					} else if (type === 'completion' && answer.trim()) {
						const text = option.querySelector('textarea');
						if (text) {
							text.value = answer;
						}
					}
				}
			},
			// 如果有验证码，则等待验证码
			async interceptor() {
				await waitForCaptcha();
				return true;
			},
			onElementSearched(elements) {
				// 处理题目跨域丢失问题
				// elements.title = elements.title.map(elementToRawObject);
			},
			/** 完成答题后 */
			onResult: async (res) => {
				if (res.ctx) {
					workResults.push(res);
				}
				console.log(res);
				await sleep(500);
				// 下一页
				$el('div.examPaper_box > div.switch-btn-box > button:nth-child(2)').click();
			},

			/** 其余配置 */

			period: (period === 0 ? 0 : period || 3) * 1000,
			timeout: (timeout || 30) * 1000,
			retry,
			stopWhenError: false
		});

		const results = await worker.doWork();

		if (type === 'exam') {
			$message('info', { content: '为了安全考虑，请自行检查后自行点击提交！' });
		} else {
			// 处理提交
			await worker.uploadHandler({
				uploadRate: upload,
				results,
				async callback(finishedRate, uploadable) {
					$message('info', {
						content: `完成率 ${finishedRate.toFixed(2)} :  ${uploadable ? '5秒后将自动提交' : '5秒后将自动保存'} `
					});

					await sleep(5000);

					// 保存按钮， 提交按钮
					const saveBtn = $el('.btnStyleX:not(.btnStyleXSumit)');
					const uploadBtn = $el('.btnStyleXSumit');

					if (uploadable) {
						uploadBtn?.click();
					} else {
						saveBtn?.click();
					}

					await sleep(2000);
					/** 确定按钮 */
					const { confirmBtn } = $el("[role='dialog'] .el-button--primary");

					confirmBtn?.click();
				}
			});
		}
	}
}

/**
 * 学分课的作业
 */
async function creditWork(options: {
	period: number;
	timeout: number;
	retry: number;
	upload: string;
	answererWrappers: AnswererWrapper[];
}) {
	const { period, timeout, retry, upload, answererWrappers } = options;

	if (upload === 'close') {
		$message('warn', { content: '自动答题已被关闭！请在设置开启自动答题！或者忽略此警告' });
	} else if (answererWrappers.length === 0) {
		$model('alert', { content: '题库配置为空，请设置。' });
	} else {
		const workResults = [];

		const worker = new OCSWorker({
			root: '.questionBox',
			elements: {
				title: '.questionContent',
				options: '.optionUl label',
				questionTit: '.questionTit'
			},
			/** 默认搜题方法构造器 */
			answerer: (elements, type, ctx) => {
				const title = StringUtils.nowrap(elements.title[0].innerText).trim();
				if (title) {
					return defaultAnswerWrapperHandler(answererWrappers, { type, title, root: ctx.root });
				} else {
					throw new Error('题目为空，请查看题目是否为空，或者忽略此题');
				}
			},
			work: {
				/** 自定义处理器 */
				handler(type, answer, option, ctx) {
					if (type === 'judgement' || type === 'single' || type === 'multiple') {
						if (option.querySelector('input')?.checked === false) {
							option.click();
						}
					} else if (type === 'completion' && answer.trim()) {
						const text = option.querySelector('textarea');
						if (text) {
							text.value = answer;
						}
					}
				}
			},
			onElementSearched(elements) {
				// 处理题目跨域丢失问题
				// elements.title = elements.title.map(elementToRawObject);
			},
			onResult: (res) => {
				if (res.ctx) {
					// 浅拷贝并且只保留 innerText ， 防止元素对象变化导致显示的题目全部是一个同样的值。

					if (res.ctx.elements.title[0]) {
						// @ts-ignore
						res.ctx.elements.title[0] = {
							innerText: res.ctx.elements.questionTit[0]?.innerText + res.ctx.elements.title[0]?.innerText
						};
					}

					workResults.push(res);
				}
				console.log(res);
			},
			period: (period || 3) * 1000,
			timeout: (timeout || 30) * 1000,
			retry,
			stopWhenError: false
		});

		const getBtn = () => document.querySelector('span.Topicswitchingbtn:nth-child(2)') as HTMLElement;
		let next = getBtn();

		while (next) {
			await worker.doWork();
			await sleep((period || 3) * 1000);
			next = getBtn();
			next?.click();
			await sleep((period || 3) * 1000);
		}
	}
}
